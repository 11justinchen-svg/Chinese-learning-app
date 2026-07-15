# 默知 MoZhi

An HSK-1 Mandarin learning app built around short, useful conversations,
retrieval practice, and character structure.

## Features

- **Open lesson courtyard** (`/lessons`): ten HSK-1 stages available in any
  order, with model dialogues, vocabulary teaching, grammar drills, production
  tasks, and checkpoints.
- **Role calls** (`/conversation`): speak or type through authored calls with a
  waiter, sales associate, taxi driver, hotel clerk, or teacher. Browser speech
  recognition and Mandarin text-to-speech are enhanced when available, but
  every call has a deterministic text fallback.
- **Flashcards** (`/flashcards`): spaced review of the HSK-1 vocabulary.
- **Progress** (`/progress`): stage completion, productive-recall gates,
  spaced-review status, and all 150 words in one dashboard.
- **Hanzi component system** (`/hanzi`): a curated character explorer focused
  on functional components.

## Stack

- Next.js 14 (App Router) with TypeScript
- Tailwind CSS and local React components
- Optional Claude API calls for safe role-reply variations; no SDK required

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The complete learning path and authored role calls work without an API key.
Set `ANTHROPIC_API_KEY` to enable constrained role-reply variations. You can
optionally override the default model with `ANTHROPIC_MODEL`.

## Learning workflow

Each stage follows the same durable-learning sequence:

1. Tap through a short comprehensible dialogue with Mandarin speech.
2. Learn the stage vocabulary in context.
3. Retrieve it through choice, listening, matching, cloze, ordering, and reply
   tasks.
4. Practice grammar in a linked role call with hints and correction/retry.
5. Pass the checkpoint with at least 80% first-try accuracy, learn at least 80%
   of the stage words, and use at least half in sentence or reply practice.
6. Review any HSK-1 vocabulary with the local Leitner schedule.

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
  lessons/                     HSK-1 learning path
  conversation/page.tsx       role-call practice
  api/conversation/route.ts   optional streamed AI reply variations
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
