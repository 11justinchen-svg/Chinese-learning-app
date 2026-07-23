import assert from "node:assert/strict";
import { HSK1, HSK2 } from "../lib/hsk.ts";
import {
  HSK1_STAGES,
  HSK2_STAGES,
  STAGES,
} from "../lib/data/stages/index.ts";
import { GRAMMAR_LESSONS } from "../lib/data/grammar.ts";

const allWords = [...HSK1, ...HSK2];
const knownWordIds = new Set(allWords.map((word) => word.id));
const knownGrammarIds = new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id));
const exerciseIds = new Set();

assert.equal(HSK1.length, 300, "HSK 3.0 Level 1 must contain 300 entries");
assert.equal(HSK2.length, 200, "HSK 3.0 Level 2 must add 200 entries");
assert.deepEqual(
  HSK1.map((word) => word.syllabusIndex),
  Array.from({ length: 300 }, (_, index) => index + 1),
  "Level 1 must preserve the official syllabus order",
);
assert.deepEqual(
  HSK2.map((word) => word.syllabusIndex),
  Array.from({ length: 200 }, (_, index) => index + 301),
  "Level 2 must preserve the official syllabus order",
);

for (const word of allWords) {
  assert(word.hanzi, `${word.id} is missing Hanzi`);
  assert(word.pinyin, `${word.id} is missing pinyin`);
  assert(word.meaning, `${word.id} is missing an English meaning`);
  assert.equal(word.syllabus, "HSK 3.0 (2025)");
  assert(word.characters.length > 0, `${word.id} is missing character data`);
}

for (const [level, words, stages] of [
  [1, HSK1, HSK1_STAGES],
  [2, HSK2, HSK2_STAGES],
]) {
  const allocated = stages.flatMap((stage) => stage.wordIds);
  assert.equal(allocated.length, words.length, `Level ${level} allocation is incomplete`);
  assert.equal(new Set(allocated).size, words.length, `Level ${level} allocation repeats words`);
  assert.deepEqual(
    new Set(allocated),
    new Set(words.map((word) => word.id)),
    `Level ${level} allocation differs from the official roster`,
  );

  for (const [position, stage] of stages.entries()) {
    assert.equal(stage.id, `hsk3-l${level}-stage-${String(position + 1).padStart(2, "0")}`);
    assert.equal(stage.level, level);
    assert.equal(stage.index, position + 1);
    assert(stage.wordIds.length >= 5 && stage.wordIds.length <= 10, `${stage.id} needs a focused 5–10 word load`);
    assert.deepEqual(
      new Set(stage.teach.map((card) => card.wordId)),
      new Set(stage.wordIds),
      `${stage.id} must teach every new word before conversation`,
    );
    assert(stage.estimatedMinutes >= 3 && stage.estimatedMinutes <= 15, `${stage.id} needs an honest short duration`);
    assert(stage.goal && stage.description && stage.scenario);
    assert(stage.dialogue.length >= 6, `${stage.id} needs a useful model exchange`);
    for (const line of stage.dialogue)
      assert(line.hanzi && line.pinyin && line.english, `${stage.id} has an incomplete dialogue line`);

    const vocabularyBlocks = stage.blocks.filter((block) => block.kind === "vocab");
    const grammarBlocks = stage.blocks.filter((block) => block.kind === "grammar");
    assert(vocabularyBlocks.length >= 2, `${stage.id} needs varied vocabulary retrieval`);
    assert.equal(
      grammarBlocks.length,
      stage.grammarLessonIds.length,
      `${stage.id} needs one drill block per assigned grammar concept`,
    );
    assert(stage.grammarLessonIds.every((id) => knownGrammarIds.has(id)));
    assert(stage.checkpoint.length >= 5 && stage.checkpoint.length <= 10);
    assert(
      new Set(stage.checkpoint.map((exercise) => exercise.kind)).size >= 3,
      `${stage.id} checkpoint needs at least three exercise kinds`,
    );
    assert(
      stage.checkpoint.some((exercise) => exercise.kind === "reply"),
      `${stage.id} checkpoint needs a productive reply`,
    );

    const credits = new Map();
    const exercises = [
      ...stage.blocks.flatMap((block) => block.exercises),
      ...stage.checkpoint,
    ];
    for (const exercise of exercises) {
      assert(!exerciseIds.has(exercise.id), `Duplicate exercise ID ${exercise.id}`);
      exerciseIds.add(exercise.id);
      assert(
        exercise.wordIds.every((id) => knownWordIds.has(id)),
        `${exercise.id} credits an unknown word`,
      );
      for (const id of exercise.wordIds) {
        if (!stage.wordIds.includes(id)) continue;
        const evidence = credits.get(id) ?? new Set();
        evidence.add(exercise.kind);
        credits.set(id, evidence);
      }
      if (exercise.kind === "choice" || exercise.kind === "listen") {
        assert(exercise.choices.includes(exercise.answer), `${exercise.id} answer is unreachable`);
        assert.equal(new Set(exercise.choices).size, exercise.choices.length, `${exercise.id} repeats a choice`);
      }
      if (exercise.kind === "cloze") {
        assert.equal((exercise.sentence.match(/＿/gu) ?? []).length, 1);
        assert(exercise.choices.includes(exercise.answer));
      }
      if (exercise.kind === "match") {
        assert(exercise.pairs.length >= 3 && exercise.pairs.length <= 6);
        assert.equal(new Set(exercise.pairs.map((pair) => pair.hanzi)).size, exercise.pairs.length);
        assert.equal(new Set(exercise.pairs.map((pair) => pair.match)).size, exercise.pairs.length);
      }
      if (exercise.kind === "order") assert(exercise.tiles.length >= 2);
      if (exercise.kind === "reply") {
        const accepted = exercise.answers ?? [exercise.answer];
        assert(accepted.length >= 2, `${exercise.id} needs answer variation`);
        assert(
          accepted.every((answer) =>
            exercise.choices.some((choice) => choice.hanzi === answer),
          ),
          `${exercise.id} contains an unreachable accepted reply`,
        );
      }
    }
    for (const wordId of stage.wordIds) {
      const kinds = credits.get(wordId) ?? new Set();
      assert(kinds.size >= 3, `${stage.id}/${wordId} needs three evidence kinds`);
    }
  }
}

assert.equal(STAGES.length, HSK1_STAGES.length + HSK2_STAGES.length);
console.log(
  `HSK 3.0 stage validation passed: ${STAGES.length} lessons, ${allWords.length} words, ${exerciseIds.size} exercises.`,
);
