"use client";

import { formatDayShort, formatTime } from "@/lib/format";
import { coverOf } from "@/lib/derive";
import { useStore } from "@/lib/store";
import { category } from "@/lib/taxonomy";
import type { Memory } from "@/lib/types";
import { MediaFrame } from "@/components/media/MediaFrame";
import { VoicePlayer } from "@/components/media/VoicePlayer";

interface Props {
  memory: Memory;
  ratio?: string;
  showYear?: boolean;
  hideTitle?: boolean;
}

/**
 * A memory in a grid.
 *
 * Picture memories use the reference tile behaviour wholesale: the image
 * creeps to 1.07 over 1.1s, the scrim deepens, the caption lifts into
 * place and the category label unrolls from zero width.
 */
export function MemoryTile({
  memory,
  ratio = "aspect-[4/5]",
  showYear = false,
  hideTitle = false,
}: Props) {
  const { openMemory, personById } = useStore();
  const cat = category(memory.category);
  const cover = coverOf(memory);
  const audio = memory.media.find((m) => m.kind === "audio");
  const extra = memory.media.filter((m) => m.kind !== "audio").length - 1;

  const meta = [showYear ? String(memory.year) : formatDayShort(memory.date), formatTime(memory.date)]
    .filter(Boolean)
    .join(" · ");

  /* ------------------------------- voice ------------------------------ */
  if (memory.type === "voice" && audio) {
    return (
      <article className="group/tile hairline rounded-2xl bg-ink-900/60 p-5 transition-colors duration-500 hover:border-brass-500/35">
        <button type="button" onClick={() => openMemory(memory.id)} className="block w-full text-left">
          <p className="micro !tracking-[0.18em] text-brass-500/80">Voice · {meta}</p>
          <h3 className="mt-2.5 font-display text-[1.25rem] leading-snug text-bone-50 transition-colors duration-300 group-hover/tile:text-brass-300">
            {memory.title}
          </h3>
        </button>
        <div className="mt-4">
          <VoicePlayer
            media={audio}
            by={memory.voiceBy ?? memory.people.map((p) => personById(p)?.name).filter(Boolean)[0]}
            seed={memory.id}
            compact
          />
        </div>
      </article>
    );
  }

  /* ------------------------------- story ------------------------------ */
  if (memory.type === "story" || !cover) {
    return (
      <button
        type="button"
        onClick={() => openMemory(memory.id)}
        className="group/tile hairline relative block w-full overflow-hidden rounded-2xl bg-ink-900/60 px-6 py-7 text-left transition-colors duration-500 hover:border-brass-500/35"
      >
        <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-brass-500/8 to-transparent opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100" />
        <span className="relative block">
          <span className="micro !tracking-[0.18em] text-brass-500/80">
            {cat.label} · {meta}
          </span>
          <span className="mt-3 block font-display text-[1.25rem] leading-snug text-bone-50 transition-colors duration-300 group-hover/tile:text-brass-300">
            {memory.title}
          </span>
          {memory.description && (
            <span className="mt-3 line-clamp-4 block text-[0.9375rem] leading-relaxed text-bone-300">
              {memory.description}
            </span>
          )}
          <span className="mt-5 flex items-center gap-2 text-[0.75rem] text-brass-500/70">
            <span className="h-px w-0 bg-brass-400 transition-all duration-500 group-hover/tile:w-6" />
            Read it
          </span>
        </span>
      </button>
    );
  }

  /* --------------------------- photo / video -------------------------- */
  return (
    <button
      type="button"
      onClick={() => openMemory(memory.id)}
      className="group/tile relative block w-full overflow-hidden rounded-2xl text-left"
    >
      <MediaFrame
        media={cover}
        seed={memory.id}
        showPlay={false}
        className={`${ratio} w-full`}
      />

      {/* scrim */}
      {!hideTitle && (
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/15 to-transparent opacity-70 transition-opacity duration-500 group-hover/tile:opacity-95" />
      )}

      {/* corner cluster */}
      <span className="absolute top-3 right-3 flex items-center gap-1.5">
        {memory.media.some((m) => m.kind === "video") && (
          <span className="grid size-7 place-items-center rounded-full bg-ink-950/70 text-brass-300 backdrop-blur-md">
            <svg viewBox="0 0 24 24" className="ml-px size-3 fill-current">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
        )}
        {extra > 0 && (
          <span className="grid size-7 place-items-center rounded-full bg-ink-950/70 text-[0.625rem] font-semibold text-bone-100 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover/tile:opacity-100">
            +{extra}
          </span>
        )}
      </span>

      {/* caption */}
      {!hideTitle && (
        <span className="absolute inset-x-0 bottom-0 p-4 pb-5 text-center md:p-5 md:pb-6">
          <span className="block font-display text-[1.0625rem] leading-snug text-bone-50 opacity-90 transition-all duration-500 group-hover/tile:opacity-100 md:text-[1.1875rem]">
            {memory.title}
          </span>
        </span>
      )}
    </button>
  );
}
