"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import { HSK, HSK1, HSK2, UNITS, findWord, type HskWord } from "@/lib/hsk";
import { STAGES } from "@/lib/data/stages";
import {
  loadProgress,
  wordStatus,
  type ProgressStore,
} from "@/lib/progression";
import {
  deckStats,
  grade,
  isDue,
  loadSrs,
  saveSrs,
  type SrsStore,
} from "@/lib/srs";
import { cn } from "@/lib/utils";
import { markLocalLearningDataChanged } from "@/lib/account/events";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

interface CustomCard {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

interface Card {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  word?: HskWord;
}

interface Deck {
  id: string;
  label: string;
  sub: string;
  ids: string[];
}

const CARDS_KEY = "mozhi.cards.v1";
const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Flashcards({
  initialUnit,
  initialStageId,
}: {
  initialUnit?: number;
  initialStageId?: string;
}) {
  const [srs, setSrs] = useState<SrsStore>({});
  const [progress, setProgress] = useState<ProgressStore>(EMPTY_PROGRESS);
  const [custom, setCustom] = useState<CustomCard[]>([]);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<{
    deck: Deck;
    queue: string[];
  } | null>(null);

  useEffect(() => {
    const storedSrs = loadSrs();
    const storedProgress = loadProgress();
    setSrs(storedSrs);
    setProgress(storedProgress);
    try {
      setCustom(JSON.parse(localStorage.getItem(CARDS_KEY) || "[]"));
    } catch {
      setCustom([]);
    }
    setReady(true);
    // Deep link from a Hanzi lesson: jump straight into the canonical stage deck.
    const requestedStage = initialStageId
      ? STAGES.find((stage) => stage.id === initialStageId)
      : undefined;
    if (requestedStage) {
      setSession({
        deck: {
          id: `stage-${requestedStage.level ?? 1}-${requestedStage.index}`,
          label: `HSK ${requestedStage.level ?? 1}, Lesson ${requestedStage.index}: ${requestedStage.title}`,
          sub: `${requestedStage.hanziTitle} · ${requestedStage.wordIds.length} words`,
          ids: requestedStage.wordIds,
        },
        queue: shuffle(requestedStage.wordIds),
      });
    } else if (initialUnit) {
      const u = UNITS.find((x) => x.index === initialUnit);
      const ids = u?.words.map((w) => w.id);
      if (u && ids?.length)
        setSession({
          deck: {
            id: `unit-${u.index}`,
            label: `Set ${u.index}`,
            sub: "",
            ids,
          },
          queue: shuffle(ids),
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decks: Deck[] = useMemo(() => {
    const list: Deck[] = [
      {
        id: "all",
        label: "All HSK 1 + 2 forms",
        sub: `${HSK.length} forms`,
        ids: HSK.map((w) => w.id),
      },
      {
        id: "hsk-1",
        label: "HSK 1",
        sub: `${HSK1.length} words`,
        ids: HSK1.map((word) => word.id),
      },
      {
        id: "hsk-2",
        label: "HSK 2",
        sub: `${HSK2.length} written forms`,
        ids: HSK2.map((word) => word.id),
      },
      ...UNITS.map((u) => ({
        id: `unit-${u.index}`,
        label: `Set ${u.index}`,
        sub: `${u.words[0].hanzi} … ${u.words[u.words.length - 1].hanzi}`,
        ids: u.words.map((w) => w.id),
      })),
      ...STAGES.map((stage) => ({
        id: `stage-${stage.level ?? 1}-${stage.index}`,
        label: `HSK ${stage.level ?? 1}, Lesson ${stage.index}: ${stage.title}`,
        sub: `${stage.hanziTitle} · ${stage.wordIds.length} words`,
        ids: stage.wordIds,
      })),
    ];
    if (custom.length)
      list.push({
        id: "custom",
        label: "My cards",
        sub: `${custom.length} card${custom.length === 1 ? "" : "s"}`,
        ids: custom.map((c) => c.id),
      });
    return list;
  }, [custom]);

  const resolve = useCallback(
    (id: string): Card => {
      const w = findWord(id);
      if (w)
        return {
          id,
          hanzi: w.hanzi,
          pinyin: w.pinyin,
          meaning: w.meaning,
          word: w,
        };
      const c = custom.find((x) => x.id === id);
      return {
        id,
        hanzi: c?.hanzi ?? "?",
        pinyin: c?.pinyin ?? "",
        meaning: c?.meaning ?? "",
      };
    },
    [custom],
  );

  function start(deck: Deck, onlyDue: boolean) {
    const pool = onlyDue
      ? deck.ids.filter((id) => srs[id] && isDue(srs[id]))
      : deck.ids;
    if (pool.length === 0) return;
    setSession({ deck, queue: shuffle(pool) });
  }

  function persistCustom(next: CustomCard[]) {
    setCustom(next);
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify(next));
      markLocalLearningDataChanged();
    } catch {
      // ignore
    }
  }

  if (!ready) return <div className="h-40" />;

  if (session) {
    return (
      <Study
        deck={session.deck}
        queue={session.queue}
        resolve={resolve}
        onGrade={(id, good) => {
          setSrs((prev) => {
            const next = grade(prev, id, good);
            saveSrs(next);
            return next;
          });
        }}
        onExit={() => setSession(null)}
      />
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h2
          className={cn(
            "mb-4 text-sm uppercase tracking-[0.2em] text-muted-foreground",
            displayFont,
          )}
        >
          Learning-path decks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decks
            .filter((d) => d.id.startsWith("stage-"))
            .map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                srs={srs}
                progress={progress}
                onStart={start}
              />
            ))}
        </div>
      </section>

      <section>
        <h2
          className={cn(
            "mb-4 text-sm uppercase tracking-[0.2em] text-muted-foreground",
            displayFont,
          )}
        >
          Frequency decks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decks
            .filter((d) => d.id === "all" || d.id.startsWith("hsk-") || d.id.startsWith("unit-"))
            .map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                srs={srs}
                progress={progress}
                onStart={start}
              />
            ))}
        </div>
      </section>

