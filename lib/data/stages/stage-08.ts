// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(8);

export const stage08: Stage = {
  id: "hsk1-stage-08",
  index: 8,
  title: "Study, school & language",
  hanziTitle: "学习",
  scenario: "In class — what you can do and what you're learning.",
  description:
    "Read, write, listen and speak — plus 会 and 能 for what you're able to do, and 都 to say everyone's doing it.",
  wordIds: STAGE_WORD_IDS[8],
  grammarLessonIds: STAGE_GRAMMAR[8],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
