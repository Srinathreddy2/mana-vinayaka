"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { coverOf, summarize } from "@/lib/derive";
import { formatDayMonth } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Festival, Memory } from "@/lib/types";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The hero background system replicated from the reference site (Team Thunders).
 *
 * Layer structure:
 * 1. Background photograph inside scroll-parallax container + continuous ambient breathing float.
 * 2. Atmospheric warm golden floodlight beam with gentle opacity pulse.
 * 3. Dual concentric counter-rotating sacred Mandala geometry (90s CW / 140s CCW) with core radial halo.
 * 4. Vertical ink gradient & deep radial spotlight vignette.
 * 5. Foreground content and celebration card sitting above the visual motion stack.
 */
export function Hero({
  festival,
  memories,
  hero,
}: {
  festival: Festival;
  memories: Memory[];
  hero?: Memory;
}) {
  const { openComposer } = useStore();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.22]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "36%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const summary = summarize(memories);
  const yearsCount = useStore().festivals.length;

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16"
    >
      {/* 1. Dual Concentric Sacred Mandala System */}
      <MandalaSystem className="top-[6%] -right-[18%] z-0 w-[46rem] max-w-[86vw] lg:-right-[6%] lg:w-[52rem]" />

      {/* 2. Soft Warm-Golden Ambient Glow Centered Directly Behind the Hero Wheel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[2%] -right-[14%] z-0 size-[56rem] max-w-[95vw] -translate-y-10 rounded-full animate-[floodlight-pulse_14s_ease-in-out_infinite] opacity-40 lg:-right-[4%] lg:size-[62rem]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(232, 176, 75, 0.18), rgba(200, 144, 31, 0.05) 48%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />

      {/* 3. Hero Background Media Layer (Vinayaka silhouette layer removed) */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 -z-30 will-change-transform">
        <div className="size-full animate-[hero-ambient-float_24s_ease-in-out_infinite] will-change-transform">
          {hero && coverOf(hero)?.src ? (
            <MediaFrame
              media={coverOf(hero)}
              seed={`hero-${hero.id}`}
              showPlay={false}
              className="size-full"
            />
          ) : (
            <div className="relative size-full overflow-hidden bg-linear-to-b from-ink-950 via-ink-900 to-ink-950">
              <PetalFlower />
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. Vertical Ink Gradient & Deep Radial Spotlight Vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-ink-950/85 via-ink-950/70 to-ink-900" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80rem_50rem_at_50%_0%,transparent,rgba(11,7,5,0.85))]" />

      {/* 5. Hero Content Stack */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="gutter">
        <div className="shell">
          <Reveal y={16}>
            <Eyebrow single>
              Vinayaka Chavithi {festival.year} · {formatDayMonth(festival.date)}
            </Eyebrow>
          </Reveal>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mt-7 font-deva text-[clamp(1.25rem,3vw,2rem)] text-brass-300"
          >
            గణపతి బాప్పా మోరియా
          </motion.p>

          <RevealText
            as="h1"
            text="Three days"
            className="mt-3 font-display text-hero leading-[0.86] tracking-[-0.025em] text-bone-50"
          />
          <RevealText
            as="h1"
            text="Countless memories"
            delay={0.22}
            className="font-display text-hero leading-[0.86] tracking-[-0.025em] text-brass-gradient"
          />

          <Reveal delay={0.35}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-bone-300 md:text-lg">
              A memory book for Vinayaka Chavithi. The photos, the stories, the voices and the
              people who were there — kept the way the house remembers it, one year at a time.
            </p>
          </Reveal>

          <div className="mt-11 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
            <Reveal delay={0.45}>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/years/${festival.year}`} className="btn btn-primary btn-lg">
                  <CalendarIcon />
                  Open {festival.year}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.55} className="lg:-mt-14 lg:ml-auto lg:w-[26rem]">
              <HeroCountdownCard />
            </Reveal>
          </div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="gutter pointer-events-none absolute inset-x-0 bottom-14 md:bottom-16">
        <div className="shell flex items-center gap-3 text-bone-500">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "scroll-nudge 2.4s ease-in-out infinite" }}>
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
          <span className="text-[0.5625rem] font-semibold tracking-[0.24em] uppercase">Scroll</span>
        </div>
      </div>
    </section>
  );
}

/**
 * Static 14-petal bloom that sits behind the rotating wheel.
 *
 * Reproduces the reference's decorative flower 1:1 — same petal count,
 * geometry, off-axis rotation, concentric ring falloff and gradient fill —
 * using our own brass tokens rather than the reference's hex values.
 */
function PetalFlower() {
  const petals = 14;
  const rings: { r: number; strokeOpacity: number; dash?: string }[] = [
    { r: 32, strokeOpacity: 0.16 },
    { r: 54, strokeOpacity: 0.12, dash: "3 7" },
    { r: 76, strokeOpacity: 0.08 },
    { r: 98, strokeOpacity: 0.04, dash: "3 7" },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full select-none text-brass-400"
    >
      <defs>
        <linearGradient id="hero-petal-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brass-400)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="var(--color-brass-600)" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <g transform="translate(200 200) rotate(43) scale(0.74)">
        {Array.from({ length: petals }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-64"
            rx="17"
            ry="62"
            fill="url(#hero-petal-fill)"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="0.7"
            transform={`rotate(${(360 / petals) * i})`}
          />
        ))}
        {rings.map((ring) => (
          <circle
            key={ring.r}
            r={ring.r}
            fill="none"
            stroke="currentColor"
            strokeOpacity={ring.strokeOpacity}
            strokeWidth="0.8"
            strokeDasharray={ring.dash}
          />
        ))}
        <circle r="5" fill="var(--color-brass-200)" fillOpacity="0.7" />
      </g>
    </svg>
  );
}

/**
 * Dual-concentric counter-rotating Mandala System matching the reference implementation.
 */
function MandalaSystem({ className = "" }: { className?: string }) {
  const petals = 16;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-square select-none ${className}`}>
      {/* Outer Clockwise Rotating Sacred Mandala */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 size-full animate-[mandala-spin_90s_linear_infinite] text-brass-400 opacity-[0.45] will-change-transform"
      >
        <g stroke="currentColor" fill="none" strokeWidth="0.8">
          {Array.from({ length: petals }, (_, i) => (
            <ellipse
              key={i}
              cx="300"
              cy="176"
              rx="30"
              ry="124"
              transform={`rotate(${(360 / petals) * i} 300 300)`}
            />
          ))}
          <circle cx="300" cy="300" r="248" strokeDasharray="3 12" strokeOpacity="0.45" />
          <circle cx="300" cy="300" r="180" strokeOpacity="0.38" />
        </g>
      </svg>

      {/* Inner Counter-Clockwise Rotating Sacred Mandala */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 size-full animate-[mandala-spin_140s_linear_infinite_reverse] text-brass-300 opacity-[0.35] will-change-transform"
      >
        <g stroke="currentColor" fill="none" strokeWidth="0.8">
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse
              key={i}
              cx="300"
              cy="228"
              rx="19"
              ry="74"
              transform={`rotate(${(360 / 8) * i} 300 300)`}
            />
          ))}
          <circle cx="300" cy="300" r="112" strokeOpacity="0.35" />
          <circle cx="300" cy="300" r="62" strokeDasharray="3 8" strokeOpacity="0.35" />
        </g>
      </svg>

      {/* Soft Diffused Warm Golden Background Glow Radiating Behind the Wheel */}
      <div
        className="pointer-events-none absolute -inset-14 rounded-full -z-10 opacity-50"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(232, 176, 75, 0.16), rgba(200, 144, 31, 0.04) 50%, transparent 75%)",
          filter: "blur(42px)",
        }}
      />
    </div>
  );
}

