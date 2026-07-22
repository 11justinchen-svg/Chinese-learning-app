"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, RotateCcw } from "lucide-react";
import { STAGES } from "@/lib/data/stages";
import { HANZI_LESSON_CHUNKS } from "@/lib/hanzi-lessons";
import { HSK } from "@/lib/hsk";
import {
  hanziProficiency,
  hanziLessonStats,
  loadProgress,
  type HanziProficiencyStatus,
  type ProgressStore,
} from "@/lib/progression";
import { isDue, loadSrs, type SrsStore } from "@/lib/srs";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

const STATUS_META: Record<
  HanziProficiencyStatus,
  { label: string; dot: string; chip: string }
> = {
  untested: {
    label: "Not tested",
    dot: "bg-muted-foreground/30",
    chip: "border-border bg-card text-muted-foreground",
  },
  started: {
    label: "Started",
    dot: "bg-amber-500",
    chip: "border-amber-500/30 bg-amber-500/10",
  },
  building: {
    label: "Building",
    dot: "bg-sky-500",
    chip: "border-sky-500/30 bg-sky-500/10",
  },
  proficient: {
    label: "Proficient",
    dot: "bg-emerald-600",
    chip: "border-emerald-600/40 bg-emerald-600/12",
  },
};

export function ProgressDashboard() {
  const [progress, setProgress] = useState<ProgressStore>(EMPTY_PROGRESS);
  const [srs, setSrs] = useState<SrsStore>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setSrs(loadSrs());
    setReady(true);
  }, []);

  const summary = useMemo(() => {
    const counts: Record<HanziProficiencyStatus, number> = {
      untested: 0,
      started: 0,
      building: 0,
      proficient: 0,
    };
    let due = 0;
    for (const word of HSK) {
      counts[hanziProficiency(word.id, progress).status] += 1;
      if (srs[word.id] && isDue(srs[word.id])) due += 1;
    }
    const completedStages = STAGES.filter(
      (stage) => progress.stages[stage.id]?.completedAt,
    ).length;
    return { counts, due, completedStages };
  }, [progress, srs]);

  if (!ready) return <main className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen bg-background pb-24 pt-12 text-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="border-b border-border pb-9">
          <p
            className={cn(
              "text-xs uppercase tracking-[0.3em] text-muted-foreground",
              displayFont,
            )}
          >
            默知 · HSK 1 + 2 practice log
          </p>
          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className={cn("text-4xl font-bold sm:text-5xl", displayFont)}>
                What you have tried
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                See which Hanzi you have recognized, heard, and used. This is
                evidence from practice, not a retention obligation or a lock.
              </p>
            </div>
            <Link
              href="/flashcards"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Optional flashcards <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Hanzi proficient"
            value={`${summary.counts.proficient} / ${HSK.length}`}
            note="Form, sound, and use all demonstrated"
          />
          <SummaryCard
            icon={<ArrowRight className="h-5 w-5" />}
            label="Stages completed"
            value={`${summary.completedStages} / ${STAGES.length}`}
            note="20 independent, always-open scenes"
          />
          <SummaryCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Optional reviews"
            value={String(summary.due)}
            note="Previously seen cards due now"
          />
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className={cn("text-2xl font-bold", displayFont)}>
                Hanzi lesson chunks
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each lesson keeps separate form, sound, and contextual-use
                evidence. All twenty remain open regardless of this score.
              </p>
            </div>
            <Link
              href="/hanzi"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Open Hanzi courtyards
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {HANZI_LESSON_CHUNKS.map((lesson) => {
              const stats = hanziLessonStats(lesson.wordIds, progress);
              return (
                <Link
                  key={lesson.id}
                  href={`/hanzi?lesson=${lesson.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        HSK {lesson.level} · Lesson {lesson.index}
                      </p>
                      <p className="mt-1 font-semibold">
                        {lesson.title}{" "}
                        <span className={cn("ml-1 text-xl text-muted-foreground", hanziFont)}>
                          {lesson.hanziTitle}
                        </span>
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${stats.score}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {stats.tried}/{stats.total} tried · {stats.proficient} proficient · form {stats.evidence.formMeaning}% · sound {stats.evidence.sound}% · use {stats.evidence.use}%
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className={cn("text-2xl font-bold", displayFont)}>
            Hanzi evidence map
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {(Object.keys(STATUS_META) as HanziProficiencyStatus[]).map((status) => (
              <span key={status} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", STATUS_META[status].dot)} />
                {STATUS_META[status].label} · {summary.counts[status]}
              </span>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10">
            {HSK.map((word) => {
              const proficiency = hanziProficiency(word.id, progress);
              const status = proficiency.status;
              return (
                <Link
                  key={word.id}
                  href={`/hanzi?word=${word.id}`}
                  title={`${word.pinyin}: ${word.meaning}. ${STATUS_META[status].label}, ${proficiency.score}% evidence`}
                  aria-label={`${word.hanzi}, ${word.pinyin}, ${word.meaning}: ${STATUS_META[status].label}`}
                  className={cn(
                    "rounded-xl border px-2 py-3 text-center transition-transform hover:-translate-y-0.5",
                    STATUS_META[status].chip,
                  )}
                >
                  <span className={cn("block text-2xl", hanziFont)}>{word.hanzi}</span>
                  <span className="mt-1 block truncate text-[0.65rem] text-muted-foreground">
                    {word.pinyin}
                  </span>
                  <span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-wide text-muted-foreground">{proficiency.score}%</span>
                  <span className="sr-only">{STATUS_META[status].label}, {proficiency.score}%</span>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <RotateCcw className="h-3.5 w-3.5" />
          Card scheduling is optional and never locks a lesson or level.
        </p>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className={cn("mt-3 text-3xl font-bold", displayFont)}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
