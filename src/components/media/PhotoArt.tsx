import { useId } from "react";
import type { ArtScene } from "@/lib/types";

/* ------------------------------------------------------------------
   Generated festival artwork.

   The sample archive ships with no binary assets. Instead each seeded
   "photograph" is drawn as a warm, abstract scene — recognisable as the
   moment it stands for, calm enough to sit behind real photos once the
   family adds their own.
------------------------------------------------------------------- */

/**
 * [glow, mid, deep] — a backlit reading of each scene.
 *
 * The palette is deliberately dark: a warm brass glow behind, mid-tone
 * warm browns for lit objects, and near-black silhouettes in front, so
 * generated artwork sits in the same night-lit register as the rest of
 * the interface.
 */
const PALETTES: Record<ArtScene, [string, string, string]> = {
  idol: ["#e8a54b", "#4a2b1c", "#0a0608"],
  mandapam: ["#d98e3f", "#43291b", "#0a0608"],
  rangoli: ["#e7bc7e", "#4a2f22", "#0b0709"],
  diyas: ["#ffc46a", "#6b3f18", "#0a0608"],
  garland: ["#e9a63c", "#54301d", "#0a0608"],
  feast: ["#cbbf6a", "#3f4326", "#0a0908"],
  sweets: ["#e5be85", "#4d3520", "#0b0709"],
  family: ["#c98a5b", "#432b1f", "#0a0608"],
  procession: ["#c96f35", "#40211a", "#080506"],
  river: ["#c97a44", "#2a2e38", "#070809"],
  street: ["#c08a54", "#3a2a1c", "#0a0708"],
  night: ["#f2c173", "#2a1a17", "#070506"],
};

interface Props {
  art: ArtScene;
  seed?: string;
  className?: string;
}

export function PhotoArt({ art, seed = "", className }: Props) {
  const uid = useId().replace(/:/g, "");
  const [light, mid, deep] = PALETTES[art] ?? PALETTES.idol;
  const grain = `${art}-${seed}`;

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={light} stopOpacity="0.62" />
          <stop offset="60%" stopColor={light} stopOpacity="0.16" />
          <stop offset="100%" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`vig-${uid}`} cx="50%" cy="50%" r="72%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill={`url(#sky-${uid})`} />
      <ellipse cx="400" cy="270" rx="380" ry="300" fill={`url(#glow-${uid})`} />

      {renderScene(art, { light, mid, deep, uid, grain })}

      {/* vignette so scenes read as night photographs, not diagrams */}
      <rect width="800" height="600" fill={`url(#vig-${uid})`} />
    </svg>
  );
}

interface Ctx {
  light: string;
  mid: string;
  deep: string;
  uid: string;
  /** Seed for the scatter details. Must stay pure — see noise(). */
  grain: string;
}

function renderScene(art: ArtScene, c: Ctx) {
  switch (art) {
    case "idol":
      return <Idol {...c} />;
    case "mandapam":
      return <Mandapam {...c} />;
    case "rangoli":
      return <Rangoli {...c} />;
    case "diyas":
      return <Diyas {...c} />;
    case "garland":
      return <Garland {...c} />;
    case "feast":
      return <Feast {...c} />;
    case "sweets":
      return <Sweets {...c} />;
    case "family":
      return <Family {...c} />;
    case "procession":
      return <Procession {...c} />;
    case "river":
      return <River {...c} />;
    case "street":
      return <Street {...c} />;
    case "night":
      return <Night {...c} />;
    default:
      return null;
  }
}

/* ------------------------------ scenes ---------------------------- */

function Idol({ mid, deep, grain }: Ctx) {
  return (
    <g>
      <path d="M120 600V250a280 280 0 0 1 560 0v350Z" fill={mid} opacity="0.28" />
      <path d="M180 600V265a220 220 0 0 1 440 0v335Z" fill={deep} opacity="0.12" />
      <GanapatiSilhouette fill={deep} />
      <FlowerRow y={186} count={11} fill={deep} opacity={0.5} />
      <g opacity="0.7">
        <Flame x={250} y={508} deep={deep} />
        <Flame x={550} y={508} deep={deep} />
      </g>
      <Bokeh count={7} grain={grain} fill="#FFF0D2" />
    </g>
  );
}

