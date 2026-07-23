"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Clock3,
  Headphones,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import {
  HSK1_ASSESSMENTS,
  findAssessment,
  type LearningAssessment,
} from "@/lib/assessments";
import type { ExerciseKind } from "@/lib/data/stages/types";
import {
  loadProgress,
  recordAssessment,
  saveProgress,
  type AssessmentAttempt,
  type ProgressStore,
} from "@/lib/progression";
import {
  ExercisePlayer,
  type PlayerResults,
} from "@/components/exercises/exercise-player";
import { cn } from "@/lib/utils";

const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };
const displayFont = "font-[family-name:var(--font-display)]";
const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
const GROUP_ASSESSMENT_COUNT = HSK1_ASSESSMENTS.filter(
  (assessment) => assessment.kind === "group",
).length;
const COMPREHENSIVE_ASSESSMENT_COUNT = HSK1_ASSESSMENTS.filter(
  (assessment) => assessment.kind === "practice",
).length;

const KIND_LABELS: Record<ExerciseKind, string> = {
  choice: "Meaning",
  match: "Connections",
  listen: "Listening",
  cloze: "Grammar",
  order: "Sentence building",
  reply: "Useful replies",
};

type View = "overview" | "quiz" | "result" | "repair";

function buildAttempt(
  assessment: LearningAssessment,
  results: PlayerResults,
): AssessmentAttempt {
  const answerById = new Map(
    results.answers.map((answer) => [answer.exerciseId, answer.correct]),
  );
  const byKind: AssessmentAttempt["byKind"] = {};
  for (const exercise of assessment.exercises) {
    const current = byKind[exercise.kind] ?? { score: 0, total: 0 };
    byKind[exercise.kind] = {
      score: current.score + (answerById.get(exercise.id) ? 1 : 0),
      total: current.total + 1,
    };
  }
  return {
    score: results.firstTryCorrect,
    total: results.total,
    completedAt: Date.now(),
    byKind,
    missedExerciseIds: results.answers
      .filter((answer) => !answer.correct)
      .map((answer) => answer.exerciseId),
  };
}

