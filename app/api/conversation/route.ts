import {
  assessRoleCallAnswer,
  findRoleCallScenario,
} from "@/lib/role-calls";
import {
  conversationAiProviderOrder,
  parseCoachPayload,
  runConversationAiProviders,
  type ConversationAiProvider,
} from "@/lib/conversation-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const requestWindows = new Map<string, { count: number; resetAt: number }>();
const OLLAMA_URL = "http://127.0.0.1:11434";
let ollamaHealth = { available: false, expiresAt: 0 };

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

async function ollamaAvailable(): Promise<boolean> {
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
    "If the local evaluator accepted the reply, also stay in character and produce the next role line. Preserve any question in the canonical role line word-for-word so the authored next turn remains coherent.",
    "Use standard simplified Mainland Mandarin and only very common beginner words. Do not introduce a new task or include markdown.",
    `Canonical reply: ${step.response.hanzi} / ${step.response.pinyin} / ${step.response.english}`,
    `Target learner model: ${step.target.hanzi} / ${step.target.pinyin} / ${step.target.english}`,
    accepted
      ? 'Return only JSON shaped as {"feedback":{"note":"...","betterHanzi":"...","betterPinyin":"..."},"turn":{"hanzi":"...","pinyin":"...","english":"..."}}.'
      : 'Return only JSON shaped as {"feedback":{"note":"...","betterHanzi":"...","betterPinyin":"..."},"turn":null}.',
    "Every pinyin field must use tone marks.",
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
  if (!upstream.ok) {
    const detail = await upstream.text();
    throw new Error(`Anthropic returned ${upstream.status}: ${detail.slice(0, 500)}`);
  }
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
  if (!upstream.ok) {
    const detail = await upstream.text();
    throw new Error(`Ollama returned ${upstream.status}: ${detail.slice(0, 500)}`);
  }
  const result = (await upstream.json()) as { message?: { content?: string } };
  const raw = result.message?.content;
  if (!raw) throw new Error("Ollama returned no text response");
  return raw;
}

async function availableProviders(): Promise<ConversationAiProvider[]> {
  return conversationAiProviderOrder({
    hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    ollamaAvailable: await ollamaAvailable(),
    preferred: process.env.AI_FEEDBACK_PROVIDER,
  });
}

export async function GET() {
  const providers = await availableProviders();
  return Response.json(
    {
      aiAvailable: providers.length > 0,
      providers,
      preferredProvider: providers[0] ?? null,
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
  const step = scenario?.steps.find((item) => item.id === input.stepId);
  const learnerText =
    typeof input.learnerText === "string" ? input.learnerText.trim() : "";
  const supportLevel = ["guided", "standard", "challenge"].includes(
    String(input.supportLevel),
  )
    ? String(input.supportLevel)
    : "guided";

  if (!scenario || !step || !learnerText || learnerText.length > 160)
    return Response.json({ error: "Invalid role-call turn." }, { status: 400 });
  const evaluation = assessRoleCallAnswer(step, learnerText);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(event({ type: "status", status: "thinking" }));
      try {
        const system = coachSystemPrompt(
          scenario,
          step,
          supportLevel,
          evaluation.accepted,
        );
        const generated = await runConversationAiProviders(providers, async (provider) => {
          const raw =
            provider === "ollama"
              ? await readOllamaRaw(system, learnerText)
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
        });
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
      } catch (error) {
        console.error(
          "Conversation AI fallback:",
          error instanceof Error ? error.message : "unknown error",
        );
        controller.enqueue(
          event({
            type: "fallback",
            reason: "The authored role reply is being used.",
          }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
