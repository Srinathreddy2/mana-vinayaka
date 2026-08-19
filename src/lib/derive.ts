import { dayOfYear, parseISO, yearsAgoLabel } from "./format";
import { CHAPTERS, chapterOf } from "./taxonomy";
import type { Chapter, Media, Memory, YearSummary } from "./types";

export function byYear(memories: Memory[], year: number): Memory[] {
  return memories.filter((m) => Number(m.year) === Number(year));
}

export function chronological(memories: Memory[]): Memory[] {
  return [...memories].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
  );
}

export function newestFirst(memories: Memory[]): Memory[] {
  return [...memories].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime(),
  );
}

export function summarize(memories: Memory[]): YearSummary {
  const people = new Set<string>();
  let photos = 0;
  let videos = 0;
  let voice = 0;
  let stories = 0;

  for (const m of memories) {
    m.people.forEach((p) => people.add(p));
    if (m.type === "story") stories += 1;
    if (m.type === "voice") voice += 1;
    for (const media of m.media) {
      if (media.kind === "image") photos += 1;
      if (media.kind === "video") videos += 1;
    }
  }

  const mediaTotal = photos + videos + voice + stories;
  const total = mediaTotal > 0 ? mediaTotal : memories.length;

  return { photos, videos, voice, people: people.size, stories, total };
}

export function totalMediaCount(memories: Memory[]): number {
  let count = 0;
  for (const m of memories) {
    for (const media of m.media) {
      if (media.kind === "image" || media.kind === "video") {
        count += 1;
      }
    }
  }
  return count;
}

export interface ChapterGroup {
  chapter: Chapter;
  memories: Memory[];
}

/** The five acts of the day, with empty acts dropped. */
export function groupByChapter(memories: Memory[]): ChapterGroup[] {
  const sorted = chronological(memories);
  return CHAPTERS.map((chapter) => ({
    chapter,
    memories: sorted.filter((m) => chapterOf(m.category) === chapter.id),
  })).filter((g) => g.memories.length > 0);
}

export function coverOf(memory?: Memory): Media | undefined {
  if (!memory) return undefined;
  return memory.media.find((m) => m.kind === "image") ?? memory.media[0];
}

/** A memory with a picture, preferred for hero slots. */
export function pickHero(memories: Memory[], preferredId?: string): Memory | undefined {
  if (preferredId) {
    const exact = memories.find((m) => m.id === preferredId);
    if (exact) return exact;
  }
  return (
    memories.find((m) => m.media.some((x) => x.kind === "image")) ??
    memories.find((m) => m.media.length > 0) ??
    memories[0]
  );
}

export interface Echo {
  memory: Memory;
  gap: number;
  label: string;
  exact: boolean;
}

/**
 * On This Day.
 *
 * An exact calendar match is the ideal; failing that we look for the
 * closest memory from that year within a month, so the section is never
 * empty and never lies about the date.
 */
export function onThisDay(memories: Memory[], today = new Date(), window = 30): Echo[] {
  const todayDoy = dayOfYear(today);
  const thisYear = today.getFullYear();
  const echoes: Echo[] = [];

  const years = [...new Set(memories.map((m) => m.year))]
    .filter((y) => y < thisYear)
    .sort((a, b) => b - a);

  for (const year of years) {
    const pool = memories.filter(
      (m) => m.year === year && (m.media.length > 0 || m.type === "story"),
    );
    if (pool.length === 0) continue;

    const scored = pool
      .map((m) => {
        const d = parseISO(m.date);
        return { memory: m, distance: Math.abs(dayOfYear(d) - todayDoy), exact: dayOfYear(d) === todayDoy };
      })
      .sort((a, b) => {
        if (a.exact !== b.exact) return a.exact ? -1 : 1;
        const aPic = a.memory.media.some((x) => x.kind === "image") ? 0 : 1;
        const bPic = b.memory.media.some((x) => x.kind === "image") ? 0 : 1;
        if (a.distance !== b.distance) return a.distance - b.distance;
        return aPic - bPic;
      });

    const best = scored[0];
    if (best.distance > window && !best.exact) continue;

    const gap = thisYear - year;
    echoes.push({
      memory: best.memory,
      gap,
      exact: best.exact,
      label: yearsAgoLabel(gap) + (best.exact ? " today" : ""),
    });
  }

  return echoes;
}

/** Dishes traced across years — the beginnings of a family recipe book. */
export interface DishThread {
  dish: string;
  years: number[];
  memories: Memory[];
}

export function dishThreads(memories: Memory[]): DishThread[] {
  const map = new Map<string, Memory[]>();
  for (const m of memories) {
    if (!m.dish) continue;
    const list = map.get(m.dish) ?? [];
    list.push(m);
    map.set(m.dish, list);
  }
  return [...map.entries()]
    .map(([dish, list]) => ({
      dish,
      memories: newestFirst(list),
      years: [...new Set(list.map((m) => m.year))].sort((a, b) => b - a),
    }))
    .sort((a, b) => b.years.length - a.years.length || a.dish.localeCompare(b.dish));
}

/** One decoration entry per year, for the year-on-year strip. */
export interface DecorationEntry {
  year: number;
  theme: string;
  memory: Memory;
}

export function decorationByYear(memories: Memory[]): DecorationEntry[] {
  const map = new Map<number, DecorationEntry>();
  for (const m of memories) {
    if (m.category !== "decoration") continue;
    const theme = m.theme ?? m.title;
    const existing = map.get(m.year);
    const hasPicture = m.media.some((x) => x.kind === "image");
    if (!existing || (hasPicture && !existing.memory.media.some((x) => x.kind === "image"))) {
      map.set(m.year, { year: m.year, theme, memory: m });
    }
  }
  return [...map.values()].sort((a, b) => b.year - a.year);
}

/** Frames for the Memory Film — a paced walk through the day. */
export interface FilmFrame {
  memory: Memory;
  mediaIndex: number;
}

export function filmFrames(memories: Memory[], max = 24): FilmFrame[] {
  const frames: FilmFrame[] = [];
  for (const group of groupByChapter(memories)) {
    for (const memory of group.memories) {
      const picture = memory.media.findIndex((m) => m.kind === "image");
      if (picture >= 0) frames.push({ memory, mediaIndex: picture });
      else if (memory.type === "story") frames.push({ memory, mediaIndex: -1 });
    }
  }
  if (frames.length <= max) return frames;

  // Thin evenly so the film still spans the whole day.
  const step = frames.length / max;
  return Array.from({ length: max }, (_, i) => frames[Math.floor(i * step)]);
}

export function peopleTallies(memories: Memory[]): Map<string, { count: number; years: Set<number> }> {
  const map = new Map<string, { count: number; years: Set<number> }>();
  for (const m of memories) {
    for (const id of m.people) {
      const entry = map.get(id) ?? { count: 0, years: new Set<number>() };
      entry.count += 1;
      entry.years.add(m.year);
      map.set(id, entry);
    }
  }
  return map;
}
