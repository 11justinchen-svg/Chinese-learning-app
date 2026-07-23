import {
  assessRoleCallAnswer,
  findRoleCallScenario,
} from "@/lib/role-calls";
import {
  conversationAiProviderOrder,
  detectExamHskLevel,
  isScoringCommand,
  parseCoachPayload,
  parseConversationExamScore,
  parseOpenCoachPayload,
  runConversationAiProviders,
  type ConversationAiProvider,
  type ExamHskLevel,
} from "@/lib/conversation-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

const encoder = new TextEncoder();
const requestWindows = new Map<string, { count: number; resetAt: number }>();
const geminiCache = new Map<string, { expiresAt: number; raw: string }>();
const OLLAMA_URL = "http://127.0.0.1:11434";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";
const GEMINI_TRANSLATE_MODEL =
  process.env.GEMINI_TRANSLATE_MODEL ?? "gemini-3.5-live-translate-preview";
let ollamaHealth = { available: false, expiresAt: 0 };

interface HistoryTurn {
  speaker: "learner" | "persona";
  hanzi: string;
  english: string;
}

function event(value: unknown): Uint8Array {
  return encoder.encode(`${JSON.stringify(value)}\n`);
}

function allowAiTurn(request: Request): boolean {
  const now = Date.now();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || request.headers.get("x-real-ip") || "local";
  const existing = requestWindows.get(client);
  if (!existing || existing.resetAt <= now) {
    requestWindows.set(client, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (existing.count >= 12) return false;
  existing.count += 1;
  return true;
}

function sanitizeHistory(value: unknown): HistoryTurn[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-24)
    .map((item) => {
      const turn = item as Record<string, unknown>;
      const speaker: HistoryTurn["speaker"] =
        turn.speaker === "learner" ? "learner" : "persona";
      const hanzi = typeof turn.hanzi === "string" ? turn.hanzi.trim().slice(0, 160) : "";
      const english =
        typeof turn.english === "string" ? turn.english.trim().slice(0, 160) : "";
      return { speaker, hanzi, english };
    })
    .filter((turn) => turn.hanzi);
}

async function ollamaAvailable(): Promise<boolean> {
  if (process.env.VERCEL) return false;
  const now = Date.now();
  if (ollamaHealth.expiresAt > now) return ollamaHealth.available;
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(1_500),
    });
    const result = (await response.json()) as {
      models?: Array<{ name?: string; model?: string }>;
    };
    const expected = process.env.OLLAMA_MODEL ?? "llama3.2";
    const names = result.models?.flatMap((model) => [model.name, model.model]) ?? [];
    const available =
      response.ok &&
      names.some(
        (name) =>
          name === expected ||
          name === `${expected}:latest` ||
          name?.replace(/:latest$/, "") === expected.replace(/:latest$/, ""),
      );
    ollamaHealth = { available, expiresAt: now + 30_000 };
  } catch {
    ollamaHealth = { available: false, expiresAt: now + 5_000 };
  }
  return ollamaHealth.available;
}

function coachSystemPrompt(
  scenario: NonNullable<ReturnType<typeof findRoleCallScenario>>,
  step: NonNullable<ReturnType<typeof findRoleCallScenario>>["steps"][number],
  supportLevel: string,
  accepted: boolean,
): string {
  return [
    `You are coaching an HSK 1 or HSK 2 Mandarin learner while role-playing a ${scenario.role}.`,
    `Setting: ${scenario.setting}. Learner support: ${supportLevel}.`,
    `The local authored evaluator marked the reply ${accepted ? "understandable" : "not yet sufficient for the goal"}.`,
    "Give one concise wording or grammar observation based only on the recognized text. Never claim to hear tones, accent, fluency, or pronunciation quality.",
    "Confirm the intended meaning when it is understandable. Give at most one correction, then a natural beginner model with tone-marked pinyin.",
    "If accepted, stay in character and produce the next role line. Preserve any question in the canonical role line word-for-word.",
    "Use standard simplified Mainland Mandarin and very common beginner words. Do not include markdown.",
    `Canonical reply: ${step.response.hanzi} / ${step.response.pinyin} / ${step.response.english}`,
    `Target learner model: ${step.target.hanzi} / ${step.target.pinyin} / ${step.target.english}`,
    "Every pinyin field must use tone marks.",
  ].join("\n");
}

