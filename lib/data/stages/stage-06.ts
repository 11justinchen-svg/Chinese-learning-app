// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(6);

export const stage06: Stage = {
  id: "hsk1-stage-06",
  index: 6,
  title: "Shopping & money",
  hanziTitle: "买东西",
  scenario: "In a shop — prices, sizes, too big and too expensive.",
  description:
    "Ask how much things cost, compare big and small, and react like a native: 太……了 for anything that's just too much.",
  wordIds: STAGE_WORD_IDS[6],
  grammarLessonIds: STAGE_GRAMMAR[6],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
