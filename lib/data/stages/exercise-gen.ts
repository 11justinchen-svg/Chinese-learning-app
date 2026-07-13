// Programmatic exercise composition. Foundation stages 2–10 ship with these
// generated drills so the whole path is playable before hand-authored content
// lands; the same builders power the weak-word re-drill after a checkpoint.
// Everything is deterministic (seeded by stage index) so server and client
// render identical content.

import { findWord, type HskWord } from "@/lib/hsk";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import {
  STAGE_GRAMMAR,
  STAGE_WORD_IDS,
  allowedHanziThrough,
} from "./allocation";
import type {
  ChoiceExercise,
  ClozeExercise,
  Exercise,
  ExerciseBlock,
  ListenExercise,
  MatchExercise,
  OrderExercise,
  TeachCard,
} from "./types";

// mulberry32 — tiny deterministic PRNG.
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Short display meaning: first sense, clipped at the first semicolon.
export function shortMeaning(w: HskWord): string {
  return w.meaning.split(";")[0].trim();
}

const PUNCT = /[。，？！、：；.,?! 　"'“”‘’…～~]/;

// The only proper names stage content may use — they segment as single tiles.
export const ALLOWED_NAMES = ["王明", "李华"];

// Greedy longest-match segmentation of a hanzi string against a vocabulary.
// Returns null when any run of Chinese text cannot be covered — the caller
// must then treat the sentence as out of bounds for this stage.
export function segmentHanzi(text: string, vocab: string[]): string[] | null {
  const sorted = [...new Set([...vocab, ...ALLOWED_NAMES])].sort(
    (a, b) => b.length - a.length,
  );
  const extras = new Set(["们", "儿"]); // plural suffix, erhua
  const tiles: string[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (PUNCT.test(ch) || /[a-zA-Z0-9＿]/.test(ch)) {
      i++;
      continue;
    }
    const hit = sorted.find((v) => text.startsWith(v, i));
    if (hit) {
      tiles.push(hit);
      i += hit.length;
    } else if (extras.has(ch)) {
      // Attach suffix to the previous tile so 我们/女儿 read naturally.
      if (tiles.length > 0) tiles[tiles.length - 1] += ch;
      else tiles.push(ch);
      i++;
    } else {
      return null;
    }
  }
  return tiles.length > 0 ? tiles : null;
}

function words(ids: string[]): HskWord[] {
  return ids.map((id) => findWord(id)).filter((w): w is HskWord => Boolean(w));
}

function chunk<T>(arr: T[], size: number): T[][] {
  // Evenly sized groups so every chunk lands between 3 and `size` items
  // (match exercises need ≥3 pairs; recall blocks cap at 2×size exercises).
  const n = Math.ceil(arr.length / size);
  const base = Math.floor(arr.length / n);
  let extra = arr.length % n;
  const out: T[][] = [];
  let i = 0;
  for (let g = 0; g < n; g++) {
    const len = base + (extra-- > 0 ? 1 : 0);
    out.push(arr.slice(i, i + len));
    i += len;
  }
  return out;
}

function choiceOf(
  w: HskWord,
  pool: HskWord[],
  direction: "hanzi-en" | "en-hanzi",
  id: string,
  rand: () => number,
): ChoiceExercise {
  const distractors = shuffled(
    pool.filter((p) => p.id !== w.id && shortMeaning(p) !== shortMeaning(w)),
    rand,
  ).slice(0, 3);
  const toText = (x: HskWord) =>
    direction === "hanzi-en" ? shortMeaning(x) : x.hanzi;
  return {
    id,
    kind: "choice",
    direction,
    wordIds: [w.id],
    question: direction === "hanzi-en" ? w.hanzi : shortMeaning(w),
    questionPinyin: direction === "hanzi-en" ? w.pinyin : undefined,
    choices: shuffled([toText(w), ...distractors.map(toText)], rand),
    answer: toText(w),
    explain: `${w.hanzi} (${w.pinyin}) — ${shortMeaning(w)}`,
  };
}

function listenOf(
  w: HskWord,
  pool: HskWord[],
  id: string,
  rand: () => number,
): ListenExercise {
  const distractors = shuffled(
    pool.filter((p) => p.id !== w.id && p.hanzi !== w.hanzi),
    rand,
  ).slice(0, 3);
  return {
    id,
    kind: "listen",
    wordIds: [w.id],
    text: w.hanzi,
    pinyin: w.pinyin,
    choices: shuffled([w.hanzi, ...distractors.map((d) => d.hanzi)], rand),
    answer: w.hanzi,
    translation: shortMeaning(w),
    explain: `${w.hanzi} (${w.pinyin}) — ${shortMeaning(w)}`,
  };
}

function matchOf(group: HskWord[], id: string): MatchExercise {
  return {
    id,
    kind: "match",
    matchType: "pinyin",
    wordIds: group.map((w) => w.id),
    pairs: group.map((w) => ({ hanzi: w.hanzi, match: w.pinyin })),
  };
}

// Grammar drills derived from a lesson's example sentences, kept strictly
// inside the stage's allowed vocabulary. Returns [] when the examples don't
// segment — the stage then has no generated grammar block and hand-authored
// content is expected to fill the gap.
function grammarExercises(
  lessonId: string,
  stageIndex: number,
  allowed: string[],
  rand: () => number,
): Exercise[] {
  const lesson = GRAMMAR_LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return [];
  const headword = lesson.hanzi.split(/[/／\s]/)[0];
  const particlePool = [
    "的",
    "吗",
    "不",
    "没",
    "了",
    "是",
    "有",
    "很",
    "都",
  ].filter((p) => allowed.includes(p) && p !== headword);
  const out: Exercise[] = [];
  lesson.examples.forEach((ex, i) => {
    const tiles = segmentHanzi(ex.hanzi, allowed);
    if (!tiles || tiles.length < 2) return;
    out.push({
      id: `s${stageIndex}-g-${lessonId}-order-${i}`,
      kind: "order",
      wordIds: [],
      tiles,
      translation: ex.meaning,
      pinyin: ex.pinyin,
      explain: `${ex.hanzi} — ${ex.pinyin}`,
    } satisfies OrderExercise);
    if (ex.hanzi.includes(headword) && particlePool.length >= 2) {
      const gapped = ex.hanzi.replace(headword, "＿");
      if (!gapped.includes(headword)) {
        out.push({
          id: `s${stageIndex}-g-${lessonId}-cloze-${i}`,
          kind: "cloze",
          wordIds: [],
          sentence: gapped,
          translation: ex.meaning,
          choices: shuffled(
            [headword, ...shuffled(particlePool, rand).slice(0, 2)],
            rand,
          ),
          answer: headword,
          explain: lesson.pattern,
        } satisfies ClozeExercise);
      }
    }
  });
  return out.length >= 4 ? out : [];
}

export interface GeneratedStageContent {
  teach: TeachCard[];
  blocks: ExerciseBlock[];
  checkpoint: Exercise[];
}

// Real, playable drills for a stage that has no hand-authored content yet:
// per word — 2 choice + 1 match + 1 listen (4 first-try credits across 3
// kinds, so "learned" is reachable), plus grammar drills from lesson examples
// when they fit the allowed vocabulary, plus a 10-exercise checkpoint.
export function buildDefaultContent(stageIndex: number): GeneratedStageContent {
  const rand = rng(stageIndex * 7919);
  const stageWords = words(STAGE_WORD_IDS[stageIndex] ?? []);
  const allowed = allowedHanziThrough(stageIndex, (id) => findWord(id)?.hanzi);

  const teach: TeachCard[] = stageWords.map((w) => ({ wordId: w.id }));

  const blocks: ExerciseBlock[] = [];
  chunk(stageWords, 5).forEach((group, gi) => {
    blocks.push({
      id: `s${stageIndex}-vocab-${gi + 1}a`,
      title: `New words ${gi + 1} · recognize`,
      kind: "vocab",
      exercises: [
        ...group.map((w, i) =>
          choiceOf(
            w,
            stageWords,
            "hanzi-en",
            `s${stageIndex}-v${gi}-rec-${i}`,
            rand,
          ),
        ),
        matchOf(group, `s${stageIndex}-v${gi}-match`),
      ],
    });
    blocks.push({
      id: `s${stageIndex}-vocab-${gi + 1}b`,
      title: `New words ${gi + 1} · recall`,
      kind: "vocab",
      exercises: [
        ...group.map((w, i) =>
          choiceOf(
            w,
            stageWords,
            "en-hanzi",
            `s${stageIndex}-v${gi}-pro-${i}`,
            rand,
          ),
        ),
        ...group.map((w, i) =>
          listenOf(w, stageWords, `s${stageIndex}-v${gi}-lis-${i}`, rand),
        ),
      ],
    });
  });

  for (const lessonId of STAGE_GRAMMAR[stageIndex] ?? []) {
    const drills = grammarExercises(lessonId, stageIndex, allowed, rand);
    if (drills.length > 0) {
      blocks.push({
        id: `s${stageIndex}-grammar-${lessonId}`,
        title:
          GRAMMAR_LESSONS.find((l) => l.id === lessonId)?.title ?? lessonId,
        kind: "grammar",
        grammarLessonId: lessonId,
        exercises: drills,
      });
    }
  }

  const sample = shuffled(stageWords, rand).slice(0, 10);
  const checkpoint: Exercise[] = sample.map((w, i) => {
    const id = `s${stageIndex}-check-${i}`;
    if (i % 3 === 2) return listenOf(w, stageWords, id, rand);
    return choiceOf(
      w,
      stageWords,
      i % 3 === 0 ? "hanzi-en" : "en-hanzi",
      id,
      rand,
    );
  });
  // Small stages still need an 8-exercise checkpoint minimum.
  while (checkpoint.length < 8 && stageWords.length > 0) {
    const w = stageWords[checkpoint.length % stageWords.length];
    checkpoint.push(
      choiceOf(
        w,
        stageWords,
        "hanzi-en",
        `s${stageIndex}-check-x${checkpoint.length}`,
        rand,
      ),
    );
  }

  return { teach, blocks, checkpoint };
}

// Quick re-drill of a learner's weak words, offered when a checkpoint passes
// but the words-learned gate hasn't been met yet.
export function buildWeakWordDrill(wordIds: string[]): Exercise[] {
  const rand = rng(wordIds.length * 104729 + 17);
  const ws = words(wordIds);
  const pool = ws.length >= 4 ? ws : words(STAGE_WORD_IDS[1]).concat(ws);
  const out: Exercise[] = [];
  ws.forEach((w, i) => {
    out.push(choiceOf(w, pool, "hanzi-en", `drill-rec-${i}`, rand));
    out.push(listenOf(w, pool, `drill-lis-${i}`, rand));
    out.push(choiceOf(w, pool, "en-hanzi", `drill-pro-${i}`, rand));
  });
  return shuffled(out, rand);
}
