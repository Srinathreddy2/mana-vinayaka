"use client";

import Link from "next/link";
import { useMemo } from "react";
import { byYear, coverOf, pickHero, summarize, totalMediaCount } from "@/lib/derive";
import { formatDay, plural } from "@/lib/format";
import { useStore } from "@/lib/store";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";
import { Summary } from "@/components/year/Summary";
import { Band, Chip, Page } from "@/components/ui/Section";

export default function YearsPage() {
  const { memories, festivals, capsuleFor } = useStore();

  const rows = useMemo(
    () =>
      festivals.map((festival) => {
        const list = byYear(memories, festival.year);
        const mediaCount = totalMediaCount(list);
        return {
          festival,
          list,
          mediaCount,
          summary: summarize(list),
          hero: pickHero(list, festival.heroMemoryId),
        };
      }),
    [festivals, memories],
  );

  return (
    <>
      <Page className="pt-40 pb-4 md:pt-52">
        <Reveal>
          <Eyebrow>Years</Eyebrow>
        </Reveal>
        <RevealText
          as="h1"
          text="Every year, a chapter."
          className="mt-6 max-w-4xl font-display text-hero leading-[0.9] tracking-[-0.025em] text-bone-50"
        />
        <Reveal delay={0.15}>
          <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-bone-300 md:text-lg">
            The same festival, the same family, a different year. Open one and the whole day is
            still there — morning to visarjan, in order.
          </p>
        </Reveal>
      </Page>

      <Band divided={false} className="!pt-20">
        <div className="relative isolate">
          {/* Soft warm-gold ambient bed behind the block — diffuse enough that
              it only lifts the card off the background, never reads as a shape. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -inset-y-16 -z-10"
            style={{
              background:
                "radial-gradient(65% 60% at 50% 45%, rgba(232, 176, 75, 0.09), rgba(232, 176, 75, 0.035) 45%, transparent 72%)",
              filter: "blur(70px)",
            }}
          />

          {/* Warm-gold halo tracing the block's outline. Box-shadow only, so it
              hugs the same rounded rectangle as the border and paints purely
              outside it — no fill, no shape, no effect on layout. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
            style={{ boxShadow: "0 0 50px 4px rgba(232, 176, 75, 0.10)" }}
          />

        <div className="space-y-px overflow-hidden rounded-2xl border border-brass-500/12">
          {rows.map(({ festival, list, mediaCount, summary, hero }, i) => (
            <Reveal key={festival.year} delay={i * 0.06}>
              <Link
                href={`/years/${festival.year}`}
                className="group/row block bg-ink-900/40 transition-colors duration-500 hover:bg-ink-800/60"
              >
                <div className="grid items-center gap-6 px-5 py-7 md:grid-cols-[auto_1fr_auto] md:gap-10 md:px-8 md:py-9">
                  <div className="font-display text-[clamp(3rem,9vw,5.5rem)] leading-none text-brass-gradient md:w-[5.5ch]">
                    {festival.year}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-title leading-none text-bone-50 transition-colors duration-300 group-hover/row:text-brass-300">
                        {festival.title}
                      </h2>
                      {capsuleFor(festival.year) && <Chip>Sealed</Chip>}
                    </div>
                    <p className="mt-2 text-[0.875rem] text-bone-400">
                      {formatDay(festival.date)}
                      {festival.place ? ` · ${festival.place}` : ""} ·{" "}
                      {plural(mediaCount, "memory", "memories")}
                    </p>
                    {festival.note && (
                      <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-bone-300">
                        {festival.note}
                      </p>
                    )}
                    <div className="mt-5">
                      <Summary summary={summary} compact />
                    </div>
                  </div>

                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-48">
                    {hero && (
                      <MediaFrame
                        media={coverOf(hero)}
                        seed={`years-${festival.year}`}
                        showPlay={false}
                        className="size-full"
                      />
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        </div>
      </Band>
    </>
  );
}
