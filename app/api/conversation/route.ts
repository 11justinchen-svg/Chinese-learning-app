import { findRoleCallScenario, normalizeMandarinAnswer } from "@/lib/role-calls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const requestWindows = new Map<string, { count: number; resetAt: number }>();

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

function requiredQuestionCue(hanzi: string): string | null {
  const match = hanzi.match(/(?:^|[。！])([^。！？]+)？/);
  return match?.[1] ? normalizeMandarinAnswer(match[1]) : null;
}

function safeGeneratedTurn(
  value: unknown,
  canonical: { hanzi: string; pinyin: string; english: string },
) {
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

export async function GET() {
  return Response.json(
    { aiAvailable: Boolean(process.env.ANTHROPIC_API_KEY) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey)
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

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(event({ type: "status", status: "thinking" }));
      try {
        const upstream = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model:
              process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
            max_tokens: 180,
            temperature: 0.35,
            system: [
              `You are role-playing a ${scenario.role} for an HSK-1 Mandarin learner.`,
              `Setting: ${scenario.setting}. Learner support: ${supportLevel}.`,
              "The learner has just successfully completed the authored communicative goal.",
              "Stay in character. Use standard simplified Mainland Mandarin and only very common beginner words.",
              "Keep the Chinese under two short sentences. Preserve any question in the canonical reply word-for-word so the next authored learner turn remains coherent.",
              "Do not introduce a new task, claim a learner mistake, or include markdown.",
              `Canonical reply: ${step.response.hanzi} / ${step.response.pinyin} / ${step.response.english}`,
              'Return only JSON with string fields "hanzi", "pinyin", and "english". Pinyin must use tone marks.',
            ].join("\n"),
            messages: [
              {
                role: "user",
                content: `Learner reply: ${learnerText}`,
              },
            ],
          }),
          signal: AbortSignal.timeout(12_000),
        });

        if (!upstream.ok) throw new Error(`Anthropic returned ${upstream.status}`);
        const result = (await upstream.json()) as {
          content?: Array<{ type?: string; text?: string }>;
        };
        const raw = result.content?.find((block) => block.type === "text")?.text;
        if (!raw) throw new Error("No text response");
        const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
        const turn = safeGeneratedTurn(parsed, step.response);
        if (!turn) throw new Error("Unsafe or malformed role response");
        controller.enqueue(event({ type: "turn", turn }));
      } catch {
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
