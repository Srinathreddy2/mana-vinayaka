"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  byYear,
  coverOf,
  groupByChapter,
  newestFirst,
  pickHero,
  summarize,
  totalMediaCount,
} from "@/lib/derive";
import { formatDay, plural } from "@/lib/format";
import { useStore } from "@/lib/store";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MemoryTile } from "@/components/memory/MemoryTile";
import { OnThisDay } from "@/components/memory/OnThisDay";
import { DragHint, DragRail } from "@/components/home/DragRail";
import { Hero } from "@/components/home/Hero";
import { InstagramCTASection } from "@/components/home/InstagramCTASection";
import { LocationSection } from "@/components/home/LocationSection";
import { Counter } from "@/components/motion/Counter";
import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";
import { MarqueeBand } from "@/components/ui/Marquee";
import { Band, Chip, Page, SectionHead } from "@/components/ui/Section";

export default function HomePage() {
  const { memories, festivals, openComposer, capsuleFor } = useStore();

  const festival = festivals[0];
  const year = festival?.year ?? new Date().getFullYear();

  // Memories flagged homeHidden stay on their year page only.
  const homeMemories = useMemo(() => memories.filter((m) => !m.homeHidden), [memories]);

  const thisYear = useMemo(() => byYear(homeMemories, year), [homeMemories, year]);
  const hero = useMemo(
    () => pickHero(thisYear, festival?.heroMemoryId) ?? pickHero(homeMemories),
    [thisYear, festival, homeMemories],
  );
  const summary = useMemo(() => summarize(thisYear), [thisYear]);
  const allSummary = useMemo(() => summarize(memories), [memories]);
  const sealed = capsuleFor(year);

  const rail = useMemo(
    () =>
      newestFirst(
        memories.filter(
          (m) =>
            (Number(m.year) === 2025 || Number(m.year) === 2026 || Number(m.year) > 2024) &&
            (m.type === "video" || m.type === "voice" || m.media.some((x) => x.kind === "video")),
        ),
      ),
    [memories],
  );

  const gallery = useMemo(() => {
    const picks = groupByChapter(thisYear)
      .flatMap((g) => g.memories.filter((m) => m.media.some((x) => x.kind === "image")).slice(0, 2))
      .slice(0, 8);
    return picks;
  }, [thisYear]);

  if (!festival) return null;

  return (
    <>
      <Hero festival={festival} memories={thisYear} hero={hero} />
      <MarqueeBand />

      {/* ---------------------------- the archive --------------------------- */}
      <section className="relative isolate overflow-hidden bg-[#060505] py-24 md:py-32 lg:py-40">
        {/* Soft, diffused warm ambient background light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[130%] w-full max-w-6xl opacity-35 blur-[110px] animate-[ambient-breathe_10s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(209, 145, 63, 0.14), rgba(232, 176, 75, 0.04) 48%, transparent 80%)",
            }}
          />
        </div>

        <Page>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <Reveal>
                <Eyebrow>The book</Eyebrow>
              </Reveal>
              <RevealText
                text="Every year, a chapter."
                className="mt-5 font-display text-display leading-[0.98] tracking-[-0.015em] text-bone-50"
              />
            </div>
            <div className="max-w-2xl space-y-6 text-[1.0625rem] leading-relaxed text-bone-300 md:text-lg">
              <Reveal delay={0.05}>
                <p>
                  Mana Vinayaka is not a gallery. It is the place the celebration goes once the
                  mandapam comes down — the morning the idol came home, the mantra nobody
                  remembered, the twenty-one kudumulu, the walk to the water.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  Photographs are the easy part. What fades first is the voice, the joke at the
                  table, who stood where. So the book keeps those too, filed under the year they
                  belong to and the people who were in them.
                </p>
              </Reveal>
              <Reveal delay={0.19}>
                <Link href="/years" className="btn btn-ghost btn-md mt-2">
                  Browse the years
                  <Arrow />
                </Link>
              </Reveal>
            </div>
          </div>

          <div className="mt-20 overflow-hidden rounded-2xl border border-brass-500/15 bg-ink-900/30 px-6 py-10 md:px-10 md:py-12">
            <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-brass-500/12">
              {[
                { value: festivals.length, label: "Celebrations kept" },
                { value: allSummary.total, label: "Memories in all" },
                { value: allSummary.photos, label: "Photographs" },
                { value: allSummary.people, label: "People named" },
              ].map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.07} className="flex flex-col items-center justify-center px-4 text-center">
                  <div className="font-display text-[clamp(2.5rem,5.5vw,3.75rem)] leading-none text-brass-gradient drop-shadow-[0_2px_10px_rgba(209,145,63,0.18)]">
                    <Counter value={stat.value} />
                  </div>
                  <div className="mt-3.5 text-[0.6875rem] font-semibold tracking-[0.22em] text-bone-400 uppercase">
                    {stat.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Page>
      </section>

      {/* ----------------------------- the film ---------------------------- */}
      <section className="relative isolate overflow-hidden border-t border-brass-500/15 bg-[#060505] py-24 md:py-32 lg:py-40">
        {/* Soft, diffused warm ambient background light */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 h-[130%] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[110px] animate-[ambient-breathe_10s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(209, 145, 63, 0.14), rgba(232, 176, 75, 0.04) 48%, transparent 80%)",
            }}
          />
        </div>

        <Page>
          <SectionHead
            eyebrow="The film"
            title="The whole day, in three minutes."
            note="Morning to visarjan, played back in the order it happened — drums, lamps, the table, the water."
            aside={
              <>
                <Chip>Memory Film · {year}</Chip>
                <Chip>{plural(summary.photos, "frame")}</Chip>
              </>
            }
          />

          <Reveal delay={0.1} className="relative mt-14">
            {/* Subtle warm golden edge backlight glow around video container */}
            <div className="pointer-events-none absolute -inset-1 rounded-[1.85rem] bg-linear-to-r from-brass-500/25 via-brass-400/35 to-brass-500/25 opacity-60 blur-xl transition-opacity duration-500 group-hover/video:opacity-90" />

            <Link
              href={`/film/${year}`}
              className="group/video relative block overflow-hidden rounded-3xl ring-1 ring-brass-500/30 shadow-[0_0_40px_-5px_rgba(209,145,63,0.28)]"
            >
              {hero && (
                <MediaFrame
                  media={coverOf(hero)}
                  seed={`film-${hero.id}`}
                  showPlay={false}
                  className="aspect-[4/5] w-full sm:aspect-[16/9]"
                />
              )}
              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/85 via-ink-950/25 to-ink-950/40" />
              <span className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="grid size-20 place-items-center rounded-full border border-brass-300/40 bg-ink-950/55 text-brass-200 shadow-[0_0_50px_-10px_rgb(209_145_63/0.65)] backdrop-blur-md transition-transform duration-500 group-hover/video:scale-110 md:size-24">
                  <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-current md:size-8">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 md:p-10">
                <span>
                  <span className="text-[0.5625rem] font-semibold tracking-[0.24em] text-brass-300 uppercase">
                    Memory film · {year}
                  </span>
                  <span className="mt-2 block font-display text-title leading-none text-bone-50">
                    {festival.title}
                  </span>
                </span>
                <span className="text-[0.8125rem] text-bone-300">{formatDay(festival.date)}</span>
              </span>
            </Link>
          </Reveal>
        </Page>
      </section>

      {/* ------------------------------ the rail ---------------------------- */}
      {rail.length > 0 && (
        <section className="relative isolate overflow-hidden border-t border-brass-500/15 bg-[#060505] py-24 md:py-32 lg:py-40">
          {/* Soft, diffused warm ambient background light - slightly stronger around the center video rail */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            {/* Broad ambient background fill */}
            <div
              className="absolute left-1/2 top-1/2 h-[130%] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[110px] animate-[ambient-breathe_10s_ease-in-out_infinite] motion-reduce:animate-none"
              style={{
                background:
                  "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(209, 145, 63, 0.14), rgba(232, 176, 75, 0.04) 48%, transparent 80%)",
              }}
            />
            {/* Center-focused warm golden glow behind the video cards */}
            <div
              className="absolute left-1/2 top-[62%] h-[60%] w-[85%] max-w-4xl -translate-x-1/2 -translate-y-1/2 opacity-45 blur-[90px] animate-[ambient-breathe_12s_ease-in-out_infinite_reverse] motion-reduce:animate-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232, 176, 75, 0.22), rgba(209, 145, 63, 0.08) 55%, transparent 85%)",
              }}
            />
          </div>

          <Page>
            <SectionHead
              eyebrow="Moving and spoken"
              title="Straight from the house."
              note="The sounds, laughter, and little moments that made our Chavithi feel like home."
            />
            <Reveal delay={0.1} className="relative mt-14">
              <DragRail memories={rail} />
              <DragHint />
            </Reveal>
          </Page>
        </section>
      )}


      {/* ----------------------------- the gallery -------------------------- */}
      {gallery.length > 0 && (
        <Band>
          <SectionHead
            eyebrow="Gallery"
            title="Lamps, leaves and everything after dark."
            note="Tap anything to open it full-screen, with the story and the people underneath."
            aside={
              <Link href="/memories" className="btn btn-ghost btn-md">
                See all {allSummary.total} moments
                <Arrow />
              </Link>
            }
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((memory, i) => (
              <Reveal key={memory.id} delay={(i % 4) * 0.06}>
                <MemoryTile memory={memory} ratio={i % 5 === 0 ? "aspect-[4/5]" : "aspect-square"} />
              </Reveal>
            ))}
          </div>
        </Band>
      )}

      {/* ---------------------------- on this day --------------------------- */}
      <section className="relative isolate overflow-hidden border-t border-brass-500/15 bg-[#060505] py-24 md:py-32 lg:py-40">
        {/* Soft, diffused warm ambient background light */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 h-[130%] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[110px] animate-[ambient-breathe_10s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(209, 145, 63, 0.14), rgba(232, 176, 75, 0.04) 48%, transparent 80%)",
            }}
          />
        </div>

        <Page>
          <OnThisDay />
        </Page>
      </section>

      {/* ------------------------------- years ------------------------------ */}
      <section className="relative isolate overflow-hidden border-t border-brass-500/15 bg-[#060505] py-24 md:py-32 lg:py-40">
        {/* Soft, diffused warm ambient background light */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 h-[130%] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[110px] animate-[ambient-breathe_10s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(209, 145, 63, 0.14), rgba(232, 176, 75, 0.04) 48%, transparent 80%)",
            }}
          />
        </div>

        <Page>
          <SectionHead
            eyebrow="The years"
            title="Open any one of them."
            note="Each year keeps its own timeline, its own people, its own capsule."
          />
          <div className={`mt-14 grid gap-6 md:gap-8 ${festivals.length <= 2 ? "mx-auto max-w-4xl sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {festivals.map((f, i) => {
              const list = byYear(memories, f.year);
              const mediaCount = totalMediaCount(list);
              const cover = coverOf(pickHero(list, f.heroMemoryId) ?? list[0]);
              return (
                <Reveal key={f.year} delay={i * 0.07} className="group/tile relative">
                  {/* Faint, subtle warm-gold ambient backlight glow close to card edges */}
                  <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-brass-400/15 opacity-40 blur-md transition-opacity duration-500 group-hover/tile:opacity-75" />

                  <Link href={`/years/${f.year}`} className="relative block overflow-hidden rounded-2xl border border-brass-500/20 bg-ink-950 transition-colors duration-500 hover:border-brass-500/40">
                    <MediaFrame
                      media={cover}
                      seed={`year-${f.year}`}
                      showPlay={false}
                      className="aspect-[5/6] w-full"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/92 via-ink-950/20 to-transparent opacity-80 transition-opacity duration-500 group-hover/tile:opacity-95" />
                    <span className="absolute inset-x-0 bottom-0 p-6">
                      <span className="block font-display text-mega text-[clamp(2.75rem,7vw,4rem)] leading-none text-brass-gradient">
                        {f.year}
                      </span>
                      <span className="mt-2 block text-[0.9375rem] text-bone-200">{f.title}</span>
                      <span className="mt-1 block text-[0.8125rem] text-bone-400">
                        {plural(mediaCount, "memory", "memories")}
                        {capsuleFor(f.year) ? " · sealed" : ""}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Page>
      </section>

      {/* ------------------------------- outro ------------------------------ */}
      <section className="relative isolate overflow-hidden border-t border-brass-500/15 bg-[#060505] py-28 md:py-36">
        {/* Soft, diffused warm ambient background light */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 h-[130%] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 opacity-40 blur-[110px] animate-[ambient-breathe_10s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(209, 145, 63, 0.16), rgba(232, 176, 75, 0.05) 48%, transparent 80%)",
            }}
          />
        </div>

        <Page className="text-center">
          <Reveal>
            <p className="font-deva text-[clamp(1.125rem,2.5vw,1.75rem)] text-brass-300">
              గణపతి బాప్పా మోరియా
            </p>
          </Reveal>
          <RevealText
            text={sealed ? "See you next Vinayaka Chavithi." : "Add what you do not want to forget."}
            className="mx-auto mt-5 max-w-4xl font-display text-display leading-[0.98] tracking-[-0.015em] text-bone-50"
          />
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-bone-300">
              A photograph, a story, or thirty seconds of someone&rsquo;s voice. Years from now
              the voice is the part you cannot recreate.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => openComposer({ year })} className="btn btn-primary btn-lg shadow-[0_0_35px_rgba(209,145,63,0.35)]">
                <PlusIcon />
                Add Memory
              </button>
              <Link href={`/years/${year}#capsule`} className="btn btn-ghost btn-lg">
                {sealed ? `Open the ${year} capsule` : `Seal ${year}`}
              </Link>
            </div>
          </Reveal>
        </Page>
      </section>

      {/* ------------------------------ location ---------------------------- */}
      <LocationSection />

      {/* ---------------------------- instagram cta ------------------------- */}
      <InstagramCTASection />
    </>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}
