# Batch handoff — HSK-1 learning path (resume from here if the session dies)

Status as of 2026-07-05. Branch: `claude/eager-bohr-468slk` (PR #1 → main).
Delete this file once all Phase B units have merged.

## Status log

- 2026-07-05: All 12 Phase B workers were spawned and immediately killed by
  the account session limit (resets 10:40pm PT) — none opened a PR. The
  Stage 8 worker's worktree held a complete, validator-clean rewrite; it was
  salvaged and committed directly (`a949e70`). **Remaining units: stages
  2, 3, 4, 5, 6, 7, 9, 10 (W1–W6, W8, W9) + progress dashboard (W10) +
  flashcards integration (W11) + README (W12).** To resume after the limit
  resets: tell Claude Code "resume the batch in HANDOFF.md" — the unit
  briefs below are self-contained.

## What's done (Phase A — foundation, committed & pushed)

The ten-stage HSK-1 learning path is live and fully playable:

- `lib/data/stages/types.ts` — Stage + 6-kind Exercise union (choice, cloze, order, match, reply, listen)
- `lib/data/stages/allocation.ts` — FROZEN allocation of all 150 words + grammar lessons to stages 1–10. Never edit.
- `lib/data/stages/stage-01.ts` — hand-authored canonical stage (the template for all content work)
- `lib/data/stages/stage-02..10.ts` — correct metadata + generated drills from `exercise-gen.ts` (playable, awaiting hand-authored replacement)
- `lib/progression.ts` — word status (`new→seen→learning→learned→mastered`; learned = ≥3 first-try correct across ≥2 kinds AND SRS box ≥2), monotonic stage-completion stamps, locks, `?unlock=all` dev bypass (sessionStorage `mozhi.dev.unlock`)
- `components/exercises/*` — ExercisePlayer (practice re-queues misses, quiz mode for checkpoints, grades SRS once per word per block) + one component per exercise kind
- `components/stage/*`, `components/path/*` — stage walkthrough (dialogue → teach → blocks → checkpoint) and the locked path page
- `lib/speech.ts` — zh-CN browser TTS, pinyin fallback
- `scripts/validate-stages.mjs` (`npm run validate`, via tsx) — enforces the frozen allocation, exercise well-formedness, ≥3-credits-across-≥2-kinds learnability, and strict vocabulary gating (greedy longest-match segmentation; extras 们/儿; names 王明/李华 only)

Verified: `npm run validate` ✓, `npm run build` ✓, browser walkthrough of Stage 1 (dialogue, teach seen-recording, exercise answer → feedback → `mozhi.progress.v1` writes) ✓, `/flashcards` regression ✓.

## What remains (Phase B — 12 independent units, one PR each)

All PRs target `claude/eager-bohr-468slk`. Each unit owns its files exclusively — no unit touches another's files, `allocation.ts`, `index.ts`, `types.ts`, `exercise-gen.ts`, the validator, or any component (exceptions noted).

| # | Unit | Owned files | Task |
|---|------|-------------|------|
| W1–W9 | Stages 2–10 content | `lib/data/stages/stage-0N.ts` (one each) | Rewrite with hand-authored content following `stage-01.ts`: 6–10-line scenario dialogue, teach cards with notes/examples for every stage word, 2–3 vocab blocks + one grammar block per `grammarLessonId` (4–8 exercises drilling that pattern), 8–12-exercise checkpoint. Keep `id/index/wordIds/grammarLessonIds` verbatim. Use all six exercise kinds. Every stage word ≥3 credits across ≥2 kinds. Chinese text only from stages 1..N (validator enforces). Constraints: S2 no numbers ("我有猫", not "我有一个猫"); S5 must drill time-word-order sentences (我中午吃米饭); S8 never bare 说 (说话 only); S10 checkpoint samples earlier stages (boss review). |
| W10 | Progress dashboard | `app/progress/page.tsx`, `components/progress/*` (new), `components/nav.tsx` (only W10 may touch nav) | Word-status grid for all 150 words (color by `wordStatus()`), per-stage progress bars, SRS due summary; add a Progress nav link. |
| W11 | Flashcards integration | `components/flashcards.tsx` | Word-status chips + per-stage decks (from `STAGES`); keep `mozhi.srs.v1` / `mozhi.cards.v1` formats untouched. |
| W12 | Docs | `README.md` | Document the learning system, progression criteria, lock rules, validator, localStorage keys. |

## Worker verification recipe

1. `npm install`, then `npm run validate` — must pass; fix content, never the validator or allocation.
2. `npm run build` — must pass.
3. `npx next dev -p 31NN` (stage number: 3102–3110; W10 3111, W11 3112; W12 skips e2e) → `curl -s localhost:31NN/lessons/hsk1-stage-0N` (or `/progress`, `/flashcards`) → expect 200 + stage hanzi title + first dialogue line in HTML. Kill the server.
4. Never port 3000 (owner's dev server). Never `next build` while a dev server runs in the same worktree.
5. Commit, push, `gh pr create --base claude/eager-bohr-468slk`.

## How to resume

- Full plan: `~/.claude/plans/robust-giggling-cocoa.md` (this machine).
- Check which units landed: `gh pr list --base claude/eager-bohr-468slk`.
- For each missing unit, either spawn a fresh agent with the row above + recipe (the brief is self-contained), or write the content directly — `stage-01.ts` is the template and `npm run validate` is the referee.
- After all merge: browser-walk 2–3 stages end-to-end, then delete this file.
