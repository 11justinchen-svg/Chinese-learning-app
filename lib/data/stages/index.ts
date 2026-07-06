// Stage registry — owned by the foundation. Content workers rewrite their own
// stage-NN.ts file and never touch this one.
import type { Stage } from "./types";
import { stage01 } from "./stage-01";
import { stage02 } from "./stage-02";
import { stage03 } from "./stage-03";
import { stage04 } from "./stage-04";
import { stage05 } from "./stage-05";
import { stage06 } from "./stage-06";
import { stage07 } from "./stage-07";
import { stage08 } from "./stage-08";
import { stage09 } from "./stage-09";
import { stage10 } from "./stage-10";

export const STAGES: Stage[] = [
  stage01,
  stage02,
  stage03,
  stage04,
  stage05,
  stage06,
  stage07,
  stage08,
  stage09,
  stage10,
].sort((a, b) => a.index - b.index);

export function findStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}

export function stageForWord(wordId: string): Stage | undefined {
  return STAGES.find((s) => s.wordIds.includes(wordId));
}
