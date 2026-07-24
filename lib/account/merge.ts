import type {
  AssessmentAttempt,
  AssessmentProgress,
  ProgressStore,
  StageProgress,
  WordProgress,
} from "@/lib/progression";
import type { CardState, SrsStore } from "@/lib/srs";
import type { LearningSnapshot } from "@/lib/account/types";

const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

function earlier(a?: number, b?: number) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.min(a, b);
}

function mergeWord(a?: WordProgress, b?: WordProgress): WordProgress {
  const kinds = { ...(a?.kinds ?? {}) };
  for (const [kind, count] of Object.entries(b?.kinds ?? {})) {
    const key = kind as keyof WordProgress["kinds"];
    kinds[key] = Math.max(kinds[key] ?? 0, count ?? 0);
  }
  return {
    seenAt: earlier(a?.seenAt, b?.seenAt),
    correct: Math.max(a?.correct ?? 0, b?.correct ?? 0),
    wrong: Math.max(a?.wrong ?? 0, b?.wrong ?? 0),
    kinds,
  };
}

function betterScore<T extends { score: number; total: number }>(
  a?: T,
  b?: T,
): T | undefined {
  if (!a) return b;
  if (!b) return a;
  const aRatio = a.total > 0 ? a.score / a.total : 0;
  const bRatio = b.total > 0 ? b.score / b.total : 0;
  if (aRatio !== bRatio) return aRatio > bRatio ? a : b;
  return a.total >= b.total ? a : b;
}

function mergeStage(a?: StageProgress, b?: StageProgress): StageProgress {
  return {
    dialogueViewed: Boolean(a?.dialogueViewed || b?.dialogueViewed) || undefined,
    blocksDone: Array.from(
      new Set([...(a?.blocksDone ?? []), ...(b?.blocksDone ?? [])]),
    ),
    checkpointBest: betterScore(a?.checkpointBest, b?.checkpointBest),
    completedAt: earlier(a?.completedAt, b?.completedAt),
  };
}

function laterAttempt(a: AssessmentAttempt, b: AssessmentAttempt) {
  return a.completedAt >= b.completedAt ? a : b;
}

function mergeAssessment(
  a?: AssessmentProgress,
  b?: AssessmentProgress,
): AssessmentProgress | undefined {
  if (!a) return b;
  if (!b) return a;
  return {
    attempts: Math.max(a.attempts, b.attempts),
    best: betterScore(a.best, b.best) ?? a.best,
    last: laterAttempt(a.last, b.last),
  };
}

export function mergeProgressStores(
  a: ProgressStore = EMPTY_PROGRESS,
  b: ProgressStore = EMPTY_PROGRESS,
): ProgressStore {
  const words: ProgressStore["words"] = {};
  for (const id of new Set([...Object.keys(a.words), ...Object.keys(b.words)])) {
    words[id] = mergeWord(a.words[id], b.words[id]);
  }

  const stages: ProgressStore["stages"] = {};
  for (const id of new Set([
    ...Object.keys(a.stages),
    ...Object.keys(b.stages),
  ])) {
    stages[id] = mergeStage(a.stages[id], b.stages[id]);
  }

  const assessmentIds = new Set([
    ...Object.keys(a.assessments ?? {}),
    ...Object.keys(b.assessments ?? {}),
  ]);
  const assessments: NonNullable<ProgressStore["assessments"]> = {};
  for (const id of assessmentIds) {
    const merged = mergeAssessment(a.assessments?.[id], b.assessments?.[id]);
    if (merged) assessments[id] = merged;
  }

  return {
    version: 1,
    words,
    stages,
    ...(assessmentIds.size > 0 ? { assessments } : {}),
  };
}

function preferredCard(a?: CardState, b?: CardState): CardState | undefined {
  if (!a) return b;
  if (!b) return a;
  if (a.reps !== b.reps) return a.reps > b.reps ? a : b;
  if (a.box !== b.box) return a.box > b.box ? a : b;
  return a.due >= b.due ? a : b;
}

export function mergeSrsStores(a: SrsStore, b: SrsStore): SrsStore {
  const merged: SrsStore = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const card = preferredCard(a[id], b[id]);
    if (card) merged[id] = card;
  }
  return merged;
}

export function mergeLearningSnapshots(
  a: LearningSnapshot,
  b: LearningSnapshot,
): LearningSnapshot {
  const customCards = new Map(
    [...a.customCards, ...b.customCards].map((card) => [card.id, card]),
  );
  return {
    schemaVersion: 1,
    progress: mergeProgressStores(a.progress, b.progress),
    srs: mergeSrsStores(a.srs, b.srs),
    customCards: Array.from(customCards.values()),
    updatedAt: Math.max(a.updatedAt, b.updatedAt, Date.now()),
  };
}
