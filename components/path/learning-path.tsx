"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, FlaskConical, Lock } from "lucide-react";
import { STAGES } from "@/lib/data/stages";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import {
  devUnlocked,
  hsk1Complete,
  isStageComplete,
  isStageUnlocked,
  loadProgress,
  setDevUnlocked,
  stageWordStats,
  unlockRequirement,
  type ProgressStore,
} from "@/lib/progression";
import { loadSrs, type SrsStore } from "@/lib/srs";
import { cn } from "@/lib/utils";
import { HskLadder } from "./hsk-ladder";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

export function LearningPath() {
  const [progress, setProgress] = useState<ProgressStore>({
    version: 1,
    words: {},
    stages: {},
  });
  const [srs, setSrs] = useState<SrsStore>({});
  const [ready, setReady] = useState(false);
  const [dev, setDev] = useState(false);

  useEffect(() => {
    // Dev escape hatch: ?unlock=all opens every stage for this tab session.
    const q = new URLSearchParams(window.location.search).get("unlock");
    if (q === "all") setDevUnlocked(true);
    if (q === "off") setDevUnlocked(false);
    setDev(devUnlocked());
    setProgress(loadProgress());
    setSrs(loadSrs());
    setReady(true);
  }, []);

  const totals = useMemo(() => {
    let learned = 0;
    let total = 0;
    for (const s of STAGES) {
      const st = stageWordStats(s, progress, srs);
      learned += st.learned;
      total += st.total;
    }
    return { learned, total };
  }, [progress, srs]);

  const pct =
    ready && totals.total > 0
      ? Math.round((totals.learned / totals.total) * 100)
      : 0;
  const done = hsk1Complete(STAGES, progress);
  const current =
    STAGES.find(
      (s) =>
        isStageUnlocked(s.index, STAGES, progress) &&
        !isStageComplete(s, progress),
    ) ?? STAGES[STAGES.length - 1];

  return (
    <section className="min-h-screen bg-background pb-32 pt-14 text-foreground">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Masthead */}
        <header className="border-b border-border pb-10">
          <p
            className={cn(
              "text-xs uppercase tracking-[0.3em] text-muted-foreground",
              displayFont,
            )}
          >
            默知 · HSK 1
          </p>
          <h1
            className={cn(
              "mt-4 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl",
              displayFont,
            )}
          >
            Ten scenes,
            <br />
            one real conversation at a time.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every stage is a real-life scenario: a dialogue to understand, the
            words that make it work, and interactive grammar drills. Pass the
            checkpoint to unlock the next stage.
          </p>
          {dev && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-3 py-1 text-xs text-accent-foreground dark:text-accent">
              <FlaskConical className="h-3.5 w-3.5" />
              dev unlock active — locks are bypassed this session
            </p>
          )}
        </header>

        {/* Resume */}
        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p
              className={cn(
                "text-xs uppercase tracking-[0.2em] text-primary",
                displayFont,
              )}
            >
              {totals.learned > 0 ? "Keep going" : "Start here"}
            </p>
            <p className="mt-1.5 text-lg font-semibold">
              Stage {current.index}: {current.title}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {totals.learned} / {totals.total} words learned
              </span>
            </div>
          </div>
          <Link
            href={`/lessons/${current.id}`}
            className={cn(
              "group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
              displayFont,
            )}
          >
            {isStageComplete(current, progress) ? "Review" : "Continue"} Stage{" "}
            {current.index}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Stage list */}
        <ol className="mt-4">
          {STAGES.map((stage, i) => {
            const unlocked =
              ready && isStageUnlocked(stage.index, STAGES, progress);
            const complete = isStageComplete(stage, progress);
            const stats = stageWordStats(stage, progress, srs);
            const upct = ready
              ? Math.round((stats.learned / stats.total) * 100)
              : 0;
            const req = ready
              ? unlockRequirement(stage.index, STAGES, progress, srs)
              : null;
            const grammarTitles = stage.grammarLessonIds
              .map((id) => GRAMMAR_LESSONS.find((l) => l.id === id)?.hanzi)
              .filter(Boolean);
            const row = (
              <div className="pointer-events-none relative z-10 flex items-center gap-5 py-6">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl",
                    hanziFont,
                    complete
                      ? "border-green-600/50 bg-green-600/10"
                      : unlocked
                        ? "border-primary/50 bg-primary/5"
                        : "border-border text-muted-foreground/60",
                  )}
                >
                  {complete ? (
                    <Check className="h-5 w-5 text-green-700 dark:text-green-500" />
                  ) : (
                    stage.hanziTitle.slice(0, 1)
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={cn(
                        "text-lg font-semibold",
                        !unlocked && "text-muted-foreground",
                      )}
                    >
                      {String(stage.index).padStart(2, "0")} · {stage.title}
                    </span>
                    <span
                      className={cn("text-xl text-muted-foreground", hanziFont)}
                    >
                      {stage.hanziTitle}
                    </span>
                    {grammarTitles.length > 0 && (
                      <span className="flex flex-wrap gap-1">
                        {grammarTitles.map((g) => (
                          <span
                            key={g}
                            className={cn(
                              "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground",
                              hanziFont,
                            )}
                          >
                            {g}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {stage.scenario}
                  </p>
                  {unlocked ? (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1 w-28 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${upct}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {ready
                          ? `${stats.learned}/${stats.total} words learned`
                          : ""}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      {req}
                    </p>
                  )}
                </div>
                {unlocked && (
                  <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-foreground sm:block" />
                )}
              </div>
            );
            return (
              <li
                key={stage.id}
                className={cn(
                  "lesson-in group relative border-b border-border",
                  !unlocked && "opacity-70",
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {unlocked && (
                  <Link
                    href={`/lessons/${stage.id}`}
                    aria-label={`Open ${stage.title}`}
                    className="absolute inset-0 z-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  />
                )}
                {row}
              </li>
            );
          })}
        </ol>

        <HskLadder hsk1Pct={pct} hsk1Done={done} />
      </div>
    </section>
  );
}
