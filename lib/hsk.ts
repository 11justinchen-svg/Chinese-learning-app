import raw from "@/lib/data/hsk1.json";

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
}

export const HSK1: HskWord[] = raw as HskWord[];

// Learning order: most frequent first (lower frequency rank = more common).
export const HSK1_BY_FREQUENCY: HskWord[] = [...HSK1].sort(
  (a, b) => (a.frequency ?? 9999) - (b.frequency ?? 9999),
);

export const UNIT_SIZE = 15;

export interface HskUnit {
  index: number;
  title: string;
  words: HskWord[];
}

// Ten preset study sets of 15 words, ordered by frequency.
export const UNITS: HskUnit[] = Array.from(
  { length: Math.ceil(HSK1_BY_FREQUENCY.length / UNIT_SIZE) },
  (_, i) => ({
    index: i + 1,
    title: `Set ${i + 1}`,
    words: HSK1_BY_FREQUENCY.slice(i * UNIT_SIZE, (i + 1) * UNIT_SIZE),
  }),
);

export function findWord(id: string): HskWord | undefined {
  return HSK1.find((w) => w.id === id);
}

export function findUnit(index: number): HskUnit | undefined {
  return UNITS.find((u) => u.index === index);
}

// Distinct components across HSK-1, most frequent first (for the radical key).
export function componentFrequency(): {
  char: string;
  meaning: string;
  count: number;
}[] {
  const map = new Map<string, { meaning: string; count: number }>();
  for (const w of HSK1)
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
