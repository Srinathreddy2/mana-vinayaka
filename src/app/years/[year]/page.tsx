"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  byYear,
  coverOf,
  decorationByYear,
  dishThreads,
  peopleTallies,
  pickHero,
  summarize,
} from "@/lib/derive";
import { formatDay, initials, plural } from "@/lib/format";
import { useStore } from "@/lib/store";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MemoryTile } from "@/components/memory/MemoryTile";
import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";
import { Capsule } from "@/components/year/Capsule";
import { Summary } from "@/components/year/Summary";
import { Band, Chip, Page, SectionHead } from "@/components/ui/Section";

export default function YearPage() {
  const params = useParams<{ year: string }>();
  const year = Number(params.year);
  const { memories, festivals, festivalFor, personById, openComposer, capsuleFor } = useStore();

  const list = useMemo(() => byYear(memories, year), [memories, year]);
  const festival = festivalFor(year);
  const summary = useMemo(() => summarize(list), [list]);
  const hero = useMemo(() => pickHero(list, festival?.heroMemoryId), [list, festival]);
  const dishes = useMemo(
    () => dishThreads(memories).filter((t) => t.years.includes(year)),
    [memories, year],
  );
  const decorations = useMemo(() => decorationByYear(memories), [memories]);
  const tallies = useMemo(() => peopleTallies(list), [list]);
  const neighbours = useMemo(() => {
    const years = festivals.map((f) => f.year).sort((a, b) => a - b);
    const at = years.indexOf(year);
    return { previous: years[at - 1], next: years[at + 1] };
  }, [festivals, year]);

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);

  if (!Number.isFinite(year) || list.length === 0) {
    return (
      <Page className="py-52 text-center">
        <h1 className="font-display text-display text-bone-50">Nothing here yet</h1>
        <p className="mt-4 text-bone-400">
          {Number.isFinite(year) ? `${year} has no memories in the book.` : "That year does not exist."}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/years" className="btn btn-ghost btn-lg">
            Back to years
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <>
      {/* ------------------------------- hero ------------------------------ */}
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden pt-36 pb-16"
      >
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 -z-20">
          {hero && (
            <MediaFrame
              media={coverOf(hero)}
              seed={`yearhero-${hero.id}`}
              showPlay={false}
              className="size-full"
            />
          )}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-ink-950/90 via-ink-950/60 to-ink-850" />

        <div className="gutter">
          <div className="shell">
            <Reveal y={16}>
              <Eyebrow single>
                Vinayaka Chavithi {year}
                {capsuleFor(year) ? " · sealed" : ""}
              </Eyebrow>
            </Reveal>
            <RevealText
              as="h1"
              text={festival?.title ?? "Our Vinayaka"}
              className="mt-5 font-display text-hero leading-[0.86] tracking-[-0.025em] text-bone-50"
            />
            <Reveal delay={0.2}>
              <p className="mt-5 text-[1.0625rem] text-bone-300">
                {festival ? formatDay(festival.date) : year}
                {festival?.place ? ` · ${festival.place}` : ""}
              </p>
              {festival?.note && (
                <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-bone-400 md:text-lg">
                  {festival.note}
                </p>
              )}
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 border-t border-brass-500/15 pt-8">
                <Summary summary={summary} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------- timeline ---------------------------- */}
      <Band divided={false}>
        <SectionHead
          eyebrow="The day"
          title="Morning to visarjan."
          note="In the order it happened."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((memory, i) => (
            <Reveal key={memory.id} delay={(i % 3) * 0.06}>
              <MemoryTile
                memory={memory}
                ratio="aspect-[4/3]"
                hideTitle
              />
            </Reveal>
          ))}
        </div>
      </Band>

      {/* ------------------------------- food ------------------------------ */}
      {dishes.length > 0 && (
        <Band>
          <SectionHead
            eyebrow="From the kitchen"
            title="What we ate."
            note="The same dishes, year after year. This is how a family recipe book starts."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((thread, i) => {
              const here = thread.memories.find((m) => m.year === year) ?? thread.memories[0];
              return (
                <Reveal key={thread.dish} delay={i * 0.07}>
                  <Link
                    href={`/memories?dish=${encodeURIComponent(thread.dish)}`}
                    className="group/tile relative block overflow-hidden rounded-2xl"
                  >
                    <MediaFrame
                      media={coverOf(here)}
                      seed={`dish-${thread.dish}-${year}`}
                      showPlay={false}
                      className="aspect-[5/4] w-full"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/90 to-transparent opacity-80 transition-opacity duration-500 group-hover/tile:opacity-95" />
                    <span className="absolute inset-x-0 bottom-0 p-5">
                      <span className="block font-display text-[1.25rem] text-bone-50">
                        {thread.dish}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] tracking-[0.12em] text-brass-400 uppercase">
                        {thread.years.join(" · ")}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Band>
      )}

      {/* ---------------------------- decoration --------------------------- */}
      {decorations.length > 1 && (
        <Band>
          <SectionHead
            eyebrow="Decoration"
            title="How the mandapam changed."
            note="Every year someone says this one is the best. Now you can check."
          />
          <Reveal delay={0.1} className="mt-14">
            <div className="no-scrollbar edge-fade-x -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-10 md:px-10">
              {decorations.map((entry) => (
                <Link
                  key={entry.year}
                  href={`/years/${entry.year}#morning`}
                  className={`group/tile relative w-[17rem] shrink-0 overflow-hidden rounded-2xl sm:w-[21rem] ${
                    entry.year === year ? "ring-1 ring-brass-400/60" : ""
                  }`}
                >
                  <MediaFrame
                    media={coverOf(entry.memory)}
                    seed={`deco-${entry.year}`}
                    showPlay={false}
                    className="aspect-[4/3] w-full"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/92 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="font-display text-[1.75rem] leading-none text-brass-gradient">
                      {entry.year}
                    </span>
                    <span className="mt-1.5 block text-[0.9375rem] text-bone-200">{entry.theme}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </Band>
      )}

      {/* ------------------------------ people ----------------------------- */}
      {tallies.size > 0 && (
        <Band>
          <SectionHead
            eyebrow="Who was here"
            title={`${tallies.size} people in the room.`}
            aside={
              <Link href="/memories?view=people" className="btn btn-ghost btn-md">
                All people
              </Link>
            }
          />
          <div className="mt-14 flex flex-wrap gap-3">
            {[...tallies.entries()]
              .sort((a, b) => b[1].count - a[1].count)
              .map(([id, tally], i) => {
                const person = personById(id);
                if (!person) return null;
                return (
                  <Reveal key={id} delay={(i % 6) * 0.05}>
                    <Link
                      href={`/people/${id}`}
                      className="hairline group flex items-center gap-3 rounded-full py-2 pr-6 pl-2 transition-colors duration-500 hover:border-brass-400/60"
                    >
                      <span className="grid size-10 place-items-center rounded-full bg-brass-500/12 font-display text-[0.875rem] text-brass-300">
                        {initials(person.name)}
                      </span>
                      <span>
                        <span className="block font-display text-[1.0625rem] leading-tight text-bone-50 transition-colors group-hover:text-brass-300">
                          {person.name}
                        </span>
                        <span className="block text-[0.6875rem] tracking-[0.14em] text-bone-500 uppercase">
                          {plural(tally.count, "memory", "memories")}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
          </div>
        </Band>
      )}

      {/* --------------------------- capsule + film ------------------------ */}
      <Band>
        <Capsule year={year} summary={summary} />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/film/${year}`}
            className="group hairline flex items-center justify-between gap-5 rounded-2xl bg-ink-900/40 px-7 py-7 transition-colors duration-500 hover:border-brass-400/50"
          >
            <span>
              <span className="micro block">Memory film</span>
              <span className="mt-2 block font-display text-[1.25rem] text-bone-50 transition-colors group-hover:text-brass-300">
                Play the {year} film
              </span>
            </span>
            <span className="text-brass-500/70 transition-transform duration-500 group-hover:translate-x-1">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>

          <div className="hairline flex items-center justify-between gap-5 rounded-2xl bg-ink-900/40 px-7 py-7">
            {neighbours.previous ? (
              <Link href={`/years/${neighbours.previous}`} className="text-[0.9375rem] text-brass-300 hover:underline">
                ← {neighbours.previous}
              </Link>
            ) : (
              <span className="text-[0.9375rem] text-bone-500">Earliest year</span>
            )}
            {neighbours.next ? (
              <Link href={`/years/${neighbours.next}`} className="text-[0.9375rem] text-brass-300 hover:underline">
                {neighbours.next} →
              </Link>
            ) : (
              <span className="text-[0.9375rem] text-bone-500">Most recent</span>
            )}
          </div>
        </div>
      </Band>
    </>
  );
}
