"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { coverOf } from "@/lib/derive";
import { useStore } from "@/lib/store";
import { category } from "@/lib/taxonomy";
import type { Memory } from "@/lib/types";
import { MediaFrame } from "@/components/media/MediaFrame";

/**
 * Drag-to-explore rail.
 *
 * A free horizontal drag with elastic ends, in tall 9:16 frames — the
 * reference's reels strip, carrying our moving and spoken memories.
 */
export function DragRail({ memories }: { memories: Memory[] }) {
  const { openMemory } = useStore();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [bound, setBound] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setBound(Math.max(0, track.scrollWidth - viewport.offsetWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [memories.length]);

  if (memories.length === 0) return null;

  return (
    <div ref={viewportRef} className="edge-fade-x -mx-5 overflow-hidden px-5 md:-mx-10 md:px-10">
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: -bound, right: 0 }}
        dragElastic={0.12}
        dragTransition={{ power: 0.28, timeConstant: 320, bounceStiffness: 240, bounceDamping: 34 }}
        className="flex w-max cursor-grab gap-5 active:cursor-grabbing"
      >
        {memories.map((memory, i) => {
          const cover = coverOf(memory);
          const isVoice = memory.type === "voice";
          const showTitle = memory.title && memory.title !== "A moment that moved" && memory.title !== "A moment we kept";
          return (
            <button
              key={memory.id}
              type="button"
              onClick={() => openMemory(memory.id)}
              className="group/reel hairline relative isolate aspect-[9/16] w-[62vw] shrink-0 overflow-hidden rounded-2xl bg-ink-850 text-left sm:w-[36vw] md:w-[24vw] lg:w-[18vw] xl:w-[15vw]"
            >
              {cover && !isVoice ? (
                <MediaFrame
                  media={cover}
                  seed={`reel-${memory.id}`}
                  showPlay={false}
                  className="size-full"
                />
              ) : (
                <span className="grid size-full place-items-center bg-linear-to-b from-ink-800 to-ink-950">
                  <span className="font-display text-[3rem] text-brass-gradient">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              )}

              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/92 via-ink-950/20 to-transparent" />

              <span className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="grid size-14 place-items-center rounded-full border border-brass-300/40 bg-ink-950/50 text-brass-200 backdrop-blur-md transition-transform duration-500 group-hover/reel:scale-110">
                  {isVoice ? (
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                      <rect x="9" y="3" width="6" height="11" rx="3" />
                      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="ml-0.5 size-5 fill-current">
                      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                    </svg>
                  )}
                </span>
              </span>

              {showTitle && (
                <span className="absolute inset-x-0 bottom-0 p-4 pb-5 text-center">
                  <span className="block font-display text-[1rem] leading-snug text-bone-50">
                    {memory.title}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

export function DragHint() {
  return (
    <div className="mt-6 flex items-center gap-3 text-bone-500">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6 3 12l5 6M16 6l5 6-5 6M3 12h18" />
      </svg>
      <span className="text-[0.5625rem] font-semibold tracking-[0.24em] uppercase">
        Drag to explore
      </span>
    </div>
  );
}
