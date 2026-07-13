---
name: design-mandarin-learning
description: Design, review, or implement efficient beginner Mandarin learning in MoZhi. Use for curriculum sequencing, HSK vocabulary allocation, grammar lesson structure, exercise selection, mastery rules, spaced repetition, scaffolding, corrective feedback, pronunciation support, learning metrics, or any claim that a Chinese-learning flow is effective.
---

# Design Mandarin Learning

Build for durable comprehension and production, not passive completion. Make
the smallest change that improves the learner's next useful behavior and its
later retention.

## Inspect before designing

1. Locate the canonical vocabulary, grammar, stage, exercise, and progression
   types. Do not infer the schema from UI copy.
2. Identify what the learner already knows at this point and the one new
   communicative function being taught.
3. Check whether the task changes content, pedagogy, progression, UI, or all
   four. Preserve stable progress IDs.
4. Define an observable outcome such as “answer a yes/no question with 是/不是
   in a new context,” not “understand 吗.”

## Use the efficient learning loop

Sequence a focused block as follows:

1. **Comprehensible model:** Show a short useful exchange with audio, hanzi,
   optional pinyin, and concise meaning.
2. **Noticing:** Highlight the target form and explain its communicative job in
   one or two sentences.
3. **Retrieval:** Ask the learner to recognize, order, complete, or hear the
   form without simply copying the model.
4. **Constrained production:** Require a contextually appropriate reply.
5. **Variation:** Change person, object, polarity, or setting while preserving
   the grammar target.
6. **Feedback and retry:** Identify the smallest meaningful error, give the
   least revealing useful hint, and retry before showing the answer.
7. **Delayed retrieval:** Revisit the target later with reduced pinyin and
   fewer hints.

Prefer short, repeated encounters distributed across a stage over one long
explanation.

## Control cognitive load

- Teach one new grammar function per block.
- Use only current-or-previous vocabulary, plus explicit allowlist items.
- Keep beginner dialogue turns short enough to hold in working memory.
- Introduce form in a meaningful situation before naming terminology.
- Make pinyin and English available on demand, then fade them. Do not hide
  meaning during initial comprehension or show full scaffolds forever.
- Include audio for listening, but always provide a text fallback.

## Require productive mastery

Do not award mastery solely for reading, tapping through dialogue, matching, or
multiple choice. Require:

- first-attempt success on more than one encounter;
- success across at least two exercise kinds;
- at least one reply or production task;
- a later review after the initial block.

Track first-attempt correctness separately from eventual completion. Requeue
misses for practice without inflating mastery credit.

## Give useful feedback

1. Confirm the intended meaning when it is understandable.
2. Identify one high-value correction at a time.
3. Contrast the learner form with the corrected form.
4. Explain the functional rule briefly.
5. Ask for an immediate retry or close variation.

Accept valid alternatives when the communicative goal allows them. Keep exact
answer matching only where one form is genuinely required.

## Protect Mandarin quality

- Use standard simplified Mandarin and tone-marked pinyin unless specified.
- Verify tones, segmentation, translation, and grammar against authoritative
  references when uncertain.
- Prefer common spoken phrasing over literal English-to-Chinese mapping.
- Distinguish etymology from a mnemonic and semantic from phonetic components.
- Avoid teaching an exception as a universal rule.

## Validate changes

Run the repository's content validator and relevant build/tests. Also inspect:

- vocabulary gating and learnability;
- unique, plausible distractors;
- answer acceptance and wrong-answer retry;
- audio fallback;
- keyboard and screen-reader operation;
- progression credit and stable IDs;
- pinyin/English fading rather than sudden removal.

Report what behavior improved, how it was verified, and any learning assumption
that remains untested.
