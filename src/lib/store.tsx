"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  emptyArchive,
  loadArchive,
  newId,
  putBlob,
  saveArchive,
  type ArchiveState,
} from "./db";
import { CAPSULES, FESTIVALS, MEMORIES, PEOPLE } from "./seed";
import { captureVideoPoster } from "./videoPoster";
import type { Capsule, CategoryId, Festival, Media, Memory, MemoryType, Person } from "./types";

export interface MemoryDraft {
  type: MemoryType;
  title: string;
  description: string;
  date: string;
  category: CategoryId;
  people: string[];
  dish?: string;
  theme?: string;
  voiceBy?: string;
  files: File[];
  audio?: { blob: Blob; durationSec: number };
}

interface StoreValue {
  ready: boolean;
  memories: Memory[];
  people: Person[];
  festivals: Festival[];
  capsules: Capsule[];
  personById: (id: string) => Person | undefined;
  festivalFor: (year: number) => Festival | undefined;
  capsuleFor: (year: number) => Capsule | undefined;
  addMemory: (draft: MemoryDraft) => Promise<string>;
  removeMemory: (id: string) => void;
  addPerson: (name: string, relation?: string) => Person;
  sealYear: (year: number) => void;
  unsealYear: (year: number) => void;
  resetArchive: () => void;
  /* transient UI */
  composerOpen: boolean;
  openComposer: (opts?: { year?: number; type?: MemoryType; category?: CategoryId }) => void;
  closeComposer: () => void;
  composerDefaults: { year?: number; type?: MemoryType; category?: CategoryId };
  viewing: string | null;
  openMemory: (id: string) => void;
  closeMemory: () => void;
  toast: string | null;
  say: (message: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const CURRENT_YEAR_FALLBACK = Math.max(...FESTIVALS.map((f) => f.year));

export function StoreProvider({ children }: { children: ReactNode }) {
  const [archive, setArchive] = useState<ArchiveState>(() => ({
    ...emptyArchive(),
    capsules: CAPSULES,
  }));
  const [ready, setReady] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerDefaults, setComposerDefaults] = useState<StoreValue["composerDefaults"]>({});
  const [viewing, setViewing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadArchive().then((stored) => {
      if (cancelled) return;
      hydrated.current = true;
      setArchive({
        ...stored,
        // Seeded capsules are the starting point; anything the user has
        // sealed or unsealed since then wins.
        capsules: mergeCapsules(CAPSULES, stored.capsules),
      });
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    void saveArchive(archive);
  }, [archive]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const say = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3400);
  }, []);

  const memories = useMemo(() => {
    const hidden = new Set(archive.hidden);
    const seedIds = new Set(MEMORIES.map((m) => m.id));
    const userOnlyMemories = archive.memories.filter((m) => !seedIds.has(m.id));
    return [...MEMORIES.filter((m) => !hidden.has(m.id)), ...userOnlyMemories];
  }, [archive.hidden, archive.memories]);

  const people = useMemo(() => [...PEOPLE, ...archive.people], [archive.people]);

  const festivals = useMemo(() => {
    const known = new Map(FESTIVALS.map((f) => [f.year, f]));
    for (const m of archive.memories) {
      if (known.has(m.year)) continue;
      known.set(m.year, {
        year: m.year,
        date: `${m.year}-08-24`,
        title: "Our Vinayaka",
        place: "Home",
        note: "",
      });
    }
    return [...known.values()].sort((a, b) => b.year - a.year);
  }, [archive.memories]);

  const personById = useCallback(
    (id: string) => people.find((p) => p.id === id),
    [people],
  );
  const festivalFor = useCallback(
    (year: number) => festivals.find((f) => f.year === year),
    [festivals],
  );
  const capsuleFor = useCallback(
    (year: number) => archive.capsules.find((c) => c.year === year),
    [archive.capsules],
  );

