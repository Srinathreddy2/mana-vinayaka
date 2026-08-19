"use client";

import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/format";
import { useBlobUrl } from "@/lib/hooks";
import type { Media } from "@/lib/types";

interface Props {
  media?: Media;
  by?: string;
  seed?: string;
  compact?: boolean;
}

/**
 * A voice memory. Real recordings play; the sample archive ships without
 * audio files, so those show the same player and say so plainly rather
 * than pretending to play something that is not there.
 */
export function VoicePlayer({ media, by, seed = "", compact = false }: Props) {
  const url = useBlobUrl(media?.blobKey);
  const src = media?.src ?? url ?? null;
  const duration = media?.durationSec ?? 0;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !src) {
      setNote(true);
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  };

  const bars = waveform(seed || media?.id || "voice", compact ? 34 : 56);

  return (
    <div
      className={`hairline flex items-center gap-4 rounded-2xl bg-ink-950/50 ${
        compact ? "px-4 py-3" : "px-5 py-4"
      }`}
    >
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play voice memory"}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-b from-brass-300 to-brass-500 text-ink-950 transition-transform duration-500 hover:scale-105 active:scale-95"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="size-4 fill-current">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-current">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex h-8 items-center gap-[3px]" aria-hidden="true">
          {bars.map((h, i) => {
            const played = i / bars.length <= progress;
            return (
              <span
                key={i}
                className="w-[3px] rounded-full transition-colors duration-200"
                style={{
                  height: `${h}%`,
                  background: played ? "var(--color-brass-300)" : "var(--color-bone-500)",
                  opacity: played ? 1 : 0.55,
                }}
              />
            );
          })}
        </div>
        <p className="mt-1.5 truncate text-[0.75rem] tracking-wide text-bone-400">
          {by ? `${by} · ` : ""}
          {formatDuration(duration)}
          {note && !src && (
            <span className="text-bone-500"> · sample memory, record your own to hear it play</span>
          )}
        </p>
      </div>
    </div>
  );
}

/** Deterministic pseudo-waveform so a recording always looks the same. */
function waveform(seed: string, count: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const next = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
  return Array.from({ length: count }, (_, i) => {
    const envelope = Math.sin((i / count) * Math.PI) * 0.55 + 0.45;
    return Math.round((next() * 0.7 + 0.3) * envelope * 100);
  });
}
