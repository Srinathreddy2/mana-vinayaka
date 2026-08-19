# Mana Vinayaka

_Our celebrations. Our memories._

A digital memory book and yearly time capsule for Vinayaka Chavithi. Not a photo
gallery — a place to keep the story, the people, the food, the decorations and
the voices from each year's celebration, so that opening it years later still
feels like something.

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**, strict
- **Tailwind CSS v4** with the token layer in `src/app/globals.css`
- **Framer Motion** for reveals, masked headings, drag and page motion
- **Lenis** for inertial smooth scrolling
- **IndexedDB** for everything the family adds — no server, no database to run

Fonts are Rozha One (display) and Mukta (interface and Telugu), loaded
through `next/font`.

## The design system

A dark, cinematic festival aesthetic: an ink ground, brass as the primary
accent, kumkum as the secondary, and bone off-whites for text. One 90rem
`.shell` inside a fixed `.gutter` sets the only horizontal rhythm; sections
run `py-24 md:py-32 lg:py-40` separated by hairline rules.

Display type is clamp-based — `--text-mega`, `--text-hero`, `--text-display`,
`--text-title` — set tight (`leading-[0.86]`–`[0.98]`, `-0.025em`) in Rozha
One. Every heading arrives one word at a time, each word masked by its own
`overflow-hidden` box and sliding up from beneath the baseline; everything
else fades up 28px, once, on scroll.

## How it is organised

```
src/
  app/                     routes
    page.tsx               home — latest celebration, timeline preview, On This Day
    years/                 all years, and one page per year
    memories/              browse by photo / video / story / voice / food / people
    people/[id]/           one person, and every memory they appear in
    film/[year]/           Memory Film player
  components/
    add/                   the Add Memory flow and the voice recorder
    home/                  hero composition and the drag-to-explore rail
    media/                 media rendering, generated artwork, voice player
    memory/                memory tiles, the lightbox, On This Day
    motion/                smooth scroll, reveals, counters, scroll progress
    year/                  summary, chapter rail, memory capsule
    shell/                 header, mobile menu, footer, app shell
    ui/                    sheet/dialog, section primitives, marquee
  lib/
    types.ts               the data model
    seed.ts                the sample archive (2024, 2025, 2026)
    taxonomy.ts            categories and the five chapters of the day
    derive.ts              summaries, timeline grouping, On This Day, film frames
    db.ts                  IndexedDB persistence
    store.tsx              the single client store
```

## Data model

Everything is a `Memory`:

```ts
{
  id, year, type,            // photo | video | story | voice
  title, description,
  date, category,            // morning, pooja, decoration, family, food,
  people: string[],          // friends, celebrations, visarjan, other
  media: Media[],            // images, videos, audio (blob or generated art)
  createdAt,
  dish?, theme?, voiceBy?    // food thread, decoration theme, whose voice
}
```

A `Festival` is one year. A `Capsule` records that a year has been sealed. The
five chapters of the day (Morning → Pooja → Afternoon → Evening → Visarjan) are
derived from the memory's category rather than stored, so a memory only ever
has to be filed once.

## Where things live

Sample memories are ordinary data in `src/lib/seed.ts`. Anything the family
adds is stored in IndexedDB in the browser: metadata in one record, and photos,
videos and voice recordings as Blobs alongside it. Nothing leaves the device
and nothing needs to be running except the app.

Removing a seeded memory hides it; removing your own deletes it.

## Sample photographs

The sample archive ships with no image files. Each seeded photograph is drawn
as generated festival artwork (`components/media/PhotoArt.tsx`) — twelve warm
scenes covering the idol, the mandapam, muggu, lamps, garlands, the meal, the
sweets, the family, the procession, the water, the street and the night. Real
photos, once added, render normally in their place.

Seeded voice memories are placeholders: the player is real, the audio is not.
Record one yourself and it plays.

## Prepared, not yet built

- **Memory Film export.** The player is real and works today. `filmFrames()` in
  `lib/derive.ts` already produces an ordered frame list — chapter, media,
  caption, timing — which is what an MP4 renderer would consume. Music,
  transitions and export are the remaining work.
- **Sharing between family members.** The store is deliberately the only place
  that touches persistence, so moving from IndexedDB to a synced backend is a
  change to `lib/db.ts` and `lib/store.tsx` and nothing else.
- **Recipes.** Food memories already carry a `dish`, and dishes are threaded
  across years. A recipe view is a small step from there.