function numberWord(n: number): string {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return words[n] ?? String(n);
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

/**
 * Dark Vinayaka Idol Silhouette with warm golden backlit halo aura.
 */
function VinayakaSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={`size-full ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="vinayaka-halo-bg" cx="50%" cy="38%" r="48%">
          <stop offset="0%" stopColor="#e8a54b" stopOpacity="0.22" />
          <stop offset="45%" stopColor="#c8901f" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Transparent base allowing background mandala to show through */}
      <rect width="800" height="600" fill="transparent" />

      {/* Imperceptible warm golden backlit halo */}
      <circle cx="400" cy="320" r="260" fill="url(#vinayaka-halo-bg)" />

      {/* Sacred Dark Vinayaka Silhouette with subtle warm rim light */}
      <g fill="#09070a" stroke="#e8a54b" strokeOpacity="0.14" strokeWidth="1" opacity="0.94">
        {/* Mandapam pedestal / seat */}
        <path d="M240 545h320c0 0-22-48-160-48s-160 48-160 48Z" opacity="0.9" />
        {/* Idol body */}
        <ellipse cx="400" cy="442" rx="128" ry="94" />
        {/* Head */}
        <circle cx="400" cy="315" r="84" />
        {/* Crown (Kiritam) */}
        <path d="M400 196l28 50h-56l28-50Z" fill="#0d0a0f" />
        <path d="M342 250h116l-12 24H354l-12-24Z" fill="#0d0a0f" />
        {/* Ears */}
        <ellipse cx="300" cy="318" rx="40" ry="50" />
        <ellipse cx="500" cy="318" rx="40" ry="50" />
        {/* Trunk (Vakratunda) */}
        <path
          d="M400 342c0 38-8 64-30 80-20 16-18 44 6 48 24 4 38-14 38-30"
          fill="none"
          stroke="#09070a"
          strokeWidth="24"
          strokeLinecap="round"
        />
        {/* Blessing Arms */}
        <path
          d="M290 425c-30 12-46 36-42 66M510 425c30 12 46 36 42 66"
          fill="none"
          stroke="#09070a"
          strokeWidth="22"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function HeroCountdownCard() {
  const targetDate = useMemo(() => new Date("2026-09-14T00:00:00"), []);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="glass hairline rounded-2xl px-6 py-6 md:px-8">
      <p className="micro !text-brass-500/80 tracking-[0.24em] font-semibold uppercase">
        GANESH UTSAV · 14 SEPT 2026
      </p>

      <h3 className="mt-3 font-display text-[1.75rem] leading-none text-bone-50">
        BAPPA ARRIVES IN
      </h3>

      <div className="mt-6 border-t border-brass-500/12 pt-6">
        <div className="grid grid-cols-4 items-center gap-2 text-center">
          <div>
            <div className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-brass-gradient">
              {pad(timeLeft.days)}
            </div>
            <div className="mt-2.5 text-[0.5625rem] font-semibold tracking-[0.2em] text-bone-400 uppercase">
              DAYS
            </div>
          </div>

          <div>
            <div className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-brass-gradient">
              {pad(timeLeft.hours)}
            </div>
            <div className="mt-2.5 text-[0.5625rem] font-semibold tracking-[0.2em] text-bone-400 uppercase">
              HOURS
            </div>
          </div>

          <div>
            <div className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-brass-gradient">
              {pad(timeLeft.mins)}
            </div>
            <div className="mt-2.5 text-[0.5625rem] font-semibold tracking-[0.2em] text-bone-400 uppercase">
              MINS
            </div>
          </div>

          <div>
            <div className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-brass-gradient">
              {pad(timeLeft.secs)}
            </div>
            <div className="mt-2.5 text-[0.5625rem] font-semibold tracking-[0.2em] text-bone-400 uppercase">
              SECS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return { days, hours, mins, secs };
}