      <CustomManager
        custom={custom}
        deck={decks.find((d) => d.id === "custom")}
        onAdd={(c) => persistCustom([...custom, c])}
        onDelete={(id) => persistCustom(custom.filter((x) => x.id !== id))}
        onStart={start}
      />
    </div>
  );
}

function DeckCard({
  deck,
  srs,
  progress,
  onStart,
}: {
  deck: Deck;
  srs: SrsStore;
  progress: ProgressStore;
  onStart: (d: Deck, onlyDue: boolean) => void;
}) {
  const stats = deckStats(srs, deck.ids);
  const learned = deck.ids.filter((id) =>
    ["learned", "mastered"].includes(wordStatus(id, progress, srs)),
  ).length;
  const pct = Math.round((stats.mastered / stats.total) * 100);
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between">
        <h3 className={cn("text-lg font-semibold", displayFont)}>
          {deck.label}
        </h3>
        <span className={cn("text-xl text-muted-foreground", hanziFont)}>
          {deck.sub.split(" ")[0]}
        </span>
      </div>
      <p className="mt-0.5 text-sm text-muted-foreground">{deck.sub}</p>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {learned}/{stats.total} learned · {stats.new} new · {stats.due} due
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onStart(deck, true)}
          disabled={stats.due === 0}
          className={cn(
            "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            stats.due === 0
              ? "cursor-not-allowed bg-secondary text-muted-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          Review {stats.due > 0 ? `(${stats.due})` : ""}
        </button>
        <button
          onClick={() => onStart(deck, false)}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary/60"
        >
          Study all
        </button>
      </div>
    </div>
  );
}

