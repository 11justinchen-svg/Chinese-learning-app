// Word-status and stage-lock engine. Word learning history lives in
// "mozhi.progress.v1"; scheduling stays in the existing SRS store ("mozhi.srs.v1").

import { MASTERED_BOX, type SrsStore } from "@/lib/srs";
import type { ExerciseKind, Stage } from "@/lib/data/stages/types";

export type WordStatus = "new" | "seen" | "learning" | "learned" | "mastered";

export interface WordProgress {
  seenAt?: number;
  /** First-attempt counts only — retries after a miss never count. */
  correct: number;
  wrong: number;
  kinds: Partial<Record<ExerciseKind, number>>;
}

export interface StageProgress {
  dialogueViewed?: boolean;
  blocksDone: string[];
  checkpointBest?: { score: number; total: number };
  /** Stamped once when both gates are first met; never cleared, so a later
   *  SRS lapse can never re-lock a stage the learner already finished. */
  completedAt?: number;
}

export interface ProgressStore {
  version: 1;
  words: Record<string, WordProgress>;
  stages: Record<string, StageProgress>;
}

const KEY = "mozhi.progress.v1";
const DEV_KEY = "mozhi.dev.unlock";

export const CHECKPOINT_PASS = 0.8; // first-try checkpoint accuracy
export const WORDS_LEARNED_GATE = 0.8; // share of stage words at learned+
export const LEARNED_CORRECT = 3;
export const LEARNED_KINDS = 2;
export const LEARNED_MIN_BOX = 2;
export const PRODUCTIVE_WORD_GATE = 0.5;

const PRODUCTIVE_KINDS: ExerciseKind[] = ["cloze", "order", "reply"];

export function loadProgress(): ProgressStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ProgressStore;
    if (parsed.version !== 1 || !parsed.words || !parsed.stages)
      return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

export function saveProgress(p: ProgressStore) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage full or unavailable — progress just won't persist.
  }
}

function emptyStore(): ProgressStore {
  return { version: 1, words: {}, stages: {} };
}

function wordEntry(p: ProgressStore, id: string): WordProgress {
  return p.words[id] ?? { correct: 0, wrong: 0, kinds: {} };
}

function stageEntry(p: ProgressStore, id: string): StageProgress {
  return p.stages[id] ?? { blocksDone: [] };
}

// --- writes (pure: return a new store; caller persists with saveProgress) ---

export function recordTeachSeen(
  p: ProgressStore,
  wordIds: string[],
  now = Date.now(),
): ProgressStore {
  const words = { ...p.words };
  for (const id of wordIds) {
    const w = wordEntry(p, id);
    words[id] = { ...w, seenAt: w.seenAt ?? now };
  }
  return { ...p, words };
}

export function recordAnswer(
  p: ProgressStore,
  wordIds: string[],
  kind: ExerciseKind,
  correct: boolean,
): ProgressStore {
  const words = { ...p.words };
  for (const id of wordIds) {
    const w = wordEntry(p, id);
    words[id] = correct
      ? {
          ...w,
          correct: w.correct + 1,
          kinds: { ...w.kinds, [kind]: (w.kinds[kind] ?? 0) + 1 },
        }
      : { ...w, wrong: w.wrong + 1 };
  }
  return { ...p, words };
}

export function recordDialogueViewed(
  p: ProgressStore,
  stageId: string,
): ProgressStore {
  const s = stageEntry(p, stageId);
  return {
    ...p,
    stages: { ...p.stages, [stageId]: { ...s, dialogueViewed: true } },
  };
}

export function recordBlockDone(
  p: ProgressStore,
  stageId: string,
  blockId: string,
): ProgressStore {
  const s = stageEntry(p, stageId);
  if (s.blocksDone.includes(blockId)) return p;
  return {
    ...p,
    stages: {
      ...p.stages,
      [stageId]: { ...s, blocksDone: [...s.blocksDone, blockId] },
    },
  };
}

export function recordCheckpoint(
  p: ProgressStore,
  stageId: string,
  score: number,
  total: number,
): ProgressStore {
  const s = stageEntry(p, stageId);
  const best = s.checkpointBest;
  const better = !best || score / total > best.score / best.total;
  return {
    ...p,
    stages: {
      ...p.stages,
      [stageId]: { ...s, checkpointBest: better ? { score, total } : best },
    },
  };
}