function openSystemPrompt(
  scenario: NonNullable<ReturnType<typeof findRoleCallScenario>>,
  supportLevel: string,
  history: readonly HistoryTurn[],
  sessionSeed: string,
): string {
  const compactHistory = history
    .map((turn) => `${turn.speaker === "learner" ? "LEARNER" : "ROLE"}: ${turn.hanzi}`)
    .join("\n");
  if (scenario.id === "oral-examiner") {
    const level =
      detectExamHskLevel(history.map((turn) => turn.hanzi).join("\n")) ?? null;
    const variationCards = [
      "travel plans and an unexpected change",
      "meeting a new classmate and making weekend plans",
      "ordering food while one item is unavailable",
      "shopping for a gift with a budget",
      "asking for directions after missing a stop",
      "describing a daily routine and solving a schedule conflict",
      "checking into a hotel and requesting help",
      "talking about weather and changing an activity",
    ];
    let hash = 0;
    for (const character of sessionSeed)
      hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
    const variation = variationCards[hash % variationCards.length];
    return [
      "You are a warm but rigorous Mandarin oral examiner.",
      "The learner sets up the exam by telling you HSK 1 or HSK 2 and optionally a topic in the opening exchange.",
      level
        ? `The selected difficulty is ${level}. Keep every question and model answer within ${level} expectations.`
        : "The level is not set. Ask the learner to choose HSK 1 or HSK 2 before beginning the interview.",
      `Fresh variation card for this call: ${variation}. Session seed: ${sessionSeed}.`,
      "If the learner named a topic, honor it and use the variation card only to add a realistic twist.",
      "Conduct an open oral interview. Ask exactly one short interrogative question in simplified Chinese per turn and wait for the learner.",
      "Vary question types across the interview: who, what, where, when, how many, choice, yes/no, and a simple reason when appropriate.",
      "Do not repeat a question already visible in the transcript. Build the next question from a detail in the learner's last answer.",
      "At HSK 1, favor short concrete questions and canonical HSK 1 vocabulary. At HSK 2, allow connected time, place, comparison, experience, and reason questions using HSK 1 plus HSK 2 vocabulary.",
      "Evaluate communicative meaning from recognized text only. Never claim to hear pronunciation, tones, accent, or fluency.",
      "Give at most one concise wording correction, then continue with the next question.",
      "The learner ends the assessment by sending the exact command SCORING. Never ask them to say it aloud.",
      `Learner support: ${supportLevel}.`,
      "Recent bounded transcript:",
      compactHistory || "(No previous turns supplied.)",
    ].join("\n");
  }
  return [
    `Stay in character as a ${scenario.role} in ${scenario.setting}.`,
    `The learner is studying HSK 1 or HSK 2 Mandarin with ${supportLevel} support.`,
    "Continue the same real-life situation for as many learner turns as they choose.",
    "Ask or say exactly one short, natural line at a time using common beginner Mandarin. Do not abruptly change the setting.",
    "Evaluate communicative meaning from recognized text only. Never claim to hear pronunciation, tones, accent, or fluency.",
    "Give at most one useful correction. The better model must use simplified Chinese and tone-marked pinyin.",
    "Even after a weak reply, keep the roleplay moving with a simple clarifying question.",
    "Recent bounded transcript:",
    compactHistory || "(No previous turns supplied.)",
  ].join("\n");
}

