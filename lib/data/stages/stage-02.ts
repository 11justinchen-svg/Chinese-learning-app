// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(2);

export const stage02: Stage = {
  id: "hsk1-stage-02",
  index: 2,
  title: "Family & the people around you",
  hanziTitle: "家人",
  scenario: "Showing a friend a photo of your family and pets.",
  description:
    "Talk about who's in your family and what you have — 的 marks possession, and 有/没有 says what you have or don't.",
  wordIds: STAGE_WORD_IDS[2],
  grammarLessonIds: STAGE_GRAMMAR[2],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
