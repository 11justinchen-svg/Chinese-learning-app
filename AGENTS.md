# MoZhi Product and Learning Instructions

These instructions apply to the whole repository. Read `PRODUCT.md`,
`DESIGN.md`, and the relevant canonical implementation before changing product
behavior. Stable content IDs and stored progress are public contracts.

## Required skills

- Use `app/hanzi/skills/design-mandarin-learning/SKILL.md` for curriculum,
  progression, exercises, Hanzi memory, feedback, pinyin, speech, or claims
  about learning efficiency.
- Also use `app/hanzi/skills/author-grammar-dialogues/SKILL.md` for grammar,
  scenarios, dialogue, conversation UI, reply exercises, answer acceptance,
  hints, or corrections.
- Use the available frontend design skill and `DESIGN.md` for interface work.

State which skill is affecting an implementation decision before making it.

## Product outcome

MoZhi gets a beginner through useful HSK 3.0 Level 1 and Level 2 Mandarin quickly. Optimize
for real-life comprehension, Hanzi recognition, and an understandable spoken or
typed response. Do not optimize for streaks, time in app, forced review, or a
linear course path.

Retention tools may exist, but they are optional. Never gate a lesson, section,
conversation, Hanzi set, or test behind prior completion.

## Supported scope

- Product lessons and Hanzi follow the official 2025 HSK 3.0 examination
  syllabus for Levels 1 and 2 only.
- Level 1 contains 300 vocabulary entries.
- Level 2 adds 200 entries and assumes Level 1, for 500 cumulative entries.
- Preserve legacy word IDs when the same written form survives the migration;
  new entries use deterministic `hsk3-2025-###` IDs.
- Use standard Mainland Mandarin and simplified characters unless a task says
  otherwise.
- Every Chinese learning line stores tone-marked pinyin and concise English.

Do not show empty HSK 3 to 6 locks or imply those levels are implemented.

## Fast lesson contract

Target three to seven focused minutes per lesson. Show the duration and real-
life outcome before the learner starts.

1. Present a short, comprehensible real-life exchange with audio and meaning.
2. Point out one useful grammar or phrase function in one or two sentences.
3. Ask for retrieval within 45 seconds.
4. Require at least one meaningful learner reply.
5. Test Hanzi form, sound, meaning, and use.
6. End with a five-item fast test or let the learner open it immediately.

Every section has **Skip section** and every lesson header has **Take fast
test**. Skipping advances without awarding correctness, completion, or mastery.
The recommended order stays visible, but all sections remain operable.

## Hanzi memory contract

Teach words as usable written language, not isolated trivia:

- large simplified Hanzi;
- tone-marked pinyin and concise meaning;
- an honest semantic or phonetic component note when useful;
- one memorable visual or verbal mnemonic clearly labeled as a mnemonic;
- one short spoken example from a real situation;
- discrimination against a plausible similar form;
- retrieval from meaning or audio;
- use in a sentence or conversation reply;
- a short test available without completing the lesson.

Hanzi testing must support all three scopes: one selected form, a learner-built
custom set, and an authored real-life set. Shopping and small-talk sets are
baseline product contracts. Keep topic-set IDs and member word IDs stable.

Display proficiency as evidence in three separate lanes: form/meaning, sound,
and contextual use. Viewing a card, selecting a set, or optional SRS review
cannot create proficiency. Every supported Hanzi must have a reachable
contextual-use item so a 100% proficiency state is possible.

Never invent etymology. Distinguish historical origin, semantic component,
phonetic component, and mnemonic.

## Conversation acceptance

Evaluate communicative intent, not one exact sentence.

- Author multiple accepted answers for every learner turn.
- Normalize whitespace, punctuation, polite particles, common pronoun omission,
  and harmless wording differences.
- Support intent slots such as requested item, quantity, destination, time,
  affirmation, or refusal.
- If a reply accomplishes the goal but has a minor grammar problem, accept it,
  continue the scene, and attach one concise correction.
- Block only when the reply does not accomplish the current goal or becomes
  unsafe or unrelated.
- Give a three-level hint ladder and an immediate retry after a blocked reply.
- Show at least one natural variation after acceptance.
- Accept the tone-marked target pinyin and its unmarked equivalent when the
  learner chooses romanized input. Show the standard Hanzi form after a pinyin
  reply is understood.

AI feedback is optional and additive. It may comment on meaning, wording, or
grammar from typed or recognized text, but must never claim to have evaluated
tones, accent, fluency, or acoustic pronunciation without an actual audio
signal and a pronunciation-capable evaluator. Provider failure or missing
credits must fall back to the authored correction without blocking the call.
When Ollama is running with the configured model, prefer its private on-device
feedback by default; an explicit `AI_FEEDBACK_PROVIDER=anthropic` may prefer
the cloud while retaining Ollama as fallback.

Core authored paths must work offline. AI may widen semantic acceptance and
feedback, but it cannot be required for a lesson to function.

## Content constraints

- Introduce at most one new grammar function per focused block.
- HSK 1 blocks use current or previously introduced HSK 1 vocabulary.
- HSK 2 blocks may use all HSK 1 vocabulary plus current or earlier HSK 2
  vocabulary.
- Keep beginner turns short, spoken, and useful.
- Avoid literal English-to-Chinese phrasing and unnatural vocabulary stuffing.
- Pinyin and English are learner-controlled scaffolds, not rewards or locks.
- Never fabricate citations, proficiency claims, pronunciation rules, or
  linguistic history.

## Progress and testing

- Access is always open. Evidence and completion are separate.
- Recognition alone never creates mastery.
- Track first-attempt correctness separately from eventual success.
- Skips create no correctness or mastery credit.
- Tests cover at least two exercise kinds and one productive reply.
- A learner may retake any test immediately without losing access.
- Optional review can use spaced scheduling, but no review is mandatory.

## Visual implementation

Follow `DESIGN.md`. The references call for tactile poster composition,
handwritten display Hanzi, paper grain, bold print colors, and asymmetric type.
Keep answers, pinyin, controls, and explanations in a highly legible interface
face. Do not turn the learning flow into decorative collage.

## Engineering guardrails

- Preserve stable IDs for existing HSK 1 words, stages, grammar lessons,
  blocks, exercises, and conversation steps.
- Preserve real-life Hanzi set IDs and membership unless a migration is
  intentional and tested.
- Prefix new level-two data with `hsk2-` and keep IDs deterministic.
- Keep content separate from renderers.
- Maintain typed speech fallback, keyboard operation, visible focus, semantic
  controls, and non-color feedback.
- Validate vocabulary allocation, answer reachability, pinyin and meaning,
  exercise coverage, skip behavior, flexible accepted answers, and direct
  access to the final HSK 2 lesson.

## Verification

Before claiming completion, run and inspect:

- curriculum and role-call validators;
- progression and speech tests;
- tests for skip-without-credit and multi-answer acceptance;
- TypeScript;
- production build;
- desktop and mobile browser walkthroughs of HSK 1, HSK 2, Hanzi, a skipped
  section, a fast test, an accepted answer variant, and a blocked-answer retry.
