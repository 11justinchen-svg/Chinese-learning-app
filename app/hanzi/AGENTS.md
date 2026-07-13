# MoZhi Hanzi and Mandarin Learning Instructions

These instructions apply to work under `app/hanzi`. The repository root is
`../..`. Before changing curriculum or lesson behavior, inspect the relevant
implementation at the repository root; the local checkout may lag the GitHub
branch.

## Required skills

- For curriculum, progression, exercises, feedback, pinyin, audio, or learning
  efficiency, read and follow
  `skills/design-mandarin-learning/SKILL.md` completely.
- For grammar lessons, scenarios, dialogue data, conversation UI, or reply
  exercises, also read and follow
  `skills/author-grammar-dialogues/SKILL.md` completely.

State which skill is being used before it causes an implementation decision.

## Product goal

MoZhi should help a beginner understand and produce useful Mandarin, then
retain it. Optimize for durable communicative ability rather than time in app,
lesson count, streaks, or passive exposure.

Use this learning loop:

1. Show a short, comprehensible conversation with audio and meaning.
2. Draw attention to one grammar function in that context.
3. Require retrieval through varied, low-friction exercises.
4. Require a constrained learner reply inside the same situation.
5. Vary the situation or speaker so the pattern transfers.
6. Give specific corrective feedback and allow an immediate retry.
7. Schedule later retrieval with less pinyin and fewer hints.

Do not call a grammar lesson complete after reading an explanation or tapping
through model dialogue.

## Content constraints

- Introduce at most one new grammar function per focused block.
- Use only vocabulary allocated to the current stage or already learned,
  except proper names and explicitly allowlisted particles.
- Keep beginner turns short and natural. Prefer a useful sentence over an
  exhaustive grammatical explanation.
- Store every Chinese line with tone-marked pinyin and concise English.
- Use standard Mainland Mandarin and simplified characters unless a task says
  otherwise.
- Treat pinyin and English as fading scaffolds: available on demand at first,
  reduced during retrieval, and absent in final production when reasonable.
- Do not use misleading character etymology. Distinguish historical origin,
  semantic component, phonetic component, and mnemonic.
- Never fabricate citations, proficiency claims, or linguistic rules.

## Conversation behavior

The newer GitHub implementation has a stage-level `DialoguePanel` that reveals
model lines one at a time. That is a preview, not a full interactive grammar
conversation. A step-by-step grammar conversation must require learner turns,
evaluate the intended communicative meaning, provide a hint ladder, and retry
misses before advancing.

Prefer deterministic authored paths for beginner grammar. AI may provide safe
variations or feedback, but the core lesson must remain usable and testable
without an API call.

## Engineering guardrails

- Preserve stable IDs for stages, words, grammar lessons, blocks, and
  exercises; progress is stored against them.
- Keep content separate from rendering components.
- Validate vocabulary gating, answer uniqueness, pinyin/meaning presence, and
  exercise coverage after content changes.
- Test both the happy path and a wrong-answer retry path.
- Do not award mastery from recognition alone. Require first-attempt success
  across multiple exercise kinds and at least one production/reply task.
- Maintain accessibility: keyboard operation, visible focus, semantic buttons,
  non-color feedback, and a text fallback for speech.

## Relevant implementation

On the newer GitHub branch, inspect these files when present:

- `lib/data/grammar.ts`
- `lib/data/stages/types.ts`
- `lib/data/stages/allocation.ts`
- `lib/data/stages/stage-*.ts`
- `components/stage/dialogue-panel.tsx`
- `components/stage/grammar-intro.tsx`
- `components/exercises/exercise-player.tsx`
- `components/exercises/reply-exercise.tsx`
- `lib/progression.ts`
- `scripts/validate-stages.mjs`

In the older checkout, the conversation surface is `components/chat.tsx`, its
prompt is `app/api/chat/route.ts`, and scenario data is `lib/lessons.ts`.
