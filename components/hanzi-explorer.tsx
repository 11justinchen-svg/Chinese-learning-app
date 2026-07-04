"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { HSK1, type HskWord, type ComponentRole } from "@/lib/hsk";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const ROLE: Record<ComponentRole, { label: string; cls: string }> = {
  semantic: { label: "meaning", cls: "bg-primary/15 text-primary" },
  part: { label: "sound / part", cls: "bg-accent/20 text-accent" },
  form: { label: "stroke", cls: "bg-muted text-muted-foreground" },
};

function Breakdown({ word }: { word: HskWord }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline gap-4">
        <span
          className={cn("text-6xl leading-none text-foreground", hanziFont)}
        >
          {word.hanzi}
        </span>
        <div>
          <p className={cn("text-lg text-muted-foreground", displayFont)}>
            {word.pinyin}
          </p>
          <p className="text-base font-semibold">{word.meaning}</p>
        </div>
      </div>
      {word.meanings.length > 1 && (
        <p className="mt-3 text-sm text-muted-foreground">
          {word.meanings.join(" · ")}
        </p>
      )}

      <div className="mt-6 space-y-5">
        {word.characters.map((c, ci) => (
          <div key={ci}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className={cn("text-2xl", hanziFont)}>{c.char}</span>
              <span className="text-sm text-muted-foreground">{c.pinyin}</span>
              {c.atomic && (
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                  pictograph
                </span>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {c.components.map((k, ki) => (
                <div
                  key={ki}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
                >
                  <span className={cn("text-2xl leading-none", hanziFont)}>
                    {k.char}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{k.meaning}</p>
                    <span
                      className={cn(
                        "mt-0.5 inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-medium",
                        ROLE[k.role].cls,
                      )}
                    >
                      {ROLE[k.role].label}
                      {k.variantOf ? ` · form of ${k.variantOf}` : ""}
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
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(HSK1[0].id);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HSK1;
    return HSK1.filter(
      (w) =>
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.pinyin
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .toLowerCase()
          .includes(q) ||
        w.meaning.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = HSK1.find((w) => w.id === selectedId) ?? HSK1[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
      {/* Detail */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Breakdown word={selected} />
      </div>

      {/* Browser */}
      <div>
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 150 words — hanzi, pinyin, or meaning"
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          {results.length} words
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          {results.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedId(w.id)}
              className={cn(
                "rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary/60",
                w.id === selected.id ? "border-primary" : "border-border",
              )}
            >
              <div className={cn("text-3xl leading-none", hanziFont)}>
                {w.hanzi}
              </div>
              <div
                className={cn(
                  "mt-2 text-xs text-muted-foreground",
                  displayFont,
                )}
              >
                {w.pinyin}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {w.meaning}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
