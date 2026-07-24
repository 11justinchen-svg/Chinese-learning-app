import assert from "node:assert/strict";
import { mergeLearningSnapshots } from "../lib/account/merge";
import type { LearningSnapshot } from "../lib/account/types";

const first: LearningSnapshot = {
  schemaVersion: 1,
  progress: {
    version: 1,
    words: {
      word: {
        seenAt: 200,
        correct: 2,
        wrong: 1,
        kinds: { choice: 2 },
      },
    },
    stages: {
      lesson: {
        dialogueViewed: true,
        blocksDone: ["words"],
        checkpointBest: { score: 3, total: 5 },
        completedAt: 500,
      },
    },
    assessments: {
      test: {
        attempts: 1,
        best: { score: 3, total: 5 },
        last: {
          score: 3,
          total: 5,
          completedAt: 300,
          byKind: { choice: { score: 3, total: 5 } },
          missedExerciseIds: ["miss-a"],
        },
      },
    },
  },
  srs: { word: { box: 2, due: 800, reps: 2 } },
  customCards: [
    { id: "custom-1", hanzi: "桥", pinyin: "qiáo", meaning: "bridge" },
  ],
  updatedAt: 700,
};

const second: LearningSnapshot = {
  schemaVersion: 1,
  progress: {
    version: 1,
    words: {
      word: {
        seenAt: 100,
        correct: 1,
        wrong: 3,
        kinds: { listen: 1 },
      },
    },
    stages: {
      lesson: {
        blocksDone: ["grammar"],
        checkpointBest: { score: 4, total: 5 },
        completedAt: 600,
      },
    },
    assessments: {
      test: {
        attempts: 2,
        best: { score: 4, total: 5 },
        last: {
          score: 4,
          total: 5,
          completedAt: 400,
          byKind: { reply: { score: 1, total: 1 } },
          missedExerciseIds: [],
        },
      },
    },
  },
  srs: { word: { box: 1, due: 900, reps: 3 } },
  customCards: [
    {
      id: "custom-1",
      hanzi: "桥",
      pinyin: "qiáo",
      meaning: "a bridge",
    },
    { id: "custom-2", hanzi: "巷", pinyin: "xiàng", meaning: "lane" },
  ],
  updatedAt: 900,
};

const merged = mergeLearningSnapshots(first, second);
assert.equal(merged.progress.words.word.seenAt, 100);
assert.equal(merged.progress.words.word.correct, 2);
assert.equal(merged.progress.words.word.wrong, 3);
assert.deepEqual(merged.progress.words.word.kinds, { choice: 2, listen: 1 });
assert.deepEqual(merged.progress.stages.lesson.blocksDone, [
  "words",
  "grammar",
]);
assert.equal(merged.progress.stages.lesson.completedAt, 500);
assert.deepEqual(merged.progress.stages.lesson.checkpointBest, {
  score: 4,
  total: 5,
});
assert.equal(merged.progress.assessments?.test.attempts, 2);
assert.equal(merged.progress.assessments?.test.last.completedAt, 400);
assert.deepEqual(merged.srs.word, { box: 1, due: 900, reps: 3 });
assert.equal(merged.customCards.length, 2);
assert.equal(merged.customCards[0].meaning, "a bridge");

console.log(
  "account sync merge passed: evidence preserved without duplicate-count inflation",
);
