import assert from "node:assert/strict";
import { GRAMMAR_LESSONS } from "../lib/data/grammar.ts";
import {
  evaluateRoleCallAnswer,
  ROLE_CALL_SCENARIOS,
} from "../lib/role-calls.ts";

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

console.log(
  `Role-call validation passed: ${scenarioIds.size} scenarios, ${stepIds.size} learner turns.`,
);