export function AssessmentHub({
  initialAssessmentId,
}: {
  initialAssessmentId?: string;
}) {
  const router = useRouter();
  const initial =
    findAssessment(initialAssessmentId ?? "") ?? HSK1_ASSESSMENTS[0];
  const [selectedId, setSelectedId] = useState(initial.id);
  const [view, setView] = useState<View>("overview");
  const [progress, setProgress] = useState<ProgressStore>(EMPTY_PROGRESS);
  const [sessionResult, setSessionResult] = useState<AssessmentAttempt | null>(
    null,
  );
  const assessment = findAssessment(selectedId) ?? HSK1_ASSESSMENTS[0];

  useEffect(() => setProgress(loadProgress()), []);

  const repairExercises = useMemo(() => {
    const missed = new Set(
      sessionResult?.missedExerciseIds ??
        progress.assessments?.[assessment.id]?.last.missedExerciseIds ??
        [],
    );
    return assessment.exercises.filter((exercise) => missed.has(exercise.id));
  }, [assessment, progress, sessionResult]);

  function chooseAssessment(id: string) {
    setSelectedId(id);
    setView("overview");
    setSessionResult(null);
    router.replace(`/practice-tests?test=${id}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishAssessment(results: PlayerResults) {
    const attempt = buildAttempt(assessment, results);
    const next = recordAssessment(loadProgress(), assessment.id, attempt);
    saveProgress(next);
    setProgress(next);
    setSessionResult(attempt);
    setView("result");
  }

  const stored = progress.assessments?.[assessment.id];
  const result = sessionResult ?? stored?.last ?? null;
  const passed = Boolean(
    result && result.score / result.total >= assessment.passRatio,
  );

  if (view === "quiz") {
    return (
      <main className="min-h-screen bg-background px-5 pb-24 pt-12 text-foreground sm:px-8">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => setView("overview")}
            className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Leave test
          </button>
          <ExercisePlayer
            key={`${assessment.id}-quiz`}
            title={assessment.title}
            exercises={assessment.exercises}
            mode="quiz"
            onFinish={finishAssessment}
          />
        </div>
      </main>
    );
  }

  if (view === "repair" && repairExercises.length > 0) {
    return (
      <main className="min-h-screen bg-background px-5 pb-24 pt-12 text-foreground sm:px-8">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => setView("result")}
            className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to result
          </button>
          <ExercisePlayer
            key={`${assessment.id}-repair`}
            title={`${assessment.title} · repair misses`}
            exercises={repairExercises}
            mode="practice"
            onFinish={() => setView("result")}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28 pt-10 text-foreground sm:pt-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="poster-hero relative overflow-hidden border border-foreground bg-card">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-8 -top-14 text-[16rem] leading-none opacity-[0.07]",
              hanziFont,
            )}
          >
            试
          </span>
          <div className="relative p-7 sm:p-10 lg:p-12">
            <p className="font-[family-name:var(--font-hand)] text-xl text-primary">
              short checks, useful repairs
            </p>
            <h1 className={cn("mt-2 max-w-4xl text-4xl font-bold sm:text-6xl", displayFont)}>
              HSK 1 practice tests
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Test one practical topic chapter or mix the whole level. Every
              test is open, records first-attempt evidence, and points misses
              back to immediate practice.
            </p>
          </div>
        </header>

        <div className="mt-9 grid gap-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="border border-foreground bg-card p-4">
              <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {GROUP_ASSESSMENT_COUNT} topic chapters ·{" "}
                {COMPREHENSIVE_ASSESSMENT_COUNT} full forms
              </p>
              <div className="grid gap-2">
                {HSK1_ASSESSMENTS.map((item) => {
                  const itemProgress = progress.assessments?.[item.id];
                  const itemPassed = Boolean(
                    itemProgress &&
                      itemProgress.best.score / itemProgress.best.total >=
                        item.passRatio,
                  );
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={item.id === assessment.id}
                      onClick={() => chooseAssessment(item.id)}
                      className={cn(
                        "min-h-16 border px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        item.id === assessment.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/50",
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <strong className="text-sm">{item.title}</strong>
                        {itemPassed && <Check className="h-4 w-4" />}
                      </span>
                      <small
                        className={cn(
                          "mt-1 block text-xs",
                          item.id === assessment.id
                            ? "text-primary-foreground/75"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.exercises.length} questions · {item.estimatedMinutes} min
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section>
            <div className="eave-panel overflow-hidden p-6 sm:p-9">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {assessment.kind === "group"
                      ? "Topic-chapter cumulative check"
                      : "Whole-level comprehensive form"}
                  </p>
                  <h2 className={cn("mt-2 text-3xl font-bold sm:text-4xl", displayFont)}>
                    {assessment.title}
                  </h2>
                  <p className={cn("mt-1 text-4xl text-primary", hanziFont)}>
                    {assessment.hanziTitle}
                  </p>
                </div>
                {stored && (
                  <span className="border border-foreground bg-background px-3 py-2 text-xs font-bold">
                    Best {stored.best.score}/{stored.best.total}
                  </span>
                )}
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                {assessment.description} Goal: {assessment.outcome}
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                <InfoChip icon={ClipboardCheck} label={`${assessment.exercises.length} questions`} />
                <InfoChip icon={Clock3} label={`About ${assessment.estimatedMinutes} minutes`} />
                <InfoChip
                  icon={Target}
                  label={`${Math.round(assessment.passRatio * 100)}% first try to pass`}
                />
              </div>

              <div className="mt-6 border border-foreground/20 bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Evidence mixed in this test
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...new Set(assessment.exercises.map((exercise) => exercise.kind))].map(
                    (kind) => (
                      <span
                        key={kind}
                        className="border border-border bg-card px-2.5 py-1.5 text-xs font-semibold"
                      >
                        {KIND_LABELS[kind]}
                      </span>
                    ),
                  )}
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Test results never lock lessons and recognition alone never
                  awards Hanzi mastery.
                </p>
              </div>

              {view === "result" && result && (
                <div
                  className={cn(
                    "mt-6 border p-5",
                    passed
                      ? "border-green-700/40 bg-green-700/5"
                      : "border-amber-700/40 bg-amber-700/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {passed ? (
                      <Sparkles className="mt-1 h-5 w-5 text-green-700" />
                    ) : (
                      <Target className="mt-1 h-5 w-5 text-amber-700" />
                    )}
                    <div>
                      <h3 className={cn("text-2xl font-bold", displayFont)}>
                        {result.score}/{result.total} first try ·{" "}
                        {passed ? "passed" : "repair recommended"}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {result.missedExerciseIds.length === 0
                          ? "No misses in this attempt."
                          : `${result.missedExerciseIds.length} questions are ready as a focused retry set.`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {Object.entries(result.byKind).map(([kind, score]) => (
                      <div
                        key={kind}
                        className="flex items-center justify-between border border-foreground/15 bg-background px-3 py-2 text-sm"
                      >
                        <span>{KIND_LABELS[kind as ExerciseKind]}</span>
                        <strong>
                          {score.score}/{score.total}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {repairExercises.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setView("repair")}
                        className="stamp-button"
                      >
                        Repair these misses <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setView("quiz")}
                      className="inline-flex min-h-11 items-center gap-2 border border-foreground bg-background px-4 py-2 text-sm font-bold hover:bg-secondary"
                    >
                      <RotateCcw className="h-4 w-4" /> Retake full test
                    </button>
                  </div>
                </div>
              )}

              {view !== "result" && (
                <button
                  type="button"
                  onClick={() => setView("quiz")}
                  className="stamp-button mt-7"
                >
                  {stored ? "Retake this test" : "Start this test"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <div className="mt-7 flex flex-wrap gap-5 border-t border-foreground/15 pt-5 text-sm">
                <Link href="/progress" className="font-bold text-primary hover:underline">
                  Back to learning path
                </Link>
                <Link href="/lessons?level=1" className="font-bold text-primary hover:underline">
                  Review HSK 1 lessons
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoChip({
  icon: Icon,
  label,
}: {
  icon: typeof Headphones;
  label: string;
}) {
  return (
    <div className="flex min-h-14 items-center gap-3 border border-foreground/20 bg-background px-3 py-2 text-sm font-semibold">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </div>
  );
}