function Study({
  deck,
  queue,
  resolve,
  onGrade,
  onExit,
}: {
  deck: Deck;
  queue: string[];
  resolve: (id: string) => Card;
  onGrade: (id: string, good: boolean) => void;
  onExit: () => void;
}) {
  const [q, setQ] = useState<string[]>(queue);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState({ good: 0, again: 0 });

  const total = queue.length;
  const current = q[pos];
  const card = current ? resolve(current) : null;

  const answer = useCallback(
    (good: boolean) => {
      if (!current) return;
      onGrade(current, good);
      setDone((d) => ({
        good: d.good + (good ? 1 : 0),
        again: d.again + (good ? 0 : 1),
      }));
      // "Again" re-queues the card later in the session.
      if (!good) setQ((prev) => [...prev, current]);
      setFlipped(false);
      setPos((p) => p + 1);
    },
    [current, onGrade],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      } else if (flipped && (e.key === "1" || e.key.toLowerCase() === "a"))
        answer(false);
      else if (flipped && (e.key === "2" || e.key.toLowerCase() === "g"))
        answer(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, answer]);

  if (!card) {
    const reviewed = done.good + done.again;
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <div className={cn("text-5xl", hanziFont)}>完成</div>
        <h2 className="mt-4 text-xl font-semibold">Session complete</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {reviewed} reviews · {done.good} good · {done.again} again
        </p>
        <button
          onClick={onExit}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" /> Back to decks
        </button>
      </div>
    );
  }

  const seen = Math.min(pos + 1, total);
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {deck.label}
        </button>
        <span className="tabular-nums">
          {seen} / {total}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${(seen / total) * 100}%` }}
        />
      </div>

      <button
        onClick={() => !flipped && setFlipped(true)}
        className="mt-6 flex min-h-[20rem] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-8 text-center"
      >
        <div className={cn("text-7xl leading-none sm:text-8xl", hanziFont)}>
          {card.hanzi}
        </div>
        {!flipped ? (
          <p className="text-sm text-muted-foreground">
            Tap or press space to flip
          </p>
        ) : (
          <div className="space-y-3">
            <p className={cn("text-2xl text-muted-foreground", displayFont)}>
              {card.pinyin}
            </p>
            <p className="text-xl font-semibold">{card.meaning}</p>
            {card.word && card.word.characters.some((c) => !c.atomic) && (
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                {card.word.characters
                  .map(
                    (c) =>
                      `${c.char} = ${c.components.map((k) => k.meaning).join(" + ")}`,
                  )
                  .join("   ·   ")}
              </p>
            )}
          </div>
        )}
      </button>

      {flipped && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3.5 text-sm font-semibold hover:bg-secondary/60"
          >
            <RotateCcw className="h-4 w-4" /> Again
          </button>
          <button
            onClick={() => answer(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Check className="h-4 w-4" /> Good
          </button>
        </div>
      )}
    </div>
  );
}

function CustomManager({
  custom,
  deck,
  onAdd,
  onDelete,
  onStart,
}: {
  custom: CustomCard[];
  deck?: Deck;
  onAdd: (c: CustomCard) => void;
  onDelete: (id: string) => void;
  onStart: (d: Deck, onlyDue: boolean) => void;
}) {
  const [hanzi, setHanzi] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [meaning, setMeaning] = useState("");

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!hanzi.trim() || !meaning.trim()) return;
    onAdd({
      id: `custom-${Date.now()}`,
      hanzi: hanzi.trim(),
      pinyin: pinyin.trim(),
      meaning: meaning.trim(),
    });
    setHanzi("");
    setPinyin("");
    setMeaning("");
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2
          className={cn(
            "text-sm uppercase tracking-[0.2em] text-muted-foreground",
            displayFont,
          )}
        >
          My cards
        </h2>
        {deck && (
          <button
            onClick={() => onStart(deck, false)}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Study my cards
          </button>
        )}
      </div>

      <form
        onSubmit={add}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.5fr_auto]">
          <input
            value={hanzi}
            onChange={(e) => setHanzi(e.target.value)}
            placeholder="汉字"
            className={cn(
              "rounded-lg border border-border bg-background px-3 py-2 text-lg outline-none focus:border-primary",
              hanziFont,
            )}
          />
          <input
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            placeholder="pīnyīn"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="meaning"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </form>

      {custom.length > 0 && (
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
          {custom.map((c) => (
            <li key={c.id} className="flex items-center gap-4 px-5 py-3">
              <span className={cn("text-2xl", hanziFont)}>{c.hanzi}</span>
              <span className="text-sm text-muted-foreground">{c.pinyin}</span>
              <span className="flex-1 truncate text-sm">{c.meaning}</span>
              <button
                onClick={() => onDelete(c.id)}
                aria-label="Delete card"
                className="text-muted-foreground hover:text-primary"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
