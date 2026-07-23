"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Compass,
  Headphones,
  MessageSquareText,
  Play,
  Shapes,
} from "lucide-react";
import { stagesForLevel } from "@/lib/data/stages";
import { HSK1, HSK2, type HskLevel } from "@/lib/hsk";
import {
  learningGroupsForLevel,
  learningGroupStatus,
  nextLearningAction,
  stagesForLearningGroup,
  type LearningStatus,
} from "@/lib/learning-path";
import {
  hanziLessonStats,
  hanziProficiency,
  loadProgress,
  type HanziProficiencyStatus,
  type ProgressStore,
} from "@/lib/progression";
import { isDue, loadSrs, type SrsStore } from "@/lib/srs";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
const displayFont = "font-[family-name:var(--font-display)]";
const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

const STATUS_META: Record<
  HanziProficiencyStatus,
  { label: string; chip: string }
> = {
  untested: {
    label: "Not tested",
    chip: "border-border bg-card text-muted-foreground",
  },
  started: {
    label: "Started",
    chip: "border-amber-500/30 bg-amber-500/10",
  },
  building: {
    label: "Building",
    chip: "border-sky-500/30 bg-sky-500/10",
  },
  proficient: {
    label: "Proficient",
    chip: "border-emerald-600/40 bg-emerald-600/12",
  },
};

const GROUP_STATUS: Record<
  LearningStatus,
  { label: string; className: string }
> = {
  "not-started": {
    label: "Not started",
    className: "border-border bg-background text-muted-foreground",
  },
  "in-progress": {
    label: "In progress",
    className: "border-amber-600/40 bg-amber-600/10",
  },
  "ready-to-test": {
    label: "Ready to test",
    className: "border-sky-600/40 bg-sky-600/10",
  },
  passed: {
    label: "Passed",
    className: "border-green-700/40 bg-green-700/10",
  },
  "review-suggested": {
    label: "Review suggested",
    className: "border-primary/40 bg-primary/10",
  },
};

