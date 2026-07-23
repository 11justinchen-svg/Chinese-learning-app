import rawHsk1 from "@/lib/data/hsk1.json";
import rawHsk2 from "@/lib/data/hsk2.json";

export type ComponentRole = "semantic" | "part" | "form";

export interface HanziComponent {
  char: string;
  meaning: string;
  role: ComponentRole;
  variantOf?: string;
}

export interface HanziChar {
  char: string;
  pinyin: string;
  atomic: boolean;
  components: HanziComponent[];
}

export interface HskWord {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  meanings: string[];
  pos: string[];
  frequency: number | null;
  characters: HanziChar[];
  syllabus?: "HSK 3.0 (2025)";
  syllabusIndex?: number;
  syllabusLevel?: HskLevel;
}

export type HskLevel = 1 | 2;

export const HSK1: HskWord[] = rawHsk1 as HskWord[];
export const HSK2: HskWord[] = rawHsk2 as HskWord[];
export const HSK: HskWord[] = [...HSK1, ...HSK2];

// Learning order: most frequent first (lower frequency rank = more common).
export const HSK1_BY_FREQUENCY: HskWord[] = [...HSK1].sort(
  (a, b) => (a.frequency ?? 9999) - (b.frequency ?? 9999),
);
export const HSK2_BY_FREQUENCY: HskWord[] = [...HSK2].sort(
  (a, b) => (a.frequency ?? 9999) - (b.frequency ?? 9999),
);
export const HSK_BY_FREQUENCY: HskWord[] = [
  ...HSK1_BY_FREQUENCY,
  ...HSK2_BY_FREQUENCY,
];

export const UNIT_SIZE = 15;

export interface HskUnit {
  index: number;
  title: string;
  words: HskWord[];
}

// Stable 15-word study sets across the official HSK 3.0 Level 1 and Level 2
// exclusive rosters.
export const UNITS: HskUnit[] = Array.from(
  { length: Math.ceil(HSK_BY_FREQUENCY.length / UNIT_SIZE) },
  (_, i) => ({
    index: i + 1,
    title: `Set ${i + 1}`,
    words: HSK_BY_FREQUENCY.slice(i * UNIT_SIZE, (i + 1) * UNIT_SIZE),
  }),
);

export function findWord(id: string): HskWord | undefined {
  return HSK.find((w) => w.id === id);
}

export function wordsForLevel(level: HskLevel): HskWord[] {
  return level === 1 ? HSK1 : HSK2;
}

export function findUnit(index: number): HskUnit | undefined {
  return UNITS.find((u) => u.index === index);
}

// Distinct components across the supported HSK 3.0 levels, most frequent first.
export function componentFrequency(level?: HskLevel): {
  char: string;
  meaning: string;
  count: number;
}[] {
  const map = new Map<string, { meaning: string; count: number }>();
  for (const w of level ? wordsForLevel(level) : HSK)
    for (const c of w.characters)
      for (const k of c.components) {
        if (k.role === "form") continue;
        const cur = map.get(k.char);
        if (cur) cur.count += 1;
        else map.set(k.char, { meaning: k.meaning, count: 1 });
      }
  return [...map.entries()]
    .map(([char, v]) => ({ char, ...v }))
    .sort((a, b) => b.count - a.count);
}
