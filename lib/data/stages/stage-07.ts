// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(7);

export const stage07: Stage = {
  id: "hsk1-stage-07",
  index: 7,
  title: "Getting around: where things are",
  hanziTitle: "在哪儿",
  scenario: "Asking where someone lives and how to get to the station.",
  description:
    "在 tells you where things are and where actions happen — enough to ask directions, take a taxi, and find the train station.",
  wordIds: STAGE_WORD_IDS[7],
  grammarLessonIds: STAGE_GRAMMAR[7],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
