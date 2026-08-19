"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDay, formatTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { category } from "@/lib/taxonomy";
import { MediaFrame } from "@/components/media/MediaFrame";
import { VoicePlayer } from "@/components/media/VoicePlayer";
import { Sheet } from "@/components/ui/Sheet";

export function MemoryViewer() {
  const { viewing, closeMemory, memories, personById, removeMemory, say } = useStore();
  const memory = memories.find((m) => m.id === viewing) ?? null;
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [viewing]);

  const visuals = memory?.media.filter((m) => m.kind !== "audio") ?? [];
  const audio = memory?.media.find((m) => m.kind === "audio");

  useEffect(() => {
    if (!memory || visuals.length < 2) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % visuals.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + visuals.length) % visuals.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [memory, visuals.length]);

  if (!memory) return null;

  const cat = category(memory.category);
  const people = memory.people.map(personById).filter(Boolean);

  return (
    <Sheet open onClose={closeMemory} label={memory.title} dark width="max-w-5xl">
      <div className="no-scrollbar flex max-h-[92dvh] flex-col overflow-y-auto">
        <div className="flex justify-end px-1 pb-2 pt-1">
          <button
            type="button"
            onClick={closeMemory}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full border border-brass-500/25 bg-ink-950/60 text-bone-300 backdrop-blur-md transition-colors hover:border-brass-400/60 hover:text-brass-300"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {visuals.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-ink-950">
              <MediaFrame
                media={visuals[index]}
                seed={`${memory.id}-${index}`}
                playable
                className="aspect-[4/3] w-full sm:aspect-[16/10]"
              />
            </div>

            {visuals.length > 1 && (
              <>
                <Arrow side="left" onClick={() => setIndex((i) => (i - 1 + visuals.length) % visuals.length)} />
                <Arrow side="right" onClick={() => setIndex((i) => (i + 1) % visuals.length)} />
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  {visuals.map((m, i) => (
                    <button
                      key={m.id}
                      type="button"
                      aria-label={`Photo ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === index ? "w-7 bg-brass-300" : "w-1.5 bg-bone-500/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <article className="hairline mt-4 rounded-3xl bg-ink-900 px-6 py-8 sm:px-9 sm:py-9">
          <div className="flex flex-wrap items-center gap-3 text-[0.5625rem] font-semibold tracking-[0.18em] uppercase">
            <span className="h-px w-6 bg-brass-500" />
            <Link
              href={`/years/${memory.year}`}
              onClick={closeMemory}
              className="text-brass-300 transition-colors hover:text-brass-200"
            >
              {memory.year}
            </Link>
            <span className="text-bone-500">
              {formatDay(memory.date)}
              {formatTime(memory.date) ? ` · ${formatTime(memory.date)}` : ""}
            </span>
            <span className="text-bone-500">· {cat.label}</span>
          </div>

          <h2 className="mt-4 font-display text-title leading-[1.05] tracking-[-0.015em] text-bone-50">
            {memory.title}
          </h2>

          {memory.description && (
            <div className="mt-5 max-w-[62ch] space-y-4 text-[1.0625rem] leading-relaxed text-bone-300">
              {memory.description.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {audio && (
            <div className="mt-6 max-w-md">
              <VoicePlayer media={audio} by={memory.voiceBy} seed={memory.id} />
            </div>
          )}

          {(memory.dish || memory.theme) && (
            <p className="mt-5 text-[0.875rem] text-bone-400">
              {memory.dish && (
                <>
                  Dish: <span className="text-bone-200">{memory.dish}</span>
                </>
              )}
              {memory.theme && (
                <>
                  Decoration: <span className="text-bone-200">{memory.theme}</span>
                </>
              )}
            </p>
          )}

          {people.length > 0 && (
            <div className="mt-6 border-t border-brass-500/12 pt-5">
              <p className="micro mb-3">Who was there</p>
              <div className="flex flex-wrap gap-2">
                {people.map(
                  (p) =>
                    p && (
                      <Link
                        key={p.id}
                        href={`/people/${p.id}`}
                        onClick={closeMemory}
                        className="rounded-full border border-brass-500/20 px-3.5 py-1.5 text-[0.875rem] text-bone-200 transition-colors hover:border-brass-400 hover:text-bone-50"
                      >
                        {p.name}
                      </Link>
                    ),
                )}
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-4 border-t border-brass-500/12 pt-5">
            <Link
              href={`/years/${memory.year}`}
              onClick={closeMemory}
              className="text-[0.875rem] text-brass-300 hover:underline"
            >
              See all of {memory.year} →
            </Link>
            <button
              type="button"
              onClick={() => {
                removeMemory(memory.id);
                closeMemory();
                say("Removed from the book.");
              }}
              className="text-[0.8125rem] text-bone-500 transition-colors hover:text-brass-300"
            >
              Remove
            </button>
          </div>
        </article>
      </div>
    </Sheet>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-brass-300/30 bg-ink-950/60 text-brass-200 backdrop-blur-md transition-transform duration-500 hover:scale-110 sm:grid ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d={side === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} />
      </svg>
    </button>
  );
}
