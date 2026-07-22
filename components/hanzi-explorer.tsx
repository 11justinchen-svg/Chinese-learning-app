"use client";

import { useMemo, useState } from "react";
import { Check, Search, Volume2, X, Zap } from "lucide-react";
import {
  wordsForLevel,
  type ComponentRole,
  type HskLevel,
  type HskWord,
} from "@/lib/hsk";
import type { ChoiceExercise } from "@/lib/data/stages/types";
import { ExercisePlayer, type PlayerResults } from "@/components/exercises/exercise-player";
import { speak } from "@/lib/speech";
import { speechFallbackMessage, useMandarinSpeech } from "@/lib/use-mandarin-speech";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
const readingHanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const ROLE: Record<ComponentRole, { label: string; cls: string }> = {
  semantic: { label: "meaning cue", cls: "bg-primary/15 text-primary" },
  part: { label: "component", cls: "bg-[oklch(var(--poster-yellow)/0.35)] text-foreground" },
  form: { label: "written form", cls: "bg-muted text-muted-foreground" },
};

function shortMeaning(word: HskWord): string {
  return word.meaning.split(";")[0].trim();
}

function quickTest(words: HskWord[], level: HskLevel, seed: number): ChoiceExercise[] {
  return Array.from({ length: 5 }, (_, index) => {
    const word = words[(seed * 17 + index * 29) % words.length];
    const hanziToMeaning = index % 2 === 0;
    const answer = hanziToMeaning ? shortMeaning(word) : word.hanzi;
    const distractors: string[] = [];
    for (let offset = 1; distractors.length < 3; offset += 1) {
      const candidate = words[(words.indexOf(word) + offset * 11) % words.length];
      const value = hanziToMeaning ? shortMeaning(candidate) : candidate.hanzi;
      if (value !== answer && !distractors.includes(value)) distractors.push(value);
    }
    return {
      id: `hanzi-hsk${level}-quick-${seed}-${index + 1}`,
      kind: "choice",
      direction: hanziToMeaning ? "hanzi-en" : "en-hanzi",
      wordIds: [word.id],
      question: hanziToMeaning ? word.hanzi : shortMeaning(word),
      questionPinyin: hanziToMeaning ? word.pinyin : undefined,
      choices: [answer, ...distractors],
      answer,
      explain: `${word.hanzi} (${word.pinyin}): ${shortMeaning(word)}`,
    };
  });
}

function Breakdown({ word }: { word: HskWord }) {
  const speech = useMandarinSpeech();
  const speechFallback = speechFallbackMessage(speech);
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
        <div className="flex items-baseline gap-4">
          <span className={cn("text-7xl leading-none text-foreground", hanziFont)}>{word.hanzi}</span>
          <div>
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
      {word.meanings.length > 1 && <p className="mt-3 text-sm text-muted-foreground">{word.meanings.join(" · ")}</p>}

      <div className="mt-6 border-y border-foreground/20 bg-[oklch(var(--poster-yellow)/0.2)] px-4 py-3">
        <p className="font-[family-name:var(--font-hand)] text-lg">memory hook, not etymology</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {componentWords.length > 0
            ? `Picture “${componentWords.join(" + ")}” as a personal cue for ${word.hanzi}. The component labels below describe form or function, not a historical origin claim.`
            : `Use the sound ${word.pinyin} and the spoken example as your memory cue for this single written form.`}
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

export function HanziExplorer() {
  const [level, setLevel] = useState<HskLevel>(1);
  const words = wordsForLevel(level);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(words[0].id);
  const [testSeed, setTestSeed] = useState(0);
  const [testOpen, setTestOpen] = useState(false);
  const [testResult, setTestResult] = useState<PlayerResults | null>(null);

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

  const selected = words.find((word) => word.id === selectedId) ?? words[0];
  const test = useMemo(() => quickTest(words, level, testSeed), [level, testSeed, words]);

  function chooseLevel(next: HskLevel) {
    const nextWords = wordsForLevel(next);
    setLevel(next);
    setSelectedId(nextWords[0].id);
    setQuery("");
    setTestOpen(false);
    setTestResult(null);
  }

  function startTest() {
    setTestSeed((value) => value + 1);
    setTestResult(null);
    setTestOpen(true);
  }

  return (
    <div className={cn(level === 1 ? "level-hsk1" : "level-hsk2")}>
      <div className="mb-7 flex flex-col justify-between gap-4 border-b border-foreground pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-[family-name:var(--font-hand)] text-xl text-primary">look, say, remember, test</p>
          <div className="mt-2 inline-flex border border-foreground" role="group" aria-label="HSK level">
            {([1, 2] as const).map((option) => (
              <button key={option} type="button" aria-pressed={level === option} onClick={() => chooseLevel(option)} className={cn("min-h-11 px-5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", option > 1 && "border-l border-foreground", level === option ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")}>
                HSK {option}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={startTest} className="stamp-button">
          <Zap className="h-4 w-4" /> Take 5-word test
        </button>
      </div>

      {testOpen && (
        <section className="poster-panel mb-8 p-5 sm:p-7" aria-label={`HSK ${level} quick Hanzi test`}>
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-[family-name:var(--font-hand)] text-lg text-primary">fast character check</p>
              <h2 className="text-xl font-bold">HSK {level}, five words</h2>
            </div>
            <button type="button" onClick={() => setTestOpen(false)} aria-label="Close test" className="grid h-11 w-11 place-items-center border border-border hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="h-4 w-4" /></button>
          </div>
          {testResult ? (
            <div className="py-8 text-center">
              <Check className="mx-auto h-7 w-7 text-primary" />
              <p className={cn("mt-3 text-5xl", hanziFont)}>{testResult.firstTryCorrect} / {testResult.total}</p>
              <p className="mt-2 text-sm text-muted-foreground">Immediate check complete. Retake for five different words or return to the browser.</p>
              <button type="button" onClick={startTest} className="stamp-button mt-5">Five different words</button>
            </div>
          ) : (
            <ExercisePlayer title={`HSK ${level} Hanzi quick test`} exercises={test} mode="quiz" onFinish={setTestResult} />
          )}
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="lg:sticky lg:top-20 lg:self-start"><Breakdown word={selected} /></div>
        <div>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${words.length} HSK ${level} forms, pinyin, or meaning`} className="min-h-12 w-full border border-foreground bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring" />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{results.length} written forms</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
            {results.map((word) => (
              <button key={word.id} type="button" onClick={() => setSelectedId(word.id)} className={cn("word-tile border bg-card p-3 text-left transition-colors hover:border-primary", word.id === selected.id ? "border-primary bg-primary/10" : "border-border")}>
                <div className={cn("text-4xl leading-none", hanziFont)}>{word.hanzi}</div>
                <div className={cn("mt-2 text-xs text-muted-foreground", displayFont)}>{word.pinyin}</div>
                <div className="truncate text-xs text-muted-foreground">{word.meaning}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
