import assert from "node:assert/strict";
import { HSK1_ASSESSMENTS } from "../lib/assessments.ts";
import { HSK1_STAGES, HSK2_STAGES } from "../lib/data/stages/index.ts";
import { HSK1 } from "../lib/hsk.ts";
import {
  learningGroupsForLevel,
  nextLearningAction,
  stagesForLearningGroup,
} from "../lib/learning-path.ts";

const groupsByLevel = {
  1: learningGroupsForLevel(1),
  2: learningGroupsForLevel(2),
};
const stagesByLevel = { 1: HSK1_STAGES, 2: HSK2_STAGES };
const empty = { version: 1, words: {}, stages: {} };

for (const level of [1, 2]) {
  const groups = groupsByLevel[level];
  const stages = stagesByLevel[level];
  assert(groups.length >= 8, `HSK ${level} needs topic-based organization`);
  const groupedIds = groups.flatMap((group) => group.stageIds);
  assert.equal(groupedIds.length, stages.length);
  assert.equal(new Set(groupedIds).size, stages.length);
  assert.deepEqual(new Set(groupedIds), new Set(stages.map((stage) => stage.id)));
  for (const group of groups) {
    assert(stagesForLearningGroup(group).length >= 1);
    assert(group.outcome && group.description);
  }
}

const hsk1Groups = groupsByLevel[1];
assert.equal(
  HSK1_ASSESSMENTS.length,
  hsk1Groups.length + 2,
  "Level 1 needs one topic test per group plus two comprehensive forms",
);
assert.equal(
  new Set(HSK1_ASSESSMENTS.map((assessment) => assessment.id)).size,
  HSK1_ASSESSMENTS.length,
);

const knownWordIds = new Set(HSK1.map((word) => word.id));
const exerciseIds = new Set();
for (const assessment of HSK1_ASSESSMENTS) {
  assert(assessment.exercises.length >= 8 && assessment.exercises.length <= 40);
  const kinds = new Set(assessment.exercises.map((exercise) => exercise.kind));
  assert(kinds.has("listen"), `${assessment.id} needs listening`);
  assert(kinds.has("reply"), `${assessment.id} needs a productive reply`);
  assert(kinds.has("order") || kinds.has("cloze"), `${assessment.id} needs sentence production`);
  assert(kinds.has("choice") || kinds.has("match"), `${assessment.id} needs form retrieval`);
  for (const exercise of assessment.exercises) {
    assert(!exerciseIds.has(exercise.id), `Duplicate assessment exercise ${exercise.id}`);
    exerciseIds.add(exercise.id);
    assert(exercise.wordIds.every((id) => knownWordIds.has(id)));
  }
}

assert.equal(
  nextLearningAction(1, empty).href,
  "/lessons/hsk3-l1-stage-01",
  "A new learner needs one clear HSK 3.0 starting lesson",
);

const first = HSK1_STAGES[0];
const active = {
  ...empty,
  stages: {
    [first.id]: { blocksDone: [`${first.id}-hanzi-lab`] },
  },
};
assert.equal(nextLearningAction(1, active).href, `/lessons/${first.id}`);

console.log(
  `Learning-path validation passed: ${groupsByLevel[1].length + groupsByLevel[2].length} topic groups, ${HSK1_ASSESSMENTS.length} Level 1 tests, ${exerciseIds.size} assessment exercises.`,
);
