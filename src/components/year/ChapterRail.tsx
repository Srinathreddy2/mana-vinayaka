"use client";

import Link from "next/link";
import { groupByChapter } from "@/lib/derive";
import type { Memory } from "@/lib/types";

/** The shape of the day, read left to right — a quiet in-page marquee. */
export function ChapterRail({ memories, year }: { memories: Memory[]; year: number }) {
  const groups = groupByChapter(memories);
  if (groups.length === 0) return null;

  return (
    <div className="no-scrollbar edge-fade-x overflow-x-auto">
      <ol className="flex min-w-max items-center justify-center gap-1 px-5 md:px-10">
        {groups.map((group, i) => (
          <li key={group.chapter.id} className="flex items-center gap-1">
            {i > 0 && <span className="px-2 text-brass-600/60">·</span>}
            <Link
              href={`/years/${year}#${group.chapter.id}`}
              className="group flex items-baseline gap-2 rounded-full px-3.5 py-2 transition-colors duration-300 hover:bg-brass-500/10"
            >
              <span className="text-[0.5625rem] font-semibold tracking-[0.2em] text-brass-500/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[1.0625rem] text-bone-200 transition-colors duration-300 group-hover:text-brass-300">
                {group.chapter.label}
              </span>
              <span className="text-[0.6875rem] text-bone-500">{group.memories.length}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
