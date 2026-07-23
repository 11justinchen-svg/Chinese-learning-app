import assert from "node:assert/strict";
import type { Stage } from "../lib/data/stages/types";
import {
  recordAnswer,
  recordAssessment,
  recordCheckpoint,
  isStageUnlocked,
  stampCompletionIfEarned,
  wordStatus,
  type ProgressStore,
} from "../lib/progression";
import { deckStats, type SrsStore } from "../lib/srs";

const ids = ["a", "b", "c", "d"];
const stage: Stage = {
  id: "test-stage",
  index: 1,
  title: "Test",
  hanziTitle: "测",
  scenario: "Test",
  description: "Test",
  wordIds: ids,
  grammarLessonIds: [],
  dialogue: [],
  teach: [],
  blocks: [],
  checkpoint: [],
};

let progress: ProgressStore = { version: 1, words: {}, stages: {} };
const matureSrs: SrsStore = Object.fromEntries(
  ids.map((id) => [id, { box: 4, due: 0, reps: 4 }]),
);

assert.equal(
  wordStatus("a", progress, matureSrs),
  "seen",
  "SRS clicks alone must not confer mastery",
);

for (const id of ids) {
  progress = recordAnswer(progress, [id], "choice", true);
  progress = recordAnswer(progress, [id], "choice", true);
  progress = recordAnswer(progress, [id], "listen", true);
}

assert.equal(wordStatus("a", progress, matureSrs), "learned");
progress = recordCheckpoint(progress, stage.id, 9, 10);
const quickCompleted = stampCompletionIfEarned(progress, stage, matureSrs, 123);
assert.equal(
  quickCompleted.stages[stage.id]?.completedAt,
  123,
  "An 80% fast test must complete a stage without a retention gate",
);

progress = recordAnswer(progress, ["a", "b"], "order", true);
assert.equal(wordStatus("a", progress, matureSrs), "mastered");

const stats = deckStats({}, ids);
assert.equal(stats.due, 0, "Unseen cards must not appear in due-only review");
assert.equal(stats.new, 4);

assert.equal(
  isStageUnlocked(10, [stage], { version: 1, words: {}, stages: {} }),
  true,
  "All lesson stages must be selectable without prior completion",
);

progress = recordAssessment(progress, "test-assessment", {
  score: 7,
  total: 10,
  completedAt: 200,
  byKind: { listen: { score: 2, total: 3 } },
  missedExerciseIds: ["miss-1", "miss-2", "miss-3"],
});
progress = recordAssessment(progress, "test-assessment", {
  score: 6,
  total: 10,
  completedAt: 300,
  byKind: { listen: { score: 1, total: 3 } },
  missedExerciseIds: ["miss-4"],
});
assert.equal(progress.assessments?.["test-assessment"].attempts, 2);
assert.deepEqual(
  progress.assessments?.["test-assessment"].best,
  { score: 7, total: 10 },
  "A weaker retake must not replace the best assessment score",
);
assert.equal(
  progress.assessments?.["test-assessment"].last.completedAt,
  300,
  "The latest result must remain available for targeted repair",
);

console.log("progression helpers: all tests passed");
