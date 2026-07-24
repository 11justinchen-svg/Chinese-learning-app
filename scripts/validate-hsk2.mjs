import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { HSK1, HSK2 } from "../lib/hsk.ts";
import { HSK2_STAGES } from "../lib/data/stages/index.ts";

assert.equal(HSK1.length + HSK2.length, 500);
assert(HSK2_STAGES.length > 10, "The deeper Level 2 path should use focused lessons");

const aihao = HSK2.find((word) => word.hanzi === "爱好");
assert(aihao, "HSK 2 needs 爱好");
assert.match(aihao.meaning, /hobby/i, "爱好 should lead with its common hobby sense");
assert.match(
  aihao.usageNote ?? "",
  /喜欢/,
  "爱好 guidance should contrast the everyday verb 喜欢",
);
assert(
  (aihao.examples?.length ?? 0) >= 2,
  "爱好 needs examples for its noun and verb uses",
);

for (const word of [...HSK1, ...HSK2]) {
  for (const character of word.characters) {
    assert(character.pinyin, `${word.id}/${character.char} needs pinyin`);
    assert(character.components.length > 0, `${word.id}/${character.char} needs a component note`);
    assert(
      existsSync(join(process.cwd(), "public/hanzi-data", `${character.char}.json`)),
      `${word.id}/${character.char} needs bundled stroke data`,
    );
  }
}

console.log(
  `HSK 3.0 data validation passed: 300 Level 1 + 200 Level 2 words, ${HSK2_STAGES.length} focused Level 2 lessons, offline stroke data present.`,
);
