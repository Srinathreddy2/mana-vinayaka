"use client";

import { useMemo } from "react";
import { coverOf, onThisDay } from "@/lib/derive";
import { formatLongDate } from "@/lib/format";
import { useToday } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/Section";

/**
 * On This Day — the reason to open the book on an ordinary morning.
 * Presented as the reference presents its schedule: numbered hairline
 * rows, a thumbnail that creeps on hover, and a rule that unrolls.
 */
export function OnThisDay({ limit = 3 }: { limit?: number }) {
  const { memories, openMemory } = useStore();
  const today = useToday();

  const echoes = useMemo(
    () =>
      today
        ? onThisDay(memories.filter((m) => !m.homeHidden), today).slice(0, limit)
        : [],
    [memories, today, limit],
  );

  if (echoes.length === 0) return null;

  return (
    <>
      <SectionHead
        eyebrow="On this day"
        title={echoes[0].exact ? "One year ago today." : "Around this time, before."}
        note="The same days, in the years behind us. This is what the book opens with next August."
      />

      <div className="relative mt-14">
        {/* Soft, wide, subtle warm golden ambient glow that gently fades outward */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[95%] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[80px]"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(232, 176, 75, 0.18), rgba(209, 145, 63, 0.05) 55%, transparent 85%)",
          }}
        />

        <div className="relative space-y-px overflow-hidden rounded-2xl border border-brass-500/10 bg-ink-900/40">
          {echoes.map((echo, i) => {
          const cover = coverOf(echo.memory);
          return (
            <Reveal key={echo.memory.id} delay={i * 0.06}>
              <button
                type="button"
                onClick={() => openMemory(echo.memory.id)}
                className="group/row flex w-full items-center gap-5 bg-ink-900/40 px-5 py-6 text-left transition-colors duration-500 hover:bg-ink-800/60 md:gap-8 md:px-8 md:py-7"
              >
                <span className="w-24 shrink-0 overflow-hidden rounded-xl md:w-40">
                  {cover ? (
                    <MediaFrame
                      media={cover}
                      seed={echo.memory.id}
                      showPlay={false}
                      className="aspect-[4/3] w-full"
                    />
                  ) : (
                    <span className="grid aspect-[4/3] w-full place-items-center rounded-xl bg-ink-800 font-display text-[1.25rem] text-brass-gradient">
                      {echo.gap}y
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[0.5625rem] font-semibold tracking-[0.2em] text-brass-400 uppercase">
                    <span className="h-px w-3 bg-brass-500 transition-all duration-500 group-hover/row:w-7" />
                    {echo.label} · {formatLongDate(echo.memory.date)}
                  </span>
                  <span className="mt-2 block font-display text-[1.25rem] leading-snug text-bone-50 transition-colors duration-300 group-hover/row:text-brass-300 md:text-[1.75rem]">
                    {echo.memory.title}
                  </span>
                  {echo.memory.description && (
                    <span className="mt-2 line-clamp-2 block text-[0.9375rem] leading-relaxed text-bone-400">
                      {echo.memory.description}
                    </span>
                  )}
                </span>

                <span className="hidden shrink-0 text-brass-500/70 transition-transform duration-500 group-hover/row:translate-x-1 sm:block">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </Reveal>
          );
        })}
        </div>
      </div>
    </>
  );
}