function examScoringPrompt(
  level: ExamHskLevel,
  history: readonly HistoryTurn[],
): string {
  const transcript = history
    .filter((turn) => !isScoringCommand(turn.hanzi))
    .map((turn) => `${turn.speaker === "learner" ? "LEARNER" : "EXAMINER"}: ${turn.hanzi}`)
    .join("\n");
  return [
    `You are scoring a ${level} Mandarin oral-interview transcript.`,
    "Assess only the learner's typed or speech-recognized text. Do not score or discuss pronunciation, tones, accent, or acoustic fluency.",
    "Use these exact maximums: communicativeSuccess 40, vocabularyControl 25, grammarClarity 25, interaction 10.",
    "Reward answers that accomplish the question's intent even when wording is imperfect.",
    "Calibrate expectations to the selected HSK level. Do not penalize an HSK 1 learner for not using HSK 2 grammar.",
    "Give a concise, evidence-based summary, at most two strengths, and one immediately useful next step.",
    "Return only the requested JSON object.",
    "Transcript:",
    transcript || "(No assessable learner turns.)",
  ].join("\n");
}

async function readAnthropicRaw(
  apiKey: string,
  system: string,
  learnerText: string,
): Promise<string> {
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 180,
      temperature: 0.35,
      system,
      messages: [{ role: "user", content: `Learner reply: ${learnerText}` }],
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!upstream.ok) throw new Error(`Anthropic returned ${upstream.status}`);
  const result = (await upstream.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  const raw = result.content?.find((block) => block.type === "text")?.text;
  if (!raw) throw new Error("Anthropic returned no text response");
  return raw;
}

async function readOllamaRaw(system: string, learnerText: string): Promise<string> {
  const upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL ?? "llama3.2",
      stream: false,
      format: "json",
      keep_alive: "5m",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Learner reply: ${learnerText}` },
      ],
      options: { temperature: 0.2, num_predict: 220 },
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!upstream.ok) throw new Error(`Ollama returned ${upstream.status}`);
  const result = (await upstream.json()) as { message?: { content?: string } };
  const raw = result.message?.content;
  if (!raw) throw new Error("Ollama returned no text response");
  return raw;
}

const coachSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedback: {
      type: "object",
      additionalProperties: false,
      properties: {
        note: { type: "string" },
        betterHanzi: { type: "string" },
        betterPinyin: { type: "string" },
      },
      required: ["note", "betterHanzi", "betterPinyin"],
    },
    turn: {
      type: ["object", "null"],
      properties: {
        hanzi: { type: "string" },
        pinyin: { type: "string" },
        english: { type: "string" },
      },
      required: ["hanzi", "pinyin", "english"],
    },
  },
  required: ["feedback", "turn"],
};

const openCoachSchema = {
  ...coachSchema,
  properties: {
    ...coachSchema.properties,
    accepted: { type: "boolean" },
    turn: {
      type: "object",
      additionalProperties: false,
      properties: {
        hanzi: { type: "string" },
        pinyin: { type: "string" },
        english: { type: "string" },
      },
      required: ["hanzi", "pinyin", "english"],
    },
  },
  required: ["accepted", "feedback", "turn"],
};

const examScoreSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    communicativeSuccess: { type: "integer", minimum: 0, maximum: 40 },
    vocabularyControl: { type: "integer", minimum: 0, maximum: 25 },
    grammarClarity: { type: "integer", minimum: 0, maximum: 25 },
    interaction: { type: "integer", minimum: 0, maximum: 10 },
    summary: { type: "string" },
    strengths: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 2,
    },
    nextStep: { type: "string" },
  },
  required: [
    "communicativeSuccess",
    "vocabularyControl",
    "grammarClarity",
    "interaction",
    "summary",
    "strengths",
    "nextStep",
  ],
};

async function readGeminiRaw(
  apiKey: string,
  system: string,
  learnerText: string,
  openEnded: boolean,
): Promise<string> {
  const cacheKey = `${openEnded ? "open" : "authored"}\u0000${system}\u0000${learnerText}`;
  const cached = geminiCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.raw;

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [
          {
            role: "user",
            parts: [{ text: `Learner reply: ${learnerText}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 320,
          temperature: openEnded ? 0.8 : 0.25,
          responseFormat: {
            text: {
              mimeType: "APPLICATION_JSON",
              schema: openEnded ? openCoachSchema : coachSchema,
            },
          },
        },
      }),
      signal: AbortSignal.timeout(12_000),
    },
  );
  if (!upstream.ok) {
    const detail = (await upstream.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      `Gemini returned ${upstream.status}: ${detail?.error?.message?.slice(0, 320) ?? "unknown error"}`,
    );
  }
  const result = (await upstream.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw = result.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;
  if (!raw) throw new Error("Gemini returned no text response");
  if (geminiCache.size >= 100) geminiCache.delete(geminiCache.keys().next().value ?? "");
  geminiCache.set(cacheKey, { raw, expiresAt: Date.now() + 30_000 });
  return raw;
}

