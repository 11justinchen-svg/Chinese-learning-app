"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  Check,
  CheckSquare2,
  Landmark,
  LayoutGrid,
  MessageCircle,
  Route,
  Search,
  Square,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import {
  HSK1,
  HSK2,
  findWord,
  type ComponentRole,
  type HskWord,
} from "@/lib/hsk";
import {
  HANZI_TOPIC_SETS,
  findHanziTopic,
  makeHanziLessonMatchPractice,
  makeHanziLessonUsePractice,
  makeHanziSetTest,
  makeHanziWordTest,
  wordsForTopic,
  type HanziTopicId,
} from "@/lib/hanzi-practice";
import { stageForWord } from "@/lib/data/stages";
import type { Exercise } from "@/lib/data/stages/types";
import type { HanziLessonChunk } from "@/lib/hanzi-lessons";
import { ExercisePlayer, type PlayerResults } from "@/components/exercises/exercise-player";
import {
  HanziLessonPath,
  type HanziLessonPractice,
} from "@/components/hanzi/lesson-path";
import {
  hanziProficiency,
  loadProgress,
  recordTeachSeen,
  saveProgress,
  type HanziProficiency,
  type HanziProficiencyStatus,
  type ProgressStore,
} from "@/lib/progression";
import { speak } from "@/lib/speech";
import { speechFallbackMessage, useMandarinSpeech } from "@/lib/use-mandarin-speech";
import { cn } from "@/lib/utils";
import {
  GRAMMAR_LESSONS,
  hanziRequirementsForGrammar,
} from "@/lib/data/grammar";

type CollectionId = "hsk1" | "hsk2" | HanziTopicId;
type HanziView = "lessons" | "overview" | "sets";
type PracticeKind = "standard" | "match" | "use";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
const readingHanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";
const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

const ROLE: Record<ComponentRole, { label: string; cls: string }> = {
  semantic: { label: "meaning cue", cls: "bg-primary/15 text-primary" },
  part: { label: "component", cls: "bg-[oklch(var(--poster-yellow)/0.35)] text-foreground" },
  form: { label: "written form", cls: "bg-muted text-muted-foreground" },
};

const PROFICIENCY_META: Record<
  HanziProficiencyStatus,
  { label: string; className: string }
> = {
  untested: {
    label: "Not tested",
    className: "border-border bg-background text-muted-foreground",
  },
  started: {
    label: "Started",
    className: "border-[oklch(var(--poster-yellow))] bg-[oklch(var(--poster-yellow)/0.2)]",
  },
  building: {
    label: "Building",
    className: "border-[oklch(var(--poster-cyan))] bg-[oklch(var(--poster-cyan)/0.2)]",
  },
  proficient: {
    label: "Proficient",
    className: "border-[oklch(var(--poster-green))] bg-[oklch(var(--poster-green)/0.18)]",
  },
};

function collectionWords(collectionId: CollectionId): HskWord[] {
  if (collectionId === "hsk1") return HSK1;
  if (collectionId === "hsk2") return HSK2;
  const topic = findHanziTopic(collectionId);
  return topic ? wordsForTopic(topic) : HSK1;
}

function collectionTitle(collectionId: CollectionId): string {
  if (collectionId === "hsk1") return "HSK 1";
  if (collectionId === "hsk2") return "HSK 2";
  return findHanziTopic(collectionId)?.title ?? "Hanzi";
}

function ProficiencyChip({ value }: { value: HanziProficiency }) {
  const meta = PROFICIENCY_META[value.status];
  return (
    <span className={cn("inline-flex border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-wide", meta.className)}>
      {meta.label} · {value.score}%
    </span>
  );
}

