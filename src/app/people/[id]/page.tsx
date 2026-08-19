"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { coverOf, newestFirst } from "@/lib/derive";
import { initials, plural } from "@/lib/format";
import { useStore } from "@/lib/store";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MemoryTile } from "@/components/memory/MemoryTile";
import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";
import { Band, Page } from "@/components/ui/Section";

export default function PersonPage() {
  const params = useParams<{ id: string }>();
  const { memories, personById } = useStore();
  const person = personById(params.id);

  const theirs = useMemo(
    () => newestFirst(memories.filter((m) => m.people.includes(params.id))),
    [memories, params.id],
  );

  const years = useMemo(
    () => [...new Set(theirs.map((m) => m.year))].sort((a, b) => b - a),
    [theirs],
  );

  const portrait = useMemo(
    () => theirs.find((m) => m.media.some((x) => x.kind === "image")),
    [theirs],
  );

  if (!person) {
    return (
      <Page className="py-52 text-center">
        <h1 className="font-display text-display text-bone-50">We don&rsquo;t know them yet</h1>
        <Link href="/memories?view=people" className="btn btn-ghost btn-lg mt-9">
          All people
        </Link>
      </Page>
    );
  }

  return (
    <>
      <Page className="pt-40 pb-4 md:pt-52">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-14">
          <Reveal>
            <div className="size-32 overflow-hidden rounded-2xl md:size-44">
              {portrait ? (
                <MediaFrame
                  media={coverOf(portrait)}
                  seed={`portrait-${person.id}`}
                  showPlay={false}
                  className="size-full"
                />
              ) : (
                <span className="grid size-full place-items-center bg-ink-800 font-display text-[2.5rem] text-brass-gradient">
                  {initials(person.name)}
                </span>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.06}>
              <Eyebrow single>{person.relation || "Family"}</Eyebrow>
            </Reveal>
            <RevealText
              as="h1"
              text={person.name}
              className="mt-5 font-display text-hero leading-[0.86] tracking-[-0.025em] text-bone-50"
            />
            <Reveal delay={0.2}>
              <p className="mt-5 text-[0.9375rem] tracking-[0.14em] text-brass-400 uppercase">
                {years.length > 0 ? years.slice().reverse().join(" · ") : "No years yet"}
              </p>
            </Reveal>
          </div>
        </div>

        {person.note && (
          <Reveal delay={0.28}>
            <p className="mt-12 max-w-2xl font-display text-[1.375rem] leading-snug text-bone-200 md:text-title md:leading-[1.15]">
              {person.note}
            </p>
          </Reveal>
        )}
      </Page>

      <Band divided={false} className="!pt-20">
        {theirs.length === 0 ? (
          <p className="py-20 text-center text-bone-400">Nothing yet.</p>
        ) : (
          <div className="space-y-20 md:space-y-28">
            {years.map((year) => {
              const list = theirs.filter((m) => m.year === year);
              return (
                <section key={year}>
                  <Reveal>
                    <div className="mb-8 flex items-baseline gap-5 border-b border-brass-500/12 pb-5">
                      <Link
                        href={`/years/${year}`}
                        className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-brass-gradient"
                      >
                        {year}
                      </Link>
                      <span className="h-px flex-1 bg-brass-500/12" />
                      <span className="shrink-0 text-[0.75rem] tracking-[0.14em] text-bone-500 uppercase">
                        {plural(list.length, "memory", "memories")}
                      </span>
                    </div>
                  </Reveal>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((memory, i) => (
                      <Reveal key={memory.id} delay={(i % 3) * 0.06}>
                        <MemoryTile
                          memory={memory}
                          ratio={i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}
                        />
                      </Reveal>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </Band>
    </>
  );
}
