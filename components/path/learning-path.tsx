"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Compass, RotateCcw } from "lucide-react";
import { STAGES } from "@/lib/data/stages";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import {
  hsk1Complete,
  isStageComplete,
  loadProgress,
  stageWordStats,
  type ProgressStore,
} from "@/lib/progression";
import { loadSrs, type SrsStore } from "@/lib/srs";
import { cn } from "@/lib/utils";
import { HskLadder } from "./hsk-ladder";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const STAGE_SPANS = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-8",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-8",
  "md:col-span-4",
  "md:col-span-5",
  "md:col-span-7",
];

export function LearningPath() {
  const [progress, setProgress] = useState<ProgressStore>({
    version: 1,
    words: {},
    stages: {},
  });
  const [srs, setSrs] = useState<SrsStore>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setSrs(loadSrs());
    setReady(true);
  }, []);

  const totals = useMemo(() => {
    let learned = 0;
    let total = 0;
    for (const stage of STAGES) {
      const stats = stageWordStats(stage, progress, srs);
      learned += stats.learned;
      total += stats.total;
    }
    return { learned, total };
  }, [progress, srs]);

  const pct =
    ready && totals.total > 0
      ? Math.round((totals.learned / totals.total) * 100)
      : 0;
  const done = hsk1Complete(STAGES, progress);
  const current =
    STAGES.find((stage) => !isStageComplete(stage, progress)) ?? STAGES[0];

  return (
    <section className="min-h-screen overflow-hidden pb-32 pt-10 text-foreground sm:pt-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="grid items-end gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <div className="flex items-center gap-3">
              <span className="seal h-10 w-10 text-xl">门</span>
              <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground">
                HSK 1 · TEN REAL SCENES
              </p>
            </div>
            <h1 className="mt-7 max-w-4xl">
              <span className={cn("block text-6xl leading-none text-primary sm:text-8xl", hanziFont)}>
                十门皆开
              </span>
              <span className={cn("mt-4 block text-3xl font-bold tracking-tight sm:text-5xl", displayFont)}>
                Every lesson is open.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Pick the conversation you need today. Order food, take a taxi,
              shop, meet someone, then return whenever you want.
            </p>
          </div>

          <div className="eave-panel px-6 py-7">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                OPEN COURTYARD
              </span>
              <Compass className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <span className={cn("text-6xl leading-none text-accent", hanziFont)}>十</span>
              <div className="text-right">
                <p className="text-2xl font-bold tabular-nums">10 / 10</p>
                <p className="text-xs text-muted-foreground">stages available</p>
              </div>
            </div>
          </div>
        </header>

        <section className="eave-panel mt-12 grid gap-7 px-6 py-7 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              {totals.learned > 0 ? "RETURN TO YOUR PLACE" : "A GOOD FIRST GATE"}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className={cn("text-2xl font-bold", displayFont)}>
                {current.title}
              </p>
              <span className={cn("text-3xl text-muted-foreground", hanziFont)}>
                {current.hanziTitle}
              </span>
            </div>
            <div className="mt-4 flex max-w-xl items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden bg-secondary">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {totals.learned} / {totals.total} words retained
              </span>
            </div>
          </div>
          <Link
            href={`/lessons/${current.id}`}
            className="group inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isStageComplete(current, progress) ? (
              <RotateCcw className="h-4 w-4" />
            ) : null}
            {totals.learned > 0 ? "Continue here" : "Enter this lesson"}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </section>

        <div className="mt-16 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-primary">
              CHOOSE YOUR SCENE
            </p>
            <h2 className={cn("mt-2 text-3xl font-bold sm:text-4xl", displayFont)}>
              No locks. No prerequisites.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-right">
            Start anywhere. Your mastery record still rewards recall, speaking,
            and checkpoint accuracy, not simply opening a lesson.
          </p>
        </div>

        <ol className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-12">
          {STAGES.map((stage, index) => {
            const complete = isStageComplete(stage, progress);
            const stats = stageWordStats(stage, progress, srs);
            const stagePct = ready
              ? Math.round((stats.learned / stats.total) * 100)
              : 0;
            const grammarTitles = stage.grammarLessonIds
              .map((id) => GRAMMAR_LESSONS.find((lesson) => lesson.id === id)?.hanzi)
              .filter(Boolean);

            return (
              <li key={stage.id} className={STAGE_SPANS[index]}>
                <Link
                  href={`/lessons/${stage.id}`}
                  aria-label={`Open Stage ${stage.index}: ${stage.title}`}
                  className="lesson-gate group flex h-full flex-col p-6 sm:p-7"
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute -right-3 top-2 -z-10 text-[8rem] leading-none opacity-[0.055] sm:text-[10rem]",
                      hanziFont,
                    )}
                  >
                    {stage.hanziTitle.slice(0, 1)}
                  </span>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                      第 {String(stage.index).padStart(2, "0")} 门
                    </span>
                    {complete ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                        <Check className="h-3.5 w-3.5" /> Complete
                      </span>
                    ) : (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {stagePct}% retained
                      </span>
                    )}
                  </div>

                  <div className="mt-8">
                    <span className={cn("text-4xl text-primary", hanziFont)}>
                      {stage.hanziTitle}
                    </span>
                    <h3 className={cn("mt-2 text-2xl font-bold", displayFont)}>
                      {stage.title}
                    </h3>
                    <p className="mt-2 max-w-[48ch] text-sm leading-6 text-muted-foreground">
                      {stage.scenario}
                    </p>
                  </div>

                  <div className="mt-auto pt-8">
                    {grammarTitles.length > 0 && (
                      <p className={cn("text-sm text-muted-foreground", hanziFont)}>
                        {grammarTitles.join(" · ")}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 border-t border-border pt-4">
                      <div className="h-1 flex-1 overflow-hidden bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${stagePct}%` }} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        Enter scene
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        <HskLadder hsk1Pct={pct} hsk1Done={done} />
      </div>
    </section>
  );
}
