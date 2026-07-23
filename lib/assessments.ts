import { STAGES } from "@/lib/data/stages";
import type { Exercise, ExerciseKind, Stage } from "@/lib/data/stages/types";
import {
  learningGroupsForLevel,
  stagesForLearningGroup,
} from "@/lib/learning-path";

export type AssessmentKind = "group" | "practice";

export interface LearningAssessment {
  id: string;
  level: 1;
  kind: AssessmentKind;
  title: string;
  hanziTitle: string;
  description: string;
  outcome: string;
  stageIds: string[];
  estimatedMinutes: number;
  support: "guided" | "reduced";
  passRatio: number;
  exercises: Exercise[];
}

const TARGET_KINDS: ExerciseKind[] = [
  "listen",
  "choice",
  "match",
  "cloze",
  "order",
  "reply",
];

function cloneExercise(
  exercise: Exercise,
  assessmentId: string,
  index: number,
): Exercise {
  return {
    ...exercise,
    id: `${assessmentId}-${String(index + 1).padStart(2, "0")}`,
  };
}

function reduceSupport(exercise: Exercise): Exercise {
  if (exercise.kind === "choice")
    return { ...exercise, questionPinyin: undefined };
  if (exercise.kind === "order") return { ...exercise, pinyin: undefined };
  if (exercise.kind === "reply")
    return {
      ...exercise,
      choices: exercise.choices.map((choice) => ({
        ...choice,
        pinyin: "",
      })),
    };
  return exercise;
}

function balancedExercises(stage: Stage, count: number, offset = 0): Exercise[] {
  const sources = [
    ...stage.checkpoint,
    ...stage.blocks.flatMap((block) => block.exercises),
  ];
  const selected: Exercise[] = [];
  const used = new Set<string>();

  for (let shift = 0; shift < TARGET_KINDS.length; shift += 1) {
    const kind = TARGET_KINDS[(shift + offset) % TARGET_KINDS.length];
    const exercise = sources.find(
      (candidate) => candidate.kind === kind && !used.has(candidate.id),
    );
    if (exercise) {
      selected.push(exercise);
      used.add(exercise.id);
    }
  }

  for (let index = 0; selected.length < count && index < sources.length; index += 1) {
    const exercise = sources[(index + offset) % sources.length];
    if (!used.has(exercise.id)) {
      selected.push(exercise);
      used.add(exercise.id);
    }
  }

  return selected.slice(0, count);
}

function evenlySample(items: Exercise[], count: number): Exercise[] {
  if (items.length <= count) return items;
  return Array.from({ length: count }, (_, index) => {
    const at = Math.floor((index * items.length) / count);
    return items[at];
  });
}

function makeGroupAssessments(): LearningAssessment[] {
  return learningGroupsForLevel(1).map((group) => {
    const stages = stagesForLearningGroup(group);
    const candidates = stages
      .flatMap((stage, stageIndex) =>
        balancedExercises(stage, 8, group.index + stageIndex),
      );
    const exercises = evenlySample(candidates, 20)
      .map((exercise, index) =>
        cloneExercise(exercise, group.assessmentId!, index),
      );
    return {
      id: group.assessmentId!,
      level: 1,
      kind: "group",
      title: `${group.title} practice test`,
      hanziTitle: group.hanziTitle,
      description: `A cumulative check across HSK 1 Lessons ${stages
        .map((stage) => stage.index)
        .join(", ")}.`,
      outcome: group.outcome,
      stageIds: [...group.stageIds],
      estimatedMinutes: 12,
      support: "guided",
      passRatio: 0.8,
      exercises,
    };
  });
}

function makePracticeAssessment(
  id: "hsk1-practice-a" | "hsk1-practice-b",
  offset: number,
): LearningAssessment {
  const stages = STAGES.filter((stage) => stage.level === 1);
  const candidates = stages
    .flatMap((stage, stageIndex) =>
      balancedExercises(stage, 2, offset + stageIndex),
    );
  const exercises = evenlySample(candidates, 40)
    .map((exercise, index) =>
      cloneExercise(
        id.endsWith("-b") ? reduceSupport(exercise) : exercise,
        id,
        index,
      ),
    );
  const form = id.endsWith("-a") ? "A" : "B";
  return {
    id,
    level: 1,
    kind: "practice",
    title: `HSK 1 Practice Test ${form}`,
    hanziTitle: form === "A" ? "一级综合甲" : "一级综合乙",
    description:
      form === "A"
        ? "A comprehensive guided form sampling the complete HSK 3.0 Level 1 path."
        : "An alternate comprehensive form with fewer support cues.",
    outcome:
      "Understand and produce useful HSK 1 Mandarin across unfamiliar mixed situations.",
    stageIds: stages.map((stage) => stage.id),
    estimatedMinutes: 30,
    support: form === "A" ? "guided" : "reduced",
    passRatio: 0.8,
    exercises,
  };
}

export const HSK1_ASSESSMENTS: LearningAssessment[] = [
  ...makeGroupAssessments(),
  makePracticeAssessment("hsk1-practice-a", 1),
  makePracticeAssessment("hsk1-practice-b", 4),
];

export function findAssessment(id: string): LearningAssessment | undefined {
  return HSK1_ASSESSMENTS.find((assessment) => assessment.id === id);
}