function GanapatiSilhouette({ fill }: { fill: string }) {
  return (
    <g fill={fill} opacity="0.88">
      {/* seat */}
      <path d="M262 540h276c0 0-18-46-138-46s-138 46-138 46Z" opacity="0.85" />
      {/* body */}
      <ellipse cx="400" cy="446" rx="118" ry="88" />
      {/* head */}
      <circle cx="400" cy="322" r="80" />
      {/* crown */}
      <path d="M400 214l26 44h-52l26-44Z" />
      <path d="M348 262h104l-10 20H358l-10-20Z" />
      {/* ears */}
      <ellipse cx="308" cy="324" rx="34" ry="46" />
      <ellipse cx="492" cy="324" rx="34" ry="46" />
      {/* trunk */}
      <path
        d="M400 348c0 34-6 58-26 74-18 15-16 40 6 44 20 4 34-10 34-26"
        fill="none"
        stroke={fill}
        strokeWidth="22"
        strokeLinecap="round"
      />
      {/* arms */}
      <path
        d="M300 430c-26 10-40 34-38 62M500 430c26 10 40 34 38 62"
        fill="none"
        stroke={fill}
        strokeWidth="20"
        strokeLinecap="round"
      />
    </g>
  );
}

function Mandapam({ mid, deep, grain }: Ctx) {
  return (
    <g>
      <rect y="470" width="800" height="130" fill={deep} opacity="0.16" />
      {/* banana stems */}
      {[110, 690].map((x) => (
        <g key={x}>
          <rect x={x - 16} y={140} width="32" height="360" rx="16" fill={deep} opacity="0.55" />
          <path
            d={`M${x} 160c-70-28-96-92-92-136 52 6 96 52 106 108`}
            fill={deep}
            opacity="0.35"
          />
          <path
            d={`M${x} 190c70-30 98-88 96-134-54 8-98 54-108 110`}
            fill={deep}
            opacity="0.28"
          />
        </g>
      ))}
      {/* arch */}
      <path
        d="M110 168C110 60 250 30 400 30s290 30 290 138"
        fill="none"
        stroke={deep}
        strokeOpacity="0.4"
        strokeWidth="16"
      />
      <FlowerRow y={132} count={15} fill={deep} opacity={0.42} />
      {/* seat and lamps */}
      <rect x="250" y="392" width="300" height="24" rx="12" fill={deep} opacity="0.4" />
      <rect x="290" y="416" width="220" height="70" rx="10" fill={mid} opacity="0.5" />
      <Flame x={216} y={470} deep={deep} />
      <Flame x={584} y={470} deep={deep} />
      <Bokeh count={9} grain={grain} fill="#FFEBC6" />
    </g>
  );
}

function Rangoli({ mid, deep, grain }: Ctx) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <g>
      <rect y="0" width="800" height="600" fill={mid} opacity="0.14" />
      <g transform="translate(400 300)">
        {petals.map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-150"
            rx="34"
            ry="86"
            fill={deep}
            opacity="0.3"
            transform={`rotate(${a})`}
          />
        ))}
        {petals.map((a) => (
          <ellipse
            key={`i${a}`}
            cx="0"
            cy="-86"
            rx="22"
            ry="50"
            fill={deep}
            opacity="0.42"
            transform={`rotate(${a + 15})`}
          />
        ))}
        <circle r="46" fill={deep} opacity="0.55" />
        <circle r="24" fill="#FFF4E0" opacity="0.75" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={round(Math.cos(a) * 250)}
              cy={round(Math.sin(a) * 250)}
              r="7"
              fill={deep}
              opacity="0.32"
            />
          );
        })}
      </g>
      <Bokeh count={5} grain={grain} fill="#FFFFFF" />
    </g>
  );
}

