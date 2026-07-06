"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flag, RotateCcw, Sparkles } from "lucide-react";
import type { Stage } from "@/lib/data/stages/types";
import { buildWeakWordDrill } from "@/lib/data/stages/exercise-gen";
import {
  CHECKPOINT_PASS,
  loadProgress,
  recordCheckpoint,
  saveProgress,
  stampCompletionIfEarned,
  stageWordStats,
  wordStatus,
} from "@/lib/progression";
import { loadSrs } from "@/lib/srs";
import { cn } from "@/lib/utils";
import {
  ExercisePlayer,
  type PlayerResults,
} from "@/components/exercises/exercise-player";

const displayFont = "font-[family-name:var(--font-display)]";

type State =
  | { view: "intro" }
  | { view: "quiz" }
  | { view: "result"; passed: boolean; score: number; total: number }
  | { view: "drill"; wordIds: string[] };

export function CheckpointPanel({
  stage,
  nextStageId,
  onProgressChange,
}: {
  stage: Stage;
  nextStageId?: string;
  onProgressChange: () => void;
}) {
  const [state, setState] = useState<State>({ view: "intro" });

  function finishQuiz({ total, firstTryCorrect }: PlayerResults) {
    let p = recordCheckpoint(loadProgress(), stage.id, firstTryCorrect, total);
    p = stampCompletionIfEarned(p, stage, loadSrs());
    saveProgress(p);
    onProgressChange();
    setState({
      view: "result",
      passed: firstTryCorrect / total >= CHECKPOINT_PASS,
      score: firstTryCorrect,
      total,
    });
  }

  function finishDrill() {
    // Drill answers may have pushed words over the "learned" line — try again.
    const p = stampCompletionIfEarned(loadProgress(), stage, loadSrs());
    saveProgress(p);
    onProgressChange();
    setState({ view: "intro" });
  }

  if (state.view === "quiz") {
    return (
      <ExercisePlayer
        title={`Stage ${stage.index} checkpoint`}
        exercises={stage.checkpoint}
        mode="quiz"
        onFinish={finishQuiz}
      />
    );
  }

  if (state.view === "drill") {
    return (
      <ExercisePlayer
        title="Weak words"
        exercises={buildWeakWordDrill(state.wordIds)}
        mode="practice"
        onFinish={finishDrill}
      />
    );
  }

  const progress = loadProgress();
  const srs = loadSrs();
  const completed = Boolean(progress.stages[stage.id]?.completedAt);
  const { total, learned } = stageWordStats(stage, progress, srs);
  const weakWords = stage.wordIds.filter(
    (id) => !["learned", "mastered"].includes(wordStatus(id, progress, srs)),
  );

  if (state.view === "result" || completed) {
    const passed = state.view === "result" ? state.passed : true;
    const wordsGateMet = learned / total >= 0.8;

    if (completed) {
      return (
        <div className="rounded-2xl border border-green-600/40 bg-green-600/5 p-6 text-center sm:p-8">
          <Sparkles className="mx-auto h-8 w-8 text-green-700 dark:text-green-500" />
          <p className={cn("mt-3 text-2xl font-bold", displayFont)}>
            Stage {stage.index} complete!
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {learned}/{total} words learned · checkpoint passed
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {nextStageId ? (
              <Link
                href={`/lessons/${nextStageId}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
                  displayFont,
                )}
              >
                Next stage
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/lessons"
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
                  displayFont,
                )}
              >
                Back to the path
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50",
                displayFont,
              )}
              onClick={() => setState({ view: "quiz" })}
            >
              <RotateCcw className="h-4 w-4" />
              Retake checkpoint
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "rounded-2xl border p-6 text-center sm:p-8",
          passed ? "border-primary/40 bg-primary/5" : "border-border bg-card",
        )}
      >
        <p className={cn("text-2xl font-bold", displayFont)}>
          {state.view === "result" &&
            `${state.score} / ${state.total} first try — ${passed ? "passed!" : "below 80%"}`}
        </p>
        {passed && !wordsGateMet ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Checkpoint passed — but only {learned} of {total} words are
              learned. Drill the {weakWords.length} weak word
              {weakWords.length === 1 ? "" : "s"} to finish the stage.
            </p>
            <button
              type="button"
              className={cn(
                "mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
                displayFont,
              )}
              onClick={() => setState({ view: "drill", wordIds: weakWords })}
            >
              Drill weak words
            </button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              {passed
                ? "Almost there — keep the words fresh."
                : "Review the blocks above, then try again. You need 80% on the first try."}
            </p>
            <button
              type="button"
              className={cn(
                "mt-5 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50",
                displayFont,
              )}
              onClick={() => setState({ view: "quiz" })}
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
      <Flag className="mx-auto h-7 w-7 text-primary" />
      <p className={cn("mt-3 text-xl font-bold", displayFont)}>
        Stage {stage.index} checkpoint
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {stage.checkpoint.length} questions, no retries mid-quiz. Score 80%
        first-try — and have 80% of the stage words learned — to unlock the next
        stage. Words learned so far: {learned}/{total}.
      </p>
      <button
        type="button"
        className={cn(
          "mt-5 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
          displayFont,
        )}
        onClick={() => setState({ view: "quiz" })}
      >
        Start
      </button>
    </div>
  );
}
