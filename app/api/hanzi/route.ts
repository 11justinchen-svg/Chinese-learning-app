import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a Chinese etymology expert inside the HuaShu learning app. Given one Chinese character, you break it into its functional components and explain what each contributes.

Respond with ONLY a JSON object, no markdown fences, matching exactly this shape:
{
  "char": "the character",
  "pinyin": "reading with tone marks",
  "meaning": "core English meaning(s)",
  "components": [
    {
      "char": "component",
      "pinyin": "reading",
      "meaning": "English meaning",
      "role": "semantic" | "phonetic" | "pictographic",
      "explanation": "one or two sentences on what this component contributes to the whole character"
    }
  ],
  "story": "two or three sentences telling how the components combine into the character's meaning and sound, suitable for a learner"
}

Rules:
- Use the real functional analysis (semantic radical vs phonetic component), not folk etymology, but phrase it memorably.
- Use compressed radical forms where they appear (氵 not 水, 亻 not 人) and note the full form in the explanation.
- If the input is not a single Chinese character, respond with {"error": "not a single Chinese character"}.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const { character } = (await req.json()) as { character: string };

  if (!character || typeof character !== "string") {
    return Response.json({ error: "character is required" }, { status: 400 });
  }

  const trimmed = character.trim();
  if ([...trimmed].length !== 1) {
    return Response.json(
      { error: "Please enter exactly one character." },
      { status: 400 },
    );
  }

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: trimmed }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  try {
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch {
    return Response.json(
      { error: "Could not analyze that character. Please try again." },
      { status: 502 },
    );
  }
}
