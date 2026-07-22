"use client";

import Link from "next/link";
import { BookOpenText, FileText, Headphones, PlayCircle, Volume2 } from "lucide-react";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import { findRoleCallScenarioForGrammar } from "@/lib/role-calls";
import { speak } from "@/lib/speech";
import {
  speechFallbackMessage,
  useMandarinSpeech,
} from "@/lib/use-mandarin-speech";
import { cn } from "@/lib/utils";
import { GrammarHanziPrerequisites } from "@/components/grammar-hanzi-prerequisites";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

// Compact pattern card shown right before a grammar block's drills.
export function GrammarIntro({ lessonId }: { lessonId: string }) {
  const speech = useMandarinSpeech();
  const tts = speech === "ready";
  const speechFallback = speechFallbackMessage(speech);

  const lesson = GRAMMAR_LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return null;
  const roleScenario = findRoleCallScenarioForGrammar(lessonId);

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
      <div className="flex items-baseline gap-3">
        <span className={cn("text-3xl", hanziFont)}>{lesson.hanzi}</span>
        <div>
          <p className="font-semibold">{lesson.title}</p>
          <p className={cn("mt-0.5 text-sm text-primary", displayFont)}>
            {lesson.pattern}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {lesson.summary}
      </p>
      {speechFallback && (
        <p className="mt-2 text-xs text-muted-foreground" role="status">
          {speechFallback}
        </p>
      )}
      <div className="mt-3 space-y-1.5">
        {lesson.examples.map((ex) => (
          <div key={ex.hanzi} className="flex items-center gap-2 text-sm">
            <span className={cn("text-base", hanziFont)}>{ex.hanzi}</span>
            {tts && (
              <button
                type="button"
                aria-label="Play example"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => speak(ex.hanzi)}
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            )}
            <span className="text-muted-foreground">
              {ex.pinyin} · {ex.meaning}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <GrammarHanziPrerequisites lessonId={lesson.id} compact />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/grammar#${lesson.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BookOpenText className="h-3.5 w-3.5" />
          Open in repertoire
        </Link>
        {roleScenario && (
          <Link
            href={`/conversation?grammar=${encodeURIComponent(lessonId)}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Headphones className="h-3.5 w-3.5" />
            Practice with {roleScenario.role.toLowerCase()}
          </Link>
        )}
        {lesson.resources.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            {r.type === "video" ? (
              <PlayCircle className="h-3.5 w-3.5" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
            {r.label}
          </a>
        ))}
      </div>
    </div>
  );
}
