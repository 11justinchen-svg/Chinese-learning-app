import { stagesForLevel } from "@/lib/data/stages";
import type { Stage } from "@/lib/data/stages/types";
import type { HskLevel } from "@/lib/hsk";
import type { ProgressStore } from "@/lib/progression";

export interface LearningGroup {
  id: string;
  level: HskLevel;
  index: number;
  title: string;
  hanziTitle: string;
  description: string;
  outcome: string;
  stageIds: [string, string];
  assessmentId?: string;
}

export type LearningStatus =
  | "not-started"
  | "in-progress"
  | "ready-to-test"
  | "passed"
  | "review-suggested";

export interface NextLearningAction {
  kind: "lesson" | "group-test" | "practice-test" | "complete";
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  href: string;
}

export const LEARNING_GROUPS: LearningGroup[] = [
  {
    id: "hsk1-people",
    level: 1,
    index: 1,
    title: "People",
    hanziTitle: "认识人",
    description: "Meet someone, identify people, and talk about family.",
    outcome: "Introduce yourself and describe the people around you.",
    stageIds: ["hsk1-stage-01", "hsk1-stage-02"],
    assessmentId: "hsk1-group-people",
  },
  {
    id: "hsk1-time",
    level: 1,
    index: 2,
    title: "Numbers and time",
    hanziTitle: "数字时间",
    description: "Count, give ages, tell time, and discuss dates.",
    outcome: "Arrange a simple time and understand when something happens.",
    stageIds: ["hsk1-stage-03", "hsk1-stage-04"],
    assessmentId: "hsk1-group-time",
  },
  {
    id: "hsk1-daily-needs",
    level: 1,
    index: 3,
    title: "Daily needs",
    hanziTitle: "日常需要",
    description: "Order food, choose items, and handle simple prices.",
    outcome: "Complete a short restaurant or shopping exchange.",
    stageIds: ["hsk1-stage-05", "hsk1-stage-06"],
    assessmentId: "hsk1-group-daily-needs",
  },
  {
    id: "hsk1-places-study",
    level: 1,
    index: 4,
    title: "Places and study",
    hanziTitle: "地点学习",
    description: "Find places, ask where things are, and use classroom language.",
    outcome: "Navigate a place and handle a basic classroom interaction.",
    stageIds: ["hsk1-stage-07", "hsk1-stage-08"],
    assessmentId: "hsk1-group-places-study",
  },
  {
    id: "hsk1-everyday-life",
    level: 1,
    index: 5,
    title: "Everyday life",
    hanziTitle: "日常生活",
    description: "Talk about weather, plans, and completed daily activities.",
    outcome: "Keep small talk moving and recount a simple day.",
    stageIds: ["hsk1-stage-09", "hsk1-stage-10"],
    assessmentId: "hsk1-group-everyday-life",
  },
  {
    id: "hsk2-arrival",
    level: 2,
    index: 1,
    title: "Arrival",
    hanziTitle: "到达",
    description: "Navigate airport travel and check into a hotel.",
    outcome: "Reach a destination and complete a basic check-in.",
    stageIds: ["hsk2-stage-01", "hsk2-stage-02"],
  },
  {
    id: "hsk2-shopping-dining",
    level: 2,
    index: 2,
    title: "Shopping and dining",
    hanziTitle: "买东西吃饭",
    description: "Compare clothes and manage a longer café order.",
    outcome: "Make choices, compare options, and clarify what you want.",
    stageIds: ["hsk2-stage-03", "hsk2-stage-04"],
  },
  {
    id: "hsk2-social-work",
    level: 2,
    index: 3,
    title: "Social life and work",
    hanziTitle: "社交工作",
    description: "Join a celebration and explain a busy working day.",
    outcome: "Participate socially and describe what is happening now.",
    stageIds: ["hsk2-stage-05", "hsk2-stage-06"],
  },
  {
    id: "hsk2-study-health",
    level: 2,
    index: 4,
    title: "Study and health",
    hanziTitle: "学习健康",
    description: "Handle a test and explain when you need medical help.",
    outcome: "Ask for clarification and communicate a simple health problem.",
    stageIds: ["hsk2-stage-07", "hsk2-stage-08"],
  },
  {
    id: "hsk2-plans-people",
    level: 2,
    index: 5,
    title: "Plans and people",
    hanziTitle: "计划人物",
    description: "Make weekend plans and describe someone in more detail.",
    outcome: "Coordinate an activity and give a useful personal description.",
    stageIds: ["hsk2-stage-09", "hsk2-stage-10"],
  },
];

export function learningGroupsForLevel(level: HskLevel): LearningGroup[] {
  return LEARNING_GROUPS.filter((group) => group.level === level);
}

