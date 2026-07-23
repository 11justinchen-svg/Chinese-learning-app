---
name: assess-hanzi-mastery
description: Design, audit, or implement evidence-based Hanzi assessment and progress in MoZhi. Use for Hanzi tests, exercise coverage, mastery thresholds, progress lanes, first-attempt scoring, retry behavior, cumulative review, lesson summaries, custom or real-life sets, and claims that a learner knows a written Mandarin word.
---

# Assess Hanzi Mastery

Measure usable written language without confusing exposure, completion, or
eventual retry success with proficiency. Keep access open and preserve stable
content and progress IDs.

## Inspect the evidence system

1. Locate canonical words, lesson allocations, exercise types, progress
   records, and validators before proposing changes.
2. Confirm the tested scope: the official 2025 HSK 3.0 syllabus has 300 Level 1
   entries; Level 2 adds 200 entries and assumes Level 1.
3. Trace every progress mutation. Card views, set selection, skips, and
   optional review scheduling must not create correctness or proficiency.
4. Preserve existing word, stage, set, exercise, and progress IDs. Derive new
   lesson summaries from word evidence instead of duplicating mastery state.

## Keep three independent evidence lanes

Record evidence per written form and do not collapse it into a single mastered
boolean.

| Lane | Qualifying evidence | Non-qualifying evidence |
| --- | --- | --- |
| Form and meaning | Retrieve Hanzi from meaning, distinguish it from a plausible similar form, or retrieve meaning from Hanzi | Viewing a card or copying a visible answer |
| Sound | Hear authentic audio and identify or enter the written form; identify tone-marked pinyin when testing sound-symbol mapping | Playing audio or reading already-visible pinyin |
| Contextual use | Complete a meaningful sentence, build a sentence, or produce an accepted conversation reply using the form | Isolated matching or recognition alone |

Do not infer acoustic pronunciation quality from typed text or answer choice.
Only a pronunciation-capable evaluator receiving actual audio may create that
claim.

## Design a qualifying assessment

1. Define an observable target for each item: form, meaning, sound, or use.
2. Include at least two exercise kinds and one productive sentence or reply in
   every test that can award overall proficiency.
3. Use current-or-earlier vocabulary. HSK 2 may also use all HSK 1 vocabulary.
4. Supply tone-marked pinyin, concise English, audio, and a text fallback in
   the source data even when scaffolds are hidden during retrieval.
5. Give each supported form a reachable contextual-use item so full
   proficiency is attainable.
6. Support tests for one selected form, a learner-built custom set, and stable
   authored real-life sets. Preserve shopping and small-talk set IDs and
   membership unless an intentional migration is tested.
7. Keep a five-item fast test available immediately. All lessons, sets, and
   retakes remain unlocked.

Prefer plausible confusables over arbitrary distractors. Ensure one best answer
where the format requires selection; authorize multiple natural answers where
the learner produces language.

## Record attempts without inflating proficiency

For each attempt, preserve at minimum:

- stable exercise, word, scope, and lane identifiers;
- whether it was the first attempt;
- correctness and eventual success separately;
- hint or answer-reveal usage;
- exercise kind and timestamp needed by the existing progression model.

Count first-attempt, unhinted correctness as mastery evidence. Count a
successful retry as practice completion and recovery evidence, not as a
replacement for the missed first attempt. Never erase a miss when a later
attempt succeeds.

Require evidence across multiple encounters and exercise kinds before labeling
a lane proficient. Require all three lanes, including contextual production,
before showing overall proficiency. If the repository defines stricter
thresholds, preserve them.

## Handle errors and retries

1. Identify the smallest high-value error.
2. Give the least revealing useful hint.
3. Retry immediately before revealing the answer.
4. Requeue the form later with reduced scaffolding.
5. Record skip, reveal, retry, and first-attempt outcomes distinctly.

Use a three-level hint ladder: communicative cue, structural cue, then partial
form. A skip advances without correctness, completion, or mastery credit.

## Build cumulative review

Compose each lesson assessment from its canonical new-word allocation plus a
small sample of earlier words in transfer contexts. Increase spacing and reduce
pinyin and English gradually; do not create an ever-growing exhaustive test.

Keep cumulative review optional and non-gating. Prioritize misses and weak
lanes, but let learners open any lesson, set, or fast test directly. Repeated
review changes proficiency only through qualifying assessment attempts.

## Report progress honestly

Show form/meaning, sound, and contextual-use status separately. Use neutral
states such as untested, developing, and proficient when evidence is sparse.
Expose why a lane has its status and what activity can improve it.

Calculate lesson and set summaries from member-word evidence. A lesson can be
complete while one or more proficiency lanes remain developing; access and
completion are not mastery.

## Validate implementation

Before claiming success, verify:

- every HSK 1 and HSK 2 form is reachable in all three evidence lanes;
- first-attempt misses remain misses after successful retries;
- skips and card views award no correctness or proficiency;
- at least two exercise kinds and a productive item contribute to mastery;
- selected-form, custom-set, and authored-set tests work;
- stable IDs and stored progress remain compatible;
- cumulative review uses only allowed vocabulary and remains optional;
- answer variants, keyboard access, audio fallback, and wrong-answer retry work;
- curriculum validators, progression and speech tests, TypeScript, and the
  production build pass.

Report the evidence used for each claim and name any assessment assumption that
remains untested.
