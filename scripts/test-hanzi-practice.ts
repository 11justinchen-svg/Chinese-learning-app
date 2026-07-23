import assert from "node:assert/strict";
import { HSK } from "../lib/hsk";
import {
  HANZI_TOPIC_SETS,
  makeHanziLessonMatchPractice,
  makeHanziLessonSelectedPractice,
  makeHanziLessonSoundPractice,
  makeHanziLessonTest,
  makeHanziLessonUsePractice,
  makeHanziSetTest,
  makeHanziWordTest,
} from "../lib/hanzi-practice";
import { HANZI_LESSON_CHUNKS } from "../lib/hanzi-lessons";
import { STAGES } from "../lib/data/stages";
import {
  hanziLessonStats,
  hanziProficiency,
  recordAnswer,
  recordTeachSeen,
  type ProgressStore,
} from "../lib/progression";

const allIds = new Set(HSK.map((word) => word.id));
const topicIds = new Set<string>();

assert.equal(HANZI_LESSON_CHUNKS.length, 20);
assert.equal(HANZI_LESSON_CHUNKS[0].title, "Describe people");
assert.equal(
  new Set(HANZI_LESSON_CHUNKS.map((lesson) => lesson.id)).size,
  HANZI_LESSON_CHUNKS.length,
  "Hanzi lesson IDs must reuse unique canonical stage IDs",
);

for (const lesson of HANZI_LESSON_CHUNKS) {
  const stage = STAGES.find((candidate) => candidate.id === lesson.id);
  assert(stage, `${lesson.id} must map to a canonical stage`);
  assert.deepEqual(lesson.wordIds, stage.wordIds, `${lesson.id} word allocation drifted`);
  assert(stage.grammarLessonIds.length > 0, `${lesson.id} needs corresponding grammar`);
  assert(
    lesson.cumulativeWordIds.length >= lesson.wordIds.length,
    `${lesson.id} must include its current forms in cumulative review`,
  );
  assert.equal(
    new Set(lesson.cumulativeWordIds).size,
    lesson.cumulativeWordIds.length,
    `${lesson.id} cumulative review repeats a word`,
  );

  const matching = makeHanziLessonMatchPractice(lesson.wordIds, 3);
  assert.equal(
    matching.length,
    Math.ceil(lesson.wordIds.length / 5) * 2,
    `${lesson.id} needs meaning and pinyin matching for every balanced group`,
  );
  assert.equal(
    matching.filter((exercise) => exercise.kind === "match").length,
    matching.length,
    `${lesson.id} must match both meaning and sound`,
  );
  assert.deepEqual(
    new Set(matching.flatMap((exercise) => exercise.wordIds)),
    new Set(lesson.wordIds),
    `${lesson.id} matching must cover every form`,
  );
  assert(
    matching.every(
      (exercise) => exercise.kind === "match" && exercise.pairs.length >= 3 && exercise.pairs.length <= 5,
    ),
    `${lesson.id} matching groups must remain usable`,
  );

  const sound = makeHanziLessonSoundPractice(lesson.wordIds, 3);
  assert.equal(sound.length, lesson.wordIds.length, `${lesson.id} must test every sound`);
  assert(sound.every((exercise) => exercise.kind === "listen"));
  assert.deepEqual(
    new Set(sound.flatMap((exercise) => exercise.wordIds)),
    new Set(lesson.wordIds),
    `${lesson.id} sound practice must cover every form`,
  );

  const use = makeHanziLessonUsePractice(lesson.id, 2);
  assert.equal(use.length, lesson.wordIds.length, `${lesson.id} must use every form in context`);
  assert(
    use.some((exercise) => exercise.kind === "reply"),
    `${lesson.id} needs a communicative response`,
  );
  assert(
    use.every((exercise) => ["cloze", "order", "reply"].includes(exercise.kind)),
    `${lesson.id} use practice must require contextual retrieval`,
  );
  assert.equal(
    new Set(use.map((exercise) => exercise.id)).size,
    use.length,
    `${lesson.id} use practice repeats an exercise ID`,
  );
  assert.deepEqual(
    new Set(use.flatMap((exercise) => exercise.wordIds)),
    new Set(lesson.wordIds),
    `${lesson.id} contextual practice must cover every form`,
  );

  const test = makeHanziLessonTest(lesson.id, 4);
  assert.equal(
    new Set(test.map((exercise) => exercise.id)).size,
    test.length,
    `${lesson.id} test repeats an exercise ID`,
  );
  for (const wordId of lesson.wordIds) {
    const evidence = test.filter((exercise) => exercise.wordIds.includes(wordId));
    assert(evidence.some((exercise) => exercise.kind === "match"), `${lesson.id}/${wordId} needs form and meaning evidence`);
    assert(evidence.some((exercise) => exercise.kind === "listen"), `${lesson.id}/${wordId} needs sound evidence`);
    assert(evidence.some((exercise) => ["cloze", "order", "reply"].includes(exercise.kind)), `${lesson.id}/${wordId} needs contextual-use evidence`);
  }

  const selectedPractice = makeHanziLessonSelectedPractice(
    lesson.id,
    ["match", "use"],
    5,
  );
  assert(
    selectedPractice.some((exercise) => exercise.kind === "match"),
    `${lesson.id} selected practice must include requested matching`,
  );
  assert(
    selectedPractice.some((exercise) =>
      ["cloze", "order", "reply"].includes(exercise.kind),
    ),
    `${lesson.id} selected practice must include requested contextual use`,
  );
  assert(
    selectedPractice.every((exercise) => exercise.kind !== "listen"),
    `${lesson.id} selected practice must exclude unselected listening`,
  );
  assert.equal(
    new Set(selectedPractice.map((exercise) => exercise.id)).size,
    selectedPractice.length,
    `${lesson.id} selected practice repeats an exercise ID`,
  );
}

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
const lessonStats = hanziLessonStats([wordId, "hsk1-011"], used);
assert.equal(lessonStats.total, 2);
assert.equal(lessonStats.proficient, 1);
assert.equal(lessonStats.evidence.sound, 50);

console.log(
  `Hanzi practice passed: ${HANZI_LESSON_CHUNKS.length} lesson chunks, ${HANZI_TOPIC_SETS.length} topic sets, ${HSK.length} focused tests, evidence model verified.`,
);
