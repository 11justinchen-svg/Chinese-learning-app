import { normalizeMandarinAnswer } from "@/lib/role-calls";

export type ConversationAiProvider = "anthropic" | "ollama";

export interface CoachLine {
  hanzi: string;
  pinyin: string;
  english: string;
}

export interface CoachFeedback {
  note: string;
  betterHanzi: string;
  betterPinyin: string;
}

export interface SafeCoachPayload {
  feedback: CoachFeedback;
  turn: CoachLine | null;
}

interface ProviderOrderOptions {
  hasAnthropicKey: boolean;
  ollamaAvailable: boolean;
  preferred?: string;
}

function requiredQuestionCue(hanzi: string): string | null {
  const match = hanzi.match(/(?:^|[。！])([^。！？]+)？/);
  return match?.[1] ? normalizeMandarinAnswer(match[1]) : null;
}

function safeGeneratedTurn(value: unknown, canonical: CoachLine): CoachLine | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const hanzi = typeof candidate.hanzi === "string" ? candidate.hanzi.trim() : "";
  const pinyin = typeof candidate.pinyin === "string" ? candidate.pinyin.trim() : "";
  const english = typeof candidate.english === "string" ? candidate.english.trim() : "";
  if (!hanzi || !pinyin || !english) return null;
  if (hanzi.length > 48 || pinyin.length > 140 || english.length > 160) return null;
  const cue = requiredQuestionCue(canonical.hanzi);
  if (cue && !normalizeMandarinAnswer(hanzi).includes(cue)) return null;
  return { hanzi, pinyin, english };
}

function safeGeneratedFeedback(
  value: unknown,
  canonical: Pick<CoachLine, "hanzi" | "pinyin">,
  accepted: boolean,
): CoachFeedback | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  let note = typeof candidate.note === "string" ? candidate.note.trim() : "";
  if (!note || note.length > 220) return null;
  if (
    /pronunc|\btone(?:s|d)?\b|accent|fluenc|sounds? (?:good|natural|correct)|发音|声调|口音|流利/i.test(
      note,
    )
  )
    note = accepted
      ? "Your intended meaning is understandable in the recognized text."
      : "The recognized words do not yet complete this turn’s goal.";

  // The model may explain the recognized wording, but it cannot replace the
  // curriculum's reviewed Hanzi or tone-marked pinyin with unverified text.
  return {
    note,
    betterHanzi: canonical.hanzi,
    betterPinyin: canonical.pinyin,
  };
}

export function parseCoachPayload(
  raw: string,
  target: CoachLine,
  canonicalResponse: CoachLine,
  accepted: boolean,
): SafeCoachPayload {
  const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "")) as {
    feedback?: unknown;
    turn?: unknown;
  };
  const feedback = safeGeneratedFeedback(parsed.feedback, target, accepted);
  if (!feedback) throw new Error("Unsafe or malformed coaching feedback");

  // AI never owns the dialogue path. Preserve valid wording variation when it
  // keeps the authored question cue; otherwise use the canonical role line.
  const turn = accepted
    ? safeGeneratedTurn(parsed.turn, canonicalResponse) ?? canonicalResponse
    : null;
  return { feedback, turn };
}

export function conversationAiProviderOrder({
  hasAnthropicKey,
  ollamaAvailable,
  preferred,
}: ProviderOrderOptions): ConversationAiProvider[] {
  const available: ConversationAiProvider[] = [];
  if (ollamaAvailable) available.push("ollama");
  if (hasAnthropicKey) available.push("anthropic");

  const normalized = preferred?.toLowerCase();
  if (normalized !== "anthropic" && normalized !== "ollama") return available;
  return available.sort((provider) => (provider === normalized ? -1 : 1));
}

export async function runConversationAiProviders<T>(
  providers: readonly ConversationAiProvider[],
  run: (provider: ConversationAiProvider) => Promise<T>,
): Promise<{ provider: ConversationAiProvider; value: T; failures: string[] }> {
  const failures: string[] = [];
  for (const provider of providers) {
    try {
      return { provider, value: await run(provider), failures };
    } catch (error) {
      const detail = error instanceof Error ? error.message : "unknown error";
      failures.push(`${provider}: ${detail}`);
    }
  }
  throw new Error(failures.join(" | ") || "No AI feedback provider is available");
}
