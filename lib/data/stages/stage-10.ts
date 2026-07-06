// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(10);

export const stage10: Stage = {
  id: "hsk1-stage-10",
  index: 10,
  title: "A day in your life",
  hanziTitle: "生活",
  scenario: "A phone call about your day — the boss stage.",
  description:
    "Phone calls, movies, sleep and the doctor — plus 了 for things already done. The checkpoint reviews everything you've learned.",
  wordIds: STAGE_WORD_IDS[10],
  grammarLessonIds: STAGE_GRAMMAR[10],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
