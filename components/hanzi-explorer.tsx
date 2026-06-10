"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { hanziEntries, type HanziEntry } from "@/lib/hanzi-data";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<string, string> = {
  semantic: "bg-primary/15 text-primary",
  phonetic: "bg-accent/15 text-accent",
  pictographic: "bg-emerald-500/15 text-emerald-400",
};

const ROLE_LABELS: Record<string, string> = {
  semantic: "meaning",
  phonetic: "sound",
  pictographic: "picture",
};

function Breakdown({ entry }: { entry: HanziEntry }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-6">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-36 w-36 items-center justify-center rounded-lg border border-primary/40 bg-background text-8xl">
            {entry.char}
          </div>
          <p className="text-lg font-medium">{entry.pinyin}</p>
          <p className="text-sm text-muted-foreground">{entry.meaning}</p>
          {entry.level && (
            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {entry.level}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {entry.components.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/60 bg-background p-4"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl">{c.char}</span>
                  <span className="text-sm text-muted-foreground">
                    {c.pinyin}
                  </span>
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-medium",
                      ROLE_STYLES[c.role] ?? ROLE_STYLES.semantic,
                    )}
                  >
                    {ROLE_LABELS[c.role] ?? c.role}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{c.meaning}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.explanation}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              How it fits together
            </p>
            <p className="mt-2 text-sm leading-relaxed">{entry.story}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HanziExplorer() {
  const [selected, setSelected] = useState<HanziEntry>(hanziEntries[0]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    const char = query.trim();
    if (!char || loading) return;

    const local = hanziEntries.find((h) => h.char === char);
    if (local) {
      setSelected(local);
      setAiResult(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hanzi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character: char }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setSelected({ level: "", ...data });
      setAiResult(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not analyze that character.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={lookup} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter any character, like 爱 or 谢"
            className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/60"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Break it down
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {aiResult && !error && (
        <p className="text-xs text-muted-foreground">
          Analysis generated live by your tutor. Cross-check rare characters
          with a dictionary.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {hanziEntries.map((h) => (
          <button
            key={h.char}
            onClick={() => {
              setSelected(h);
              setAiResult(false);
              setError(null);
            }}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-md border text-2xl transition-colors",
              selected.char === h.char && !aiResult
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50",
            )}
          >
            {h.char}
          </button>
        ))}
      </div>

      <Breakdown entry={selected} />
    </div>
  );
}