function Diyas({ mid, deep, grain }: Ctx) {
  const lamps = [130, 270, 400, 530, 670];
  return (
    <g>
      <rect y="430" width="800" height="170" fill={deep} opacity="0.12" />
      {lamps.map((x, i) => (
        <g key={x} transform={`translate(${x} ${400 + (i % 2) * 46})`}>
          <ellipse cx="0" cy="34" rx="52" ry="12" fill="#FFD79A" opacity="0.28" />
          <path d="M-46 8c0 26 20 34 46 34s46-8 46-34Z" fill={mid} opacity="0.95" />
          <ellipse cx="0" cy="8" rx="46" ry="12" fill={deep} opacity="0.45" />
          <Flame x={0} y={4} deep="#FFD98A" scale={1.1} />
        </g>
      ))}
      <Bokeh count={12} grain={grain} fill="#FFDFA8" />
    </g>
  );
}

function Garland({ mid, deep, grain }: Ctx) {
  const strands = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      {strands.map((s) => {
        const x = 70 + s * 132;
        const length = 300 + ((s * 67) % 190);
        const beads = Math.floor(length / 34);
        return (
          <g key={s}>
            <line x1={x} y1="0" x2={x} y2={length} stroke={deep} strokeOpacity="0.25" strokeWidth="3" />
            {Array.from({ length: beads }, (_, i) => (
              <circle
                key={i}
                cx={x}
                cy={i * 34 + 26}
                r="16"
                fill={i % 3 === 0 ? deep : mid}
                opacity={i % 3 === 0 ? 0.5 : 0.75}
              />
            ))}
          </g>
        );
      })}
      <rect y="520" width="800" height="80" fill={deep} opacity="0.14" />
      <Bokeh count={8} grain={grain} fill="#FFF1D4" />
    </g>
  );
}

function Feast({ mid, deep, grain }: Ctx) {
  return (
    <g>
      <rect y="0" width="800" height="600" fill={mid} opacity="0.1" />
      {/* banana leaf */}
      <path
        d="M90 300c0-92 140-150 310-150s310 58 310 150-140 150-310 150S90 392 90 300Z"
        fill={deep}
        opacity="0.5"
      />
      <path d="M110 300h580" stroke="#F7F3E4" strokeOpacity="0.45" strokeWidth="4" />
      {/* servings */}
      {[
        [270, 250, 40, "#F3D08A"],
        [400, 232, 34, "#EFE3C0"],
        [520, 252, 38, "#E2A25A"],
        [300, 356, 32, "#F6E7BE"],
        [430, 366, 30, "#D9BE7C"],
        [545, 350, 26, "#C98F4E"],
      ].map(([cx, cy, r, fill], i) => (
        <ellipse
          key={i}
          cx={cx as number}
          cy={cy as number}
          rx={r as number}
          ry={(r as number) * 0.66}
          fill={fill as string}
          opacity="0.92"
        />
      ))}
      <Bokeh count={6} grain={grain} fill="#FFFFFF" />
    </g>
  );
}

function Sweets({ mid, deep, grain }: Ctx) {
  const rows = [
    { y: 372, xs: [268, 356, 444, 532] },
    { y: 316, xs: [312, 400, 488] },
    { y: 262, xs: [356, 444] },
  ];
  return (
    <g>
      <ellipse cx="400" cy="420" rx="270" ry="86" fill={deep} opacity="0.28" />
      <ellipse cx="400" cy="404" rx="252" ry="76" fill={mid} opacity="0.55" />
      {rows.map((row) =>
        row.xs.map((x) => (
          <g key={`${row.y}-${x}`}>
            <path
              d={`M${x - 40} ${row.y}c0-30 18-52 40-52s40 22 40 52Z`}
              fill="#FFF6E6"
              opacity="0.95"
            />
            <path d={`M${x} ${row.y - 52}l6 -16h-12l6 16Z`} fill={deep} opacity="0.5" />
          </g>
        )),
      )}
      <FlowerRow y={92} count={9} fill={deep} opacity={0.3} />
      <Bokeh count={5} grain={grain} fill="#FFFFFF" />
    </g>
  );
}

