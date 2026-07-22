"use client";

import { useEffect, useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import type { ReplyExercise } from "@/lib/data/stages/types";
import { speak } from "@/lib/speech";
import {
  speechFallbackMessage,
  useMandarinSpeech,
} from "@/lib/use-mandarin-speech";
import { cn } from "@/lib/utils";
import {
  hashSeed,
  optionClass,
  seededShuffle,
  type ExerciseChildProps,
} from "./utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

export function ReplyExerciseView({
  exercise,
  phase,
  onAnswer,
}: ExerciseChildProps<ReplyExercise>) {
  const [selected, setSelected] = useState<string | null>(null);
  const speech = useMandarinSpeech();
  const tts = speech === "ready";
  const speechFallback = speechFallbackMessage(speech);
  const choices = useMemo(
    () => seededShuffle(exercise.choices, hashSeed(exercise.id)),
    [exercise.id, exercise.choices],
  );
  const accepted = useMemo(
    () => new Set(exercise.answers ?? [exercise.answer]),
    [exercise.answer, exercise.answers],
  );
  const answering = phase === "answering";

  useEffect(() => {
    if (!answering) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) {
        setSelected(choices[n - 1].hanzi);
        onAnswer(accepted.has(choices[n - 1].hanzi));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accepted, answering, choices, onAnswer]);

  return (
    <div>
      <p className="text-sm italic text-muted-foreground">{exercise.scene}</p>
      <div className="mt-3 flex items-start gap-3 rounded-2xl rounded-tl-sm border border-border bg-secondary/50 px-4 py-3">
        <div className="min-w-0">
          <p className={cn("text-2xl", hanziFont)}>{exercise.line.hanzi}</p>
          <p
            className={cn("mt-0.5 text-xs text-muted-foreground", displayFont)}
          >
            {exercise.line.pinyin}
          </p>
        </div>
        {tts && (
          <button
            type="button"
            aria-label="Play line"
            className="mt-1 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            onClick={() => speak(exercise.line.hanzi)}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {speechFallback && (
        <p className="mt-2 text-xs text-muted-foreground" role="status">
          {speechFallback}
        </p>
      )}
      <p className="mt-4 text-sm text-muted-foreground">How do you reply?</p>
      <div className="mt-2 space-y-2">
        {choices.map((c, i) => {
          const state = answering
            ? "idle"
            : accepted.has(c.hanzi)
              ? "correct"
              : c.hanzi === selected
                ? "wrong"
                : "idle";
          return (
            <button
              key={c.hanzi}
              type="button"
              disabled={!answering}
              className={optionClass(state)}
              onClick={() => {
                setSelected(c.hanzi);
                onAnswer(accepted.has(c.hanzi));
              }}
            >
              <span className="mr-2 text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className={cn("text-xl", hanziFont)}>{c.hanzi}</span>
              <span
                className={cn(
                  "ml-2 text-xs text-muted-foreground",
                  displayFont,
                )}
              >
                {c.pinyin}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
