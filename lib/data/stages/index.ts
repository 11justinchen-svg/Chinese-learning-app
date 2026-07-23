import type { Stage } from "./types";
import {
  HSK3_LEVEL_1_STAGES,
  HSK3_LEVEL_2_STAGES,
} from "./hsk3";

/**
 * Canonical HSK 3.0 (2025 syllabus) stage registry.
 *
 * Legacy word IDs are preserved in the vocabulary migration when the written
 * form remains in the official roster. New lesson IDs intentionally use an
 * HSK3 prefix so an old completion record cannot complete different content.
 */
export const HSK1_STAGES: Stage[] = HSK3_LEVEL_1_STAGES;
export const HSK2_STAGES: Stage[] = HSK3_LEVEL_2_STAGES;
export const STAGES: Stage[] = [...HSK1_STAGES, ...HSK2_STAGES];

export function stagesForLevel(level: 1 | 2): Stage[] {
  return level === 1 ? HSK1_STAGES : HSK2_STAGES;
}

export function findStage(id: string): Stage | undefined {
  return STAGES.find((stage) => stage.id === id);
}

export function stageForWord(wordId: string): Stage | undefined {
  return STAGES.find((stage) => stage.wordIds.includes(wordId));
}
