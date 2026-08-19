"use client";

import { Eyebrow, Reveal, RevealText } from "@/components/motion/Reveal";
import { Band, Chip, Page } from "@/components/ui/Section";

const MAPS_URL = "https://maps.app.goo.gl/i9aYU2Niwa7NXVVr8";

const LOCATION = {
  kind: "Mandapam",
  name: "Mandapam",
  address: "Ramalayam, Yerraballi, Duvvur Mandal, Kadapa District, Andhra Pradesh",
};

/**
 * Our location.
 *
 * Left column carries the section head and the address card; right column
 * is a drawn map rather than an embedded iframe, so it keeps the ink and
 * brass palette instead of dropping a bright rectangle into the page.
 * Both the card CTA and the map itself open the same Google Maps link.
 */
export function LocationSection() {
  return (
    <section id="location" className="relative isolate overflow-hidden border-t border-brass-500/15 bg-[#060505] scroll-mt-28 py-24 md:py-32 lg:py-40">
      {/* Soft, diffused warm golden ambient background light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 h-[130%] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[110px] animate-[ambient-breathe_10s_ease-in-out_infinite] motion-reduce:animate-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(209, 145, 63, 0.14), rgba(232, 176, 75, 0.04) 48%, transparent 80%)",
          }}
        />
      </div>

      {/* Hero Petal Flower graphic without any surrounding rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-15 size-[54rem] max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-75 lg:size-[62rem]"
      >
        <LocationPetalFlower />
      </div>

      <Page>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* ------------------------------ left ----------------------------- */}
          <div>
            <Reveal>
              <Eyebrow>Our location</Eyebrow>
            </Reveal>

            <RevealText
              text="Find us here"
              className="mt-5 font-display text-display leading-[0.98] tracking-[-0.015em] text-bone-50"
            />

            <Reveal delay={0.08}>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-bone-300 md:text-lg">
                This is where our celebrations come alive.
              </p>
            </Reveal>

            <Reveal delay={0.16} className="relative mt-10">
              {/* Faint, subtle warm-gold ambient backlight glow close to card edges */}
              <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-brass-400/12 opacity-35 blur-md" />

              <div className="relative rounded-2xl border border-brass-500/15 bg-ink-900/50 p-7 transition-colors duration-500 hover:border-brass-500/30 md:p-9">
                <Chip>{LOCATION.kind}</Chip>

                <div className="mt-6 flex items-start gap-4">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border border-brass-500/30 bg-brass-500/10 text-brass-300">
                    <PinIcon />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.375rem] leading-none text-bone-50">
                      {LOCATION.name}
                    </h3>
                    <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-bone-300">
                      {LOCATION.address}
                    </p>
                  </div>
                </div>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg mt-8 w-full sm:w-auto"
                >
                  Open in Google Maps
                  <ArrowIcon />
                </a>
              </div>
            </Reveal>
          </div>

          {/* ------------------------------ right ---------------------------- */}
          <Reveal delay={0.12} className="group/map relative">
            {/* Faint, subtle warm-gold ambient backlight glow close to map container edges */}
            <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-brass-400/15 opacity-35 blur-md transition-opacity duration-500 group-hover/map:opacity-65" />

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${LOCATION.name} in Google Maps`}
              className="relative block overflow-hidden rounded-3xl border border-brass-500/20 bg-ink-950 transition-colors duration-500 hover:border-brass-500/35"
            >
              <StylisedMap />

              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/85 via-transparent to-ink-950/40" />

              <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
                <span>
                  <span className="block text-[0.5625rem] font-semibold tracking-[0.24em] text-brass-300 uppercase">
                    {LOCATION.kind}
                  </span>
                  <span className="mt-2 block font-display text-[1.375rem] leading-none text-bone-50">
                    {LOCATION.name}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] text-brass-300 uppercase">
                  <span className="h-px w-0 bg-brass-400 transition-all duration-500 group-hover/map:w-6" />
                  Open in Maps
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </Page>
    </section>
  );
}

/**
 * A drawn map: block grid, two main roads, a watercourse, and the mandapam
 * marked with a brass pin under breathing rings. Deliberately abstract —
 * it says "here", the link does the navigating.
 */
function StylisedMap() {
  const blocks = [
    [60, 70, 150, 96],
    [232, 70, 118, 96],
    [372, 40, 132, 126],
    [524, 92, 96, 74],
    [640, 60, 118, 106],
    [60, 200, 110, 118],
    [192, 200, 158, 82],
    [560, 210, 130, 96],
    [712, 200, 46, 106],
    [60, 352, 128, 104],
    [212, 340, 96, 116],
    [332, 372, 118, 84],
    [472, 356, 92, 100],
    [596, 350, 162, 106],
    [130, 486, 190, 74],
    [366, 486, 140, 74],
    [552, 486, 206, 74],
  ] as const;

  return (
    <svg
      viewBox="0 0 800 620"
      className="aspect-[4/3] w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/map:scale-[1.03] sm:aspect-[5/4] lg:aspect-square"
      role="img"
      aria-label="Stylised map showing the mandapam location"
    >
      <defs>
        <linearGradient id="loc-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#100b0f" />
          <stop offset="100%" stopColor="#060406" />
        </linearGradient>
        <radialGradient id="loc-glow" cx="50%" cy="47%" r="42%">
          <stop offset="0%" stopColor="#d1913f" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#d1913f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="loc-pin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd79a" />
          <stop offset="100%" stopColor="#d1913f" />
        </linearGradient>
      </defs>

      <rect width="800" height="620" fill="url(#loc-ground)" />

      {/* city blocks */}
      <g fill="#1a1218" stroke="#241c22" strokeWidth="1">
        {blocks.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="6" />
        ))}
      </g>

      {/* minor streets */}
      <g stroke="#241c22" strokeWidth="2">
        <path d="M0 186h800M0 330h800M0 470h800M198 0v620M356 0v620M470 0v620M580 0v620" />
      </g>

      {/* main roads */}
      <g stroke="#d1913f" strokeOpacity="0.22" strokeWidth="7" strokeLinecap="round">
        <path d="M0 258h800" />
        <path d="M318 0v620" />
      </g>
      <g stroke="#d1913f" strokeOpacity="0.1" strokeWidth="16" strokeLinecap="round">
        <path d="M0 258h800" />
        <path d="M318 0v620" />
      </g>

      {/* watercourse */}
      <path
        d="M-20 560q140-46 258-8t236-22 200-58 146-30"
        fill="none"
        stroke="#2a2e38"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M-20 560q140-46 258-8t236-22 200-58 146-30"
        fill="none"
        stroke="#3a4250"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* the spot */}
      <circle cx="400" cy="292" r="230" fill="url(#loc-glow)" />

      <g>
        <circle className="pin-ring" cx="400" cy="292" r="86" fill="none" stroke="#d1913f" strokeWidth="1.5" />
        <circle
          className="pin-ring"
          cx="400"
          cy="292"
          r="86"
          fill="none"
          stroke="#d1913f"
          strokeWidth="1.5"
          style={{ animationDelay: "1.15s" }}
        />
        <circle
          className="pin-ring"
          cx="400"
          cy="292"
          r="86"
          fill="none"
          stroke="#d1913f"
          strokeWidth="1.5"
          style={{ animationDelay: "2.3s" }}
        />
      </g>

      <ellipse cx="400" cy="300" rx="30" ry="8" fill="#060406" opacity="0.75" />

      <g className="transition-transform duration-500 group-hover/map:-translate-y-1.5">
        <path
          d="M400 176c-31 0-56 25-56 56 0 40 44 74 53 66 9-8 59-26 59-66 0-31-25-56-56-56Z"
          fill="url(#loc-pin)"
        />
        <circle cx="400" cy="230" r="19" fill="#0a0709" />
        <circle cx="400" cy="230" r="7" fill="#ffd79a" />
      </g>

      {/* label */}
      <g>
        <rect x="286" y="330" width="228" height="46" rx="23" fill="#0a0709" opacity="0.92" />
        <rect
          x="286"
          y="330"
          width="228"
          height="46"
          rx="23"
          fill="none"
          stroke="#d1913f"
          strokeOpacity="0.35"
        />
        <text
          x="400"
          y="359"
          textAnchor="middle"
          fill="#f0c274"
          fontSize="17"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          letterSpacing="2.6"
        >
          MANDAPAM
        </text>
      </g>

      {/* vignette */}
      <rect width="800" height="620" fill="url(#loc-vignette)" />
      <defs>
        <radialGradient id="loc-vignette" cx="50%" cy="50%" r="72%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
  * Exact 14-petal bloom copied from the hero section decorative background element.
  */
function LocationPetalFlower() {
  const petals = 14;

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full select-none text-brass-400"
    >
      <defs>
        <linearGradient id="location-petal-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brass-400)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="var(--color-brass-600)" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <g transform="translate(200 200) rotate(43) scale(0.88)">
        {Array.from({ length: petals }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-64"
            rx="17"
            ry="62"
            fill="url(#location-petal-fill)"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="0.7"
            transform={`rotate(${(360 / petals) * i})`}
          />
        ))}
        <circle r="5" fill="var(--color-brass-200)" fillOpacity="0.7" />
      </g>
    </svg>
  );
}
