// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(5);

export const stage05: Stage = {
  id: "hsk1-stage-05",
  index: 5,
  title: "Ordering food & drink",
  hanziTitle: "吃饭",
  scenario: "At a restaurant — likes, wants, ordering for two.",
  description:
    "Order like you mean it: 想 for what you'd like, 喜欢 for what you love, and time words in the right spot in the sentence.",
  wordIds: STAGE_WORD_IDS[5],
  grammarLessonIds: STAGE_GRAMMAR[5],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
