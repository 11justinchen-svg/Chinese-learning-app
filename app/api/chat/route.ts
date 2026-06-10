import Anthropic from "@anthropic-ai/sdk";
import { findLesson } from "@/lib/lessons";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Xiao Hui (小慧), a friendly robot Chinese tutor inside the MoZhi (默知) learning app. Your job is to give the learner real conversation practice in Mandarin Chinese, focused on what a traveler in China actually needs to say.

Rules for every reply:
- Carry on a natural conversation in Chinese at the learner's level. Default to simple HSK 1-2 Chinese unless the learner is clearly more advanced, then match their level.
- Always format Chinese sentences like this: the Chinese text, then pinyin in parentheses, then a short English gloss on the next line.
- Gently correct mistakes: quote the learner's sentence, show the corrected version, and explain the fix in one short English sentence.
- When an interesting character appears, occasionally break it into its components and explain what each component contributes (meaning side, sound side), in one or two sentences.
- Keep replies short, two to four exchanges worth of text at most, and always end with a question in Chinese to keep the conversation going.
- Be warm and encouraging, never lecture at length.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const { messages, scenarioId } = (await req.json()) as {
    messages: ChatMessage[];
    scenarioId?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages array is required" }, { status: 400 });
  }

  const lesson = scenarioId ? findLesson(scenarioId) : undefined;

  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ];
  if (lesson) {
    system.push({
      type: "text",
      text: `Scenario for this session, "${lesson.title}": ${lesson.prompt} Stay inside this scenario unless the learner clearly wants to change topics.`,
    });
  }

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system,
    messages: messages.slice(-20).map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => {
        controller.enqueue(encoder.encode(delta));
      });
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
