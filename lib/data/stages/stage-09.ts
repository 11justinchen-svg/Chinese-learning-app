// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(9);

export const stage09: Stage = {
  id: "hsk1-stage-09",
  index: 9,
  title: "Weather & small talk",
  hanziTitle: "聊天",
  scenario: "Polite chit-chat — weather, feelings, apologies.",
  description:
    "The social glue: hot and cold weather, 很 to describe things, and the polite trio 对不起 / 没关系 / 不客气.",
  wordIds: STAGE_WORD_IDS[9],
  grammarLessonIds: STAGE_GRAMMAR[9],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