function EvidenceRow({ value }: { value: HanziProficiency }) {
  const items = [
    ["Form + meaning", value.evidence.formMeaning],
    ["Sound", value.evidence.sound],
    ["Use", value.evidence.use],
  ] as const;
  return (
    <div className="mt-4 grid grid-cols-3 border border-foreground/20" aria-label="Hanzi proficiency evidence">
      {items.map(([label, earned], index) => (
        <div key={label} className={cn("px-2 py-3 text-center", index > 0 && "border-l border-foreground/20")}>
          <span className={cn("mx-auto grid h-5 w-5 place-items-center border", earned ? "border-[oklch(var(--poster-green))] bg-[oklch(var(--poster-green))] text-background" : "border-border text-muted-foreground")}>
            {earned && <Check className="h-3 w-3" />}
          </span>
          <span className="mt-1 block text-[0.68rem] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function Breakdown({
  word,
  progress,
  onTest,
}: {
  word: HskWord;
  progress: ProgressStore;
  onTest: () => void;
}) {
  const speech = useMandarinSpeech();
  const speechFallback = speechFallbackMessage(speech);
  const proficiency = hanziProficiency(word.id, progress);
  const owner = stageForWord(word.id);
  const componentWords = word.characters
    .flatMap((character) => character.components)
    .filter((component) => component.role !== "form")
    .map((component) => component.meaning);

  return (
    <div className="poster-panel relative overflow-hidden p-6 sm:p-7">
      <span aria-hidden="true" className={cn("absolute -right-5 -top-8 text-[9rem] leading-none opacity-[0.06]", hanziFont)}>
        {word.hanzi.slice(0, 1)}
      </span>
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-4">
          <span className={cn("text-7xl leading-none text-foreground", hanziFont)}>{word.hanzi}</span>
          <div className="min-w-0">
            <p className={cn("text-lg text-muted-foreground", displayFont)}>{word.pinyin}</p>
            <p className="text-base font-semibold">{word.meaning}</p>
          </div>
        </div>
        {speech === "ready" && (
          <button type="button" onClick={() => speak(word.hanzi, { rate: 0.72 })} aria-label={`Hear ${word.hanzi}`} className="grid h-11 w-11 shrink-0 place-items-center border border-foreground bg-[oklch(var(--poster-cyan))] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Volume2 className="h-5 w-5" />
          </button>
        )}
      </div>
      {speechFallback && <p className="mt-3 text-xs text-muted-foreground" role="status">{speechFallback}</p>}

      <div className="mt-5 border-y border-foreground/20 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Your evidence</p>
            <div className="mt-2"><ProficiencyChip value={proficiency} /></div>
          </div>
          <button type="button" onClick={onTest} className="stamp-button min-h-11">
            <Zap className="h-4 w-4" /> Test this Hanzi
          </button>
        </div>
        <EvidenceRow value={proficiency} />
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Proficient requires first-try evidence for form and meaning, sound, and use in context. Viewing or flashcards alone do not count.
        </p>
        {!proficiency.evidence.use && owner && (
          <Link href={`/lessons/${owner.id}`} className="mt-3 inline-flex min-h-11 items-center gap-2 border border-foreground bg-card px-3 py-2 text-xs font-bold hover:bg-secondary">
            <BookOpenText className="h-4 w-4" /> Use it in {owner.title}
          </Link>
        )}
      </div>

      {word.meanings.length > 1 && <p className="mt-4 text-sm text-muted-foreground">{word.meanings.join(" · ")}</p>}
      <div className="mt-5 bg-[oklch(var(--poster-yellow)/0.2)] px-4 py-3">
        <p className="font-[family-name:var(--font-hand)] text-lg">memory hook, not etymology</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {componentWords.length > 0
            ? `Picture “${componentWords.join(" + ")}” as a personal cue for ${word.hanzi}. The labels below describe visible form or function, not a historical origin claim.`
            : `Use the sound ${word.pinyin} and a real spoken example as your memory cue for this written form.`}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {word.characters.map((character) => (
          <div key={`${word.id}-${character.char}`}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className={cn("text-3xl", readingHanziFont)}>{character.char}</span>
              <span className="text-sm text-muted-foreground">{character.pinyin}</span>
              {character.atomic && <span className="border border-border bg-secondary px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground">single form</span>}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {character.components.map((component, index) => (
                <div key={`${component.char}-${index}`} className="flex items-center gap-3 border border-border bg-background px-3 py-2">
                  <span className={cn("text-2xl leading-none", readingHanziFont)}>{component.char}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{component.meaning}</p>
                    <span className={cn("mt-0.5 inline-block px-1.5 py-0.5 text-[0.65rem] font-medium", ROLE[component.role].cls)}>
                      {ROLE[component.role].label}{component.variantOf ? ` · form of ${component.variantOf}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HanziExplorer({
  initialWordId,
  initialSetId,
  initialLessonId,
  initialGrammarId,
}: {
  initialWordId?: string;
  initialSetId?: string;
  initialLessonId?: string;
  initialGrammarId?: string;
}) {
  const requestedGrammar = GRAMMAR_LESSONS.find(
    (lesson) => lesson.id === initialGrammarId,
  );
  const requestedGrammarWordIds = requestedGrammar
    ? hanziRequirementsForGrammar(requestedGrammar.id)
        .map((requirement) => requirement.wordId)
        .filter((wordId) => Boolean(findWord(wordId)))
    : [];
  const requestedGrammarFirstWord = findWord(requestedGrammarWordIds[0]);
  const initialCollection: CollectionId =
    requestedGrammarFirstWord?.id.startsWith("hsk2-")
      ? "hsk2"
      : initialSetId && (initialSetId === "hsk1" || initialSetId === "hsk2" || findHanziTopic(initialSetId))
      ? (initialSetId as CollectionId)
      : initialWordId?.startsWith("hsk2-")
        ? "hsk2"
        : "hsk1";
  const [collectionId, setCollectionId] = useState<CollectionId>(initialCollection);
  const [grammarFocusId, setGrammarFocusId] = useState<string | null>(
    requestedGrammar && requestedGrammarWordIds.length > 0
      ? requestedGrammar.id
      : null,
  );
  const [view, setView] = useState<HanziView>(
    requestedGrammar
      ? "overview"
      : initialWordId
      ? "overview"
      : initialSetId && findHanziTopic(initialSetId)
        ? "sets"
        : "lessons",
  );
  const grammarFocus = GRAMMAR_LESSONS.find(
    (lesson) => lesson.id === grammarFocusId,
  );
  const grammarFocusWordIds = grammarFocus
    ? hanziRequirementsForGrammar(grammarFocus.id).map(
        (requirement) => requirement.wordId,
      )
    : [];
  const words = useMemo(
    () =>
      grammarFocus
        ? grammarFocusWordIds
            .map(findWord)
            .filter((word): word is HskWord => Boolean(word))
        : collectionWords(collectionId),
    [collectionId, grammarFocus, grammarFocusWordIds],
  );
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(
    initialWordId && findWord(initialWordId)
      ? initialWordId
      : requestedGrammarWordIds[0] ?? words[0].id,
  );
  const [customIds, setCustomIds] = useState<string[]>([]);
  const [testSeed, setTestSeed] = useState(requestedGrammar ? 1 : 0);
  const [testWordIds, setTestWordIds] = useState<string[]>(
    requestedGrammarWordIds,
  );
  const [testStageId, setTestStageId] = useState<string | null>(null);
  const [practiceKind, setPracticeKind] = useState<PracticeKind>("standard");
  const [playerMode, setPlayerMode] = useState<"practice" | "quiz">(
    requestedGrammar ? "practice" : "quiz",
  );
  const [testTitle, setTestTitle] = useState(
    requestedGrammar ? `${requestedGrammar.title}: prerequisite Hanzi` : "",
  );
  const [testOpen, setTestOpen] = useState(Boolean(requestedGrammar));
  const [testResult, setTestResult] = useState<PlayerResults | null>(null);
  const [progress, setProgress] = useState<ProgressStore>(EMPTY_PROGRESS);

  useEffect(() => setProgress(loadProgress()), []);

  const selected = findWord(selectedId) ?? words[0];

  useEffect(() => {
    if (!selected || view === "lessons") return;
    const next = recordTeachSeen(loadProgress(), [selected.id]);
    saveProgress(next);
    setProgress(next);
  }, [selected, view]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter(
      (word) =>
        word.hanzi.includes(q) ||
        word.pinyin.toLowerCase().includes(q) ||
        word.pinyin.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().includes(q) ||
        word.meaning.toLowerCase().includes(q),
    );
  }, [query, words]);

  const test = useMemo(
    (): Exercise[] => {
      if (practiceKind === "match")
        return makeHanziLessonMatchPractice(testWordIds, testSeed);
      if (practiceKind === "use" && testStageId)
        return makeHanziLessonUsePractice(testStageId, testSeed);
      return testWordIds.length === 1
        ? makeHanziWordTest(testWordIds[0], testSeed)
        : makeHanziSetTest(testWordIds, testSeed);
    },
    [practiceKind, testSeed, testStageId, testWordIds],
  );
  const topic = grammarFocus ? undefined : findHanziTopic(collectionId);
  const activeCollectionTitle = grammarFocus
    ? `${grammarFocus.title} prerequisites`
    : collectionTitle(collectionId);

  function chooseCollection(next: CollectionId) {
    const nextWords = collectionWords(next);
    setGrammarFocusId(null);
    setCollectionId(next);
    setSelectedId(nextWords[0].id);
    setQuery("");
    setTestOpen(false);
    setTestResult(null);
  }

  function revealPractice() {
    window.requestAnimationFrame(() => {
      document.getElementById("hanzi-practice-panel")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  function startTest(
    ids: string[],
    title: string,
    mode: "practice" | "quiz" = "quiz",
  ) {
    if (ids.length === 0) return;
    setTestWordIds(ids);
    setTestStageId(null);
    setPracticeKind("standard");
    setPlayerMode(mode);
    setTestTitle(title);
    setTestSeed((value) => value + 1);
    setTestResult(null);
    setTestOpen(true);
    revealPractice();
  }

  function startLessonPractice(
    kind: HanziLessonPractice,
    lesson: HanziLessonChunk,
  ) {
    setTestWordIds(
      kind === "review" ? lesson.cumulativeWordIds : lesson.wordIds,
    );
    setTestStageId(lesson.id);
    setPracticeKind(kind === "review" ? "standard" : kind);
    setPlayerMode("practice");
    setTestTitle(
      kind === "match"
        ? `Lesson ${lesson.index}: match form, meaning, and sound`
        : kind === "use"
          ? `Lesson ${lesson.index}: build and respond`
          : `Lesson ${lesson.index}: cumulative review`,
    );
    setTestSeed((value) => value + 1);
    setTestResult(null);
    setTestOpen(true);
    revealPractice();
  }

  function retakeTest() {
    setTestSeed((value) => value + 1);
    setTestResult(null);
  }

  function finishTest(result: PlayerResults) {
    setTestResult(result);
    setProgress(loadProgress());
  }

  function toggleCustom(wordId: string) {
    setCustomIds((current) =>
      current.includes(wordId)
        ? current.filter((id) => id !== wordId)
        : [...current, wordId],
    );
  }

  function chooseView(next: HanziView) {
    if (grammarFocusId) setGrammarFocusId(null);
    setView(next);
    if (next === "sets" && !findHanziTopic(collectionId)) {
      chooseCollection("shopping");
    }
    if (next === "overview" && findHanziTopic(collectionId)) {
      chooseCollection(initialWordId?.startsWith("hsk2-") ? "hsk2" : "hsk1");
    }
  }

  return (
    <div className={cn(collectionId === "hsk2" ? "level-hsk2" : "level-hsk1")}>
      <nav className="mb-9 border-y border-foreground bg-card" aria-label="Hanzi study areas">
        <div className="grid sm:grid-cols-3" role="tablist">
          {([
            ["lessons", Route, "Lesson courtyards", "Build skills in focused chunks"],
            ["overview", LayoutGrid, "General overview", "Browse and test every form"],
            ["sets", Landmark, "Real-life sets", "Shop, travel, eat, and check in"],
          ] as const).map(([id, Icon, label, note], index) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => chooseView(id)}
              className={cn(
                "flex min-h-20 items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5",
                index > 0 && "border-t border-foreground sm:border-l sm:border-t-0",
                view === id ? "bg-foreground text-background" : "hover:bg-secondary",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span><strong className="block text-sm">{label}</strong><small className={cn("mt-0.5 block text-[0.68rem]", view === id ? "opacity-70" : "text-muted-foreground")}>{note}</small></span>
            </button>
          ))}
        </div>
      </nav>

      {testOpen && (
        <section id="hanzi-practice-panel" className="poster-panel my-8 scroll-mt-20 p-5 sm:p-7" aria-label={testTitle}>
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-[family-name:var(--font-hand)] text-lg text-primary">form, sound, use</p>
              <h2 className="text-xl font-bold">{testTitle}</h2>
            </div>
            <button type="button" onClick={() => setTestOpen(false)} aria-label="Close test" className="grid h-11 w-11 place-items-center border border-border hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="h-4 w-4" /></button>
          </div>
          {testResult ? (
            <div className="py-7">
              <Check className="h-7 w-7 text-primary" />
              <p className={cn("mt-3 text-5xl", hanziFont)}>{testResult.firstTryCorrect} / {testResult.total}</p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Your evidence map has been updated. A word becomes proficient only after form/meaning, sound, and contextual use are all demonstrated.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={retakeTest} className="stamp-button">Retake with a new mix</button>
                <button type="button" onClick={() => setTestOpen(false)} className="inline-flex min-h-11 items-center border border-foreground bg-card px-4 py-2 text-sm font-bold hover:bg-secondary">Return to the set</button>
              </div>
            </div>
          ) : (
            <ExercisePlayer key={`${practiceKind}-${testStageId}-${testSeed}`} title={testTitle} exercises={test} mode={playerMode} onFinish={finishTest} />
          )}
        </section>
      )}

      {view === "lessons" ? (
        <HanziLessonPath
          progress={progress}
          initialLessonId={initialLessonId}
          onPractice={startLessonPractice}
        />
      ) : (
        <>
          <section className="border-b border-foreground pb-7" aria-labelledby="collections-heading">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p id="collections-heading" className="font-[family-name:var(--font-hand)] text-xl text-primary">
                  {grammarFocus
                    ? "forms that unlock this grammar pattern"
                    : view === "overview"
                      ? "the whole character field"
                      : "language for a real place"}
                </p>
                <div className="mt-2 inline-flex border border-foreground" role="group" aria-label="HSK level">
                  {(["hsk1", "hsk2"] as const).map((id, index) => (
                    <button key={id} type="button" aria-pressed={collectionId === id} onClick={() => chooseCollection(id)} className={cn("min-h-11 px-5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", index > 0 && "border-l border-foreground", collectionId === id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary") }>
                      {id === "hsk1" ? "HSK 1" : "HSK 2"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => startTest(words.map((word) => word.id), `${activeCollectionTitle} mixed test`, grammarFocus ? "practice" : "quiz")} className="stamp-button min-h-11">
                  <Zap className="h-4 w-4" /> {grammarFocus ? "Practice prerequisites" : view === "overview" ? "General test" : "Test this set"}
                </button>
                <button type="button" disabled={customIds.length === 0} onClick={() => startTest(customIds, `Your ${customIds.length}-Hanzi test`, "practice")} className="inline-flex min-h-11 items-center gap-2 border border-foreground bg-card px-4 py-2 text-sm font-bold hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45">
                  <CheckSquare2 className="h-4 w-4" /> Test selected ({customIds.length})
                </button>
              </div>
            </div>

            {grammarFocus && (
              <div className="mt-6 grid gap-4 border border-foreground bg-[oklch(var(--poster-cyan)/0.15)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Grammar prerequisite set · {words.length} written form{words.length === 1 ? "" : "s"}
                  </p>
                  <p className="mt-1 text-lg font-bold">{grammarFocus.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{grammarFocus.pattern}</p>
                </div>
                <Link href={`/grammar#${grammarFocus.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 border border-foreground bg-card px-4 py-2 text-sm font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <BookOpenText className="h-4 w-4" /> Return to grammar
                </Link>
              </div>
            )}

            {view === "sets" && (
              <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-label="Real-life Hanzi sets">
                {HANZI_TOPIC_SETS.map((set, index) => (
                  <button key={set.id} type="button" aria-pressed={collectionId === set.id} onClick={() => chooseCollection(set.id)} className={cn("min-h-28 border border-foreground p-3 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", collectionId === set.id ? "bg-[oklch(var(--poster-yellow))] shadow-[3px_3px_0_oklch(var(--foreground))]" : index % 2 === 0 ? "bg-[oklch(var(--poster-cyan)/0.25)]" : "bg-card") }>
                    <span className={cn("block text-2xl", hanziFont)}>{set.hanziTitle}</span>
                    <span className="mt-2 block text-sm font-bold">{set.title}</span>
                    <span className="mt-1 block text-[0.68rem] text-muted-foreground">{set.wordIds.length} useful forms</span>
                  </button>
                ))}
              </div>
            )}

            {view === "sets" && topic && (
              <div className="mt-5 grid gap-4 border border-foreground bg-[oklch(var(--poster-yellow)/0.16)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div><p className="text-sm font-bold">{topic.goal}</p><p className="mt-1 text-xs text-muted-foreground">{topic.description}</p></div>
                {topic.scenarioId && (
                  <Link href={`/conversation?scenario=${topic.scenarioId}`} className="inline-flex min-h-11 items-center justify-center gap-2 border border-foreground bg-card px-4 py-2 text-sm font-bold hover:bg-secondary">
                    <MessageCircle className="h-4 w-4" /> Speak this set
                  </Link>
                )}
              </div>
            )}
          </section>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,390px)_1fr]">
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Breakdown word={selected} progress={progress} onTest={() => startTest([selected.id], `${selected.hanzi} focused test`, "practice")} />
            </div>
            <div>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search Hanzi, pinyin, or meaning" placeholder={`Search ${words.length} forms, pinyin, or meaning`} className="min-h-12 w-full border border-foreground bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring" />
              </div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{results.length} written forms</p>
                <p className="text-xs text-muted-foreground">Use the square to build your own test</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                {results.map((word) => {
                  const proficiency = hanziProficiency(word.id, progress);
                  const selectedForTest = customIds.includes(word.id);
                  return (
                    <div key={word.id} className={cn("word-tile relative border bg-card transition-colors hover:border-primary", word.id === selected.id ? "border-primary bg-primary/10" : "border-border") }>
                      <button type="button" onClick={() => setSelectedId(word.id)} className="min-h-32 w-full p-3 pr-10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                        <div className={cn("text-4xl leading-none", hanziFont)}>{word.hanzi}</div>
                        <div className={cn("mt-2 text-xs text-muted-foreground", displayFont)}>{word.pinyin}</div>
                        <div className="truncate text-xs text-muted-foreground">{word.meaning}</div>
                        <span className="mt-2 block text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">{PROFICIENCY_META[proficiency.status].label} · {proficiency.score}%</span>
                      </button>
                      <button type="button" aria-pressed={selectedForTest} aria-label={`${selectedForTest ? "Remove" : "Add"} ${word.hanzi} ${selectedForTest ? "from" : "to"} custom test`} onClick={() => toggleCustom(word.id)} className={cn("absolute right-2 top-2 grid h-9 w-9 place-items-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selectedForTest ? "border-foreground bg-[oklch(var(--poster-yellow))]" : "border-border bg-background hover:border-primary") }>
                        {selectedForTest ? <CheckSquare2 className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
