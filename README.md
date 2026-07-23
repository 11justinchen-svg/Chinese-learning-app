# 默知 MoZhi

An official 2025 HSK 3.0 Level 1 and Level 2 Mandarin learning app built around short, useful conversations,
retrieval practice, and character structure.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F11justinchen-svg%2FChinese-learning-app&env=GEMINI_API_KEY&envDescription=Server-only%20Gemini%20key%20for%20open-ended%20character%20calls%20and%20Live%20Translate&project-name=mozhi-mandarin)

## Features

- **Open lesson courtyard** (`/lessons`): topic lessons covering all 500 Level 1–2 entries, available in any
  order, with model dialogues, vocabulary teaching, grammar drills, production
  tasks, and checkpoints.
- **Grammar repertoire** (`/grammar`): every lesson-linked HSK 3.0 Level 1 and Level 2
  pattern in one unlocked, searchable review surface with audio and practice links.
- **Role calls** (`/conversation`): speak or type with a waiter, sales associate,
  taxi driver, hotel clerk, or teacher. Gemini Flash-Lite stays in character for
  an open-ended call; Gemini Live Translate can turn Mandarin speech into a
  checked transcript. Authored coached calls remain available without an API.
- **Flashcards** (`/flashcards`): spaced review of HSK 3.0 Level 1 and Level 2 vocabulary.
- **Progress** (`/progress`): stage completion, productive-recall gates,
  spaced-review status, and all supported words in one dashboard.
- **Hanzi component system** (`/hanzi`): a curated character explorer focused
  on functional components.

## Stack

- Next.js 15 (App Router) with TypeScript
- Tailwind CSS and local React components
- Gemini 3.5 Flash-Lite REST calls for structured character turns and feedback
- Gemini 3.5 Live Translate with one-use, short-lived browser tokens

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The complete learning path and authored coached calls work without an API key.
Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to enable free
character calls and Live Translate. Keep this key server-side; the browser only
receives a short-lived, one-use Live API token. Anthropic and local Ollama are
optional fallback providers.

## Deploy to Vercel

Import the GitHub repository in Vercel with the repository root (`./`) as the
Root Directory. Vercel detects Next.js automatically; keep its default install,
build, and output settings. The committed `package-lock.json` provides a locked
npm install, and `package.json` pins the supported Node.js 24 runtime.

No environment variable is required for authored lessons. For the full hosted
experience, add `GEMINI_API_KEY` as a server-only Vercel environment variable.
The committed defaults use `gemini-3.5-flash-lite` for the character and
`gemini-3.5-live-translate-preview` for audio translation. You may also set
`GEMINI_MODEL`, `GEMINI_TRANSLATE_MODEL`, and `AI_FEEDBACK_PROVIDER=gemini`
explicitly. Ollama is local-only and is disabled in Vercel functions.

Before deploying, run the same gates used for this repository:

```bash
npm ci
npm run validate
npm run test:progression
npm run test:speech
npm run build
```

## Learning workflow

Each stage follows the same durable-learning sequence:

1. Tap through a short comprehensible dialogue with Mandarin speech.
2. Learn the stage vocabulary in context.
3. Retrieve it through choice, listening, matching, cloze, ordering, and reply
   tasks.
4. Retrieve one or two focused grammar functions through ordering, cloze, and
   scenario-reply tasks, then review them any time in `/grammar`.
5. Pass the checkpoint with at least 80% first-try accuracy, learn at least 80%
   of the stage words, and use at least half in sentence or reply practice.
6. Review any HSK 1 or HSK 2 vocabulary with the local Leitner schedule.

Progress stays on the device in `mozhi.progress.v1`, SRS scheduling in
`mozhi.srs.v1`, and custom cards in `mozhi.cards.v1`.

## Verification

```bash
npm run test:speech
npm run test:progression
npm run validate
npm run build
```

`npm run validate` checks frozen word allocation, vocabulary gating, exercise
shape and learnability, plus all authored role-call paths.

## Project structure

```
app/
  lessons/                     HSK 1 and HSK 2 learning paths
  grammar/page.tsx             unlocked grammar repertoire
  conversation/page.tsx       open character and coached role calls
  api/conversation/route.ts   streamed Gemini character turns and feedback
  api/conversation/live-token short-lived Gemini Live tokens
  hanzi/page.tsx              character component explorer
components/
  conversation/role-call-studio.tsx  guided voice/text calls
  exercises/                       lesson exercise renderers
  progress/                        learner progress dashboard
  stage/                           stage dialogue and teaching UI
lib/
  role-calls.ts       authored personas, steps, and local evaluation
  speech.ts           browser Mandarin text-to-speech
  progression.ts      learning evidence, completion, and open stage access
```
