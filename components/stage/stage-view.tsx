"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Dumbbell,
  Flag,
  Lock,
  MessageCircle,
} from "lucide-react";
import { STAGES, findStage } from "@/lib/data/stages";
import type { ExerciseBlock } from "@/lib/data/stages/types";
import {
  loadProgress,
  recordBlockDone,
  recordDialogueViewed,
  recordTeachSeen,
  saveProgress,
  stageWordStats,
  type ProgressStore,
} from "@/lib/progression";
import { loadSrs, type SrsStore } from "@/lib/srs";
import { cn } from "@/lib/utils";
import { DialoguePanel } from "./dialogue-panel";
import { TeachCards } from "./teach-cards";
import { GrammarIntro } from "./grammar-intro";
import { CheckpointPanel } from "./checkpoint-panel";
import { ExercisePlayer } from "@/components/exercises/exercise-player";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

type SectionId = "dialogue" | "teach" | `block:${string}` | "checkpoint";

export function StageView({ stageId }: { stageId: string }) {
  const stage = findStage(stageId);
  const [progress, setProgress] = useState<ProgressStore>({
    version: 1,
    words: {},
    stages: {},
  });
  const [srs, setSrs] = useState<SrsStore>({});
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  const refresh = useCallback(() => {
    setProgress(loadProgress());
    setSrs(loadSrs());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    refresh();
    setReady(true);
  }, [refresh]);

  const sections = useMemo<
    { id: SectionId; label: string; done: boolean }[]
  >(() => {
    if (!stage) return [];
    const sp = progress.stages[stage.id];
    const out: { id: SectionId; label: string; done: boolean }[] = [];
    if (stage.dialogue.length > 0)
      out.push({
        id: "dialogue",
        label: "Conversation",
        done: Boolean(sp?.dialogueViewed),
      });
    out.push({
      id: "teach",
      label: "New words",
      done: stage.wordIds.every((id) => progress.words[id]?.seenAt),
    });
    for (const b of stage.blocks)
      out.push({
        id: `block:${b.id}`,
        label: b.title,
        done: Boolean(sp?.blocksDone.includes(b.id)),
      });
    out.push({
      id: "checkpoint",
      label: "Checkpoint",
      done: Boolean(sp?.completedAt),
    });
    return out;
  }, [stage, progress]);

  // First incomplete section is the frontier; everything before it stays open.
  const frontier = useMemo(() => {
    const i = sections.findIndex((s) => !s.done);
    return i === -1 ? sections.length - 1 : i;
  }, [sections]);

  useEffect(() => {
    if (ready && active === null && sections.length > 0)
      setActive(sections[frontier].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, sections.length]);

  if (!stage) {
    return (
      <Missing text="This stage doesn't exist.">
        <BackToPath />
      </Missing>
    );
  }
  if (!ready) return <main className="min-h-screen bg-background" />;

  const { total, learned } = stageWordStats(stage, progress, srs);
  const blockById = new Map(stage.blocks.map((b) => [b.id, b]));

  function sectionIcon(id: SectionId) {
    if (id === "dialogue") return <MessageCircle className="h-4 w-4" />;
    if (id === "teach") return <BookOpen className="h-4 w-4" />;
    if (id === "checkpoint") return <Flag className="h-4 w-4" />;
    return <Dumbbell className="h-4 w-4" />;
  }

  return (
    <main className="min-h-screen pb-32 pt-10 text-foreground">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <BackToPath />

        <header className="eave-panel mt-9 overflow-hidden px-6 py-8 sm:px-9 sm:py-10">
          <span className={cn("pointer-events-none absolute -right-3 -top-6 text-[9rem] leading-none text-accent opacity-[0.06]", hanziFont)}>
            {stage.hanziTitle.slice(0, 1)}
          </span>
          <p
            className={cn(
              "text-xs uppercase tracking-[0.3em] text-muted-foreground",
              displayFont,
            )}
          >
            第 {String(stage.index).padStart(2, "0")} 门 · {stage.scenario}
          </p>
          <div className="mt-3 flex items-baseline gap-4">
            <span className={cn("text-5xl sm:text-6xl", hanziFont)}>
              {stage.hanziTitle}
            </span>
            <h1 className={cn("text-2xl font-bold sm:text-3xl", displayFont)}>
              {stage.title}
            </h1>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {stage.description}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 w-40 overflow-hidden bg-secondary">
              <div
                className="h-full bg-primary"
                style={{ width: `${(learned / total) * 100}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {learned} / {total} words learned
            </span>
          </div>
        </header>

        <ol className="mt-8 space-y-4">
          {sections.map((section, i) => {
            const locked = i > frontier;
            const isActive = active === section.id;
            const block =
              section.id.startsWith("block:") &&
              blockById.get(section.id.slice("block:".length));
            return (
              <li
                key={section.id}
                className={cn(
                  "border bg-card/80",
                  isActive ? "eave-panel border-primary/40" : "border-border",
                  locked && "opacity-50",
                )}
              >
                <button
                  type="button"
                  disabled={locked}
                  aria-expanded={isActive}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  onClick={() => setActive(isActive ? null : section.id)}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                      section.done
                        ? "border-green-600/50 bg-green-600/10 text-green-700 dark:text-green-500"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {locked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : section.done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      sectionIcon(section.id)
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {section.label}
                    </span>
                    {block && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {block.kind === "grammar"
                          ? "Grammar drill"
                          : "Vocabulary"}{" "}
                        · {block.exercises.length} exercises
                      </span>
                    )}
                  </span>
                </button>

                {isActive && !locked && (
                  <div className="border-t border-border/60 p-5 sm:p-6">
                    {section.id === "dialogue" && (
                      <DialoguePanel
                        dialogue={stage.dialogue}
                        onViewed={() => {
                          saveProgress(
                            recordDialogueViewed(loadProgress(), stage.id),
                          );
                          refresh();
                          setActive("teach");
                        }}
                      />
                    )}
                    {section.id === "teach" && (
                      <TeachCards
                        cards={stage.teach}
                        onWordSeen={(wordId) => {
                          saveProgress(
                            recordTeachSeen(loadProgress(), [wordId]),
                          );
                        }}
                        onDone={() => {
                          // Teach lists can omit words; mark the rest seen so
                          // the section completes.
                          saveProgress(
                            recordTeachSeen(loadProgress(), stage.wordIds),
                          );
                          refresh();
                          const next = sections.find(
                            (s) =>
                              s.id.startsWith("block:") ||
                              s.id === "checkpoint",
                          );
                          if (next) setActive(next.id);
                        }}
                      />
                    )}
                    {block && (
                      <div className="space-y-5">
                        {block.kind === "grammar" && block.grammarLessonId && (
                          <GrammarIntro lessonId={block.grammarLessonId} />
                        )}
                        <ExercisePlayer
                          title={block.title}
                          exercises={block.exercises}
                          mode="practice"
                          onFinish={() => {
                            saveProgress(
                              recordBlockDone(
                                loadProgress(),
                                stage.id,
                                block.id,
                              ),
                            );
                            refresh();
                            const idx = sections.findIndex(
                              (s) => s.id === section.id,
                            );
                            const next = sections[idx + 1];
                            if (next) setActive(next.id);
                          }}
                        />
                      </div>
                    )}
                    {section.id === "checkpoint" && (
                      <CheckpointPanel
                        stage={stage}
                        nextStageId={
                          STAGES.find((s) => s.index === stage.index + 1)?.id
                        }
                        onProgressChange={refresh}
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}

function BackToPath() {
  return (
    <Link
      href="/lessons"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      All stages
    </Link>
  );
}

function Missing({
  text,
  icon,
  children,
}: {
  text: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <div className="text-center">
        {icon}
        <p className="mt-4 text-lg font-semibold">{text}</p>
        <div className="mt-4">{children}</div>
      </div>
    </main>
  );
}
