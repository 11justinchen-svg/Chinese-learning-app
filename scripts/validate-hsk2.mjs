import assert from "node:assert/strict";
import { HSK1, HSK2 } from "../lib/hsk.ts";
import { HSK2_STAGES } from "../lib/data/stages/index.ts";
import { GRAMMAR_LESSONS } from "../lib/data/grammar.ts";
import { HSK2_GRAMMAR_BY_STAGE } from "../lib/data/stages/hsk2.ts";

const exerciseIds = new Set();
const allocatedIds = HSK2_STAGES.flatMap((stage) => stage.wordIds);
const knownIds = new Set([...HSK1, ...HSK2].map((word) => word.id));
const hsk2Ids = new Set(HSK2.map((word) => word.id));
const grammarIds = new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id));

assert.equal(HSK2_STAGES.length, 10, "HSK 2 needs ten scenario lessons");
assert.equal(allocatedIds.length, HSK2.length, "Every HSK 2 word must be allocated once");
assert.equal(new Set(allocatedIds).size, HSK2.length, "HSK 2 allocation contains duplicates");
assert.deepEqual(new Set(allocatedIds), hsk2Ids, "HSK 2 allocation does not match the source list");

for (const word of HSK2) {
  assert(word.hanzi, `${word.id} is missing hanzi`);
  assert(word.pinyin, `${word.id} is missing pinyin`);
  assert(word.meaning, `${word.id} is missing a meaning`);
  assert(word.characters.length > 0, `${word.id} has no character analysis`);
  for (const character of word.characters) {
    assert(character.pinyin, `${word.id}/${character.char} is missing pinyin`);
    assert(character.components.length > 0, `${word.id}/${character.char} has no component note`);
    for (const component of character.components)
      assert(component.meaning, `${word.id}/${character.char}/${component.char} is missing a meaning`);
  }
}

for (const [index, stage] of HSK2_STAGES.entries()) {
  const number = index + 1;
  assert.equal(stage.id, `hsk2-stage-${String(number).padStart(2, "0")}`);
  assert.equal(stage.level, 2, `${stage.id} must be marked HSK 2`);
  assert.equal(stage.index, number, `${stage.id} has the wrong level-local index`);
  assert(stage.estimatedMinutes && stage.estimatedMinutes >= 32 && stage.estimatedMinutes <= 45, `${stage.id} needs an honest full-lesson time estimate`);
  assert(stage.goal, `${stage.id} needs a real-life goal`);
  assert(stage.dialogue.length >= 4, `${stage.id} needs a model conversation`);
  assert(stage.blocks.length >= 2, `${stage.id} needs retrieval and production blocks`);
  assert.deepEqual(stage.grammarLessonIds, HSK2_GRAMMAR_BY_STAGE[number], `${stage.id} grammar allocation drifted`);
  assert(stage.grammarLessonIds.length >= 2, `${stage.id} needs substantial grammar coverage`);
  assert(stage.grammarLessonIds.every((id) => grammarIds.has(id)), `${stage.id} includes unknown grammar`);
  const grammarBlocks = stage.blocks.filter((block) => block.kind === "grammar");
  assert.equal(grammarBlocks.length, stage.grammarLessonIds.length, `${stage.id} needs one practice block per grammar concept`);
  for (const block of grammarBlocks) {
    assert(block.grammarLessonId && stage.grammarLessonIds.includes(block.grammarLessonId), `${block.id} is not allocated to ${stage.id}`);
    assert(block.exercises.length >= 5, `${block.id} needs varied, production-bearing practice`);
    assert(block.exercises.some((exercise) => exercise.kind === "reply"), `${block.id} needs a scenario reply`);
    assert(block.exercises.filter((exercise) => exercise.kind === "cloze").length >= 2, `${block.id} needs repeated retrieval`);
    assert(block.exercises.filter((exercise) => exercise.kind === "order").length >= 2, `${block.id} needs sentence building`);
  }
  assert.equal(stage.checkpoint.length, 5 + stage.grammarLessonIds.length, `${stage.id} checkpoint must test every grammar concept`);
  assert(stage.checkpoint.some((exercise) => exercise.kind === "reply"), `${stage.id} checkpoint needs a reply`);
  assert(stage.checkpoint.some((exercise) => exercise.kind === "order"), `${stage.id} checkpoint needs sentence production`);
  assert.equal(
    stage.checkpoint.filter((exercise) => exercise.id.includes("checkpoint-grammar")).length,
    stage.grammarLessonIds.length,
    `${stage.id} checkpoint needs one item per grammar concept`,
  );

  for (const [lineIndex, line] of stage.dialogue.entries()) {
    assert(line.hanzi && line.pinyin && line.english, `${stage.id} dialogue ${lineIndex + 1} is incomplete`);
  }

  const exercises = [
    ...stage.blocks.flatMap((block) => block.exercises),
    ...stage.checkpoint,
  ];
  for (const exercise of exercises) {
    assert(!exerciseIds.has(exercise.id), `Duplicate exercise ID: ${exercise.id}`);
    exerciseIds.add(exercise.id);
    assert(exercise.wordIds.every((id) => knownIds.has(id)), `${exercise.id} credits an unknown word`);
    if (exercise.kind === "choice" || exercise.kind === "listen") {
      assert(exercise.choices.includes(exercise.answer), `${exercise.id} answer is not a choice`);
      assert.equal(new Set(exercise.choices).size, exercise.choices.length, `${exercise.id} has duplicate choices`);
    }
    if (exercise.kind === "match") {
      assert(exercise.pairs.length >= 3 && exercise.pairs.length <= 6, `${exercise.id} needs 3 to 6 pairs`);
      assert.equal(new Set(exercise.pairs.map((pair) => pair.hanzi)).size, exercise.pairs.length, `${exercise.id} repeats hanzi`);
      assert.equal(new Set(exercise.pairs.map((pair) => pair.match)).size, exercise.pairs.length, `${exercise.id} repeats meanings`);
    }
    if (exercise.kind === "order")
      assert(exercise.tiles.length >= 2, `${exercise.id} needs at least two order tiles`);
    if (exercise.kind === "reply") {
      const answers = exercise.answers ?? [exercise.answer];
      assert(answers.length >= 2, `${exercise.id} needs multiple natural answers`);
      for (const answer of answers)
        assert(exercise.choices.some((choice) => choice.hanzi === answer), `${exercise.id} accepted answer is not a choice: ${answer}`);
    }
  }
}

console.log(
  `HSK 2 validation passed: ${HSK2_STAGES.length} lessons, ${HSK2.length} words, ${exerciseIds.size} stable exercises.`,
);
