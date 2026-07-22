import assert from "node:assert/strict";
import { GRAMMAR_LESSONS } from "../lib/data/grammar.ts";
import {
  evaluateRoleCallAnswer,
  ROLE_CALL_SCENARIOS,
} from "../lib/role-calls.ts";
import { findWord } from "../lib/hsk.ts";

const scenarioIds = new Set();
const stepIds = new Set();
const grammarIds = new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id));

assert.equal(ROLE_CALL_SCENARIOS.length, 5, "Expected five launch roles");

for (const scenario of ROLE_CALL_SCENARIOS) {
  assert(!scenarioIds.has(scenario.id), `Duplicate scenario ID: ${scenario.id}`);
  scenarioIds.add(scenario.id);
  assert(scenario.opening.hanzi && scenario.opening.pinyin && scenario.opening.english);
  assert(scenario.steps.length >= 3, `${scenario.id} needs at least three learner turns`);
  assert(
    scenario.grammarLessonIds.every((id) => grammarIds.has(id)),
    `${scenario.id} references an unknown grammar lesson`,
  );

  for (const step of scenario.steps) {
    assert(!stepIds.has(step.id), `Duplicate step ID: ${step.id}`);
    stepIds.add(step.id);
    assert.equal(step.hints.length, 3, `${step.id} must have a three-level hint ladder`);
    assert(step.target.hanzi && step.target.pinyin && step.target.english);
    assert(step.response.hanzi && step.response.pinyin && step.response.english);
    assert(step.correction, `${step.id} needs specific corrective feedback`);
    assert(step.wordIds.length > 0, `${step.id} needs Hanzi use evidence`);
    assert(
      step.wordIds.every((id) => findWord(id)),
      `${step.id} references an unknown Hanzi word ID`,
    );
    assert(
      step.acceptedAnswers.length > 0 || step.requiredGroups?.length,
      `${step.id} has no answer contract`,
    );
    if (step.acceptedAnswers[0]) {
      assert(
        evaluateRoleCallAnswer(step, `${step.acceptedAnswers[0]}！`),
        `${step.id} rejected its authored answer with punctuation`,
      );
    }
    assert(
      evaluateRoleCallAnswer(step, step.target.pinyin),
      `${step.id} rejected its tone-marked pinyin model`,
    );
    assert(
      !evaluateRoleCallAnswer(step, "今天天气很好"),
      `${step.id} accepted an unrelated sentence`,
    );
  }
}

const personalNameStep = ROLE_CALL_SCENARIOS.find(
  (scenario) => scenario.id === "hotel-clerk",
)?.steps[0];
assert(personalNameStep);
assert(evaluateRoleCallAnswer(personalNameStep, "我叫 Justin。"));
assert(!evaluateRoleCallAnswer(personalNameStep, "我叫"));

const teaStep = ROLE_CALL_SCENARIOS.find(
  (scenario) => scenario.id === "waiter",
)?.steps[0];
assert(teaStep);
assert(
  evaluateRoleCallAnswer(teaStep, "今天我想要一杯茶"),
  "An understandable tea order should pass without exact wording",
);
assert(
  !evaluateRoleCallAnswer(teaStep, "我不想喝茶"),
  "A reply with the opposite intent must not pass",
);
assert(
  evaluateRoleCallAnswer(teaStep, "wo xiang he cha"),
  "An unmarked pinyin model reply should pass",
);
assert(
  evaluateRoleCallAnswer(teaStep, "xiang he cha"),
  "A natural subject-omitted pinyin reply should pass",
);
assert(
  !evaluateRoleCallAnswer(teaStep, "wo bu xiang he cha"),
  "Opposite pinyin intent must not pass",
);
const thanksStep = ROLE_CALL_SCENARIOS.find(
  (scenario) => scenario.id === "waiter",
)?.steps[2];
assert(thanksStep);
assert(
  !evaluateRoleCallAnswer(thanksStep, "bu xiexie"),
  "A contradictory pinyin thank-you must not pass",
);

console.log(
  `Role-call validation passed: ${scenarioIds.size} scenarios, ${stepIds.size} learner turns.`,
);
