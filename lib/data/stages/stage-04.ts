// Generated-content stage: metadata is final; teach/blocks/checkpoint are
// composed by exercise-gen until hand-authored content replaces this file.
// See stage-01.ts for the canonical hand-authored example.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildDefaultContent } from "./exercise-gen";
import type { Stage } from "./types";

const gen = buildDefaultContent(4);

export const stage04: Stage = {
  id: "hsk1-stage-04",
  index: 4,
  title: "Days, dates & your week",
  hanziTitle: "日期",
  scenario: "Making plans — which day, what date, what time of day.",
  description:
    "Say when things happen: today, tomorrow, mornings and afternoons, and how dates and weekdays are built from numbers.",
  wordIds: STAGE_WORD_IDS[4],
  grammarLessonIds: STAGE_GRAMMAR[4],
  dialogue: [],
  teach: gen.teach,
  blocks: gen.blocks,
  checkpoint: gen.checkpoint,
};
