import Link from "next/link";
import { ArrowRight, Shapes } from "lucide-react";
import { hanziRequirementsForGrammar } from "@/lib/data/grammar";
import { findWord } from "@/lib/hsk";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";

export function GrammarHanziPrerequisites({
  lessonId,
  compact = false,
}: {
  lessonId: string;
  compact?: boolean;
}) {
  const requirements = hanziRequirementsForGrammar(lessonId)
    .map((requirement) => ({ ...requirement, word: findWord(requirement.wordId) }))
    .filter(
      (
        requirement,
      ): requirement is (typeof requirement) & {
        word: NonNullable<(typeof requirement)["word"]>;
      } => Boolean(requirement.word),
    );

  if (requirements.length === 0) return null;

  return (
    <section
      aria-label="Prerequisite Hanzi"
      className={cn(
        "border border-foreground/20 bg-[oklch(var(--poster-cyan)/0.12)]",
        compact ? "p-3" : "p-4",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            <Shapes className="h-3.5 w-3.5" /> Prerequisite Hanzi
          </p>
          {!compact && (
            <p className="mt-1 text-xs text-muted-foreground">
              Recognize these forms before retrieving the grammar pattern.
            </p>
          )}
        </div>
        <Link
          href={`/hanzi?grammar=${encodeURIComponent(lessonId)}`}
          className="inline-flex min-h-11 items-center gap-2 border border-foreground bg-background px-3 py-2 text-xs font-bold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Practice {requirements.length} form{requirements.length === 1 ? "" : "s"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className={cn("grid gap-2", compact ? "mt-3 sm:grid-cols-2" : "mt-4")}>
        {requirements.map(({ wordId, use, word }) => (
          <Link
            key={wordId}
            href={`/hanzi?word=${encodeURIComponent(wordId)}`}
            aria-label={`Study ${word.hanzi}, ${word.pinyin}: ${use}`}
            className="group flex min-h-14 items-center gap-3 border border-border bg-background px-3 py-2 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className={cn("text-2xl leading-none text-primary", hanziFont)}>
              {word.hanzi}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-foreground">
                {word.pinyin}
              </span>
              <span className="block text-[0.68rem] leading-4 text-muted-foreground group-hover:text-foreground">
                {use}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
