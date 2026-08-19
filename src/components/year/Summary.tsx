"use client";

import type { YearSummary } from "@/lib/types";

type Row = { key: keyof YearSummary; one: string; many: string };

/** Media counts always render, including zero, so an empty year reads as 0. */
const MEDIA_ROWS: Row[] = [
  { key: "photos", one: "photo", many: "photos" },
  { key: "videos", one: "video", many: "videos" },
  { key: "voice", one: "voice", many: "voices" },
];

/** Everything else stays hidden until there is something to count. */
const EXTRA_ROWS: Row[] = [
  { key: "people", one: "person", many: "people" },
  { key: "stories", one: "story", many: "stories" },
];

/** The year's contents, as a row of brass numerals with micro labels. */
export function Summary({ summary, compact = false }: { summary: YearSummary; compact?: boolean }) {
  const shown = [...MEDIA_ROWS, ...EXTRA_ROWS.filter((r) => summary[r.key] > 0)];

  return (
    <ul className={`flex flex-wrap ${compact ? "gap-x-7 gap-y-3" : "gap-x-10 gap-y-6 sm:gap-x-14"}`}>
      {shown.map((row) => (
        <li key={row.key}>
          <span
            className={`block font-display leading-none text-brass-gradient ${
              compact ? "text-[1.375rem]" : "text-[clamp(1.75rem,4vw,2.75rem)]"
            }`}
          >
            {summary[row.key]}
          </span>
          <span
            className={`mt-1.5 block font-semibold tracking-[0.2em] text-bone-500 uppercase ${
              compact ? "text-[0.5625rem]" : "text-[0.625rem]"
            }`}
          >
            {summary[row.key] === 1 ? row.one : row.many}
          </span>
        </li>
      ))}
    </ul>
  );
}
