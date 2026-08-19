/* ------------------------------------------------------------------
   The data model.

   Everything in the app is a Memory. A Memory belongs to one Festival
   (one year), sits in one Category, may hold several Media, and may
   name the People who were there. Stories and voice notes are simply
   memories whose media happens to be words or a recording.
------------------------------------------------------------------- */

export type MemoryType = "photo" | "video" | "story" | "voice";

export type CategoryId =
  | "morning"
  | "pooja"
  | "decoration"
  | "family"
  | "food"
  | "friends"
  | "celebrations"
  | "visarjan"
  | "other";

/** The five acts of the day. Categories are grouped into these. */
export type ChapterId =
  | "morning"
  | "pooja"
  | "afternoon"
  | "evening"
  | "visarjan";

export interface Category {
  id: CategoryId;
  label: string;
  glyph: string;
  chapter: ChapterId;
}

export interface Chapter {
  id: ChapterId;
  label: string;
  hint: string;
}

export type MediaKind = "image" | "video" | "audio";

export interface Media {
  id: string;
  kind: MediaKind;
  /** Seeded artwork key — rendered as generated festival artwork. */
  art?: ArtScene;
  /** Uploaded file held in IndexedDB under this key. */
  blobKey?: string;
  /** Video only — still frame held in IndexedDB, used as the card thumbnail. */
  posterKey?: string;
  /** Plain URL, if a memory ever points at a real file. */
  src?: string;
  alt?: string;
  durationSec?: number;
  objectPosition?: string;
}

export type ArtScene =
  | "idol"
  | "mandapam"
  | "rangoli"
  | "diyas"
  | "garland"
  | "feast"
  | "sweets"
  | "family"
  | "procession"
  | "river"
  | "street"
  | "night";

export interface Person {
  id: string;
  name: string;
  relation: string;
  /** Two-letter monogram fallback is derived from the name. */
  art?: ArtScene;
  note?: string;
}

export interface Memory {
  id: string;
  year: number;
  type: MemoryType;
  title: string;
  description?: string;
  /** ISO date-time of the moment itself. */
  date: string;
  category: CategoryId;
  people: string[];
  media: Media[];
  createdAt: string;
  /** Food memories: the dish, so the same dish can be traced across years. */
  dish?: string;
  /** Decoration memories: the theme, for year-on-year comparison. */
  theme?: string;
  /** Who recorded a voice memory. */
  voiceBy?: string;
  /** Keep this memory off the Home page; it still appears in its year. */
  homeHidden?: boolean;
  /** True for memories the user created in this browser. */
  userCreated?: boolean;
}

export interface Festival {
  year: number;
  /** ISO date of the Chavithi day itself. */
  date: string;
  title: string;
  place: string;
  note: string;
  heroMemoryId?: string;
}

export interface Capsule {
  year: number;
  sealedAt: string;
  note?: string;
}

export interface YearSummary {
  photos: number;
  videos: number;
  voice: number;
  people: number;
  stories: number;
  total: number;
}
