"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const BANDS = ["一", "二", "三", "四", "五", "六"];

export function HskLadder({
  hsk1Pct,
  hsk1Done,
}: {
  hsk1Pct: number;
  hsk1Done: boolean;
}) {
  return (
    <div className="mt-20">
      <p
        className={cn(
          "mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground",
          displayFont,
        )}
      >
        The HSK ladder
      </p>
      <div className="flex flex-wrap gap-2">
        {BANDS.map((hanzi, i) => {
          const level = i + 1;
          const activeLevel = level === 1;
          const nextUp = level === 2 && hsk1Done;
          return (
            <div
              key={level}
              className={cn(
                "flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border",
                activeLevel
                  ? "border-primary bg-primary/10 text-foreground"
                  : nextUp
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border text-muted-foreground/50",
              )}
            >
              <span className={cn("text-2xl", hanziFont)}>{hanzi}</span>
              {activeLevel ? (
                <span className="text-[0.6rem] uppercase tracking-wide">
                  {hsk1Done ? "complete" : `${hsk1Pct}%`}
                </span>
              ) : nextUp ? (
                <span className="text-[0.6rem] uppercase tracking-wide">
                  coming soon
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[0.6rem] uppercase tracking-wide">
                  <Lock className="h-2.5 w-2.5" />
                  {level === 2 ? "finish HSK 1" : "soon"}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {hsk1Done
          ? "HSK 1 complete — HSK 2 is next on the roadmap."
          : "Complete all ten HSK 1 stages to unlock the next level."}
      </p>
    </div>
  );
}
