---
name: author-grammar-dialogues
description: Author, review, or implement step-by-step beginner Mandarin grammar conversations in MoZhi. Use when adding or changing grammar lesson dialogue, stage dialogue, interactive conversation steps, reply exercises, prompts, hints, accepted answers, corrections, pinyin, translations, or the UI and data model that advances a learner through a guided exchange.
---

# Author Grammar Dialogues

Create authored conversations that move a learner from understanding a model
to producing the target grammar in context. Do not confuse line-by-line reveal
with interaction: a grammar conversation must require learner turns.

## Inspect the lesson contract

1. Read the grammar lesson, stage allocation, current and prior word IDs, stage
   dialogue, exercise types, and progression rules.
2. State the target as a communicative act: identify, ask, negate, locate,
   request, compare, or report completion.
3. Choose one concrete situation where that act is natural.
4. Decide whether the task needs a model preview, an interactive guided
   conversation, or both.

Keep an existing stage preview as `DialogueLine[]` when it is only illustrative.
Do not overload that type with answer checking if the product needs interactive
learner turns; define a separate guided-step type with stable IDs.

## Build the conversation arc

Use six to ten short turns or steps:

1. **Set the scene:** Establish roles and a visible goal in one sentence.
2. **Model:** Show one natural exchange containing the target.
3. **Notice:** Briefly point to the form-to-meaning connection.
4. **Guided reply:** Ask the learner for a constrained response with choices or
   a strong hint.
5. **Reduced-support reply:** Ask a close variation with less scaffolding.
6. **Transfer:** Change one dimension such as person, polarity, noun, time, or
   setting.
7. **Personal response:** Let the learner express a true or chosen meaning when
   the grammar permits.
8. **Recap:** Replay the completed exchange without English by default and
   schedule a later retrieval item.

Repeat the target often enough to establish the pattern, but keep the exchange
natural. Avoid a dialogue whose only purpose is to cram in vocabulary.

## Specify interactive steps

For each step, provide the fields the renderer and evaluator need. Prefer a
shape equivalent to:

```ts
interface GuidedDialogueStep {
  id: string;
  speaker: string;
  kind: "model" | "learner" | "feedback";
  hanzi?: string;
  pinyin?: string;
  english?: string;
  prompt?: string;
  acceptedAnswers?: string[];
  targetWordIds?: string[];
  hint?: string;
  explain?: string;
}
```

Adapt to the repository's actual types. Keep model content deterministic and
available offline. Use an AI service only for optional semantic acceptance,
additional variations, or feedback; provide a local fallback.

## Author learner turns

- Ask for a meaningful reply, not transcription of the previous line.
- Accept common valid variants, punctuation differences, and optional pronouns
  when they do not change the target.
- Use exact matching for tightly controlled early steps, then widen acceptance.
- Give a three-level hint ladder: communicative cue, missing pattern, then
  partially completed answer.
- After a miss, explain one error and retry the same goal before advancing.
- Record first-attempt correctness once; retries support learning but do not
  create mastery credit.

## Write beginner Mandarin

- Stay within current-or-prior allocated vocabulary.
- Use standard spoken Mandarin, simplified hanzi, tone-marked pinyin, and a
  concise natural English gloss.
- Keep each turn focused on one intention.
- Do not force 吗 into question-word questions or 是 before adjectives.
- Verify measure words, aspect, negation, word order, and tone changes when
  relevant.
- Use names, roles, and settings consistently through the exchange.

## Review the experience

Check that:

- the learner speaks or selects a reply within the first few steps;
- the grammar target is needed to accomplish the scene goal;
- assistance fades across steps;
- at least one transfer step cannot be solved by copying;
- wrong answers receive targeted feedback and an immediate retry;
- audio has a text/pinyin fallback;
- the completed exchange can be replayed;
- stable step IDs preserve progress;
- vocabulary validation and the app build pass.

If the current UI only reveals authored model lines, report that clearly. Call
it a dialogue preview, then identify the missing learner-response, evaluation,
feedback, and retry states needed for a true guided grammar conversation.
