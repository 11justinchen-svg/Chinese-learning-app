import { normalizeMandarinAnswer } from "@/lib/role-calls";
import { pinyin } from "pinyin-pro";

export type ConversationAiProvider = "anthropic" | "gemini" | "ollama";

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

export interface SafeOpenCoachPayload extends SafeCoachPayload {
  accepted: boolean;
}

export type ExamHskLevel = "HSK 1" | "HSK 2";

export interface ConversationExamScore {
  level: ExamHskLevel;
  assessedTurns: number;
  total: number;
  communicativeSuccess: number;
  vocabularyControl: number;
  grammarClarity: number;
  interaction: number;
  summary: string;
  strengths: string[];
  nextStep: string;
  disclaimer: string;
}

const ACOUSTIC_CLAIM =
  /pronunc|\btone(?:s|d)?\b|accent|fluenc|sounds? (?:good|natural|correct)|发音|声调|口音|流利/i;

export function isScoringCommand(value: string): boolean {
  return value.trim().toUpperCase() === "SCORING";
}

export function detectExamHskLevel(value: string): ExamHskLevel | null {
  const normalized = value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "");
  if (/(?:hsk-?2|hsk二|二级|2级|level2)/i.test(normalized)) return "HSK 2";
  if (/(?:hsk-?1|hsk一|一级|1级|level1)/i.test(normalized)) return "HSK 1";
  return null;
}

function safeScoreText(value: unknown, fallback: string, maxLength: number): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || ACOUSTIC_CLAIM.test(text)) return fallback;
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength - 1);
  const boundaries = [
    clipped.lastIndexOf(" "),
    clipped.lastIndexOf("。"),
    clipped.lastIndexOf("！"),
    clipped.lastIndexOf("？"),
    clipped.lastIndexOf("."),
  ];
  const boundary = Math.max(...boundaries);
  const clean =
    boundary >= Math.floor(maxLength * 0.65)
      ? clipped.slice(0, boundary)
      : clipped;
  return `${clean.trimEnd()}…`;
}

function boundedInteger(value: unknown, maximum: number): number {
  const number = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(maximum, Math.round(number)));
}

export function parseConversationExamScore(
  raw: string,
  expectedLevel: ExamHskLevel,
  assessedTurns = 4,
): ConversationExamScore {
  const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "")) as {
    communicativeSuccess?: unknown;
    vocabularyControl?: unknown;
    grammarClarity?: unknown;
    interaction?: unknown;
    summary?: unknown;
    strengths?: unknown;
    nextStep?: unknown;
  };
  const evidenceCaps =
    assessedTurns <= 0
      ? [8, 5, 5, 1]
      : assessedTurns === 1
        ? [22, 15, 15, 4]
        : assessedTurns === 2
          ? [30, 20, 20, 6]
          : assessedTurns === 3
            ? [36, 23, 23, 8]
            : [40, 25, 25, 10];
  const communicativeSuccess = boundedInteger(
    parsed.communicativeSuccess,
    evidenceCaps[0],
  );
  const vocabularyControl = boundedInteger(
    parsed.vocabularyControl,
    evidenceCaps[1],
  );
  const grammarClarity = boundedInteger(
    parsed.grammarClarity,
    evidenceCaps[2],
  );
  const interaction = boundedInteger(parsed.interaction, evidenceCaps[3]);
  const strengths = Array.isArray(parsed.strengths)
    ? parsed.strengths
        .slice(0, 2)
        .map((value) =>
          safeScoreText(
            value,
            "You kept the exchange moving with understandable text.",
            120,
          ),
        )
    : [];
  return {
    level: expectedLevel,
    assessedTurns,
    total:
      communicativeSuccess +
      vocabularyControl +
      grammarClarity +
      interaction,
    communicativeSuccess,
    vocabularyControl,
    grammarClarity,
    interaction,
    summary:
      assessedTurns < 3
        ? `Limited evidence from ${assessedTurns} interview ${assessedTurns === 1 ? "answer" : "answers"}. ${safeScoreText(
            parsed.summary,
            "Your recognized text shows emerging control at the selected level.",
            180,
          )}`
        : safeScoreText(
            parsed.summary,
            "Your recognized text shows emerging control at the selected level.",
            220,
          ),
    strengths:
      strengths.length > 0
        ? strengths
        : ["You produced a meaningful reply in the conversation."],
    nextStep: safeScoreText(
      parsed.nextStep,
      "Retake the interview and add one more detail to each answer.",
      180,
    ),
    disclaimer:
      "This score uses typed or recognized text only. It does not grade pronunciation, tones, accent, or acoustic fluency.",
  };
}

