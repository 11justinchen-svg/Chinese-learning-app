"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, RotateCcw, Trophy } from "lucide-react";
import { STAGES, stageForWord } from "@/lib/data/stages";
import { findWord } from "@/lib/hsk";
import {
  hsk1Complete,
  loadProgress,
  stageWordStats,
  wordStatus,
  type ProgressStore,
  type WordStatus,
} from "@/lib/progression";
import { isDue, loadSrs, type SrsStore } from "@/lib/srs";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

const STATUS_META: Record<
  WordStatus,
  { label: string; dot: string; chip: string }
> = {
  new: {
    label: "New",
    dot: "bg-muted-foreground/30",
    chip: "border-border bg-card text-muted-foreground",
  },
  seen: {
    label: "Seen",
    dot: "bg-sky-500",
    chip: "border-sky-500/30 bg-sky-500/10",
  },
  learning: {
    label: "Learning",
    dot: "bg-amber-500",
    chip: "border-amber-500/30 bg-amber-500/10",
  },
  learned: {
    label: "Learned",
    dot: "bg-emerald-500",
    chip: "border-emerald-500/30 bg-emerald-500/10",
  },
  mastered: {
    label: "Mastered",
    dot: "bg-primary",
    chip: "border-primary/30 bg-primary/10",
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
    const counts: Record<WordStatus, number> = {
      new: 0,
      seen: 0,
      learning: 0,
      learned: 0,
      mastered: 0,
    };
    let due = 0;
    for (const stage of STAGES) {
      for (const id of stage.wordIds) {
        counts[wordStatus(id, progress, srs)] += 1;
        if (srs[id] && isDue(srs[id])) due += 1;
      }
    }
    const retained = counts.learned + counts.mastered;
    const completedStages = STAGES.filter(
      (stage) => progress.stages[stage.id]?.completedAt,
    ).length;
    return { counts, due, retained, completedStages };
  }, [progress, srs]);

  if (!ready) return <main className="min-h-screen bg-background" />;

  const complete = hsk1Complete(STAGES, progress);
  const percent = Math.round((summary.retained / 150) * 100);

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
            默知 · Your HSK 1
          </p>
          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className={cn("text-4xl font-bold sm:text-5xl", displayFont)}>
                Progress you can use
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                A word becomes learned only after repeated first-try recall
                across different exercise types and spaced review. Finishing a
                card once is not mastery.
              </p>
            </div>
            <Link
              href="/flashcards"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Review due words <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Trophy className="h-5 w-5" />}
            label="Words retained"
            value={`${summary.retained} / 150`}
            note={`${percent}% learned or mastered`}
          />
          <SummaryCard
            icon={<ArrowRight className="h-5 w-5" />}
            label="Stages completed"
            value={`${summary.completedStages} / ${STAGES.length}`}
            note={complete ? "HSK-1 path complete" : "Dialogue, practice, checkpoint"}
          />
          <SummaryCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Reviews due"
            value={String(summary.due)}
            note="Previously seen cards due now"
          />
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className={cn("text-2xl font-bold", displayFont)}>
                Stage progress
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Checkpoints require 80% first-try accuracy and 80% learned words.
              </p>
            </div>
            <Link
              href="/lessons"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Continue the learning path
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {STAGES.map((stage) => {
              const stats = stageWordStats(stage, progress, srs);
              const stageProgress = progress.stages[stage.id];
              const pct = Math.round((stats.learned / stats.total) * 100);
              const checkpoint = stageProgress?.checkpointBest;
              const checkpointPct = checkpoint
                ? Math.round((checkpoint.score / checkpoint.total) * 100)
                : 0;
              return (
                <Link
                  key={stage.id}
                  href={`/lessons/${stage.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Stage {stage.index}
                      </p>
                      <p className="mt-1 font-semibold">
                        {stage.title}{" "}
                        <span className={cn("ml-1 text-xl text-muted-foreground", hanziFont)}>
                          {stage.hanziTitle}
                        </span>
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {stats.learned}/{stats.total} learned · checkpoint {checkpoint ? `${checkpointPct}% best` : "not attempted"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className={cn("text-2xl font-bold", displayFont)}>
            All 150 words
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {(Object.keys(STATUS_META) as WordStatus[]).map((status) => (
              <span key={status} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", STATUS_META[status].dot)} />
                {STATUS_META[status].label} · {summary.counts[status]}
              </span>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10">
            {STAGES.flatMap((stage) => stage.wordIds).map((id) => {
              const word = findWord(id);
              if (!word) return null;
              const status = wordStatus(id, progress, srs);
              const owner = stageForWord(id);
              return (
                <Link
                  key={id}
                  href={owner ? `/lessons/${owner.id}` : "/hanzi"}
                  title={`${word.pinyin} — ${word.meaning} — ${STATUS_META[status].label}`}
                  className={cn(
                    "rounded-xl border px-2 py-3 text-center transition-transform hover:-translate-y-0.5",
                    STATUS_META[status].chip,
                  )}
                >
                  <span className={cn("block text-2xl", hanziFont)}>{word.hanzi}</span>
                  <span className="mt-1 block truncate text-[0.65rem] text-muted-foreground">
                    {word.pinyin}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <RotateCcw className="h-3.5 w-3.5" />
          Missed words return sooner; successful words are scheduled farther out.
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