export function ProgressDashboard() {
  const [level, setLevel] = useState<HskLevel>(1);
  const [progress, setProgress] = useState<ProgressStore>(EMPTY_PROGRESS);
  const [srs, setSrs] = useState<SrsStore>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setSrs(loadSrs());
    setReady(true);
  }, []);

  const words = level === 1 ? HSK1 : HSK2;
  const groups = useMemo(() => learningGroupsForLevel(level), [level]);
  const stages = useMemo(() => stagesForLevel(level), [level]);
  const action = useMemo(
    () => nextLearningAction(level, progress),
    [level, progress],
  );
  const summary = useMemo(() => {
    const completedLessons = stages.filter(
      (stage) => progress.stages[stage.id]?.completedAt,
    ).length;
    const passedGroups = groups.filter(
      (group) => learningGroupStatus(group, progress) === "passed",
    ).length;
    const proficient = words.filter(
      (word) => hanziProficiency(word.id, progress).status === "proficient",
    ).length;
    const due = words.filter((word) => srs[word.id] && isDue(srs[word.id])).length;
    return { completedLessons, passedGroups, proficient, due };
  }, [groups, progress, srs, stages, words]);

  if (!ready) return <main className="min-h-screen bg-background" />;

  return (
    <main
      className={cn(
        "min-h-screen overflow-hidden pb-28 pt-10 text-foreground sm:pt-14",
        level === 1 ? "level-hsk1" : "level-hsk2",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="poster-hero relative overflow-hidden border border-foreground bg-card">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-7 -top-14 text-[17rem] leading-none opacity-[0.07]",
              hanziFont,
            )}
          >
            路
          </span>
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="font-[family-name:var(--font-hand)] text-xl text-primary">
                one clear next step
              </p>
              <h1 className={cn("mt-2 text-4xl font-bold sm:text-6xl", displayFont)}>
                Your learning path
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Work through practical topic chapters or open any lesson. Progress
                records what you can recognize, hear, and use without turning
                the curriculum into a lock.
              </p>
            </div>
            <div className="border-t border-foreground bg-foreground p-7 text-background lg:border-l lg:border-t-0 lg:p-9">
              <div className="flex items-center justify-between">
                <Compass className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  HSK {level}
                </span>
              </div>
              <p className={cn("mt-9 text-6xl leading-none text-primary", hanziFont)}>
                {groups.length}章
              </p>
              <p className="mt-3 text-2xl font-bold">
                {summary.passedGroups} / {groups.length} chapters passed
              </p>
              <p className="mt-1 text-sm opacity-75">
                {summary.completedLessons}/{stages.length} lessons · {summary.proficient}/{words.length} Hanzi proficient
              </p>
            </div>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-foreground py-4">
          <div
            className="inline-flex border border-foreground"
            role="group"
            aria-label="Progress level"
          >
            {([1, 2] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={level === value}
                onClick={() => setLevel(value)}
                className={cn(
                  "min-h-11 px-5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  value === 2 && "border-l border-foreground",
                  level === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary",
                )}
              >
                HSK {value}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {groups.length} chapters · {stages.length} open lessons
          </p>
        </div>

        <section className="poster-panel mt-8 grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Recommended now · {action.eyebrow}
            </p>
            <h2 className={cn("mt-2 text-3xl font-bold sm:text-4xl", displayFont)}>
              {action.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {action.description}
            </p>
          </div>
          <Link href={action.href} className="stamp-button group">
            {action.kind === "lesson" ? <Play className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
            {action.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        <section className="mt-14">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-[family-name:var(--font-hand)] text-xl text-primary">
                smaller lessons inside practical topics
              </p>
              <h2 className={cn("mt-1 text-3xl font-bold sm:text-4xl", displayFont)}>
                HSK {level} chapters
              </h2>
            </div>
            {level === 1 && (
              <Link
                href="/practice-tests"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                All HSK 1 practice tests <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <ol className="mt-7 space-y-5">
            {groups.map((group) => {
              const groupStages = stagesForLearningGroup(group);
              const groupWordIds = groupStages.flatMap((stage) => stage.wordIds);
              const stats = hanziLessonStats(groupWordIds, progress);
              const status = learningGroupStatus(group, progress);
              const completed = groupStages.filter(
                (stage) => progress.stages[stage.id]?.completedAt,
              ).length;
              return (
                <li key={group.id}>
                  <article className="eave-panel overflow-hidden">
                    <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
                      <div className="relative border-b border-foreground p-6 sm:p-8 lg:border-b-0 lg:border-r">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -right-2 -top-8 text-[9rem] leading-none opacity-[0.055]",
                            hanziFont,
                          )}
                        >
                          {group.hanziTitle.slice(0, 1)}
                        </span>
                        <div className="relative flex items-center justify-between gap-4">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            Chapter {group.index}
                          </p>
                          <span
                            className={cn(
                              "border px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide",
                              GROUP_STATUS[status].className,
                            )}
                          >
                            {GROUP_STATUS[status].label}
                          </span>
                        </div>
                        <h3 className={cn("relative mt-4 text-2xl font-bold", displayFont)}>
                          {group.title}
                        </h3>
                        <p className={cn("relative mt-1 text-3xl text-primary", hanziFont)}>
                          {group.hanziTitle}
                        </p>
                        <p className="relative mt-4 text-sm leading-6 text-muted-foreground">
                          {group.outcome}
                        </p>
                        <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-foreground/15 pt-4 text-center">
                          <MiniStat label="Lessons" value={`${completed}/2`} />
                          <MiniStat label="Hanzi" value={`${stats.proficient}/${stats.total}`} />
                          <MiniStat label="Evidence" value={`${stats.score}%`} />
                        </div>
                      </div>

                      <div className="p-5 sm:p-7">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {groupStages.map((stage) => {
                            const stageProgress = progress.stages[stage.id];
                            const stageComplete = Boolean(stageProgress?.completedAt);
                            const started = Boolean(
                              stageProgress?.dialogueViewed ||
                                stageProgress?.blocksDone.length ||
                                stageProgress?.checkpointBest,
                            );
                            return (
                              <Link
                                key={stage.id}
                                href={`/lessons/${stage.id}`}
                                className="group min-h-40 border border-foreground/20 bg-background p-4 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                    Lesson {stage.index}
                                  </span>
                                  {stageComplete && <Check className="h-4 w-4 text-green-700" />}
                                </div>
                                <p className={cn("mt-4 text-2xl text-primary", hanziFont)}>
                                  {stage.hanziTitle}
                                </p>
                                <p className={cn("mt-1 font-bold", displayFont)}>
                                  {stage.title}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold">
                                  {stageComplete ? "Review" : started ? "Continue" : "Start"}
                                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {group.assessmentId && (
                          <Link
                            href={`/practice-tests?test=${group.assessmentId}`}
                            className="group mt-3 flex min-h-16 items-center justify-between gap-4 border border-foreground bg-[oklch(var(--poster-yellow)/0.16)] px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span className="flex items-center gap-3">
                              <ClipboardCheck className="h-5 w-5 text-primary" />
                              <span>
                                <strong className="block text-sm">
                                  {status === "passed"
                                    ? "Chapter test passed"
                                    : status === "ready-to-test"
                                      ? "Chapter test ready"
                                      : "Chapter practice test"}
                                </strong>
                                <small className="text-xs text-muted-foreground">
                                  16 mixed questions · always open
                                </small>
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <SecondaryAction
            icon={Clock3}
            title={`${summary.due} optional reviews due`}
            description="Review previously seen forms without blocking the recommended path."
            href="/flashcards"
            label="Open reviews"
          />
          <SecondaryAction
            icon={MessageSquareText}
            title="Practice a live role"
            description="Use what you know with a waiter, sales associate, teacher, driver, or hotel clerk."
            href="/conversation"
            label="Open role calls"
          />
        </section>

        <details className="mt-12 border border-foreground bg-card">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-7">
            <span className="flex items-center gap-3">
              <Shapes className="h-5 w-5 text-primary" />
              Detailed HSK {level} Hanzi evidence
            </span>
            <ChevronDown className="h-4 w-4" />
          </summary>
          <div className="border-t border-foreground p-5 sm:p-7">
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              This diagnostic map is available when you want detail. It is not
              the starting point and does not control lesson access.
            </p>
            <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10">
              {words.map((word) => {
                const proficiency = hanziProficiency(word.id, progress);
                return (
                  <Link
                    key={word.id}
                    href={`/hanzi?word=${word.id}`}
                    title={`${word.pinyin}: ${word.meaning}. ${STATUS_META[proficiency.status].label}`}
                    aria-label={`${word.hanzi}, ${word.pinyin}, ${word.meaning}: ${STATUS_META[proficiency.status].label}`}
                    className={cn(
                      "border px-2 py-3 text-center hover:-translate-y-0.5",
                      STATUS_META[proficiency.status].chip,
                    )}
                  >
                    <span className={cn("block text-2xl", hanziFont)}>
                      {word.hanzi}
                    </span>
                    <span className="mt-1 block truncate text-[0.62rem] text-muted-foreground">
                      {word.pinyin}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <strong className="block text-sm">{value}</strong>
      <small className="text-[0.62rem] uppercase tracking-wide text-muted-foreground">
        {label}
      </small>
    </span>
  );
}

function SecondaryAction({
  icon: Icon,
  title,
  description,
  href,
  label,
}: {
  icon: typeof Headphones;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-foreground bg-card p-5 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="h-5 w-5 text-primary" />
      <h3 className={cn("mt-3 text-xl font-bold", displayFont)}>{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold">
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
