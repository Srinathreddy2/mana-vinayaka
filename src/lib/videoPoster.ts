"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   Video posters.

   An <img> pointed at a video file cannot decode it — the browser shows
   its broken-image glyph. Videos therefore need a real still frame, which
   we extract in the browser: decode the first playable frame onto a
   canvas and export it as a JPEG blob.

   New uploads get this captured once and stored alongside the video, so
   the poster survives reloads. Videos saved before posters existed are
   captured on demand and memoised for the session.
------------------------------------------------------------------- */

const MAX_WIDTH = 640;
const CAPTURE_TIMEOUT_MS = 6000;

/**
 * Decode a still frame from a video and return it as a JPEG blob.
 * Resolves null when the frame cannot be produced — unsupported codec,
 * decode failure or timeout — so callers can fall back deliberately.
 */
export function captureVideoPoster(source: Blob | string): Promise<Blob | null> {
  if (typeof document === "undefined") return Promise.resolve(null);

  return new Promise((resolve) => {
    const ownsUrl = typeof source !== "string";
    const url = ownsUrl ? URL.createObjectURL(source) : source;

    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    let settled = false;
    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.removeAttribute("src");
      video.load();
      if (ownsUrl) URL.revokeObjectURL(url);
      resolve(blob);
    };

    const timer = setTimeout(() => finish(null), CAPTURE_TIMEOUT_MS);

    const draw = () => {
      try {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return finish(null);

        const scale = Math.min(1, MAX_WIDTH / w);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) return finish(null);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // toBlob throws on a tainted canvas (cross-origin video without CORS).
        canvas.toBlob((blob) => finish(blob), "image/jpeg", 0.82);
      } catch {
        finish(null);
      }
    };

    video.onerror = () => finish(null);
    video.onseeked = draw;
    video.onloadeddata = () => {
      // Seeking slightly in avoids the black leader frame many clips open on.
      const target = Number.isFinite(video.duration) && video.duration > 0
        ? Math.min(0.5, video.duration / 2)
        : 0;
      if (target > 0) video.currentTime = target;
      else draw();
    };

    video.src = url;
  });
}

/* Session cache so a legacy video is only decoded once per page load. */
const derivedPosters = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();

function derivePosterUrl(videoUrl: string): Promise<string | null> {
  const cached = derivedPosters.get(videoUrl);
  if (cached !== undefined) return Promise.resolve(cached);

  const existing = inFlight.get(videoUrl);
  if (existing) return existing;

  const task = captureVideoPoster(videoUrl).then((blob) => {
    const objectUrl = blob ? URL.createObjectURL(blob) : null;
    derivedPosters.set(videoUrl, objectUrl);
    inFlight.delete(videoUrl);
    return objectUrl;
  });

  inFlight.set(videoUrl, task);
  return task;
}

/**
 * Poster for a video that has no stored one. Returns null while decoding
 * and if the frame could not be produced.
 */
export function useDerivedVideoPoster(videoUrl?: string | null): string | null {
  const [poster, setPoster] = useState<string | null>(() =>
    videoUrl ? derivedPosters.get(videoUrl) ?? null : null,
  );

  useEffect(() => {
    if (!videoUrl) {
      setPoster(null);
      return;
    }
    let cancelled = false;
    derivePosterUrl(videoUrl).then((url) => {
      if (!cancelled) setPoster(url);
    });
    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  return poster;
}
