"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChoiceExercise } from "@/lib/data/stages/types";
import { cn } from "@/lib/utils";
import {
  hashSeed,
  optionClass,
  seededShuffle,
  type ExerciseChildProps,
} from "./utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

export function ChoiceExerciseView({
  exercise,
  phase,
  onAnswer,
}: ExerciseChildProps<ChoiceExercise>) {
  const [selected, setSelected] = useState<string | null>(null);
  const choices = useMemo(
    () => seededShuffle(exercise.choices, hashSeed(exercise.id)),
    [exercise.id, exercise.choices],
  );
  const hanziQuestion = exercise.direction === "hanzi-en";
  const answering = phase === "answering";

  useEffect(() => {
    if (!answering) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) {
        setSelected(choices[n - 1]);
        onAnswer(choices[n - 1] === exercise.answer);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answering, choices, exercise.answer, onAnswer]);

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {hanziQuestion ? "What does this mean?" : "Pick the Chinese"}
      </p>
      <div className="mt-3">
        <p
          className={cn(
            hanziQuestion
              ? cn("text-4xl sm:text-5xl", hanziFont)
              : "text-2xl font-semibold",
          )}
        >
          {exercise.question}
        </p>
        {exercise.questionPinyin && (
          <p
            className={cn("mt-1.5 text-sm text-muted-foreground", displayFont)}
          >
            {exercise.questionPinyin}
          </p>
        )}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {choices.map((c, i) => {
          const state = answering
            ? "idle"
            : c === exercise.answer
              ? "correct"
              : c === selected
                ? "wrong"
                : "idle";
          return (
            <button
              key={c}
              type="button"
              disabled={!answering}
              className={cn(
                optionClass(state),
                !hanziQuestion && cn("text-xl", hanziFont),
              )}
              onClick={() => {
                setSelected(c);
                onAnswer(c === exercise.answer);
              }}
            >
              <span className="mr-2 text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
