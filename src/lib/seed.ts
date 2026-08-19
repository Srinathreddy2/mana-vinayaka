import type { Capsule, Festival, Media, Memory, Person } from "./types";

/* ------------------------------------------------------------------
   Sample family archive — three celebrations.

   Written as if a real Telugu family kept this book for three years.
   Photographs are rendered as generated festival artwork (see PhotoArt)
   so the app looks alive offline, with no binary assets to ship.
------------------------------------------------------------------- */

export const PEOPLE: Person[] = [
  { id: "amma", name: "Amma", relation: "Mother", note: "Keeper of the kitchen and of every ritual we would otherwise forget." },
  { id: "nanna", name: "Nanna", relation: "Father", note: "Wakes before everyone, buys the idol, refuses help carrying it." },
  { id: "srinath", name: "Srinath", relation: "Me", note: "The one behind the camera, mostly." },
  { id: "sirisha", name: "Sirisha", relation: "Sister", note: "Comes home from Bengaluru every year, without fail." },
  { id: "chinnu", name: "Chinnu", relation: "Niece", note: "Six years old. Asks the questions nobody else thinks to ask." },
  { id: "tatayya", name: "Tatayya", relation: "Grandfather", note: "Remembers Chavithi in the old house, and tells it the same way every year." },
  { id: "ammamma", name: "Ammamma", relation: "Grandmother", note: "Sits by the mandapam and watches everything." },
  { id: "ravi", name: "Ravi", relation: "Cousin", note: "Always late, always carrying too many sweets." },
];

export const FESTIVALS: Festival[] = [
  {
    year: 2026,
    date: "2026-09-14",
    title: "Our Vinayaka",
    place: "Yerraballi",
    note: "Our upcoming Vinayaka Chavithi celebration in Yerraballi.",
  },
  {
    year: 2025,
    date: "2025-08-24",
    title: "Our Vinayaka",
    place: "Yerraballi",
    note: "",
    heroMemoryId: "m25-idol-laddu",
  },
];

export const CAPSULES: Capsule[] = [
  { year: 2025, sealedAt: "2025-08-27T00:00:00" },
];

let mediaCounter = 0;
const img = (art: Media["art"], alt: string): Media => ({
  id: `md-${++mediaCounter}`,
  kind: "image",
  art,
  alt,
});
const vid = (art: Media["art"], alt: string, durationSec: number): Media => ({
  id: `md-${++mediaCounter}`,
  kind: "video",
  art,
  alt,
  durationSec,
});
const aud = (durationSec: number): Media => ({
  id: `md-${++mediaCounter}`,
  kind: "audio",
  durationSec,
});

type SeedMemory = Omit<Memory, "createdAt"> & { createdAt?: string };

const seed = (m: SeedMemory): Memory => ({
  ...m,
  createdAt: m.createdAt ?? `${m.date.split("T")[0]}T23:00:00`,
});

/* ----------------------------- 2026 ------------------------------ */

const Y2026: Memory[] = [];

/* ----------------------------- 2025 ------------------------------ */

/*
  Static media served from public/vinayaka/. Filed under 2025 by request:
  the 20260818 in the filenames is the upload date, not the celebration.
  Titles, categories and people are neutral placeholders — edit any entry
  by hand to give it real details.
*/
const Y2025: Memory[] = [
  seed({
    id: "m25-idol-laddu",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "Our Vinayaka",
    date: "2025-08-24T10:00",
    category: "pooja",
    people: [],
    media: [
      {
        id: "md-25-idol-laddu",
        kind: "image",
        src: "/vinayaka/IMG20250827233750.jpg",
        alt: "Ganesh Idol with Laddu",
      },
    ],
  }),
  seed({
    id: "m25-static-01",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "A moment we kept",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        id: "md-25-static-01",
        kind: "image",
        src: "/vinayaka/IMG-20260818-WA0016.jpg",
        alt: "A moment we kept",
      },
    ],
  }),
  seed({
    id: "m25-static-02",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "A moment we kept",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        id: "md-25-static-02",
        kind: "image",
        src: "/vinayaka/IMG-20260818-WA0017.jpg",
        alt: "A moment we kept",
      },
    ],
  }),
  seed({
    id: "m25-static-03",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "A moment we kept",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        id: "md-25-static-03",
        kind: "image",
        src: "/vinayaka/IMG-20260818-WA0018.jpg",
        alt: "A moment we kept",
      },
    ],
  }),
  seed({
    id: "m25-static-05",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "A moment we kept",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        id: "md-25-static-05",
        kind: "image",
        src: "/vinayaka/IMG-20260818-WA0020.jpg",
        alt: "A moment we kept",
      },
    ],
  }),
  seed({
    id: "m25-static-06",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "A moment we kept",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        id: "md-25-static-06",
        kind: "image",
        src: "/vinayaka/IMG-20260818-WA0021.jpg",
        alt: "A moment we kept",
      },
    ],
  }),
  seed({
    id: "m25-static-07",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "A moment we kept",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        id: "md-25-static-07",
        kind: "image",
        src: "/vinayaka/IMG-20260818-WA0022.jpg",
        alt: "A moment we kept",
      },
    ],
  }),
  seed({
    id: "m25-static-08",
    year: 2025,
    homeHidden: true,
    type: "video",
    title: "A moment that moved",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        // No poster set — MediaFrame derives a still via useDerivedVideoPoster,
        // so the card never receives the video URL in an <img>.
        id: "md-25-static-08",
        kind: "video",
        src: "/vinayaka/VID-20260818-WA0010.mp4",
        alt: "A moment that moved",
      },
    ],
  }),
  seed({
    id: "m25-static-09",
    year: 2025,
    homeHidden: true,
    type: "photo",
    title: "A moment we kept",
    date: "2025-08-24T12:00",
    category: "other",
    people: [],
    media: [
      {
        id: "md-25-static-09",
        kind: "image",
        src: "/vinayaka/WhatsApp Image 2026-08-18 at 8.41.45 PM.jpeg",
        alt: "A moment we kept",
      },
    ],
  }),
];

/* ----------------------------- 2024 ------------------------------ */

const Y2024: Memory[] = [];

export const MEMORIES: Memory[] = [...Y2026, ...Y2025];
