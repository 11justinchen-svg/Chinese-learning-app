"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flag, RotateCcw, Sparkles } from "lucide-react";
import type { Stage } from "@/lib/data/stages/types";
import {
  CHECKPOINT_PASS,
  loadProgress,
  recordCheckpoint,
  saveProgress,
  stampCompletionIfEarned,
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
  | { view: "result"; passed: boolean; score: number; total: number };

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

  const progress = loadProgress();
  const completed = Boolean(progress.stages[stage.id]?.completedAt);

  if (state.view === "result" || completed) {
    const passed = state.view === "result" ? state.passed : true;

    if (completed) {
      return (
        <div className="rounded-2xl border border-green-600/40 bg-green-600/5 p-6 text-center sm:p-8">
          <Sparkles className="mx-auto h-8 w-8 text-green-700 dark:text-green-500" />
          <p className={cn("mt-3 text-2xl font-bold", displayFont)}>
            Stage {stage.index} complete!
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Fast test passed. No retention schedule is required.
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
                href={`/lessons?level=${stage.level ?? 1}`}
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
        <p className="mt-2 text-sm text-muted-foreground">
          {passed
            ? "Fast test passed. This lesson is complete."
            : "Try the five-minute lesson blocks or retake now. Every lesson stays open."}
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
        {stage.checkpoint.length} quick questions, including a useful reply.
        Score 80% to mark this lesson complete. No streak, waiting period, or
        review schedule is required, and every other lesson stays open.
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
