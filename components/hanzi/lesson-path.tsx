"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  ClipboardCheck,
  Headphones,
  Layers3,
  MessageSquareText,
  Shuffle,
  Sparkles,
  Volume2,
} from "lucide-react";
import { findWord, type HskLevel } from "@/lib/hsk";
import {
  hanziLessonsForLevel,
  type HanziLessonChunk,
} from "@/lib/hanzi-lessons";
import {
  hanziLessonStats,
  type ProgressStore,
} from "@/lib/progression";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./scroll-reveal";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";

export type HanziLessonPractice =
  | "match"
  | "sound"
  | "use"
  | "test"
  | "review";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
const displayFont = "font-[family-name:var(--font-display)]";

const STEPS = [
  ["01", "Preview", "See, hear, and understand the new forms."],
  ["02", "Flashcards", "Recall meaning and sound before revealing."],
  ["03", "Match all", "Connect every form, meaning, and pinyin."],
  ["04", "Hear all", "Retrieve every form from spoken Mandarin."],
  ["05", "Use all", "Complete one contextual task for every form."],
  ["06", "Grammar", "Use the forms inside this lesson’s patterns."],
  ["07", "Lesson test", "Test form, sound, and use without retries."],
  ["08", "Review", "Mix this lesson with earlier forms."],
] as const;

