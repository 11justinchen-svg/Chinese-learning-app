"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, PencilLine, Play, RotateCcw } from "lucide-react";
import HanziWriter, { type CharacterJson } from "hanzi-writer";
import { cn } from "@/lib/utils";

type Mode = "ready" | "animating" | "quiz" | "complete";

async function loadLocalCharacter(character: string): Promise<CharacterJson> {
  const response = await fetch(
    `/hanzi-data/${encodeURIComponent(character)}.json`,
  );
  if (!response.ok)
    throw new Error(`Stroke data is unavailable for ${character}.`);
  return response.json() as Promise<CharacterJson>;
}

export function StrokePractice({
  hanzi,
  compact = false,
}: {
  hanzi: string;
  compact?: boolean;
}) {
  const characters = Array.from(
    new Set(
      Array.from(hanzi).filter((character) =>
        /\p{Script=Han}/u.test(character),
      ),
    ),
  );
  const [selected, setSelected] = useState(characters[0] ?? "");
  const [mode, setMode] = useState<Mode>("ready");
  const [mistakes, setMistakes] = useState(0);
  const [error, setError] = useState("");
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const operationRef = useRef(0);

  useEffect(() => {
    if (!selected || !targetRef.current) return;
    const target = targetRef.current;
    operationRef.current += 1;
    target.replaceChildren();
    setMode("ready");
    setMistakes(0);
    setError("");

    const size = compact ? 190 : 230;
    const writer = HanziWriter.create(target, selected, {
      width: size,
      height: size,
      padding: 14,
      showOutline: true,
      showCharacter: true,
      strokeColor: "#171512",
      outlineColor: "#d3c8b4",
      highlightColor: "#d94a36",
      drawingColor: "#215b4a",
      drawingWidth: 5,
      strokeAnimationSpeed: 1.15,
      delayBetweenStrokes: 260,
      showHintAfterMisses: 2,
      charDataLoader: (character, onLoad, onError) => {
        void loadLocalCharacter(character).then(onLoad).catch(onError);
      },
      onLoadCharDataError: () => {
        setError(`Stroke order is unavailable for ${selected}.`);
      },
    });
    writerRef.current = writer;

    return () => {
      writer.cancelQuiz();
      writerRef.current = null;
      target.replaceChildren();
    };
  }, [compact, selected]);

  async function animate() {
    const writer = writerRef.current;
    if (!writer) return;
    const operation = ++operationRef.current;
    writer.cancelQuiz();
    setMode("animating");
    setMistakes(0);
    await writer.showOutline({ duration: 0 });
    await writer.hideCharacter({ duration: 120 });
    await writer.animateCharacter({
      onComplete: () => {
        if (operationRef.current === operation) setMode("ready");
      },
    });
  }

  async function startQuiz() {
    const writer = writerRef.current;
    if (!writer) return;
    operationRef.current += 1;
    writer.cancelQuiz();
    setMistakes(0);
    setMode("quiz");
    await writer.hideCharacter({ duration: 120 });
    await writer.quiz({
      showHintAfterMisses: 2,
      onMistake: (stroke) => setMistakes(stroke.totalMistakes),
      onComplete: (summary) => {
        setMistakes(summary.totalMistakes);
        setMode("complete");
      },
    });
  }

  async function showCharacter() {
    const writer = writerRef.current;
    if (!writer) return;
    operationRef.current += 1;
    writer.cancelQuiz();
    await writer.showCharacter();
    setMode("ready");
  }

  if (characters.length === 0) return null;

  return (
    <section className="mt-5 border border-foreground/20 bg-card/70 p-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Stroke order
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Watch once, then draw in the numbered order.
          </p>
        </div>
        {characters.length > 1 && (
          <div className="inline-flex border border-foreground/20" role="tablist" aria-label="Character to practice">
            {characters.map((character) => (
              <button
                key={character}
                type="button"
                role="tab"
                aria-selected={selected === character}
                onClick={() => setSelected(character)}
                className={cn(
                  "grid min-h-11 min-w-11 place-items-center border-l border-foreground/20 px-3 text-xl first:border-l-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected === character
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-secondary",
                )}
              >
                {character}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div
          className="stroke-writer-grid mx-auto grid place-items-center border border-foreground/20 bg-background"
          style={{ width: compact ? 192 : 232, height: compact ? 192 : 232 }}
        >
          <div ref={targetRef} aria-label={`Stroke order canvas for ${selected}`} />
        </div>
        <div>
          <p className="text-sm font-semibold" role="status">
            {mode === "quiz" && `Draw ${selected} · ${mistakes} misses`}
            {mode === "complete" &&
              `Complete · ${mistakes === 0 ? "clean first try" : `${mistakes} misses`}`}
            {mode === "animating" && "Playing stroke order…"}
            {mode === "ready" && "Ready to watch or practice"}
          </p>
          {error && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={animate} className="inline-flex min-h-11 items-center justify-center gap-2 border border-foreground bg-background px-3 py-2 text-sm font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {mode === "animating" ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              Play order
            </button>
            <button type="button" onClick={startQuiz} className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-3 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <PencilLine className="h-4 w-4" /> Draw it
            </button>
            {(mode === "quiz" || mode === "complete") && (
              <button type="button" onClick={showCharacter} className="inline-flex min-h-11 items-center justify-center gap-2 border border-foreground/40 bg-card px-3 py-2 text-sm font-bold hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:col-span-2">
                <Eye className="h-4 w-4" /> Show character
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
