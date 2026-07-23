import assert from "node:assert/strict";
import { HSK1_ASSESSMENTS } from "../lib/assessments.ts";
import { HSK1_STAGES, HSK2_STAGES } from "../lib/data/stages/index.ts";
import { HSK1 } from "../lib/hsk.ts";
import {
  learningGroupsForLevel,
  nextLearningAction,
  stagesForLearningGroup,
} from "../lib/learning-path.ts";

const hsk1Groups = learningGroupsForLevel(1);
const hsk2Groups = learningGroupsForLevel(2);
const empty = { version: 1, words: {}, stages: {} };

assert.equal(hsk1Groups.length, 5, "HSK 1 needs five learning chapters");
assert.equal(hsk2Groups.length, 5, "HSK 2 needs five learning chapters");

for (const [level, groups, stages] of [
  [1, hsk1Groups, HSK1_STAGES],
  [2, hsk2Groups, HSK2_STAGES],
]) {
  const groupedIds = groups.flatMap((group) => group.stageIds);
  assert.equal(groupedIds.length, 10, `HSK ${level} chapters must contain ten lessons`);
  assert.equal(new Set(groupedIds).size, 10, `HSK ${level} chapters repeat a lesson`);
  assert.deepEqual(
    new Set(groupedIds),
    new Set(stages.map((stage) => stage.id)),
    `HSK ${level} chapter map drifted from canonical stages`,
  );
  for (const group of groups) {
    assert.equal(
      stagesForLearningGroup(group).length,
      2,
      `${group.id} must contain exactly two lessons`,
    );
    assert(group.outcome, `${group.id} needs a communicative outcome`);
  }
}

assert.equal(HSK1_ASSESSMENTS.length, 7, "HSK 1 needs five chapter tests and two comprehensive forms");
assert.equal(
  new Set(HSK1_ASSESSMENTS.map((assessment) => assessment.id)).size,
  HSK1_ASSESSMENTS.length,
  "Assessment IDs must be unique",
);

const knownWordIds = new Set(HSK1.map((word) => word.id));
const allExerciseIds = new Set();
for (const assessment of HSK1_ASSESSMENTS) {
  assert.equal(assessment.level, 1);
  assert.equal(assessment.passRatio, 0.8);
  assert.equal(
    assessment.exercises.length,
    assessment.kind === "group" ? 16 : 40,
    `${assessment.id} has the wrong test length`,
  );
  const kinds = new Set(assessment.exercises.map((exercise) => exercise.kind));
  assert(kinds.has("listen"), `${assessment.id} needs listening`);
  assert(kinds.has("reply"), `${assessment.id} needs a useful reply`);
  assert(
    kinds.has("order") || kinds.has("cloze"),
    `${assessment.id} needs sentence or grammar production`,
  );
  assert(
    kinds.has("choice") || kinds.has("match"),
    `${assessment.id} needs form or meaning retrieval`,
  );
  for (const exercise of assessment.exercises) {
    assert(!allExerciseIds.has(exercise.id), `Duplicate assessment exercise ID: ${exercise.id}`);
    allExerciseIds.add(exercise.id);
    assert(
      exercise.wordIds.every((id) => knownWordIds.has(id)),
      `${exercise.id} credits a word outside HSK 1`,
    );
    if (exercise.kind === "choice" || exercise.kind === "listen") {
      assert(exercise.choices.includes(exercise.answer), `${exercise.id} answer is not a choice`);
      assert.equal(new Set(exercise.choices).size, exercise.choices.length, `${exercise.id} repeats a choice`);
    }
    if (exercise.kind === "reply") {
      const accepted = exercise.answers ?? [exercise.answer];
      assert(accepted.length >= 2, `${exercise.id} needs natural answer variation`);
      assert(accepted.every((answer) => exercise.choices.some((choice) => choice.hanzi === answer)));
    }
  }
}

assert.equal(
  nextLearningAction(1, empty).href,
  "/lessons/hsk1-stage-01",
  "A new learner needs one obvious starting lesson",
);

const scatteredActive = {
  ...empty,
  stages: {
    "hsk1-stage-05": {
      blocksDone: ["hsk1-stage-05-hanzi-lab"],
      dialogueViewed: true,
    },
  },
};
assert.equal(
  nextLearningAction(1, scatteredActive).href,
  "/lessons/hsk1-stage-05",
  "An active open lesson should resume before the default sequential recommendation",
);

const firstChapterComplete = {
  ...empty,
  stages: {
    "hsk1-stage-01": { blocksDone: [], completedAt: 1 },
    "hsk1-stage-02": { blocksDone: [], completedAt: 2 },
  },
};
assert.equal(
  nextLearningAction(1, firstChapterComplete).href,
  "/practice-tests?test=hsk1-group-people",
  "Completing two lessons should recommend their chapter test",
);

const firstChapterPassed = {
  ...firstChapterComplete,
  assessments: {
    "hsk1-group-people": {
      attempts: 1,
      best: { score: 13, total: 16 },
      last: {
        score: 13,
        total: 16,
        completedAt: 3,
        byKind: {},
        missedExerciseIds: [],
      },
    },
  },
};
assert.equal(
  nextLearningAction(1, firstChapterPassed).href,
  "/lessons/hsk1-stage-03",
  "Passing a chapter test should advance the recommendation",
);

console.log(
  `Learning-path validation passed: ${hsk1Groups.length + hsk2Groups.length} chapters, ${HSK1_ASSESSMENTS.length} HSK 1 tests, ${allExerciseIds.size} assessment exercises.`,
);