function Family({ mid, deep, grain }: Ctx) {
  const figures = [
    { x: 150, h: 210 },
    { x: 258, h: 250 },
    { x: 366, h: 176 },
    { x: 452, h: 128 },
    { x: 546, h: 236 },
    { x: 660, h: 200 },
  ];
  return (
    <g>
      <rect y="150" width="800" height="450" fill={mid} opacity="0.16" />
      <FlowerRow y={110} count={13} fill={deep} opacity={0.3} />
      {figures.map((f, i) => {
        const top = 560 - f.h;
        const headR = f.h * 0.115;
        return (
          <g key={f.x} fill={deep} opacity={0.72 - (i % 3) * 0.07}>
            <circle cx={f.x} cy={top + headR} r={headR} />
            <path
              d={`M${f.x - headR * 1.55} 560c0-${f.h * 0.62} ${headR * 0.6}-${f.h * 0.7} ${
                headR * 1.55
              }-${f.h * 0.7}s${headR * 1.55} ${f.h * 0.08} ${headR * 1.55} ${f.h * 0.7}Z`}
            />
          </g>
        );
      })}
      <rect y="556" width="800" height="44" fill={deep} opacity="0.22" />
      <Bokeh count={7} grain={grain} fill="#FFF0D6" />
    </g>
  );
}