export function stagesForLearningGroup(group: LearningGroup): Stage[] {
  const stageById = new Map(
    stagesForLevel(group.level).map((stage) => [stage.id, stage]),
  );
  return group.stageIds
    .map((id) => stageById.get(id))
    .filter((stage): stage is Stage => Boolean(stage));
}

export function assessmentPassed(
  progress: ProgressStore,
  assessmentId: string,
  passRatio = 0.8,
): boolean {
  const best = progress.assessments?.[assessmentId]?.best;
  return Boolean(best && best.score / best.total >= passRatio);
}

export function learningGroupStatus(
  group: LearningGroup,
  progress: ProgressStore,
): LearningStatus {
  const stages = stagesForLearningGroup(group);
  const complete = stages.filter(
    (stage) => progress.stages[stage.id]?.completedAt,
  ).length;
  if (
    group.assessmentId &&
    assessmentPassed(progress, group.assessmentId)
  )
    return "passed";
  if (complete === stages.length && group.assessmentId) return "ready-to-test";
  if (complete === stages.length) return "passed";
  const attempted = stages.some((stage) => {
    const stageProgress = progress.stages[stage.id];
    return Boolean(
      stageProgress?.dialogueViewed ||
        stageProgress?.blocksDone.length ||
        stageProgress?.checkpointBest,
    );
  });
  return attempted || complete > 0 ? "in-progress" : "not-started";
}

export function nextLearningAction(
  level: HskLevel,
  progress: ProgressStore,
): NextLearningAction {
  const groups = learningGroupsForLevel(level);
  const levelStages = stagesForLevel(level);
  const activeStage = levelStages.find((stage) => {
    const stageProgress = progress.stages[stage.id];
    return Boolean(
      !stageProgress?.completedAt &&
        (stageProgress?.dialogueViewed ||
          stageProgress?.blocksDone.length ||
          stageProgress?.checkpointBest),
    );
  });

  if (activeStage) {
    const group = groups.find((candidate) =>
      candidate.stageIds.includes(activeStage.id),
    );
    return {
      kind: "lesson",
      eyebrow: `${group?.title ?? `HSK ${level}`} · Lesson ${activeStage.index}`,
      title: activeStage.title,
      description:
        "Resume the conversation, Hanzi, grammar, and reply sequence where you left it.",
      label: "Continue lesson",
      href: `/lessons/${activeStage.id}`,
    };
  }

  for (const group of groups) {
    const stages = stagesForLearningGroup(group);
    const incomplete = stages.find(
      (stage) => !progress.stages[stage.id]?.completedAt,
    );
    if (incomplete) {
      return {
        kind: "lesson",
        eyebrow: `${group.title} · Lesson ${incomplete.index}`,
        title: incomplete.title,
        description: incomplete.goal ?? incomplete.scenario,
        label: "Start lesson",
        href: `/lessons/${incomplete.id}`,
      };
    }
    if (
      group.assessmentId &&
      !assessmentPassed(progress, group.assessmentId)
    ) {
      const attempted = progress.assessments?.[group.assessmentId];
      return {
        kind: "group-test",
        eyebrow: `${group.title} · cumulative check`,
        title: attempted ? `Retry ${group.title}` : `Test ${group.title}`,
        description: attempted
          ? "Use the result to repair the specific listening, Hanzi, grammar, or reply misses."
          : `Mix both ${group.title.toLowerCase()} lessons in one short first-attempt check.`,
        label: attempted ? "Review result and retry" : "Take group test",
        href: `/practice-tests?test=${group.assessmentId}`,
      };
    }
  }

  if (level === 1) {
    for (const id of ["hsk1-practice-a", "hsk1-practice-b"]) {
      if (!assessmentPassed(progress, id)) {
        const form = id.endsWith("-a") ? "A" : "B";
        return {
          kind: "practice-test",
          eyebrow: `HSK 1 Practice Test ${form}`,
          title:
            form === "A"
              ? "Bring the whole level together"
              : "Try it with less support",
          description:
            form === "A"
              ? "A comprehensive listening, reading, sentence, grammar, and reply practice test."
              : "An alternate comprehensive form with reduced scaffolding.",
          label: `Start Practice Test ${form}`,
          href: `/practice-tests?test=${id}`,
        };
      }
    }
  }

  return {
    kind: "complete",
    eyebrow: `HSK ${level} path`,
    title: "Choose what is useful next",
    description:
      "The recommended route is complete. Revisit a chapter, practice due forms, or keep speaking in a role call.",
    label: "Open role calls",
    href: "/conversation",
  };
}
