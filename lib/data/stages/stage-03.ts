// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(3);

export const stage03: Stage = {
  id: "hsk1-stage-03",
  index: 3,
  title: "Counting, age & the clock",
  hanziTitle: "数字",
  scenario: "Exchanging ages, counting things, reading the clock.",
  description:
    "The numbers 0–10 unlock ages, prices, and times — and Chinese counts nouns with measure words like 个 and 岁.",
  wordIds: STAGE_WORD_IDS[3],
  grammarLessonIds: STAGE_GRAMMAR[3],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
