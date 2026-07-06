"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Eye, EyeOff, Volume2 } from "lucide-react";
import type { DialogueLine } from "@/lib/data/stages/types";
import { canSpeakChinese, onVoicesReady, speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

export function DialoguePanel({
  dialogue,
  onViewed,
}: {
  dialogue: DialogueLine[];
  onViewed: () => void;
}) {
  const [revealed, setRevealed] = useState(1);
  const [showEnglish, setShowEnglish] = useState(true);
  const [tts, setTts] = useState(false);
  const allShown = revealed >= dialogue.length;

  useEffect(() => {
    setTts(canSpeakChinese());
    return onVoicesReady(() => setTts(canSpeakChinese()));
  }, []);

  const speakers = [...new Set(dialogue.map((l) => l.speaker))];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tap through the conversation — this is what you'll be able to say by
          the end of the stage.
        </p>
        <button
          type="button"
          className="ml-4 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => setShowEnglish((v) => !v)}
        >
          {showEnglish ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          English
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {dialogue.slice(0, revealed).map((line, i) => {
          const mine = speakers.indexOf(line.speaker) % 2 === 1;
          return (
            <div
              key={i}
              className={cn(
                "lesson-in flex",
                mine ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl border px-4 py-3",
                  mine
                    ? "rounded-tr-sm border-primary/30 bg-primary/10"
                    : "rounded-tl-sm border-border bg-card",
                )}
              >
                <p
                  className={cn(
                    "text-[0.65rem] uppercase tracking-wider text-muted-foreground",
                    displayFont,
                  )}
                >
                  {line.speaker}
                </p>
                <div className="mt-1 flex items-start gap-2">
                  <p className={cn("text-2xl leading-snug", hanziFont)}>
                    {line.hanzi}
                  </p>
                  {tts && (
                    <button
                      type="button"
                      aria-label="Play line"
                      className="mt-1 shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      onClick={() => speak(line.hanzi)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs text-muted-foreground",
                    displayFont,
                  )}
                >
                  {line.pinyin}
                </p>
                {showEnglish && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {line.english}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!allShown ? (
        <button
          type="button"
          className={cn(
            "mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50",
            displayFont,
          )}
          onClick={() => setRevealed((r) => r + 1)}
        >
          Next line
          <ChevronDown className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          className={cn(
            "mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
            displayFont,
          )}
          onClick={onViewed}
        >
          Got it — teach me the words
        </button>
      )}
    </div>
  );
}
