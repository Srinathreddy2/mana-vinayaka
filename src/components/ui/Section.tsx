"use client";

import type { ReactNode } from "react";
import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";

/** gutter + shell — the only horizontal rhythm in the whole site. */
export function Page({
  children = null,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`gutter ${className}`}>
      <div className="shell">{children}</div>
    </div>
  );
}

/** A full section band: vertical rhythm plus the hairline that opens it. */
export function Band({
  children,
  id,
  divided = true,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  divided?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`gutter relative scroll-mt-28 py-24 md:py-32 lg:py-40 ${
        divided ? "border-t border-brass-500/12" : ""
      } ${className}`}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

/**
 * The section header composition: eyebrow rules, a masked-reveal display
 * heading, a lede, and an optional right-hand cluster that bottom-aligns
 * with the heading on wide screens.
 */
export function SectionHead({
  eyebrow,
  title,
  note,
  aside,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <RevealText
          text={title}
          className="mt-5 font-display text-display leading-[0.98] tracking-[-0.015em] text-bone-50"
        />
        {note && (
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-bone-300 md:text-lg">
              {note}
            </p>
          </Reveal>
        )}
      </div>
      {aside && (
        <Reveal delay={0.12}>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">{aside}</div>
        </Reveal>
      )}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}

/** Uppercase micro-label used above small blocks. */
export function Micro({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`micro ${className}`}>{children}</p>;
}
