"use client";

import { Reveal } from "@/components/motion/Reveal";

const INSTAGRAM_URL = "https://www.instagram.com/yerraballi_committee_kurrollu/";

/**
 * Hero section matching Team Thunders reference screenshot composition.
 *
 * Positioned exactly below LocationSection.
 *
 * Visual hierarchy:
 * 1. Centered gold eyebrow: Vinayaka Chavithi 2026 · 14 September
 * 2. Large bold serif headline: Three years of remembering.
 * 3. Muted subtitle description
 * 4. Bright gold Instagram CTA button with glowing radial backlight aura
 * 5. Telugu chant below: గణపతి బాప్పా మోరియా
 * 6. Background: Glowing 16-petal gold mandala + dark Vinayaka gold-outlined silhouette
 */
export function InstagramCTASection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-brass-500/15 bg-[#000000] py-32 md:py-44 text-center">
      {/* 1. Subtle Warm Golden Radial Ambient Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 size-[54rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full animate-[floodlight-pulse_14s_ease-in-out_infinite] opacity-60"
        style={{
          background: "radial-gradient(circle at 50% 45%, rgba(232, 176, 75, 0.20), rgba(200, 144, 31, 0.05) 48%, transparent 72%)",
          filter: "blur(40px)",
        }}
      />

      {/* 2. Faint Dual Concentric Sacred Mandala System (Background decoration) */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[52rem] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 select-none lg:size-[60rem]">
        {/* Outer Clockwise 16-Petal Gold Mandala */}
        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 size-full animate-[mandala-spin_90s_linear_infinite] text-brass-400 opacity-20 will-change-transform"
        >
          <g stroke="currentColor" fill="none" strokeWidth="0.85">
            {Array.from({ length: 16 }, (_, i) => (
              <ellipse
                key={i}
                cx="300"
                cy="176"
                rx="32"
                ry="124"
                transform={`rotate(${(360 / 16) * i} 300 300)`}
              />
            ))}
            <circle cx="300" cy="300" r="248" strokeDasharray="3 12" strokeWidth="0.75" />
            <circle cx="300" cy="300" r="180" strokeOpacity="0.4" strokeWidth="0.75" />
          </g>
        </svg>

        {/* Inner Counter-Clockwise 8-Petal Gold Mandala */}
        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 size-full animate-[mandala-spin_140s_linear_infinite_reverse] text-brass-300 opacity-12 will-change-transform"
        >
          <g stroke="currentColor" fill="none" strokeWidth="0.85">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse
                key={i}
                cx="300"
                cy="228"
                rx="20"
                ry="74"
                transform={`rotate(${(360 / 8) * i} 300 300)`}
              />
            ))}
            <circle cx="300" cy="300" r="112" strokeWidth="0.75" />
            <circle cx="300" cy="300" r="62" strokeDasharray="3 8" strokeWidth="0.75" />
          </g>
        </svg>

        {/* Core Radial Gold Warmth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgba(232, 176, 75, 0.14), transparent 70%)",
          }}
        />
      </div>

      {/* 5. Centered Hero Content Stack */}
      <div className="gutter relative z-10 mx-auto max-w-5xl px-4">
        <div className="shell flex flex-col items-center text-center">
          {/* Centered Eyebrow */}
          <Reveal y={14}>
            <div className="inline-flex items-center gap-3 rounded-full border border-brass-500/30 bg-brass-500/10 px-5 py-1.5 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-brass-400 animate-pulse" />
              <span className="font-sans text-xs font-semibold tracking-[0.2em] text-brass-300 uppercase">
                Vinayaka Chavithi 2026 · 14 September
              </span>
            </div>
          </Reveal>

          {/* Large Bold Serif Headline matching Team Thunders visual scale */}
          <Reveal delay={0.12}>
            <h2 className="mx-auto mt-7 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[1.04] tracking-[-0.02em] text-center">
              <span className="text-bone-50">Three days </span>
              <span className="bg-linear-to-r from-brass-300 via-brass-200 to-brass-400 bg-clip-text text-transparent">
                Countless memories
              </span>
            </h2>
          </Reveal>

          {/* Description */}
          <Reveal delay={0.24}>
            <p className="mx-auto mt-6 max-w-2xl font-sans text-[1.0625rem] leading-relaxed text-bone-200 md:text-xl">
              No passes, no VIP rope, no queue that moves faster for anyone. Bring your family, bring your neighbours — prasadam is on us in Yerraballi.
            </p>
          </Reveal>

          {/* Single Bright Gold Instagram CTA Button with Glowing Radial Backlight */}
          <Reveal delay={0.38}>
            <div className="relative mt-10 flex justify-center">
              {/* Backlight Glow around Button */}
              <div className="pointer-events-none absolute -inset-3 rounded-full bg-brass-400/50 blur-xl transition-all duration-500 hover:bg-brass-400/70" />

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3.5 rounded-full bg-linear-to-r from-brass-300 via-brass-400 to-brass-500 px-9 py-4 font-sans text-base font-bold text-ink-950 shadow-[0_0_40px_rgba(232,176,75,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_70px_rgba(232,176,75,0.75)] active:scale-95"
              >
                <InstagramIcon />
                <span>Follow us on Instagram</span>
              </a>
            </div>
          </Reveal>

          {/* Telugu Chant below */}
          <Reveal delay={0.50}>
            <p className="mt-12 font-deva text-[clamp(1.375rem,2.8vw,2rem)] tracking-wide text-brass-300/90">
              గణపతి బాప్పా మోరియా
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
