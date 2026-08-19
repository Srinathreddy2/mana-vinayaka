"use client";

import { useState } from "react";
import { formatDay } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { YearSummary } from "@/lib/types";
import { Summary } from "./Summary";

/**
 * The Memory Capsule.
 *
 * Sealing changes nothing about the data — it is a ritual, not a lock.
 * That is the point: a moment at the end of the year where the family
 * agrees the celebration is over and puts it away.
 */
export function Capsule({ year, summary }: { year: number; summary: YearSummary }) {
  const { capsuleFor, sealYear, unsealYear, say } = useStore();
  const capsule = capsuleFor(year);
  const [confirming, setConfirming] = useState(false);
  const [justSealed, setJustSealed] = useState(false);

  const seal = () => {
    sealYear(year);
    setConfirming(false);
    setJustSealed(true);
    say("Sealed. 🪔");
  };

  return (
    <section
      id="capsule"
      className="scroll-mt-24 overflow-hidden rounded-[28px] border border-brass-500/12 bg-ink-800/45 px-7 py-10 text-center sm:px-12 sm:py-14"
    >
      <p className="micro">Memory capsule</p>
      <h2 className="mt-3 font-display text-[1.75rem] leading-tight text-bone-50 sm:text-[2.25rem]">
        {year} Memory Capsule
      </h2>

      <div className="mt-8 flex justify-center">
        <Summary summary={summary} />
      </div>

      {capsule ? (
        <div className="mt-9">
          <p className="font-display text-[1.375rem] text-brass-300">
            See you next Vinayaka Chavithi. 🪔
          </p>
          <p className="mt-2.5 text-[0.875rem] text-bone-400">
            Sealed on {formatDay(capsule.sealedAt)}
            {capsule.note ? ` · ${capsule.note}` : ""}
          </p>
          {justSealed && (
            <p className=" mx-auto mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-bone-400">
              Next year, this is what &ldquo;one year ago&rdquo; will open with.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              unsealYear(year);
              setJustSealed(false);
            }}
            className="mt-6 text-[0.8125rem] text-bone-500 transition-colors hover:text-brass-300"
          >
            Open it again
          </button>
        </div>
      ) : confirming ? (
        <div className="mt-9">
          <p className="mx-auto max-w-md text-[0.9375rem] leading-relaxed text-bone-400">
            Sealing {year} closes the chapter. You can still add memories afterwards — this is
            simply how the family says the celebration is over.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={seal} className="btn btn-primary btn-md">
              Seal {year}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost btn-md">
              Not yet
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-9">
          <button type="button" onClick={() => setConfirming(true)} className="btn btn-primary btn-md">
            Seal this year&rsquo;s memories
          </button>
          <p className="mt-3 text-[0.8125rem] text-bone-500">
            Do it on the night of visarjan, when the house is quiet.
          </p>
        </div>
      )}
    </section>
  );
}
