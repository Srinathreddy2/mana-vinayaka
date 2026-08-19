import type { Category, CategoryId, Chapter, ChapterId, MemoryType } from "./types";

export const CHAPTERS: Chapter[] = [
  { id: "morning", label: "Morning", hint: "Before the day begins" },
  { id: "pooja", label: "Pooja", hint: "Bells, camphor, mantras" },
  { id: "afternoon", label: "Afternoon", hint: "The house is full" },
  { id: "evening", label: "Evening", hint: "Lamps and music" },
  { id: "visarjan", label: "Visarjan", hint: "Until next year" },
];

export const CATEGORIES: Category[] = [
  { id: "morning", label: "Morning", glyph: "🌅", chapter: "morning" },
  { id: "decoration", label: "Decoration", glyph: "🌼", chapter: "morning" },
  { id: "pooja", label: "Pooja", glyph: "🪔", chapter: "pooja" },
  { id: "food", label: "Food", glyph: "🍛", chapter: "afternoon" },
  { id: "family", label: "Family", glyph: "❤️", chapter: "afternoon" },
  { id: "friends", label: "Friends", glyph: "🤝", chapter: "evening" },
  { id: "celebrations", label: "Celebrations", glyph: "🎶", chapter: "evening" },
  { id: "visarjan", label: "Visarjan", glyph: "🌊", chapter: "visarjan" },
  { id: "other", label: "Other", glyph: "✨", chapter: "evening" },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));

export function category(id: CategoryId): Category {
  return CATEGORY_MAP.get(id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function chapterOf(id: CategoryId): ChapterId {
  return category(id).chapter;
}

export const MEMORY_TYPES: {
  id: MemoryType;
  label: string;
  glyph: string;
  blurb: string;
}[] = [
  { id: "photo", label: "Photo", glyph: "📸", blurb: "A moment you saw" },
  { id: "video", label: "Video", glyph: "🎥", blurb: "A moment that moved" },
  { id: "story", label: "Story", glyph: "📝", blurb: "Something worth telling" },
  { id: "voice", label: "Voice", glyph: "🎙️", blurb: "A voice to keep" },
];

export const TYPE_LABEL: Record<MemoryType, string> = {
  photo: "Photo",
  video: "Video",
  story: "Story",
  voice: "Voice",
};
