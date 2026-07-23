import assert from "node:assert/strict";
import {
  GRAMMAR_HANZI_REQUIREMENTS,
  GRAMMAR_LESSONS,
} from "../lib/data/grammar.ts";
import { STAGES } from "../lib/data/stages/index.ts";
import { HSK } from "../lib/hsk.ts";
import { makeHanziSetTest } from "../lib/hanzi-practice.ts";

const knownWordIds = new Set(HSK.map((word) => word.id));
const grammarIds = new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id));
const referenced = new Set(STAGES.flatMap((stage) => stage.grammarLessonIds));

assert.deepEqual(
  new Set(Object.keys(GRAMMAR_HANZI_REQUIREMENTS)),
  grammarIds,
  "Every grammar concept needs a Hanzi prerequisite bridge",
);

for (const lesson of GRAMMAR_LESSONS) {
  assert(lesson.id && lesson.title && lesson.hanzi && lesson.pattern && lesson.summary);
  assert(lesson.examples.length >= 2, `${lesson.id} needs repeated examples`);
  for (const example of lesson.examples)
    assert(example.hanzi && example.pinyin && example.meaning, `${lesson.id} has an incomplete learning line`);

  const requirements = GRAMMAR_HANZI_REQUIREMENTS[lesson.id];
  assert(
    requirements.length >= 1 && requirements.length <= 3,
    `${lesson.id} needs one to three prerequisite forms`,
  );
  assert.equal(new Set(requirements.map((item) => item.wordId)).size, requirements.length);
  assert(requirements.every((item) => knownWordIds.has(item.wordId)));
  assert(requirements.every((item) => item.use.trim().length >= 8));

  const practice = makeHanziSetTest(
    requirements.map((requirement) => requirement.wordId),
    1,
  );
  assert(practice.length >= 3, `${lesson.id} prerequisite practice is unreachable`);
}

for (const id of referenced) assert(grammarIds.has(id), `${id} is not authored`);
for (const id of grammarIds)
  assert(referenced.has(id), `${id} is not assigned to a visible HSK 3.0 lesson`);

console.log(
  `Grammar validation passed: ${GRAMMAR_LESSONS.length} HSK 3.0 concepts, ${Object.values(GRAMMAR_HANZI_REQUIREMENTS).flat().length} prerequisite links.`,
);
