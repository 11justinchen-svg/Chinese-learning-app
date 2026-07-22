import assert from "node:assert/strict";
import {
  GRAMMAR_HANZI_REQUIREMENTS,
  GRAMMAR_LESSONS,
} from "../lib/data/grammar.ts";
import { STAGES, stagesForLevel } from "../lib/data/stages/index.ts";
import { HSK1, HSK2 } from "../lib/hsk.ts";
import { makeHanziSetTest } from "../lib/hanzi-practice.ts";

const knownWordIds = new Set([...HSK1, ...HSK2].map((word) => word.id));
const knownGrammarIds = new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id));
const referencedGrammarIds = new Set(
  STAGES.flatMap((stage) => stage.grammarLessonIds),
);

// The repository's source list places 也 in HSK 2, while the existing HSK 1
// lesson teaches 也/都 together. The prerequisite bridge intentionally
// pre-teaches this one written form instead of hiding that dependency.
const explicitPreteach = new Map([["ye-dou", new Set(["hsk2-121"])]]);

assert.deepEqual(
  new Set(Object.keys(GRAMMAR_HANZI_REQUIREMENTS)),
  knownGrammarIds,
  "Every grammar concept needs exactly one prerequisite-Hanzi definition",
);

for (const lessonId of referencedGrammarIds) {
  const requirements = GRAMMAR_HANZI_REQUIREMENTS[lessonId];
  assert(requirements, `${lessonId} is missing prerequisite Hanzi`);
  assert(
    requirements.length >= 1 && requirements.length <= 3,
    `${lessonId} should have one to three high-value prerequisite forms`,
  );
  assert.equal(
    new Set(requirements.map((requirement) => requirement.wordId)).size,
    requirements.length,
    `${lessonId} repeats a prerequisite word`,
  );

  const owner = STAGES.find((stage) => stage.grammarLessonIds.includes(lessonId));
  assert(owner, `${lessonId} is not assigned to a stage`);
  const allowed = new Set(
    owner.level === 2
      ? [
          ...HSK1.map((word) => word.id),
          ...stagesForLevel(2)
            .filter((stage) => stage.index <= owner.index)
            .flatMap((stage) => stage.wordIds),
        ]
      : stagesForLevel(1)
          .filter((stage) => stage.index <= owner.index)
          .flatMap((stage) => stage.wordIds),
  );

  for (const requirement of requirements) {
    assert(
      knownWordIds.has(requirement.wordId),
      `${lessonId} references unknown prerequisite ${requirement.wordId}`,
    );
    assert(
      requirement.use.trim().length >= 8,
      `${lessonId}/${requirement.wordId} needs a useful grammar-role label`,
    );
    assert(
      allowed.has(requirement.wordId) ||
        explicitPreteach.get(lessonId)?.has(requirement.wordId),
      `${lessonId} previews ${requirement.wordId} without an explicit prerequisite exception`,
    );
  }

  const wordIds = requirements.map((requirement) => requirement.wordId);
  const practice = makeHanziSetTest(wordIds, 1);
  assert(practice.length >= 3, `${lessonId} does not generate enough Hanzi practice`);
  const practicedIds = new Set(practice.flatMap((exercise) => exercise.wordIds));
  for (const wordId of wordIds)
    assert(practicedIds.has(wordId), `${lessonId} practice omits ${wordId}`);
}

console.log(
  `Grammar Hanzi validation passed: ${referencedGrammarIds.size} concepts, ${Object.values(GRAMMAR_HANZI_REQUIREMENTS).flat().length} prerequisite links.`,
);
