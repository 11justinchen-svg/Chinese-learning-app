export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestWindows = new Map<string, { count: number; resetAt: number }>();
const TRANSLATE_MODEL =
  process.env.GEMINI_TRANSLATE_MODEL ?? "gemini-3.5-live-translate-preview";

function allowToken(request: Request): boolean {
  const now = Date.now();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || request.headers.get("x-real-ip") || "local";
  const existing = requestWindows.get(client);
  if (!existing || existing.resetAt <= now) {
    requestWindows.set(client, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (existing.count >= 4) return false;
  existing.count += 1;
  return true;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return Response.json(
      { error: "Live translation is not configured." },
      { status: 503 },
    );
  if (!allowToken(request))
    return Response.json(
      { error: "Live translation token limit reached." },
      { status: 429, headers: { "Retry-After": "60" } },
    );

  const now = Date.now();
  const upstream = await fetch(
    "https://generativelanguage.googleapis.com/v1alpha/auth_tokens",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        uses: 1,
        expireTime: new Date(now + 15 * 60_000).toISOString(),
        newSessionExpireTime: new Date(now + 60_000).toISOString(),
      }),
      signal: AbortSignal.timeout(8_000),
    },
  );
  if (!upstream.ok) {
    const detail = (await upstream.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    console.error(
      "Gemini ephemeral token request failed:",
      upstream.status,
      detail?.error?.message?.slice(0, 320) ?? "unknown error",
    );
    return Response.json(
      { error: "Live translation could not start." },
      { status: 502 },
    );
  }
  const result = (await upstream.json()) as { name?: string };
  if (!result.name)
    return Response.json(
      { error: "Live translation returned no token." },
      { status: 502 },
    );

  return Response.json(
    {
      token: result.name,
      model: TRANSLATE_MODEL,
      expiresAt: new Date(now + 15 * 60_000).toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