async function readGeminiExamScoreRaw(
  apiKey: string,
  system: string,
): Promise<string> {
  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [
          {
            role: "user",
            parts: [{ text: "SCORING" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 420,
          temperature: 0.15,
          responseFormat: {
            text: {
              mimeType: "APPLICATION_JSON",
              schema: examScoreSchema,
            },
          },
        },
      }),
      signal: AbortSignal.timeout(12_000),
    },
  );
  if (!upstream.ok) {
    const detail = (await upstream.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      `Gemini scoring returned ${upstream.status}: ${detail?.error?.message?.slice(0, 320) ?? "unknown error"}`,
    );
  }
  const result = (await upstream.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw = result.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;
  if (!raw) throw new Error("Gemini returned no scoring response");
  return raw;
}

async function availableProviders(): Promise<ConversationAiProvider[]> {
  return conversationAiProviderOrder({
    hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    ollamaAvailable: await ollamaAvailable(),
    preferred: process.env.AI_FEEDBACK_PROVIDER,
  });
}

export async function GET() {
  const providers = await availableProviders();
  const hasGemini = providers.includes("gemini");
  return Response.json(
    {
      aiAvailable: providers.length > 0,
      openEndedAvailable: hasGemini,
      liveTranslateAvailable: hasGemini,
      providers,
      preferredProvider: providers[0] ?? null,
      models: hasGemini
        ? { conversation: GEMINI_MODEL, liveTranslate: GEMINI_TRANSLATE_MODEL }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const providers = await availableProviders();
  if (providers.length === 0)
    return Response.json(
      { error: "AI variations are not configured. Authored mode is available." },
      { status: 503 },
    );
  if (!allowAiTurn(request))
    return Response.json(
      { error: "AI turn limit reached. Authored mode is still available." },
      { status: 429, headers: { "Retry-After": "60" } },
    );

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const scenario =
    typeof input.scenarioId === "string"
      ? findRoleCallScenario(input.scenarioId)
      : undefined;
  const learnerText =
    typeof input.learnerText === "string" ? input.learnerText.trim() : "";
  const supportLevel = ["guided", "standard", "challenge"].includes(
    String(input.supportLevel),
  )
    ? String(input.supportLevel)
    : "guided";
  const mode = input.mode === "open" ? "open" : "authored";
  const history = sanitizeHistory(input.history);
  const sessionSeed =
    typeof input.sessionSeed === "string"
      ? input.sessionSeed.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80)
      : "default";

  if (!scenario || !learnerText || learnerText.length > 160)
    return Response.json({ error: "Invalid role-call turn." }, { status: 400 });

  if (mode === "open") {
    if (!providers.includes("gemini"))
      return Response.json(
        { error: "Open roleplay requires Gemini Flash-Lite." },
        { status: 503 },
      );
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(event({ type: "status", status: "thinking" }));
        try {
          if (
            scenario.id === "oral-examiner" &&
            isScoringCommand(learnerText)
          ) {
            const level =
              detectExamHskLevel(history.map((turn) => turn.hanzi).join("\n")) ??
              "HSK 1";
            const raw = await readGeminiExamScoreRaw(
              process.env.GEMINI_API_KEY as string,
              examScoringPrompt(level, history),
            );
            const assessedTurns = Math.max(
              0,
              history.filter(
                (turn) =>
                  turn.speaker === "learner" &&
                  !isScoringCommand(turn.hanzi),
              ).length - 1,
            );
            controller.enqueue(
              event({
                type: "score",
                provider: "gemini",
                score: parseConversationExamScore(
                  raw,
                  level,
                  assessedTurns,
                ),
              }),
            );
            return;
          }
          const system = openSystemPrompt(
            scenario,
            supportLevel,
            history,
            sessionSeed,
          );
          const raw = await readGeminiRaw(
            process.env.GEMINI_API_KEY as string,
            system,
            learnerText,
            true,
          );
          const generated = parseOpenCoachPayload(raw);
          controller.enqueue(
            event({
              type: "feedback",
              provider: "gemini",
              feedback: generated.feedback,
            }),
          );
          controller.enqueue(
            event({
              type: "turn",
              provider: "gemini",
              openEnded: true,
              examLevel:
                scenario.id === "oral-examiner"
                  ? detectExamHskLevel(
                      history.map((turn) => turn.hanzi).join("\n"),
                    )
                  : null,
              turn: generated.turn,
            }),
          );
        } catch (error) {
          console.error(
            "Open conversation fallback:",
            error instanceof Error ? error.message : "unknown error",
          );
          controller.enqueue(
            event({ type: "fallback", reason: "Open conversation paused." }),
          );
        } finally {
          controller.close();
        }
      },
    });
    return ndjsonResponse(stream);
  }

  const step = scenario.steps.find((item) => item.id === input.stepId);
  if (!step)
    return Response.json({ error: "Invalid role-call turn." }, { status: 400 });
  const evaluation = assessRoleCallAnswer(step, learnerText);
  const continueOpen =
    input.continueOpen === true &&
    evaluation.accepted &&
    providers.includes("gemini") &&
    step.id === scenario.steps.at(-1)?.id;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(event({ type: "status", status: "thinking" }));
      try {
        if (continueOpen) {
          const system = openSystemPrompt(
            scenario,
            supportLevel,
            history,
            sessionSeed,
          );
          const raw = await readGeminiRaw(
            process.env.GEMINI_API_KEY as string,
            system,
            learnerText,
            true,
          );
          const generated = parseOpenCoachPayload(raw);
          controller.enqueue(
            event({
              type: "feedback",
              provider: "gemini",
              feedback: generated.feedback,
            }),
          );
          controller.enqueue(
            event({
              type: "turn",
              provider: "gemini",
              openEnded: true,
              turn: generated.turn,
            }),
          );
        } else {
          const system = coachSystemPrompt(
            scenario,
            step,
            supportLevel,
            evaluation.accepted,
          );
          const generated = await runConversationAiProviders(
            providers,
            async (provider) => {
              const raw =
                provider === "ollama"
                  ? await readOllamaRaw(system, learnerText)
                  : provider === "gemini"
                    ? await readGeminiRaw(
                        process.env.GEMINI_API_KEY as string,
                        system,
                        learnerText,
                        false,
                      )
                    : await readAnthropicRaw(
                        process.env.ANTHROPIC_API_KEY as string,
                        system,
                        learnerText,
                      );
              return parseCoachPayload(
                raw,
                step.target,
                step.response,
                evaluation.accepted,
              );
            },
          );
          for (const failure of generated.failures)
            console.warn("Conversation AI provider fallback:", failure);
          controller.enqueue(
            event({
              type: "feedback",
              provider: generated.provider,
              feedback: generated.value.feedback,
            }),
          );
          if (generated.value.turn)
            controller.enqueue(
              event({
                type: "turn",
                provider: generated.provider,
                turn: generated.value.turn,
              }),
            );
        }
      } catch (error) {
        console.error(
          "Conversation AI fallback:",
          error instanceof Error ? error.message : "unknown error",
        );
        controller.enqueue(
          event({ type: "fallback", reason: "The authored role reply is being used." }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return ndjsonResponse(stream);
}

function ndjsonResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
