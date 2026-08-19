"use client";

import { useEffect, useRef, useState } from "react";
import { cachedBlobUrl, resolveBlobUrl } from "./db";

/** Resolve an IndexedDB blob key to an object URL. */
export function useBlobUrl(key?: string): string | null {
  const [url, setUrl] = useState<string | null>(() => (key ? cachedBlobUrl(key) ?? null : null));

  useEffect(() => {
    if (!key) {
      setUrl(null);
      return;
    }
    const hit = cachedBlobUrl(key);
    if (hit) {
      setUrl(hit);
      return;
    }
    let cancelled = false;
    resolveBlobUrl(key).then((next) => {
      if (!cancelled) setUrl(next);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return url;
}

/** Adds `is-visible` to a `.reveal` element the first time it scrolls in. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Today's date, but only after mount.
 *
 * Anything that depends on "now" has to wait for the client, otherwise the
 * server-rendered markup and the browser can disagree about the date.
 */
export function useToday(): Date | null {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  return today;
}

/** Locks body scroll while a sheet or lightbox is open. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

/** Calls back on Escape. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}