export function stampCompletionIfEarned(
  p: ProgressStore,
  stage: Stage,
  srs: SrsStore,
  now = Date.now(),
): ProgressStore {
  const s = stageEntry(p, stage.id);
  if (s.completedAt) return p;
  const best = s.checkpointBest;
  if (!best || best.score / best.total < CHECKPOINT_PASS) return p;
  const { total, learned } = stageWordStats(stage, p, srs);
  if (learned / total < WORDS_LEARNED_GATE) return p;
  const productive = productiveWordStats(stage, p);
  if (productive.practiced / productive.total < PRODUCTIVE_WORD_GATE) return p;
  return {
    ...p,
    stages: { ...p.stages, [stage.id]: { ...s, completedAt: now } },
  };
}

// --- reads ---

export function wordStatus(
  id: string,
  p: ProgressStore,
  srs: SrsStore,
): WordStatus {
  const box = srs[id]?.box ?? 0;
  const w = p.words[id];
  if (!w) return box > 0 ? "seen" : "new";
  const kindCount = Object.values(w.kinds).filter((n) => (n ?? 0) > 0).length;
  const learned =
    w.correct >= LEARNED_CORRECT &&
    kindCount >= LEARNED_KINDS &&
    box >= LEARNED_MIN_BOX;
  const hasProductiveRecall = PRODUCTIVE_KINDS.some(
    (kind) => (w.kinds[kind] ?? 0) > 0,
  );
  if (learned && box >= MASTERED_BOX && hasProductiveRecall)
    return "mastered";
  if (learned) return "learned";
  if (w.correct >= 1) return "learning";
  if (w.seenAt) return "seen";
  return "new";
}

const LEARNED_OR_BETTER: WordStatus[] = ["learned", "mastered"];

export function stageWordStats(
  stage: Stage,
  p: ProgressStore,
  srs: SrsStore,
): { total: number; learned: number; mastered: number } {
  let learned = 0;
  let mastered = 0;
  for (const id of stage.wordIds) {
    const st = wordStatus(id, p, srs);
    if (LEARNED_OR_BETTER.includes(st)) learned++;
    if (st === "mastered") mastered++;
  }
  return { total: stage.wordIds.length, learned, mastered };
}

export function productiveWordStats(
  stage: Stage,
  p: ProgressStore,
): { total: number; practiced: number } {
  const practiced = stage.wordIds.filter((id) => {
    const kinds = p.words[id]?.kinds;
    return PRODUCTIVE_KINDS.some((kind) => (kinds?.[kind] ?? 0) > 0);
  }).length;
  return { total: stage.wordIds.length, practiced };
}

export function isStageComplete(stage: Stage, p: ProgressStore): boolean {
  return Boolean(p.stages[stage.id]?.completedAt);
}

export function isStageUnlocked(
  index: number,
  stages: Stage[],
  p: ProgressStore,
): boolean {
  if (index === 1 || devUnlocked()) return true;
  const prev = stages.find((s) => s.index === index - 1);
  return prev ? isStageComplete(prev, p) : false;
}

export function unlockRequirement(
  index: number,
  stages: Stage[],
  p: ProgressStore,
  srs: SrsStore,
): string | null {
  if (isStageUnlocked(index, stages, p)) return null;
  const prev = stages.find((s) => s.index === index - 1);
  if (!prev) return null;
  const { total, learned } = stageWordStats(prev, p, srs);
  const needWords = Math.max(
    0,
    Math.ceil(total * WORDS_LEARNED_GATE) - learned,
  );
  const best = p.stages[prev.id]?.checkpointBest;
  const needCheckpoint = !best || best.score / best.total < CHECKPOINT_PASS;
  const productive = productiveWordStats(prev, p);
  const needProductive = Math.max(
    0,
    Math.ceil(productive.total * PRODUCTIVE_WORD_GATE) - productive.practiced,
  );
  const parts: string[] = [];
  if (needWords > 0)
    parts.push(`learn ${needWords} more word${needWords === 1 ? "" : "s"}`);
  if (needCheckpoint) parts.push("pass the checkpoint");
  if (needProductive > 0)
    parts.push(
      `use ${needProductive} more word${needProductive === 1 ? "" : "s"} in sentence or reply practice`,
    );
  if (parts.length === 0) parts.push("finish the checkpoint");
  const req = parts.join(" and ");
  return `${req.charAt(0).toUpperCase()}${req.slice(1)} in Stage ${prev.index} to unlock.`;
}

export function hsk1Complete(stages: Stage[], p: ProgressStore): boolean {
  return stages.every((s) => isStageComplete(s, p));
}

// Dev escape hatch: /lessons?unlock=all sets it, ?unlock=off clears it.
// Session-scoped so it can't be mistaken for real progress after a restart.
export function devUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(DEV_KEY) === "1";
  } catch {
    return false;
  }
}

export function setDevUnlocked(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(DEV_KEY, "1");
    else window.sessionStorage.removeItem(DEV_KEY);
  } catch {
    // sessionStorage unavailable — dev unlock just won't stick.
  }
}
