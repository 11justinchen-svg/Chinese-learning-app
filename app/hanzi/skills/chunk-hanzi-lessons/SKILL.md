---
name: chunk-hanzi-lessons
description: Design, implement, or review cumulative HSK 1 and HSK 2 Hanzi lesson chunks in MoZhi. Use when adding a Hanzi lesson overview, lesson cards, stage-based character sets, flashcards, matching, listening, sentence creation, reply practice, fast tests, missed-item review, or lesson-level Hanzi progress while preserving the general explorer and all-unlocked access.
---

# Chunk Hanzi Lessons

Turn the canonical MoZhi curriculum into short Hanzi-focused lesson paths. Keep
the general Hanzi explorer, real-life sets, custom sets, and single-form tests;
lesson chunks are an additional stage-based view, not a replacement curriculum.

## Inspect the source of truth

1. Read repository `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, and
   `skills/design-mandarin-learning/SKILL.md` before editing.
2. Locate canonical stage allocations, word records, exercise types,
   progression evidence, and Hanzi set definitions. Do not infer them from UI
   labels.
3. Map each chunk to an existing stable stage ID and its canonical word IDs.
   Preserve existing stage, word, exercise, topic-set, and progress IDs.
4. Record the stage's real-life outcome, current words, and eligible prior
   words. HSK 1 may use current or prior HSK 1 vocabulary; HSK 2 may also use
   HSK 1 vocabulary.

## Define the information architecture

Provide three reachable Hanzi paths:

- **Overview:** level summary, search, proficiency map, and a general mixed
  test.
- **Lessons:** all HSK 1 and HSK 2 stage chunks, always unlocked, with the
  recommended order visible.
- **Sets:** authored real-life sets, learner-built custom sets, and one-form
  practice.

Label each lesson with level, sequence, and an observable communicative outcome,
for example `Lesson 1 · HSK 1 — Describe people`. Show estimated duration, new
Hanzi count, and separate form/meaning, sound, and contextual-use evidence.

Derive lesson summaries from word-level evidence. Do not create a parallel
mastery store or award credit for opening a card, selecting a set, or skipping.

## Build each chunk

Target three to seven focused minutes and keep every section skippable. Include:

1. **Preview:** State the real-life goal; distinguish new words from prior words.
2. **Character cards:** Show large simplified Hanzi, tone-marked pinyin,
   concise meaning, audio with text fallback, one short spoken example, and an
   honest component note or clearly labeled mnemonic when useful.
3. **Flashcards:** Retrieve meaning and pronunciation instead of merely revealing
   cards.
4. **Discrimination:** Match Hanzi with meaning or pinyin and contrast a
   plausible similar form.
5. **Listening:** Retrieve the written form from audio.
6. **Sentence use:** Order, complete, or construct a short sentence using only
   eligible vocabulary.
7. **Meaningful reply:** Respond inside the stage's real-life situation. For
   reply behavior, also follow `skills/author-grammar-dialogues/SKILL.md`.
8. **Fast test:** Offer five mixed items immediately, including at least two
   exercise kinds and one productive reply.
9. **Miss review:** Requeue errors with specific feedback, a least-revealing
   hint, and an immediate retry.

Let later chunks sample a small number of earlier words in transfer items.
Never turn cumulative practice into linear gating or an ever-growing mandatory
test. Fade pinyin and English during retrieval while keeping them available on
demand.

## Implement without curriculum drift

- Compose lesson chunks from canonical stage word IDs; do not copy vocabulary
  into a second lesson dataset.
- Keep content separate from renderers. Prefer shared exercise generation and
  progress selectors over lesson-specific UI logic.
- Add deterministic IDs for genuinely new content and prefix HSK 2 additions
  with `hsk2-`.
- Preserve authored real-life set IDs and memberships, including shopping and
  small talk.
- Keep all chunks, tests, and sections directly operable regardless of progress.
- Keep semantic controls, keyboard access, visible focus, non-color feedback,
  and typed speech fallback.

## Award evidence conservatively

Track first-attempt correctness separately from eventual success. Update only
the evidence lane actually tested:

- Hanzi/meaning retrieval contributes to **form/meaning**.
- Audio retrieval contributes to **sound**.
- Sentence construction or a communicatively successful reply contributes to
  **contextual use**.

Recognition alone never creates mastery. A skip advances navigation only and
creates no completion, correctness, or proficiency evidence. Allow immediate
retakes without removing access.

## Validate before completion

1. Run curriculum and Hanzi validators, progression and speech tests,
   skip-without-credit tests, multi-answer acceptance tests, TypeScript, and the
   production build.
2. Prove every supported form has a reachable contextual-use item and that a
   100% state is achievable through real evidence.
3. Check vocabulary gating, pinyin and meanings, unique plausible distractors,
   audio fallback, stable IDs, and direct access to the final HSK 2 chunk.
4. Walk through desktop and mobile: overview, one HSK 1 chunk, one HSK 2 chunk,
   a skipped section, fast test, accepted reply variant, and blocked-answer
   retry.
5. Report the behavior added, authoritative data used, checks run, and any
   learning assumption that remains untested.