function EvidenceBars({
  lesson,
  progress,
}: {
  lesson: HanziLessonChunk;
  progress: ProgressStore;
}) {
  const stats = hanziLessonStats(lesson.wordIds, progress);
  const lanes = [
    ["Form", stats.evidence.formMeaning],
    ["Sound", stats.evidence.sound],
    ["Use", stats.evidence.use],
  ] as const;
  return (
    <div className="grid grid-cols-3 gap-2" aria-label="Lesson Hanzi evidence">
      {lanes.map(([label, value]) => (
        <div key={label}>
          <div className="mb-1 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
            <span>{label}</span><span>{value}%</span>
          </div>
          <div className="h-1 overflow-hidden bg-secondary">
            <span className="block h-full origin-left bg-primary" style={{ transform: `scaleX(${value / 100})` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonCard({
  lesson,
  selected,
  progress,
  onSelect,
  delay,
}: {
  lesson: HanziLessonChunk;
  selected: boolean;
  progress: ProgressStore;
  onSelect: () => void;
  delay: number;
}) {
  const stats = hanziLessonStats(lesson.wordIds, progress);
  return (
    <ScrollReveal delay={delay}>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className={cn(
          "hanzi-lesson-gate group w-full p-5 text-left sm:p-6",
          selected && "is-selected",
        )}
      >
        <span aria-hidden="true" className={cn("absolute -right-2 -top-4 text-[7rem] leading-none opacity-[0.055]", hanziFont)}>
          {lesson.hanziTitle.slice(0, 1)}
        </span>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              HSK {lesson.level} · Lesson {String(lesson.index).padStart(2, "0")}
            </p>
            <h3 className={cn("mt-2 text-xl font-bold sm:text-2xl", displayFont)}>{lesson.title}</h3>
            <p className={cn("mt-1 text-3xl text-primary", hanziFont)}>{lesson.hanziTitle}</p>
          </div>
          <span className="inline-flex items-center gap-1 border border-foreground/30 bg-card px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide">
            <Sparkles className="h-3 w-3" /> Open
          </span>
        </div>
        <p className="relative mt-4 max-w-[54ch] text-sm leading-6 text-muted-foreground">{lesson.goal}</p>
        <div className="relative mt-5 border-t border-foreground/15 pt-4">
          <EvidenceBars lesson={lesson} progress={progress} />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{stats.proficient}/{stats.total} proficient</span>
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              Open courtyard <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </button>
    </ScrollReveal>
  );
}

export function HanziLessonPath({
  progress,
  initialLessonId,
  onPractice,
}: {
  progress: ProgressStore;
  initialLessonId?: string;
  onPractice: (kind: HanziLessonPractice, lesson: HanziLessonChunk) => void;
}) {
  const requestedLevel = initialLessonId?.startsWith("hsk2-") ? 2 : 1;
  const [level, setLevel] = useState<HskLevel>(requestedLevel);
  const lessons = useMemo(() => hanziLessonsForLevel(level), [level]);
  const [selectedId, setSelectedId] = useState(
    initialLessonId && lessons.some((lesson) => lesson.id === initialLessonId)
      ? initialLessonId
      : lessons[0].id,
  );
  const selected = lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];
  const levelStats = hanziLessonStats(
    lessons.flatMap((lesson) => lesson.wordIds),
    progress,
  );
  const lessonWords = selected.wordIds.map(findWord).filter(Boolean);
  const grammarLessons = selected.stage.grammarLessonIds
    .map((id) => GRAMMAR_LESSONS.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is (typeof GRAMMAR_LESSONS)[number] => Boolean(lesson));

  function chooseLevel(next: HskLevel) {
    const nextLessons = hanziLessonsForLevel(next);
    setLevel(next);
    setSelectedId(nextLessons[0].id);
  }

  return (
    <section className={cn(level === 1 ? "level-hsk1" : "level-hsk2")} aria-labelledby="hanzi-lessons-heading">
      <div className="hanzi-courtyard-hero overflow-hidden border border-foreground bg-card">
        <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative p-6 sm:p-9 lg:p-11">
            <span aria-hidden="true" className={cn("absolute -right-5 -top-12 text-[14rem] leading-none opacity-[0.06]", hanziFont)}>字</span>
            <p className="font-[family-name:var(--font-hand)] text-xl text-primary">one courtyard, one useful outcome</p>
            <h2 id="hanzi-lessons-heading" className={cn("relative mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl", displayFont)}>
              Build Hanzi through situations.
            </h2>
            <p className="relative mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Start anywhere. Each open lesson introduces a focused set, then asks you to recognize it, hear it, build with it, and respond with it. Later courtyards bring earlier forms back with fewer hints.
            </p>
          </div>
          <div className="relative flex min-h-64 flex-col justify-between border-t border-foreground bg-foreground p-7 text-background lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em]">
              <span>All lessons unlocked</span><Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className={cn("text-7xl leading-none text-primary", hanziFont)}>十门</p>
              <p className="mt-3 text-2xl font-bold">{levelStats.proficient} / {levelStats.total} proficient</p>
              <p className="mt-1 text-sm opacity-70">{levelStats.tried} forms tried · {levelStats.score}% evidence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-foreground py-4">
        <div className="inline-flex border border-foreground" role="group" aria-label="Hanzi lesson level">
          {([1, 2] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={level === value}
              onClick={() => chooseLevel(value)}
              className={cn(
                "min-h-11 px-5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                value === 2 && "border-l border-foreground",
                level === value ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary",
              )}
            >
              HSK {value}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ten open lessons · no linear gate</p>
      </div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ScrollReveal>
            <div className="eave-panel overflow-hidden p-6 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Lesson {selected.index} · HSK {selected.level}</p>
                  <h3 className={cn("mt-2 text-3xl font-bold", displayFont)}>{selected.title}</h3>
                  <p className={cn("mt-1 text-5xl text-primary", hanziFont)}>{selected.hanziTitle}</p>
                </div>
                <span className="seal h-12 w-12 text-2xl">开</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">{selected.scenario}</p>

              <div className="mt-6 border-y border-foreground/20 py-4">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">New forms in this courtyard</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lessonWords.map((word) => word && (
                    <span key={word.id} className="inline-flex items-baseline gap-1.5 border border-foreground/20 bg-background px-2.5 py-1.5">
                      <span className={cn("text-xl", hanziFont)}>{word.hanzi}</span>
                      <span className="text-[0.65rem] text-muted-foreground">{word.pinyin}</span>
                    </span>
                  ))}
                </div>
                {selected.priorWordIds.length > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Cumulative review can draw from {selected.priorWordIds.length} earlier HSK {selected.level} forms.
                  </p>
                )}
              </div>

              <div className="mt-5 border border-foreground/20 bg-[oklch(var(--poster-cyan)/0.12)] p-4">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Grammar these Hanzi unlock
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {grammarLessons.map((grammar) => (
                    <Link
                      key={grammar.id}
                      href={`/grammar#${grammar.id}`}
                      className="inline-flex min-h-11 items-center gap-2 border border-foreground bg-background px-3 py-2 text-xs font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className={cn("text-lg text-primary", hanziFont)}>{grammar.hanzi}</span>
                      {grammar.title}
                    </Link>
                  ))}
                </div>
              </div>

              <ol className="mt-6 grid gap-x-5 gap-y-3 sm:grid-cols-2">
                {STEPS.map(([number, label, description]) => (
                  <li key={number} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-foreground/15 pt-3">
                    <span className="text-xs font-bold text-primary">{number}</span>
                    <div><p className="text-sm font-bold">{label}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p></div>
                  </li>
                ))}
              </ol>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                <Link href={`/flashcards?stage=${selected.id}`} className="hanzi-practice-action">
                  <BookOpenText className="h-4 w-4" /><span><strong>Flashcards</strong><small>Recall before reveal</small></span>
                </Link>
                <button type="button" onClick={() => onPractice("match", selected)} className="hanzi-practice-action">
                  <Shuffle className="h-4 w-4" /><span><strong>Match every form</strong><small>{selected.wordIds.length} forms · meaning + pinyin</small></span>
                </button>
                <button type="button" onClick={() => onPractice("sound", selected)} className="hanzi-practice-action">
                  <Headphones className="h-4 w-4" /><span><strong>Hear every form</strong><small>{selected.wordIds.length} listening checks</small></span>
                </button>
                <button type="button" onClick={() => onPractice("use", selected)} className="hanzi-practice-action">
                  <MessageSquareText className="h-4 w-4" /><span><strong>Use every form</strong><small>{selected.wordIds.length} contextual tasks</small></span>
                </button>
                <button type="button" onClick={() => onPractice("test", selected)} className="hanzi-practice-action">
                  <ClipboardCheck className="h-4 w-4" /><span><strong>Lesson test</strong><small>Form, sound, and use · first try</small></span>
                </button>
                <button type="button" onClick={() => onPractice("review", selected)} className="hanzi-practice-action">
                  <Volume2 className="h-4 w-4" /><span><strong>Cumulative review</strong><small>Earlier forms return</small></span>
                </button>
              </div>
              <Link href={`/lessons/${selected.id}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:underline">
                Continue into the full conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </aside>

        <ol className="space-y-4">
          {lessons.map((lesson, index) => (
            <li key={lesson.id}>
              <LessonCard
                lesson={lesson}
                selected={lesson.id === selected.id}
                progress={progress}
                onSelect={() => setSelectedId(lesson.id)}
                delay={(index % 4) * 70}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
