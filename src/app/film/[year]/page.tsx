"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { byYear, filmFrames, summarize } from "@/lib/derive";
import { formatDay } from "@/lib/format";
import { useStore } from "@/lib/store";
import { category } from "@/lib/taxonomy";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal } from "@/components/motion/Reveal";
import { Band, Chip, Page } from "@/components/ui/Section";

const FRAME_MS = 3600;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Memory Film.
 *
 * The MVP plays the year back in the browser — title card, the day in
 * order, closing card. Rendering it to a shareable video file is the next
 * step; the frame list below is already the edit decision list that a
 * renderer would consume.
 */
export default function FilmPage() {
  const params = useParams<{ year: string }>();
  const year = Number(params.year);
  const { memories, festivalFor, personById } = useStore();

  const list = useMemo(() => byYear(memories, year), [memories, year]);
  const frames = useMemo(() => filmFrames(list), [list]);
  const festival = festivalFor(year);
  const summary = useMemo(() => summarize(list), [list]);

  /* -1 = title card, frames.length = closing card */
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const total = frames.length;
  const atEnd = index >= total;

  const advance = useCallback(() => {
    setIndex((i) => {
      if (i >= total) {
        setPlaying(false);
        return i;
      }
      return i + 1;
    });
  }, [total]);

  useEffect(() => {
    if (!playing || atEnd) return;
    const timer = setTimeout(advance, index < 0 ? 2600 : FRAME_MS);
    return () => clearTimeout(timer);
  }, [playing, index, advance, atEnd]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, total));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, -1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [total]);

  if (total === 0) {
    return (
      <Page className="py-52 text-center">
        <h1 className="font-display text-display text-bone-50">Not enough to make a film yet</h1>
        <p className="mt-4 text-bone-400">Add a few photos to {year} and come back.</p>
        <Link href={`/years/${year}`} className="btn btn-ghost btn-lg mt-9">
          Back to {year}
        </Link>
      </Page>
    );
  }

  const frame = index >= 0 && index < total ? frames[index] : null;
  const progress = Math.min(Math.max((index + 1) / (total + 1), 0), 1);

  return (
    <Band divided={false} className="!pt-32 md:!pt-40">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href={`/years/${year}`} className="text-[0.8125rem] text-bone-400 transition-colors hover:text-brass-300">
          ← {year}
        </Link>
        <Chip>Memory film</Chip>
      </div>

      {/* ------------------------------ stage ----------------------------- */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-ink-950 sm:aspect-[16/9]">
        <AnimatePresence mode="wait">
          {index < 0 && (
            <Card key="title">
              <p className="font-deva text-[clamp(1.125rem,2.5vw,1.75rem)] text-brass-300">
                గణపతి బాప్పా మోరియా
              </p>
              <h1 className="mt-5 font-display text-display leading-[0.92] tracking-[-0.02em] text-bone-50">
                {festival?.title ?? "Our Vinayaka"}
              </h1>
              <p className="mt-4 text-[0.75rem] font-semibold tracking-[0.24em] text-brass-400 uppercase">
                {festival ? formatDay(festival.date) : year}
              </p>
            </Card>
          )}

          {frame && frame.mediaIndex >= 0 && (
            <motion.div
              key={`f-${index}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="absolute inset-0"
            >
              <MediaFrame
                media={frame.memory.media[frame.mediaIndex]}
                seed={`film-${frame.memory.id}`}
                showPlay={false}
                className="size-full"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-950/85 via-ink-950/25 to-transparent px-6 pt-24 pb-8 sm:px-10 sm:pb-10">
                <p className="text-[0.5625rem] font-semibold tracking-[0.24em] text-brass-300 uppercase">
                  {category(frame.memory.category).label}
                </p>
                <p className="mt-2 font-display text-title leading-none text-bone-50">
                  {frame.memory.title}
                </p>
                {frame.memory.people.length > 0 && (
                  <p className="mt-2.5 text-[0.875rem] text-bone-300">
                    {frame.memory.people.map((p) => personById(p)?.name).filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {frame && frame.mediaIndex < 0 && (
            <Card key={`s-${index}`}>
              <p className="text-[0.5625rem] font-semibold tracking-[0.24em] text-brass-300 uppercase">
                {category(frame.memory.category).label}
              </p>
              <p className="mx-auto mt-6 max-w-3xl font-display text-[1.375rem] leading-snug text-bone-50 sm:text-[2rem]">
                &ldquo;{truncate(frame.memory.description ?? frame.memory.title, 220)}&rdquo;
              </p>
            </Card>
          )}

          {atEnd && (
            <Card key="end">
              <p className="font-display text-display leading-[0.98] text-bone-50">
                See you next Vinayaka Chavithi.
              </p>
              <p className="mt-6 text-[0.75rem] font-semibold tracking-[0.2em] text-brass-400 uppercase">
                {summary.photos} photos · {summary.stories} stories · {summary.voice} voices ·{" "}
                {summary.people} people
              </p>
              <button
                type="button"
                onClick={() => {
                  setIndex(-1);
                  setPlaying(true);
                }}
                className="btn btn-primary btn-lg mt-9"
              >
                Play again
              </button>
            </Card>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 top-0 h-[3px] bg-bone-50/10">
          <div
            className="h-full bg-linear-to-r from-brass-600 to-brass-300 transition-all duration-500 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* ----------------------------- controls --------------------------- */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (atEnd) setIndex(-1);
              setPlaying((p) => !p);
            }}
            className="btn btn-primary btn-lg"
          >
            {playing ? "Pause" : index < 0 ? "Play the film" : "Resume"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIndex(-1);
              setPlaying(false);
            }}
            className="btn btn-ghost btn-lg"
          >
            Restart
          </button>
        </div>
        <p className="text-[0.75rem] tracking-[0.12em] text-bone-500 uppercase">
          {index < 0 ? "Title" : atEnd ? "End" : `${index + 1} of ${total}`} · space to play
        </p>
      </div>

      <Reveal delay={0.1}>
        <div className="hairline mt-14 rounded-2xl bg-ink-900/40 px-7 py-7">
          <p className="micro">Coming next</p>
          <h2 className="mt-3 font-display text-[1.25rem] text-bone-50">
            Export this as a video you can send to the family
          </h2>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-bone-400">
            The film above is built from a frame list — chapter order, photo, caption and timing —
            which is exactly what a renderer needs. Music, transitions and an MP4 export are the
            next step; nothing about the memories has to change for it.
          </p>
        </div>
      </Reveal>
    </Band>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950 px-8 text-center"
    >
      {children}
    </motion.div>
  );
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}...`;
}
