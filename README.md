# 默知 MoZhi

An HSK-1 Mandarin learning app built around short, useful conversations,
retrieval practice, and character structure.

## Features

- **Lesson path** (`/lessons`): ten HSK-1 stages with model dialogues,
  vocabulary teaching, grammar drills, production tasks, and checkpoints.
- **Role calls** (`/conversation`): speak or type through authored calls with a
  waiter, sales associate, taxi driver, hotel clerk, or teacher. Browser speech
  recognition and Mandarin text-to-speech are enhanced when available, but
  every call has a deterministic text fallback.
- **Flashcards** (`/flashcards`): spaced review of the HSK-1 vocabulary.
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
  stage/                           stage dialogue and teaching UI
lib/
  role-calls.ts       authored personas, steps, and local evaluation
  speech.ts           browser Mandarin text-to-speech
```
