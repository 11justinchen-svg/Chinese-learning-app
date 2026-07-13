"use client";

import { useEffect, useMemo, useState } from "react";
import { Turtle, Volume2 } from "lucide-react";
import type { ListenExercise } from "@/lib/data/stages/types";
import { speak } from "@/lib/speech";
import { useMandarinSpeech } from "@/lib/use-mandarin-speech";
import { cn } from "@/lib/utils";
import {
  hashSeed,
  optionClass,
  seededShuffle,
  type ExerciseChildProps,
} from "./utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

export function ListenExerciseView({
  exercise,
  phase,
  onAnswer,
}: ExerciseChildProps<ListenExercise>) {
  const [selected, setSelected] = useState<string | null>(null);
  const speech = useMandarinSpeech();
  const tts = speech === "ready";
  const choices = useMemo(
    () => seededShuffle(exercise.choices, hashSeed(exercise.id)),
    [exercise.id, exercise.choices],
  );
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
      <p
        className="text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {tts
          ? "Listen, then pick what you heard"
          : speech === "loading"
            ? "Preparing the Mandarin voice…"
            : "No Mandarin voice is available — use the pinyin fallback"}
      </p>

      {tts ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            aria-label="Play Mandarin audio at normal speed"
            onClick={() => speak(exercise.text)}
          >
            <Volume2 className="h-7 w-7" />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            aria-label="Replay Mandarin audio slowly"
            onClick={() => speak(exercise.text, { rate: 0.68 })}
          >
            <Turtle className="h-5 w-5" />
          </button>
        </div>
      ) : speech === "loading" ? (
        <div
          className="mt-4 h-16 w-16 animate-pulse rounded-2xl bg-secondary"
          aria-hidden="true"
        />
      ) : (
        <p className={cn("mt-4 text-3xl", displayFont)}>{exercise.pinyin}</p>
      )}

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
              className={cn(optionClass(state), "text-xl", hanziFont)}
              onClick={() => {
                setSelected(c);
                onAnswer(c === exercise.answer);
              }}
            >
              <span className="mr-2 align-middle text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              {c}
            </button>
          );
        })}
      </div>

      {!answering && (
        <p className={cn("mt-4 text-sm text-muted-foreground", displayFont)}>
          {exercise.pinyin}
          {exercise.translation ? ` · ${exercise.translation}` : ""}
        </p>
      )}
    </div>
  );
}
