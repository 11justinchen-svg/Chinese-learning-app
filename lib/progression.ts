// Word-status and stage-lock engine. Word learning history lives in
// "mozhi.progress.v1"; scheduling stays in the existing SRS store ("mozhi.srs.v1").

import { MASTERED_BOX, type SrsStore } from "@/lib/srs";
import type { ExerciseKind, Stage } from "@/lib/data/stages/types";
import { markLocalLearningDataChanged } from "@/lib/account/events";

export type WordStatus = "new" | "seen" | "learning" | "learned" | "mastered";
export type HanziProficiencyStatus =
  | "untested"
  | "started"
  | "building"
  | "proficient";

export interface HanziProficiency {
  status: HanziProficiencyStatus;
  score: number;
  accuracy: number | null;
  attempts: number;
  evidence: {
    formMeaning: boolean;
    sound: boolean;
    use: boolean;
  };
}

export interface HanziLessonStats {
  total: number;
  tried: number;
  building: number;
  proficient: number;
  score: number;
  evidence: {
    formMeaning: number;
    sound: number;
    use: number;
  };
}

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

export interface AssessmentKindScore {
  score: number;
  total: number;
}

export interface AssessmentAttempt {
  score: number;
  total: number;
  completedAt: number;
  byKind: Partial<Record<ExerciseKind, AssessmentKindScore>>;
  missedExerciseIds: string[];
}

export interface AssessmentProgress {
  attempts: number;
  best: { score: number; total: number };
  last: AssessmentAttempt;
}

export interface ProgressStore {
  version: 1;
  words: Record<string, WordProgress>;
  stages: Record<string, StageProgress>;
  /** Added without changing the version so existing local saves remain valid. */
  assessments?: Record<string, AssessmentProgress>;
}

const KEY = "mozhi.progress.v1";

export const CHECKPOINT_PASS = 0.8; // first-try checkpoint accuracy
export const WORDS_LEARNED_GATE = 0.8; // share of stage words at learned+
export const LEARNED_CORRECT = 3;
export const LEARNED_KINDS = 2;
export const LEARNED_MIN_BOX = 2;
export const PRODUCTIVE_WORD_GATE = 0.5;

const PRODUCTIVE_KINDS: ExerciseKind[] = ["cloze", "order", "reply"];
const FORM_MEANING_KINDS: ExerciseKind[] = ["choice", "match"];

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
    markLocalLearningDataChanged();
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

export function recordAssessment(
  p: ProgressStore,
  assessmentId: string,
  attempt: AssessmentAttempt,
): ProgressStore {
  const assessments = p.assessments ?? {};
  const previous = assessments[assessmentId];
  const best =
    !previous ||
    attempt.score / attempt.total > previous.best.score / previous.best.total
      ? { score: attempt.score, total: attempt.total }
      : previous.best;
  return {
    ...p,
    assessments: {
      ...assessments,
      [assessmentId]: {
        attempts: (previous?.attempts ?? 0) + 1,
        best,
        last: attempt,
      },
    },
  };
}

export function stampCompletionIfEarned(
  p: ProgressStore,
  stage: Stage,
  _srs: SrsStore,
  now = Date.now(),
): ProgressStore {
  const s = stageEntry(p, stage.id);
  if (s.completedAt) return p;
  const best = s.checkpointBest;
  if (!best || best.score / best.total < CHECKPOINT_PASS) return p;
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

/**
 * Character proficiency is evidence-based and intentionally separate from
 * optional SRS boxes. A learner needs form/meaning, sound, and contextual-use
 * evidence before the UI says "proficient".
 */
export function hanziProficiency(
  id: string,
  progress: ProgressStore,
): HanziProficiency {
  const word = progress.words[id];
  const evidence = {
    formMeaning: FORM_MEANING_KINDS.some((kind) => (word?.kinds[kind] ?? 0) > 0),
    sound: (word?.kinds.listen ?? 0) > 0,
    use: PRODUCTIVE_KINDS.some((kind) => (word?.kinds[kind] ?? 0) > 0),
  };
  const evidenceCount = Object.values(evidence).filter(Boolean).length;
  const attempts = (word?.correct ?? 0) + (word?.wrong ?? 0);
  const accuracy = attempts > 0 ? (word?.correct ?? 0) / attempts : null;
  const score = Math.round((evidenceCount / 3) * 100);
  let status: HanziProficiencyStatus = "untested";
  if (evidenceCount === 1 || word?.seenAt) status = "started";
  if (evidenceCount >= 2) status = "building";
  if (
    evidenceCount === 3 &&
    (word?.correct ?? 0) >= 3 &&
    (accuracy ?? 0) >= 0.7
  )
    status = "proficient";
  return { status, score, accuracy, attempts, evidence };
}

/** Aggregate the existing word evidence for a lesson without adding a second
 * progress store. Percentages are derived, so old saves and stable IDs remain
 * valid when the Hanzi UI groups words into lesson chunks. */
export function hanziLessonStats(
  wordIds: string[],
  progress: ProgressStore,
): HanziLessonStats {
  if (wordIds.length === 0) {
    return {
      total: 0,
      tried: 0,
      building: 0,
      proficient: 0,
      score: 0,
      evidence: { formMeaning: 0, sound: 0, use: 0 },
    };
  }

  const values = wordIds.map((id) => hanziProficiency(id, progress));
  const count = (test: (value: HanziProficiency) => boolean) =>
    values.filter(test).length;
  const pct = (test: (value: HanziProficiency) => boolean) =>
    Math.round((count(test) / wordIds.length) * 100);

  return {
    total: wordIds.length,
    tried: count((value) => value.status !== "untested"),
    building: count(
      (value) => value.status === "building" || value.status === "proficient",
    ),
    proficient: count((value) => value.status === "proficient"),
    score: Math.round(
      values.reduce((total, value) => total + value.score, 0) / values.length,
    ),
    evidence: {
      formMeaning: pct((value) => value.evidence.formMeaning),
      sound: pct((value) => value.evidence.sound),
      use: pct((value) => value.evidence.use),
    },
  };
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
  _index: number,
  _stages: Stage[],
  _p: ProgressStore,
): boolean {
  // Access and mastery are intentionally separate. Learners may choose any
  // useful situation, while completion still requires the full evidence gate.
  return true;
}

export function unlockRequirement(
  _index: number,
  _stages: Stage[],
  _p: ProgressStore,
  _srs: SrsStore,
): string | null {
  return null;
}

export function hsk1Complete(stages: Stage[], p: ProgressStore): boolean {
  return stages.every((s) => isStageComplete(s, p));
}
