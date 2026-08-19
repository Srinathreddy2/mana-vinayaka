"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { coverOf, dishThreads, newestFirst, peopleTallies } from "@/lib/derive";
import { initials, plural } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Memory, MemoryType } from "@/lib/types";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MemoryTile } from "@/components/memory/MemoryTile";
import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";
import { Band, Chip, Page, SectionHead } from "@/components/ui/Section";

type Lens = "all" | MemoryType | "food" | "people";

const LENSES: { id: Lens; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "photo", label: "Photos" },
  { id: "video", label: "Videos" },
  { id: "story", label: "Stories" },
  { id: "voice", label: "Voices" },
  { id: "food", label: "Food" },
  { id: "people", label: "People" },
];

export default function MemoriesPage() {
  return (
    <Suspense fallback={<Page className="py-52" />}>
      <MemoriesBrowser />
    </Suspense>
  );
}

function MemoriesBrowser() {
  const search = useSearchParams();
  const { memories, festivals, openComposer } = useStore();

  const dishFilter = search.get("dish");
  const [lens, setLens] = useState<Lens>(
    (search.get("view") as Lens) ?? (dishFilter ? "food" : "all"),
  );
  const [year, setYear] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    let list: Memory[] = memories;
    if (year !== "all") list = list.filter((m) => m.year === year);
    if (dishFilter) list = list.filter((m) => m.dish === dishFilter);
    if (lens === "food") list = list.filter((m) => m.category === "food" || Boolean(m.dish));
    else if (lens !== "all" && lens !== "people") list = list.filter((m) => m.type === lens);
    return newestFirst(list);
  }, [memories, lens, year, dishFilter]);

  const tallies = useMemo(() => peopleTallies(memories), [memories]);
  const threads = useMemo(() => dishThreads(memories), [memories]);

  return (
    <>
      <Page className="relative isolate pt-40 pb-4 md:pt-52">
        {/* Warm ambient light behind the heading — heavily diffused so it reads
            as lift in the background, never as a circle or spotlight. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -bottom-32 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 32% 46%, rgba(232, 176, 75, 0.10), rgba(232, 176, 75, 0.035) 46%, transparent 74%)",
            filter: "blur(90px)",
          }}
        />

        <Reveal>
          <Eyebrow>Memories</Eyebrow>
        </Reveal>
        <RevealText
          as="h1"
          text={dishFilter ?? "Everything we kept."}
          className="mt-6 max-w-4xl font-display text-hero leading-[0.9] tracking-[-0.025em] text-bone-50"
        />
        <Reveal delay={0.15}>
          <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-bone-300 md:text-lg">
            {dishFilter
              ? "Every year this dish appears in the book."
              : "Photos, videos, stories, voices and the people in them — across every year."}
          </p>
          {dishFilter && (
            <Link href="/memories" className="btn btn-ghost btn-md mt-7">
              ← Everything
            </Link>
          )}
        </Reveal>
      </Page>

      <Band divided={false} className="!pt-16">
        {/* --------------------------- filters --------------------------- */}
        <Reveal>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-10 md:flex-wrap md:px-10">
            {LENSES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLens(l.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-all duration-300 ${
                  lens === l.id
                    ? "border border-brass-500/40 bg-brass-500/12 text-brass-300"
                    : "hairline text-bone-300 hover:border-brass-400/50 hover:text-bone-50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Reveal>

        {lens !== "people" && (
          <Reveal delay={0.06}>
            <div className="no-scrollbar -mx-5 mt-3 flex gap-1 overflow-x-auto px-5 md:-mx-10 md:px-10">
              <YearChip active={year === "all"} onClick={() => setYear("all")} label="All years" />
              {festivals.map((f) => (
                <YearChip
                  key={f.year}
                  active={year === f.year}
                  onClick={() => setYear(f.year)}
                  label={String(f.year)}
                />
              ))}
            </div>
          </Reveal>
        )}

        {/* ---------------------------- people --------------------------- */}
        {lens === "people" ? (
          <div className="mt-20">
            <SectionHead
              eyebrow="People"
              title="Who has been here."
              note="The same faces, year after year. Open one to see their Chavithis."
            />
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[...tallies.entries()]
                .sort((a, b) => b[1].years.size - a[1].years.size || b[1].count - a[1].count)
                .map(([id, tally], i) => (
                  <PersonCard key={id} id={id} tally={tally} delay={(i % 4) * 0.06} />
                ))}
            </div>

            {threads.length > 0 && (
              <div className="mt-24">
                <SectionHead eyebrow="From the kitchen" title="Dishes that keep coming back." />
                <Reveal delay={0.1}>
                  <div className="mt-10 flex flex-wrap gap-3">
                    {threads.map((t) => (
                      <Link
                        key={t.dish}
                        href={`/memories?dish=${encodeURIComponent(t.dish)}`}
                        className="hairline group rounded-full px-5 py-2.5 text-[0.9375rem] text-bone-200 transition-colors duration-500 hover:border-brass-400/60 hover:text-bone-50"
                      >
                        {t.dish}{" "}
                        <span className="text-[0.75rem] tracking-[0.12em] text-brass-500/70 uppercase">
                          · {t.years.join(" ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </Reveal>
              </div>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-title text-bone-50">Nothing here yet</p>
            <p className="mt-3 text-bone-400">This is where that kind of memory will live.</p>
            <button type="button" onClick={() => openComposer()} className="btn btn-primary btn-lg mt-8">
              Add Memory
            </button>
          </div>
        ) : (
          <>
            <Reveal delay={0.1}>
              <div className="mt-10 flex items-center gap-3">
                <Chip>{plural(filtered.length, "memory", "memories")}</Chip>
                <span className="h-px flex-1 bg-brass-500/12" />
              </div>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((memory, i) => (
                <Reveal key={memory.id} delay={(i % 4) * 0.05}>
                  <MemoryTile
                    memory={memory}
                    showYear
                    ratio={i % 5 === 0 ? "aspect-[4/5]" : "aspect-square"}
                  />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Band>
    </>
  );
}

function YearChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.75rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
        active ? "text-brass-300" : "text-bone-500 hover:text-bone-200"
      }`}
    >
      {label}
    </button>
  );
}

function PersonCard({
  id,
  tally,
  delay,
}: {
  id: string;
  tally: { count: number; years: Set<number> };
  delay: number;
}) {
  const { personById, memories } = useStore();
  const person = personById(id);
  const cover = useMemo(() => {
    const withPicture = memories.find(
      (m) => m.people.includes(id) && m.media.some((x) => x.kind === "image"),
    );
    return withPicture ? coverOf(withPicture) : undefined;
  }, [memories, id]);

  if (!person) return null;
  const years = [...tally.years].sort((a, b) => b - a);

  return (
    <Reveal delay={delay}>
      <Link href={`/people/${id}`} className="group/tile relative block overflow-hidden rounded-2xl">
        {cover ? (
          <MediaFrame
            media={cover}
            seed={`person-${id}`}
            showPlay={false}
            className="aspect-square w-full"
            imageClassName="group-hover/tile:scale-[1.07]"
          />
        ) : (
          <span className="grid aspect-square w-full place-items-center bg-ink-800 font-display text-[2.5rem] text-brass-gradient">
            {initials(person.name)}
          </span>
        )}
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/92 via-ink-950/20 to-transparent opacity-85 transition-opacity duration-500 group-hover/tile:opacity-95" />
        <span className="absolute inset-x-0 bottom-0 p-5">
          <span className="block font-display text-[1.1875rem] leading-tight text-bone-50 transition-colors duration-300 group-hover/tile:text-brass-300">
            {person.name}
          </span>
          <span className="mt-1 block text-[0.75rem] text-bone-400">{person.relation}</span>
          <span className="mt-1.5 block text-[0.625rem] font-semibold tracking-[0.16em] text-brass-500/80 uppercase">
            {years.join(" · ")}
          </span>
        </span>
      </Link>
    </Reveal>
  );
}
