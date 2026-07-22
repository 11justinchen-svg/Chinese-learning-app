"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, Compass, MessageCircle, Zap } from "lucide-react";
import { stagesForLevel } from "@/lib/data/stages";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import { isStageComplete, loadProgress, type ProgressStore } from "@/lib/progression";
import type { HskLevel } from "@/lib/hsk";
import { cn } from "@/lib/utils";
import { HskLadder } from "./hsk-ladder";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
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

const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

function wordWasTried(id: string, progress: ProgressStore): boolean {
  const word = progress.words[id];
  return Boolean(word?.seenAt || word?.correct || word?.wrong);
}

function levelPractice(level: HskLevel, progress: ProgressStore) {
  const ids = stagesForLevel(level).flatMap((stage) => stage.wordIds);
  const tried = ids.filter((id) => wordWasTried(id, progress)).length;
  return { tried, total: ids.length, pct: Math.round((tried / ids.length) * 100) };
}

export function LearningPath() {
  const router = useRouter();
  const [level, setLevel] = useState<HskLevel>(1);
  const [progress, setProgress] = useState<ProgressStore>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("level");
    if (requested === "2") setLevel(2);
    setProgress(loadProgress());
    setReady(true);
  }, []);

  const stages = useMemo(() => stagesForLevel(level), [level]);
  const selectedPractice = useMemo(
    () => levelPractice(level, progress),
    [level, progress],
  );
  const practiceByLevel = useMemo(
    () => ({
      1: levelPractice(1, progress).pct,
      2: levelPractice(2, progress).pct,
    }),
    [progress],
  );
  const current =
    stages.find((stage) => !isStageComplete(stage, progress)) ?? stages[0];
  const completed = stages.filter((stage) => isStageComplete(stage, progress)).length;

  function chooseLevel(next: HskLevel) {
    setLevel(next);
    router.replace(`/lessons?level=${next}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section
      className={cn(
        "min-h-screen overflow-hidden pb-32 pt-10 text-foreground sm:pt-14",
        level === 1 ? "level-hsk1" : "level-hsk2",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="poster-hero relative overflow-hidden border border-foreground bg-card">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-8 -top-12 text-[15rem] leading-none opacity-[0.09] sm:text-[22rem]",
              hanziFont,
            )}
          >
            {level === 1 ? "一" : "二"}
          </span>
          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative p-7 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="seal h-10 w-10 text-xl">门</span>
                <p className="text-xs font-bold tracking-[0.2em]">
                  HSK {level} · TEN OPEN SCENES
                </p>
                <span className="font-[family-name:var(--font-hand)] text-lg text-primary">
                  start anywhere
                </span>
              </div>
              <h1 className="mt-7 max-w-4xl">
                <span className={cn("block text-6xl leading-[0.9] text-primary sm:text-8xl", hanziFont)}>
                  {level === 1 ? "十门皆开" : "二级开场"}
                </span>
                <span className={cn("mt-5 block text-3xl font-bold tracking-tight sm:text-5xl", displayFont)}>
                  {level === 1 ? "Speak what you need today." : "Real life, one step further."}
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                Pick a scene, speak within minutes, and leave when you have what you need.
                Every section is skippable. Every lesson and both HSK levels are open.
              </p>
            </div>

            <div className="poster-level-field relative flex min-h-64 flex-col justify-between border-t border-foreground p-7 text-[oklch(var(--poster-paper))] lg:border-l lg:border-t-0 lg:p-9">
              <div className="flex items-center justify-between">
                <Compass className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">open map</span>
              </div>
              <div>
                <p className={cn("text-7xl leading-none", hanziFont)}>十</p>
                <p className="mt-3 text-2xl font-bold">10 / 10 lessons available</p>
                <p className="mt-1 text-sm opacity-80">
                  {level === 1 ? 150 : 147} written forms · {completed} fast tests passed
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="poster-panel mt-10 grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-[family-name:var(--font-hand)] text-lg text-primary">
              {selectedPractice.tried > 0 ? "pick up where you left off" : "a useful first scene"}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className={cn("text-2xl font-bold", displayFont)}>{current.title}</p>
              <span className={cn("text-4xl text-muted-foreground", hanziFont)}>{current.hanziTitle}</span>
            </div>
            <div className="mt-4 flex max-w-xl items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden border border-foreground/20 bg-secondary">
                <div className="h-full bg-primary" style={{ width: `${ready ? selectedPractice.pct : 0}%` }} />
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {selectedPractice.tried} / {selectedPractice.total} words tried
              </span>
            </div>
          </div>
          <Link href={`/lessons/${current.id}`} className="stamp-button group">
            Enter scene
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </section>

        <div className="mt-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-[family-name:var(--font-hand)] text-xl text-primary">choose your situation</p>
            <h2 className={cn("mt-1 text-3xl font-bold sm:text-4xl", displayFont)}>No locks. No prerequisites.</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> about 5 minutes</span>
            <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> real reply practice</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4" /> fast test anytime</span>
          </div>
        </div>

        <ol className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-12">
          {stages.map((stage, index) => {
            const complete = isStageComplete(stage, progress);
            const tried = stage.wordIds.filter((id) => wordWasTried(id, progress)).length;
            const stagePct = ready ? Math.round((tried / stage.wordIds.length) * 100) : 0;
            const grammarTitles = stage.grammarLessonIds
              .map((id) => GRAMMAR_LESSONS.find((lesson) => lesson.id === id)?.hanzi)
              .filter(Boolean);
            return (
              <li key={stage.id} className={STAGE_SPANS[index % STAGE_SPANS.length]}>
                <Link
                  href={`/lessons/${stage.id}`}
                  aria-label={`Open HSK ${level} lesson ${stage.index}: ${stage.title}`}
                  className="lesson-gate group flex h-full flex-col p-6 sm:p-7"
                >
                  <span aria-hidden="true" className={cn("absolute -right-3 top-2 -z-10 text-[9rem] leading-none opacity-[0.07]", hanziFont)}>
                    {stage.hanziTitle.slice(0, 1)}
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold tracking-[0.16em] text-muted-foreground">
                      HSK {level} · {String(stage.index).padStart(2, "0")}
                    </span>
                    {complete ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent"><Check className="h-3.5 w-3.5" /> Test passed</span>
                    ) : (
                      <span className="text-xs tabular-nums text-muted-foreground">{stagePct}% tried</span>
                    )}
                  </div>
                  <div className="mt-8">
                    <span className={cn("text-5xl text-primary", hanziFont)}>{stage.hanziTitle}</span>
                    <h3 className={cn("mt-2 text-2xl font-bold", displayFont)}>{stage.title}</h3>
                    <p className="mt-2 max-w-[48ch] text-sm leading-6 text-muted-foreground">{stage.goal ?? stage.scenario}</p>
                  </div>
                  <div className="mt-auto pt-8">
                    {grammarTitles.length > 0 && <p className="font-[family-name:var(--font-hand)] text-base text-muted-foreground">{grammarTitles.join(" · ")}</p>}
                    <div className="mt-3 flex items-center gap-3 border-t border-border pt-4">
                      <div className="h-1 flex-1 overflow-hidden bg-secondary"><div className="h-full bg-primary" style={{ width: `${stagePct}%` }} /></div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold">Enter scene <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" /></span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        <HskLadder level={level} practiced={practiceByLevel} onSelect={chooseLevel} />
      </div>
    </section>
  );
}