export function toneMarkedPinyinForHanzi(hanzi: string): string {
  return pinyin(hanzi, { toneType: "symbol", type: "string" })
    .replace(/\s+([，。！？；：,.!?;:])/gu, "$1")
    .replaceAll("，", ",")
    .replaceAll("。", ".")
    .replaceAll("！", "!")
    .replaceAll("？", "?")
    .replaceAll("；", ";")
    .replaceAll("：", ":")
    .replace(/([，。！？；：,.!?;:])(?=\S)/gu, "$1 ")
    .replace(/\s+/gu, " ")
    .trim();
}

interface ProviderOrderOptions {
  hasAnthropicKey: boolean;
  hasGeminiKey: boolean;
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
  return { hanzi, pinyin: toneMarkedPinyinForHanzi(hanzi), english };
}

function safeOpenTurn(value: unknown): CoachLine | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const hanzi = typeof candidate.hanzi === "string" ? candidate.hanzi.trim() : "";
  const pinyin = typeof candidate.pinyin === "string" ? candidate.pinyin.trim() : "";
  const english = typeof candidate.english === "string" ? candidate.english.trim() : "";
  if (!hanzi || !pinyin || !english) return null;
  if (hanzi.length > 64 || pinyin.length > 180 || english.length > 180) return null;
  if (!/[\u3400-\u9fff]/u.test(hanzi)) return null;
  return { hanzi, pinyin: toneMarkedPinyinForHanzi(hanzi), english };
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
  if (ACOUSTIC_CLAIM.test(note))
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

export function parseOpenCoachPayload(raw: string): SafeOpenCoachPayload {
  const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "")) as {
    accepted?: unknown;
    feedback?: unknown;
    turn?: unknown;
  };
  if (typeof parsed.accepted !== "boolean")
    throw new Error("Open coaching result is missing acceptance evidence");
  const turn = safeOpenTurn(parsed.turn);
  if (!turn) throw new Error("Unsafe or malformed open role line");

  const feedbackValue = parsed.feedback as Record<string, unknown> | undefined;
  let note = typeof feedbackValue?.note === "string" ? feedbackValue.note.trim() : "";
  const betterHanzi =
    typeof feedbackValue?.betterHanzi === "string"
      ? feedbackValue.betterHanzi.trim()
      : "";
  const betterPinyin =
    typeof feedbackValue?.betterPinyin === "string"
      ? feedbackValue.betterPinyin.trim()
      : "";
  if (!note || !betterHanzi || !betterPinyin)
    throw new Error("Unsafe or malformed open coaching feedback");
  if (note.length > 220 || betterHanzi.length > 64 || betterPinyin.length > 180)
    throw new Error("Open coaching feedback exceeded its safe size");
  if (ACOUSTIC_CLAIM.test(note))
    note = parsed.accepted
      ? "Your intended meaning is understandable in the recognized text."
      : "The recognized text is not fully clear yet; compare it with the model and try the next turn.";

  return {
    accepted: parsed.accepted,
    feedback: {
      note,
      betterHanzi,
      betterPinyin: toneMarkedPinyinForHanzi(betterHanzi),
    },
    turn,
  };
}

export function conversationAiProviderOrder({
  hasAnthropicKey,
  hasGeminiKey,
  ollamaAvailable,
  preferred,
}: ProviderOrderOptions): ConversationAiProvider[] {
  const available: ConversationAiProvider[] = [];
  if (hasGeminiKey) available.push("gemini");
  if (ollamaAvailable) available.push("ollama");
  if (hasAnthropicKey) available.push("anthropic");

  const normalized = preferred?.toLowerCase();
  if (
    normalized !== "anthropic" &&
    normalized !== "gemini" &&
    normalized !== "ollama"
  )
    return available;
  if (!available.includes(normalized)) return available;
  return [
    normalized,
    ...available.filter((provider) => provider !== normalized),
  ] as ConversationAiProvider[];
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
