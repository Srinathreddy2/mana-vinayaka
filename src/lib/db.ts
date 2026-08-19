import type { Capsule, Memory, Person } from "./types";

/* ------------------------------------------------------------------
   Local persistence.

   No server, no infrastructure — the archive lives in the browser.
   Metadata goes in one IndexedDB record; photos, videos and voice
   recordings are kept as Blobs alongside it, so a 40MB video never
   has to be base64-encoded into a JSON string.
------------------------------------------------------------------- */

const DB_NAME = "mana-vinayaka";
const DB_VERSION = 1;
const STORE_KV = "kv";
const STORE_BLOBS = "blobs";
const STATE_KEY = "archive";

export interface ArchiveState {
  version: 1;
  memories: Memory[];
  people: Person[];
  capsules: Capsule[];
  /** Seed memories the user removed. */
  hidden: string[];
}

export const emptyArchive = (): ArchiveState => ({
  version: 1,
  memories: [],
  people: [],
  capsules: [],
  hidden: [],
});

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_KV)) db.createObjectStore(STORE_KV);
        if (!db.objectStoreNames.contains(STORE_BLOBS)) db.createObjectStore(STORE_BLOBS);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });

  return dbPromise;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T | null> {
  return openDB().then(
    (db) =>
      new Promise<T | null>((resolve) => {
        if (!db) return resolve(null);
        try {
          const request = run(db.transaction(store, mode).objectStore(store));
          request.onsuccess = () => resolve(request.result as T);
          request.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      }),
  );
}

export async function loadArchive(): Promise<ArchiveState> {
  const raw = await tx<ArchiveState>(STORE_KV, "readonly", (s) => s.get(STATE_KEY));
  if (!raw || raw.version !== 1) return emptyArchive();
  return { ...emptyArchive(), ...raw };
}

export async function saveArchive(state: ArchiveState): Promise<void> {
  await tx(STORE_KV, "readwrite", (s) => s.put(state, STATE_KEY));
}

export async function putBlob(key: string, blob: Blob): Promise<void> {
  await tx(STORE_BLOBS, "readwrite", (s) => s.put(blob, key));
}

export async function getBlob(key: string): Promise<Blob | null> {
  return tx<Blob>(STORE_BLOBS, "readonly", (s) => s.get(key));
}

export async function deleteBlob(key: string): Promise<void> {
  await tx(STORE_BLOBS, "readwrite", (s) => s.delete(key));
}

/* Object URLs are cached per blob key so the same photo is only ever
   materialised once per session. */
const urlCache = new Map<string, string>();
const pending = new Map<string, Promise<string | null>>();

export function cachedBlobUrl(key: string): string | undefined {
  return urlCache.get(key);
}

export function resolveBlobUrl(key: string): Promise<string | null> {
  const hit = urlCache.get(key);
  if (hit) return Promise.resolve(hit);

  const inflight = pending.get(key);
  if (inflight) return inflight;

  const task = getBlob(key).then((blob) => {
    pending.delete(key);
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    urlCache.set(key, url);
    return url;
  });

  pending.set(key, task);
  return task;
}

export function newId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}
