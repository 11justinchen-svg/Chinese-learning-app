# MoZhi Hanzi Instructions

The repository-wide instructions in `../../AGENTS.md` apply first. This folder
contains the Mandarin learning skills used when changing curriculum, exercises,
conversation behavior, feedback, pinyin, audio, or Hanzi learning.

## Required skills

- Read `skills/design-mandarin-learning/SKILL.md` completely for curriculum,
  progression, exercises, testing, Hanzi memory, feedback, or learning UX.
- Also read `skills/author-grammar-dialogues/SKILL.md` completely for grammar,
  scenarios, dialogue, conversation UI, replies, accepted answers, hints, or
  corrections.

State which skill is affecting the implementation before it changes a product
decision.

## Local priorities

- Official 2025 HSK 3.0 Levels 1 and 2 only: 300 Level 1 entries and 200
  additional Level 2 entries.
- Short, real-life, skippable learning blocks.
- Hanzi form, sound, meaning, component, retrieval, and use.
- Multiple natural conversation answers evaluated by communicative intent.
- Tone-marked pinyin, concise English, speech, and a text fallback.
- Stable IDs, offline authored paths, accessibility, and validation.

Do not reintroduce linear locks, mandatory retention work, exact-sentence
conversation grading, fabricated etymology, or decorative handwritten text in
controls and explanations.
