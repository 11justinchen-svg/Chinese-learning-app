import assert from "node:assert/strict";
import { HSK } from "../lib/hsk";
import {
  HANZI_TOPIC_SETS,
  makeHanziSetTest,
  makeHanziWordTest,
} from "../lib/hanzi-practice";
import {
  hanziProficiency,
  recordAnswer,
  recordTeachSeen,
  type ProgressStore,
} from "../lib/progression";

const allIds = new Set(HSK.map((word) => word.id));
const topicIds = new Set<string>();

assert(HANZI_TOPIC_SETS.some((topic) => topic.id === "shopping"));
assert(HANZI_TOPIC_SETS.some((topic) => topic.id === "small-talk"));

for (const topic of HANZI_TOPIC_SETS) {
  assert(!topicIds.has(topic.id), `Duplicate topic ID: ${topic.id}`);
  topicIds.add(topic.id);
  assert(topic.wordIds.length >= 10, `${topic.id} is too small to be a useful set`);
  assert.equal(
    new Set(topic.wordIds).size,
    topic.wordIds.length,
    `${topic.id} repeats a word`,
  );
  assert(
    topic.wordIds.every((id) => allIds.has(id)),
    `${topic.id} references a word outside HSK 1 and HSK 2`,
  );
  const exercises = makeHanziSetTest(topic.wordIds, 3);
  assert(exercises.length >= 6, `${topic.id} needs a substantial mixed test`);
  assert(
    new Set(exercises.map((exercise) => exercise.kind)).size >= 3,
    `${topic.id} test needs at least three exercise kinds`,
  );
}

for (const word of HSK) {
  const exercises = makeHanziWordTest(word.id, 2);
  assert.equal(exercises.length, 4, `${word.id} needs a four-part focused test`);
  assert(
    exercises.every((exercise) => exercise.wordIds.includes(word.id)),
    `${word.id} focused test contains unrelated credit`,
  );
  assert(exercises.some((exercise) => exercise.kind === "choice"));
  assert(exercises.some((exercise) => exercise.kind === "listen"));
  assert(
    exercises.some((exercise) => ["cloze", "order", "reply"].includes(exercise.kind)),
    `${word.id} needs reachable contextual-use evidence`,
  );
  assert.equal(
    new Set(exercises.map((exercise) => exercise.id)).size,
    exercises.length,
    `${word.id} focused test repeats an exercise ID`,
  );
}

const empty: ProgressStore = { version: 1, words: {}, stages: {} };
const wordId = "hsk1-010";
assert.equal(hanziProficiency(wordId, empty).status, "untested");
const seen = recordTeachSeen(empty, [wordId], 1);
assert.equal(hanziProficiency(wordId, seen).status, "started");
const form = recordAnswer(seen, [wordId], "choice", true);
assert.equal(hanziProficiency(wordId, form).status, "started");
const sound = recordAnswer(form, [wordId], "listen", true);
assert.equal(hanziProficiency(wordId, sound).status, "building");
const used = recordAnswer(sound, [wordId], "reply", true);
const proficient = hanziProficiency(wordId, used);
assert.equal(proficient.status, "proficient");
assert.equal(proficient.score, 100);

console.log(
  `Hanzi practice passed: ${HANZI_TOPIC_SETS.length} topic sets, ${HSK.length} focused tests, evidence model verified.`,
);
