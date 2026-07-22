import { STAGES, stagesForLevel } from "@/lib/data/stages";
import type { Stage } from "@/lib/data/stages/types";
import type { HskLevel } from "@/lib/hsk";

export interface HanziLessonChunk {
  /** Reuse the canonical stage ID so word ownership and saved progress never drift. */
  id: string;
  level: HskLevel;
  index: number;
  title: string;
  hanziTitle: string;
  goal: string;
  scenario: string;
  wordIds: string[];
  priorWordIds: string[];
  cumulativeWordIds: string[];
  stage: Stage;
}

const HSK1_FOCUS = [
  "Describe people",
  "Talk about family, friends, and pets",
  "Count, give ages, and tell time",
  "Discuss dates and your week",
  "Order food and drinks",
  "Shop and discuss prices",
  "Find places and give directions",
  "Study and use classroom language",
  "Describe weather and make small talk",
  "Recount your daily life",
] as const;

const HSK2_FOCUS = [
  "Navigate to the airport",
  "Check into a hotel",
  "Buy clothes and compare prices",
  "Order at a cafe",
  "Join a birthday celebration",
  "Handle a busy day",
  "Get through a test",
  "Explain illness and ask for help",
  "Make weekend plans",
  "Describe someone in detail",
] as const;

function focusTitle(stage: Stage): string {
  const titles = (stage.level ?? 1) === 1 ? HSK1_FOCUS : HSK2_FOCUS;
  return titles[stage.index - 1] ?? stage.title;
}

function makeChunk(stage: Stage): HanziLessonChunk {
  const level = (stage.level ?? 1) as HskLevel;
  const levelStages = stagesForLevel(level);
  const priorWordIds = levelStages
    .filter((candidate) => candidate.index < stage.index)
    .flatMap((candidate) => candidate.wordIds);
  return {
    id: stage.id,
    level,
    index: stage.index,
    title: focusTitle(stage),
    hanziTitle: stage.hanziTitle,
    goal: stage.goal ?? stage.scenario,
    scenario: stage.scenario,
    wordIds: stage.wordIds,
    priorWordIds,
    cumulativeWordIds: [...priorWordIds, ...stage.wordIds],
    stage,
  };
}

export const HANZI_LESSON_CHUNKS: HanziLessonChunk[] = STAGES.map(makeChunk);

export function hanziLessonsForLevel(level: HskLevel): HanziLessonChunk[] {
  return HANZI_LESSON_CHUNKS.filter((lesson) => lesson.level === level);
}

export function findHanziLesson(id: string): HanziLessonChunk | undefined {
  return HANZI_LESSON_CHUNKS.find((lesson) => lesson.id === id);
}
