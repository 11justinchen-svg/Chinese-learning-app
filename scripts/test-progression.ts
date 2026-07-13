import assert from "node:assert/strict";
import type { Stage } from "../lib/data/stages/types";
import {
  recordAnswer,
  recordCheckpoint,
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
assert.equal(
  stampCompletionIfEarned(progress, stage, matureSrs).stages[stage.id]
    ?.completedAt,
  undefined,
  "Recognition-only evidence must not complete a stage",
);

progress = recordAnswer(progress, ["a", "b"], "order", true);
assert.equal(wordStatus("a", progress, matureSrs), "mastered");
const completed = stampCompletionIfEarned(progress, stage, matureSrs, 123);
assert.equal(completed.stages[stage.id]?.completedAt, 123);

const stats = deckStats({}, ids);
assert.equal(stats.due, 0, "Unseen cards must not appear in due-only review");
assert.equal(stats.new, 4);

console.log("progression helpers: all tests passed");
