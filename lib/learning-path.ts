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
  stageIds: string[];
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

function groupsForLevel(level: HskLevel): LearningGroup[] {
  const groups: LearningGroup[] = [];
  for (const stage of stagesForLevel(level)) {
    const previous = groups.at(-1);
    if (previous?.hanziTitle === stage.hanziTitle) {
      previous.stageIds.push(stage.id);
      continue;
    }
    const index = groups.length + 1;
    const slug = stage.hanziTitle
      .split("")
      .map((character) => character.codePointAt(0)?.toString(16))
      .join("-");
    groups.push({
      id: `hsk3-l${level}-group-${String(index).padStart(2, "0")}-${slug}`,
      level,
      index,
      title: stage.title.replace(/\s·\s\d+$/u, ""),
      hanziTitle: stage.hanziTitle,
      description: stage.scenario,
      outcome: stage.goal ?? stage.scenario,
      stageIds: [stage.id],
      assessmentId:
        level === 1
          ? `hsk3-l1-group-${String(index).padStart(2, "0")}`
          : undefined,
    });
  }
  return groups;
}

export const LEARNING_GROUPS: LearningGroup[] = [
  ...groupsForLevel(1),
  ...groupsForLevel(2),
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
