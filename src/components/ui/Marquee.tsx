"use client";

import type { ReactNode } from "react";

interface Item {
  text: string;
  deva?: boolean;
}

/**
 * The infinite marquee band.
 *
 * Two identical runs of the same items, translated -50% over 40s, so the
 * loop never seams. Pauses under the cursor, masked at both edges.
 */
export function Marquee({
  items,
  size = "sm",
  speed = 40,
}: {
  items: Item[];
  size?: "sm" | "lg";
  speed?: number;
}) {
  const run = (key: string): ReactNode => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key !== "a"}>
      {items.map((item, i) => (
        <span
          key={`${item.text}-${i}`}
          className={`flex items-center ${size === "lg" ? "gap-8 px-8" : "gap-7 px-7"}`}
        >
          <span
            className={
              item.deva
                ? `font-deva ${size === "lg" ? "text-2xl text-brass-500/45 md:text-3xl" : "text-lg text-brass-400/80 md:text-xl"}`
                : `font-display ${size === "lg" ? "text-2xl text-bone-400/30 md:text-3xl" : "text-lg text-bone-300/50 md:text-xl"}`
            }
          >
            {item.text}
          </span>
          <span className="size-1.5 shrink-0 rounded-full bg-kum-400/50" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="group edge-fade-x relative flex overflow-hidden">
      <div
        className="flex w-max shrink-0 items-center will-change-transform group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
}

export const CHANT: Item[] = [
  { text: "गणपति बप्पा मोरया", deva: true },
  { text: "mangala moorthy moraya" },
  { text: "గణపతి బప్పా మోరియా", deva: true },
  { text: "मंगल मूर्ति मोरया", deva: true },
  { text: "ganapati bappa morya" },
  { text: "మంగళ మూర్తి మోరియా", deva: true },
];

/** The full-width band that separates the hero from the page. */
export function MarqueeBand() {
  return (
    <div className="relative border-y border-brass-500/12 bg-ink-950/50 py-5">
      <Marquee items={CHANT} />
    </div>
  );
}
