"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toDateInputValue } from "@/lib/format";
import { useStore, type MemoryDraft } from "@/lib/store";
import { CATEGORIES, MEMORY_TYPES } from "@/lib/taxonomy";
import type { CategoryId, MemoryType } from "@/lib/types";
import { Sheet, SheetHeader } from "@/components/ui/Sheet";
import { Recorder } from "./Recorder";

const EMPTY: MemoryDraft = {
  type: "photo",
  title: "",
  description: "",
  date: "",
  category: "pooja",
  people: [],
  files: [],
};

/**
 * Add Memory.
 *
 * Two steps only: what kind of memory, then the memory itself — written
 * as questions rather than field labels, because this is a memory book
 * and not a database form.
 */
export function Composer() {
  const {
    composerOpen,
    closeComposer,
    composerDefaults,
    people,
    addMemory,
    addPerson,
    festivalFor,
    festivals,
    say,
  } = useStore();
  const router = useRouter();

  const [step, setStep] = useState<"type" | "details">("type");
  const [draft, setDraft] = useState<MemoryDraft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [newPerson, setNewPerson] = useState("");
  const [showPersonInput, setShowPersonInput] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const latestYear = festivals[0]?.year ?? new Date().getFullYear();

  useEffect(() => {
    if (!composerOpen) return;
    const year = composerDefaults.year ?? latestYear;
    const festivalDate = festivalFor(year)?.date;
    setDraft({
      ...EMPTY,
      type: composerDefaults.type ?? "photo",
      category: composerDefaults.category ?? "pooja",
      date: festivalDate ?? toDateInputValue(new Date()),
    });
    setStep(composerDefaults.type ? "details" : "type");
    setShowPersonInput(false);
    setNewPerson("");
    setSaving(false);
  }, [composerOpen, composerDefaults, festivalFor, latestYear]);

  const previews = useFilePreviews(draft.files);

  const canSave = useMemo(
    () =>
      draft.files.length > 0 ||
      Boolean(draft.audio) ||
      draft.title.trim().length > 0 ||
      draft.description.trim().length > 0,
    [draft],
  );

  const update = (patch: Partial<MemoryDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const pickType = (type: MemoryType) => {
    update({ type, category: type === "voice" ? "other" : draft.category });
    setStep("details");
  };

  const togglePerson = (id: string) =>
    setDraft((d) => ({
      ...d,
      people: d.people.includes(id) ? d.people.filter((p) => p !== id) : [...d.people, id],
    }));

  const commitNewPerson = () => {
    const name = newPerson.trim();
    if (!name) {
      setShowPersonInput(false);
      return;
    }
    const person = addPerson(name);
    setDraft((d) => ({ ...d, people: [...d.people, person.id] }));
    setNewPerson("");
    setShowPersonInput(false);
  };

  const save = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    const year = Number(draft.date.slice(0, 4));
    await addMemory(draft);
    closeComposer();
    say("Kept. This one is yours now.");
    if (Number.isFinite(year)) router.push(`/years/${year}`);
  };

  const typeMeta = MEMORY_TYPES.find((t) => t.id === draft.type);

  return (
    <Sheet
      open={composerOpen}
      onClose={closeComposer}
      label="Add a memory"
      width={step === "type" ? "max-w-xl" : "max-w-2xl"}
    >
      {step === "type" ? (
        <>
          <SheetHeader
            title="What do you want to remember?"
            subtitle="Pick whichever comes closest. You can add the rest afterwards."
            onClose={closeComposer}
          />
          <div className="grid grid-cols-2 gap-3 px-6 pb-8 sm:px-8">
            {MEMORY_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pickType(t.id)}
                className="group rounded-[22px] border border-brass-500/12 bg-ink-800/35 px-5 py-7 text-left transition-all duration-300 hover:border-brass-400/50 hover:bg-ink-800/70"
              >
                <span className="block text-[1.75rem] leading-none">{t.glyph}</span>
                <span className="mt-3 block font-display text-[1.125rem] text-bone-50">{t.label}</span>
                <span className="mt-1 block text-[0.8125rem] text-bone-400">{t.blurb}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <SheetHeader
            title={promptFor(draft.type)}
            subtitle={typeMeta ? `${typeMeta.glyph} ${typeMeta.label} memory` : undefined}
            onClose={closeComposer}
            onBack={() => setStep("type")}
          />

          <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-6 sm:px-8">
            {/* media */}
            {(draft.type === "photo" || draft.type === "video") && (
              <section className="mb-8">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept={draft.type === "video" ? "video/*" : "image/*"}
                  className="sr-only"
                  onChange={(e) =>
                    update({ files: [...draft.files, ...Array.from(e.target.files ?? [])] })
                  }
                />
                {draft.files.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-brass-500/20 px-6 py-12 text-center transition-colors hover:border-brass-400 hover:bg-ink-800/30"
                  >
                    <span className="text-[1.75rem]">{draft.type === "video" ? "🎥" : "📸"}</span>
                    <span className="mt-3 font-display text-[1.0625rem] text-bone-50">
                      Add {draft.type === "video" ? "videos" : "photos"}
                    </span>
                    <span className="mt-1 text-[0.8125rem] text-bone-400">
                      They stay on this device
                    </span>
                  </button>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {previews.map((p, i) => (
                      <div
                        key={p.key}
                        className="group relative aspect-square overflow-hidden rounded-[14px] bg-ink-800"
                      >
                        {p.isVideo ? (
                          // eslint-disable-next-line jsx-a11y/media-has-caption
                          <video src={p.url} className="h-full w-full object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.url} alt="" className="h-full w-full object-cover" />
                        )}
                        <button
                          type="button"
                          aria-label="Remove"
                          onClick={() =>
                            update({ files: draft.files.filter((_, index) => index !== i) })
                          }
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex aspect-square items-center justify-center rounded-[14px] border border-dashed border-brass-500/20 text-bone-400 transition-colors hover:border-brass-400 hover:text-bone-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M12 6v12M6 12h12" />
                      </svg>
                    </button>
                  </div>
                )}
              </section>
            )}

            {draft.type === "voice" && (
              <section className="mb-8">
                <Recorder recorded={draft.audio} onRecorded={(audio) => update({ audio })} />
              </section>
            )}

            {/* the story */}
            <Question label={draft.type === "story" ? "What happened?" : "Give it a name"}>
              <input
                className="field font-display !text-[1.25rem]"
                placeholder={placeholderTitle(draft.type)}
                value={draft.title}
                onChange={(e) => update({ title: e.target.value })}
              />
            </Question>

            <Question
              label={draft.type === "story" ? "Tell the story" : "Anything you want to say about it?"}
            >
              <textarea
                className="field"
                rows={draft.type === "story" ? 6 : 3}
                placeholder="Tell the story..."
                value={draft.description}
                onChange={(e) => update({ description: e.target.value })}
              />
            </Question>

            {/* people */}
            <Question label="Who was there?">
              <div className="flex flex-wrap gap-2 pt-1">
                {people.map((p) => {
                  const on = draft.people.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePerson(p.id)}
                      className={`rounded-full px-4 py-2 text-[0.875rem] transition-all duration-200 ${
                        on
                          ? "bg-brass-500 text-ink-950"
                          : "border border-brass-500/20 text-bone-200 hover:border-brass-400/60"
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
                {showPersonInput ? (
                  <input
                    autoFocus
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    onBlur={commitNewPerson}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitNewPerson();
                      }
                    }}
                    placeholder="Their name"
                    className="rounded-full border border-brass-400/60 bg-transparent px-4 py-2 text-[0.875rem] outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPersonInput(true)}
                    className="rounded-full border border-dashed border-brass-500/20 px-4 py-2 text-[0.875rem] text-bone-400 transition-colors hover:border-brass-400 hover:text-bone-50"
                  >
                    + Someone else
                  </button>
                )}
              </div>
            </Question>

            {/* when */}
            <Question label="When was this?">
              <input
                type="date"
                className="field"
                value={draft.date.slice(0, 10)}
                onChange={(e) => update({ date: e.target.value })}
              />
            </Question>

            {/* moment */}
            <Question label="Which part of the day?">
              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORIES.map((c) => {
                  const on = draft.category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => update({ category: c.id as CategoryId })}
                      className={`rounded-full px-4 py-2 text-[0.875rem] transition-all duration-200 ${
                        on
                          ? "bg-brass-500 text-ink-950"
                          : "border border-brass-500/20 text-bone-200 hover:border-brass-400/60"
                      }`}
                    >
                      <span className="mr-1.5">{c.glyph}</span>
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </Question>

            {draft.category === "food" && (
              <Question label="What was the dish?">
                <input
                  className="field"
                  placeholder="Kudumulu, undrallu, payasam..."
                  value={draft.dish ?? ""}
                  onChange={(e) => update({ dish: e.target.value })}
                />
                <p className="mt-2 text-[0.8125rem] text-bone-400">
                  Naming it lets you follow the same dish across years.
                </p>
              </Question>
            )}

            {draft.category === "decoration" && (
              <Question label="What was the theme this year?">
                <input
                  className="field"
                  placeholder="Simple flowers, temple theme, banana stems..."
                  value={draft.theme ?? ""}
                  onChange={(e) => update({ theme: e.target.value })}
                />
              </Question>
            )}

            {draft.type === "voice" && (
              <Question label="Whose voice is this?">
                <input
                  className="field"
                  placeholder="Amma, Tatayya, yours..."
                  value={draft.voiceBy ?? ""}
                  onChange={(e) => update({ voiceBy: e.target.value })}
                />
              </Question>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-brass-500/12 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-4">
            <p className="text-[0.8125rem] text-bone-400">
              Saved to {draft.date.slice(0, 4) || "this year"}
            </p>
            <button
              type="button"
              onClick={save}
              disabled={!canSave || saving}
              className="btn btn-primary btn-md"
            >
              {saving ? "Saving..." : "Save memory"}
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h3 className="mb-1.5 font-display text-[1.0625rem] text-bone-200">{label}</h3>
      {children}
    </section>
  );
}

function promptFor(type: MemoryType): string {
  switch (type) {
    case "story":
      return "Write it down before it fades";
    case "voice":
      return "Say it out loud";
    case "video":
      return "A moment that moved";
    default:
      return "A moment you saw";
  }
}

function placeholderTitle(type: MemoryType): string {
  switch (type) {
    case "story":
      return "The funniest moment";
    case "voice":
      return "Amma on the kudumulu";
    case "video":
      return "Mangala harathi";
    default:
      return "Bringing Vinayaka home";
  }
}

interface Preview {
  key: string;
  url: string;
  isVideo: boolean;
}

function useFilePreviews(files: File[]): Preview[] {
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    const next = files.map((file, i) => ({
      key: `${file.name}-${file.size}-${i}`,
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video"),
    }));
    setPreviews(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [files]);

  return previews;
}