  const addMemory = useCallback(
    async (draft: MemoryDraft) => {
      const id = newId("mem");
      const media: Media[] = [];

      for (const file of draft.files) {
        const key = newId("blob");
        await putBlob(key, file);

        const isVideo = file.type.startsWith("video");

        // Videos need a still frame to show on the card — an <img> cannot
        // decode a video file. Captured once here and stored beside it.
        let posterKey: string | undefined;
        if (isVideo) {
          const poster = await captureVideoPoster(file);
          if (poster) {
            posterKey = newId("blob");
            await putBlob(posterKey, poster);
          }
        }

        media.push({
          id: newId("md"),
          kind: isVideo ? "video" : "image",
          blobKey: key,
          posterKey,
          alt: draft.title,
        });
      }

      if (draft.audio) {
        const key = newId("blob");
        await putBlob(key, draft.audio.blob);
        media.push({
          id: newId("md"),
          kind: "audio",
          blobKey: key,
          durationSec: draft.audio.durationSec,
        });
      }

      const date = draft.date.includes("T") ? draft.date : `${draft.date}T12:00`;
      const memory: Memory = {
        id,
        year: Number(draft.date.slice(0, 4)) || CURRENT_YEAR_FALLBACK,
        type: draft.type,
        title: draft.title.trim() || untitled(draft.type),
        description: draft.description.trim() || undefined,
        date,
        category: draft.category,
        people: draft.people,
        media,
        createdAt: new Date().toISOString(),
        dish: draft.dish?.trim() || undefined,
        theme: draft.theme?.trim() || undefined,
        voiceBy: draft.voiceBy?.trim() || undefined,
        userCreated: true,
      };

      setArchive((prev) => ({ ...prev, memories: [...prev.memories, memory] }));
      return id;
    },
    [],
  );

  const removeMemory = useCallback((id: string) => {
    setArchive((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
      hidden: prev.memories.some((m) => m.id === id) ? prev.hidden : [...prev.hidden, id],
    }));
  }, []);

  const addPerson = useCallback((name: string, relation = "") => {
    const person: Person = { id: newId("person"), name: name.trim(), relation };
    setArchive((prev) => ({ ...prev, people: [...prev.people, person] }));
    return person;
  }, []);

  const sealYear = useCallback((year: number) => {
    setArchive((prev) => ({
      ...prev,
      capsules: [
        ...prev.capsules.filter((c) => c.year !== year),
        { year, sealedAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const unsealYear = useCallback((year: number) => {
    setArchive((prev) => ({
      ...prev,
      capsules: prev.capsules.filter((c) => c.year !== year),
    }));
  }, []);

  const resetArchive = useCallback(() => {
    setArchive({ ...emptyArchive(), capsules: CAPSULES });
  }, []);

  const openComposer = useCallback((opts: StoreValue["composerDefaults"] = {}) => {
    setComposerDefaults(opts);
    setComposerOpen(true);
  }, []);

  const value: StoreValue = {
    ready,
    memories,
    people,
    festivals,
    capsules: archive.capsules,
    personById,
    festivalFor,
    capsuleFor,
    addMemory,
    removeMemory,
    addPerson,
    sealYear,
    unsealYear,
    resetArchive,
    composerOpen,
    openComposer,
    closeComposer: useCallback(() => setComposerOpen(false), []),
    composerDefaults,
    viewing,
    openMemory: useCallback((id: string) => setViewing(id), []),
    closeMemory: useCallback(() => setViewing(null), []),
    toast,
    say,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

function mergeCapsules(base: Capsule[], stored: Capsule[]): Capsule[] {
  if (stored.length === 0) return base;
  const map = new Map(base.map((c) => [c.year, c]));
  for (const c of stored) map.set(c.year, c);
  return [...map.values()];
}

function untitled(type: MemoryType): string {
  switch (type) {
    case "story":
      return "A moment from the day";
    case "voice":
      return "A voice from this year";
    case "video":
      return "A moment that moved";
    default:
      return "A moment we kept";
  }
}
