---
name: author-hanzi-sentence-practice
description: Author, review, or implement beginner Mandarin Hanzi sentence practice in MoZhi. Use for sentence ordering, cloze, word-bank construction, contextual-use tests, communicative replies, answer variants, hints, corrections, or exercise sets that must stay within current and previously introduced HSK 1 or HSK 2 vocabulary.
---

# Author Hanzi Sentence Practice

Create short, deterministic exercises that move a learner from recognizing a
written word to using it in a natural sentence or reply. Keep the core path
offline, accessible, skippable, and available without lesson gating.

## Establish the contract

1. Inspect the canonical stage allocation, word IDs, exercise types, and
   progression rules. Never infer allowed vocabulary from UI copy.
2. Name one observable communicative outcome, such as describing a person or
   requesting an item. Introduce at most one new grammar function.
3. Build an allowlist from current and prior stages. HSK 2 may also use all HSK
   1 vocabulary. Map every lexical token to an allowed word ID; treat approved
   particles and proper names as explicit exceptions.
4. Preserve existing IDs. Give new exercises deterministic IDs derived from
   the level, stage, target word, exercise kind, and sequence.

## Build a compact practice arc

Place retrieval within 45 seconds and keep the full set within a three-to-seven
minute lesson:

1. Show one short spoken example with simplified Hanzi, tone-marked pinyin,
   concise English, and audio or a text fallback.
2. Ask for a guided ordering or cloze response.
3. Ask for a reduced-support sentence construction using a word bank or brief
   meaning prompt.
4. Require a meaningful reply in a visible real-life situation.
5. Change one detail—person, object, number, time, polarity, or setting—and ask
   for transfer without copying the model.
6. Requeue misses with less revealing feedback; do not turn retries into
   first-attempt credit.

Use at least two exercise kinds plus one productive reply in a test. Make the
five-item fast test directly available; do not require the teaching sequence.

## Author each exercise kind

### Ordering

- Split a natural spoken sentence into meaningful chunks.
- Prefer an order with one defensible answer. If multiple orders are natural,
  accept all or revise the prompt instead of marking valid Mandarin wrong.
- Avoid giving away the answer through punctuation or chunk shape.

### Cloze

- Blank the target Hanzi only when context makes the intended word clear.
- Supply plausible same-stage distractors with distinct form and meaning.
- Record every natural accepted answer when the communicative goal permits
  more than one response.

### Sentence construction

- Ask the learner to express a meaning, not copy the preceding line.
- Constrain early items with a word bank; reduce support in later variations.
- Accept harmless pronoun omission, particle variation, punctuation, and word
  order differences that preserve the intended meaning.

### Communicative reply

- State the speaker role, situation, and immediate goal.
- Author multiple natural accepted answers and explicit intent slots such as
  item, quantity, destination, time, affirmation, or refusal.
- Provide three hints: communicative cue, required pattern, then a partially
  completed response.
- If the learner achieves the goal with a minor grammar error, accept the
  reply, show one concise correction and a natural variation, then continue.
- Block only a reply that misses the goal, is unsafe, or is unrelated. Give
  targeted feedback and retry the same goal before advancing.
- Accept tone-marked target pinyin and its unmarked equivalent when romanized
  input is enabled, then show the standard Hanzi form.

## Protect learning evidence

- Record first-attempt correctness separately from eventual success.
- Let **Skip section** advance without correctness, completion, or mastery.
- Award contextual-use evidence only for a sentence or meaningful reply, never
  for viewing, matching, selecting a set, or optional review.
- Keep form/meaning, sound, and contextual-use evidence separate.
- Make pinyin and English learner-controlled scaffolds, then fade them across
  retrieval; never remove the text fallback for audio.
- Keep every lesson, set, exercise, and retake available regardless of prior
  progress.

## Review Mandarin and implementation

Verify before shipping:

- every Chinese learning line has simplified Hanzi, tone-marked pinyin, and a
  concise natural English gloss;
- every lexical item is current or previously introduced;
- measure words, negation, aspect, word order, and tone marks are correct;
- distractors are plausible, unique, and cannot create another valid answer;
- answer normalization and accepted variants make every intended answer
  reachable;
- a wrong answer gets specific feedback, all three hints remain available, and
  an immediate retry works;
- skips award no credit and fast tests are directly reachable;
- stable IDs, keyboard operation, focus visibility, semantic controls, and
  speech text fallbacks remain intact.

Run the curriculum validator, relevant exercise and progression tests,
TypeScript, and the production build. Report any vocabulary, linguistic, or
acceptance assumption that remains unverified.
