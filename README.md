# 默知 MoZhi

The Chinese Learning App, built around real conversation for travelers. A 3D robot tutor, Xiao Hui (小慧), roleplays the situations a tourist actually hits (taxis, restaurants, hotels, bargaining), corrects your mistakes in context, and teaches characters by explaining the meaning of the components inside them instead of asking you to memorize strokes.

## Features

- **Homepage case** (`/`): the argument for MoZhi over tile-tapping apps: character decomposition (好 = 女 + 子), phonetic series, mandatory production, tone pairs, real situations, and free vs. a paid annual commitment.
- **Lesson path** (`/lessons`): a Duolingo-style path of conversational lessons for travelers, grouped into units (first words, getting around, eating well, checking in, when things go wrong). Each lesson drops you into a live roleplay with the tutor.
- **Conversation practice** (`/chat`): a streaming chat with the robot tutor. Replies come in Chinese with pinyin and an English gloss, with gentle in-context corrections. The 3D robot sits beside the conversation.
- **Hanzi component system** (`/hanzi`): a curated set of characters broken into their functional parts (meaning component, sound component, pictograph), each with an explanation and a short story of how the parts combine. Type any other character and the tutor analyzes it live.
- **Robot-centered homepage hero** (`/`): the robot over a marquee wall of display type, with the 默知 logo set in a ring.

## Stack

- Next.js 14 (App Router) with TypeScript
- Tailwind CSS with a shadcn-style component structure (`components/ui`, `lib/utils.ts`)
- Spline (`@splinetool/react-spline`) for the 3D robot
- Claude API (`@anthropic-ai/sdk`) for conversation and character analysis

## Setup

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

The home and hanzi pages work without an API key (the curated character set is local). The chat tutor and live character analysis require `ANTHROPIC_API_KEY`.

## Project structure

```
app/
  page.tsx            homepage hero around the 3D robot
  chat/page.tsx       conversation with the robot tutor
  hanzi/page.tsx      character component explorer
  api/chat/route.ts   streaming Claude conversation endpoint
  api/hanzi/route.ts  character breakdown endpoint
components/
  ui/                 shadcn-style primitives (card, spotlight, splite)
  chat.tsx            chat client
  hanzi-explorer.tsx  hanzi browser and live lookup
lib/
  hanzi-data.ts       curated character breakdowns
  utils.ts            cn() helper
```