function Procession({ mid, deep, grain }: Ctx) {
  const crowd = Array.from({ length: 14 }, (_, i) => ({
    x: 30 + i * 56 + ((i * 23) % 17),
    h: 150 + ((i * 47) % 90),
  }));
  return (
    <g>
      <rect y="330" width="800" height="270" fill={mid} opacity="0.22" />
      <g fill={deep} opacity="0.34">
        <path d="M0 340h800v-40l-60 -30 -90 30 -110 -46 -120 46 -100 -30 -130 40 -90 -20Z" />
      </g>
      {crowd.map((p, i) => (
        <g key={i} fill={deep} opacity={0.55 + (i % 3) * 0.12}>
          <circle cx={p.x} cy={600 - p.h} r={p.h * 0.09} />
          <rect
            x={p.x - p.h * 0.11}
            y={600 - p.h + p.h * 0.13}
            width={p.h * 0.22}
            height={p.h * 0.9}
            rx={p.h * 0.1}
          />
          {i % 4 === 0 && (
            <path
              d={`M${p.x - p.h * 0.11} ${600 - p.h + p.h * 0.24}l-${p.h * 0.16} -${p.h * 0.22}`}
              stroke={deep}
              strokeWidth={p.h * 0.055}
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
      <Bokeh count={14} grain={grain} fill="#FFE2AE" />
    </g>
  );
}

function River({ mid, deep, grain }: Ctx) {
  return (
    <g>
      <circle cx="600" cy="180" r="76" fill="#FFE4B0" opacity="0.85" />
      <rect y="340" width="800" height="260" fill={deep} opacity="0.55" />
      <rect y="340" width="800" height="260" fill={mid} opacity="0.2" />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M0 ${376 + i * 26}q100 -12 200 0t200 0 200 0 200 0`}
          fill="none"
          stroke="#FFE9C4"
          strokeOpacity={0.32 - i * 0.025}
          strokeWidth="4"
        />
      ))}
      <ellipse cx="600" cy="470" rx="60" ry="90" fill="#FFE4B0" opacity="0.18" />
      <g fill={deep} opacity="0.7">
        <circle cx="250" cy="292" r="26" />
        <rect x="228" y="318" width="44" height="70" rx="16" />
        <circle cx="322" cy="304" r="20" />
        <rect x="306" y="324" width="34" height="62" rx="14" />
      </g>
      <Bokeh count={6} grain={grain} fill="#FFF3D8" />
    </g>
  );
}

function Street({ mid, deep, grain }: Ctx) {
  const shops = [0, 1, 2, 3, 4];
  return (
    <g>
      <rect y="430" width="800" height="170" fill={deep} opacity="0.28" />
      {shops.map((s) => {
        const x = s * 170 - 20;
        const h = 250 + ((s * 61) % 110);
        return (
          <g key={s}>
            <rect x={x} y={470 - h} width="150" height={h} fill={deep} opacity={0.24 + (s % 2) * 0.1} />
            <rect x={x + 18} y={470 - h + 30} width="114" height="40" rx="8" fill={mid} opacity="0.55" />
            {[0, 1, 2].map((w) => (
              <rect
                key={w}
                x={x + 22 + w * 40}
                y={470 - h + 100}
                width="26"
                height="34"
                fill="#FFE6B8"
                opacity="0.5"
              />
            ))}
          </g>
        );
      })}
      <path d="M0 480h800" stroke="#FFE6B8" strokeOpacity="0.3" strokeWidth="6" strokeDasharray="30 26" />
      <FlowerRow y={44} count={17} fill={deep} opacity={0.28} />
      <Bokeh count={11} grain={grain} fill="#FFDFA4" />
    </g>
  );
}

function Night({ light, mid, deep, grain }: Ctx) {
  return (
    <g>
      <rect width="800" height="600" fill={mid} opacity="0.3" />
      <rect y="420" width="800" height="180" fill={deep} opacity="0.75" />
      {Array.from({ length: 3 }, (_, row) => (
        <g key={row}>
          <path
            d={`M-20 ${90 + row * 90}q210 ${70 + row * 12} 420 0t420 0`}
            fill="none"
            stroke={light}
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          {Array.from({ length: 16 }, (_, i) => (
            <circle
              key={i}
              cx={i * 54 + 10}
              cy={round(90 + row * 90 + Math.sin((i / 16) * Math.PI) * (46 + row * 10))}
              r="7"
              fill={light}
              opacity="0.9"
            />
          ))}
        </g>
      ))}
      <Bokeh count={20} grain={grain} fill="#FFD98F" />
    </g>
  );
}

/* ---------------------------- primitives -------------------------- */

function FlowerRow({
  y,
  count,
  fill,
  opacity,
}: {
  y: number;
  count: number;
  fill: string;
  opacity: number;
}) {
  const step = 800 / (count - 1);
  return (
    <g opacity={opacity}>
      <path
        d={`M0 ${y}q${step * (count - 1) * 0.5} 46 ${step * (count - 1)} 0`}
        fill="none"
        stroke={fill}
        strokeWidth="3"
        strokeOpacity="0.5"
      />
      {Array.from({ length: count }, (_, i) => {
        const x = i * step;
        const dip = round(Math.sin((i / (count - 1)) * Math.PI) * 22);
        return <circle key={i} cx={x} cy={y + dip} r={i % 2 ? 13 : 17} fill={fill} />;
      })}
    </g>
  );
}

function Flame({
  x,
  y,
  deep,
  scale = 1,
}: {
  x: number;
  y: number;
  deep: string;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="-14" rx="26" ry="30" fill="#FFD98A" opacity="0.35" />
      <path
        d="M0 -34c10 12 14 20 14 28a14 14 0 0 1-28 0c0-8 4-16 14-28Z"
        fill="#FFF0C4"
        style={{ transformOrigin: "center bottom", animation: "flame 2.6s ease-in-out infinite" }}
      />
      <ellipse cx="0" cy="2" rx="18" ry="6" fill={deep} opacity="0.35" />
    </g>
  );
}

function Bokeh({ count, grain, fill }: { count: number; grain: string; fill: string }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={noise(grain, i, 1) * 800}
          cy={noise(grain, i, 2) * 520 + 20}
          r={noise(grain, i, 3) * 26 + 8}
          fill={fill}
          opacity={noise(grain, i, 4) * 0.16 + 0.05}
        />
      ))}
    </g>
  );
}

/**
 * Trigonometry is precision-dependent across engines, so any coordinate
 * derived from sin/cos is rounded before it reaches the DOM. Otherwise the
 * server's markup and the browser's disagree in the sixteenth decimal.
 */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Deterministic scatter.
 *
 * Pure by coordinate rather than a running PRNG: a stateful generator would
 * hand back different numbers on React's second render pass, and the
 * server-rendered artwork would no longer match the client's.
 */
function noise(seed: string, index: number, salt: number): number {
  let h = 2166136261;
  const key = `${seed}|${index}|${salt}`;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return ((h >>> 0) % 100000) / 100000;
}

