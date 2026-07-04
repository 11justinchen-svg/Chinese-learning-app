# 默知 MoZhi — Product Requirements Document

**Status:** Draft v1
**Date:** 2026-06-09
**Author:** Justin
**Method:** Authored via the `grill-me` skill — every decision below was resolved one branch at a time.

---

## 1. Summary

MoZhi (默知) is a Chinese-learning web app built around **real conversation** rather than rote memorization. A 3D robot tutor, Xiao Hui (小慧), roleplays the situations a traveler actually hits — taxis, restaurants, hotels, bargaining — corrects mistakes in context, and teaches characters by explaining the *meaning of the components inside them* instead of drilling strokes.

This PRD covers the **product as a whole** and defines the v1 cut that turns the current stateless prototype into a product with users, progress, and a measurable retention loop.

## 2. Vision

> Learn the Chinese you'll actually use, from the trip that makes you want to learn it.

A real trip is the most powerful motivator a beginner ever gets. MoZhi captures that urgency, then keeps the learner going after the trip ends — converting a two-week cram into a lasting habit.

## 3. Target Users

MoZhi serves **two segments through one sequenced funnel** — not two parallel products.

| Segment | Who | Job-to-be-done |
|---|---|---|
| **Traveler (the wedge)** | Someone with a China/Taiwan trip ahead | "Be able to handle real situations on my trip." |
| **Learner (the retention engine)** | The same person, after the trip | "Keep building real Mandarin so it sticks." |

**Funnel thesis:** *Acquire on urgency (the trip), retain on mastery (the habit).* The trip is the hook that gets someone in the door; the same roleplay + hanzi engine converts them into an ongoing learner so they don't churn the day they land.

## 4. Positioning & Platform Decision

**v1 is desktop-oriented responsive web**, deliberately framed around the **trip-prep phase**:

- The heavy learning happens at a desk, *before* the trip — that's where focus, time, and typing live.
- In-country survival ("what's the word for receipt?") is treated as a lighter handoff, not the v1 design center.
- **Decision tension (recorded):** A traveler standing in a market is on a phone, not a laptop. We are consciously *not* optimizing for the in-country moment in v1. Mobile/PWA, offline survival phrases, and push-based streak reminders are explicitly a **fast-follow (v2)**, gated on v1 retention proof.

**Stack stays:** Next.js 14 (App Router), TypeScript, Tailwind, Spline 3D robot, Claude API for conversation and live character analysis.

## 5. Monetization

**Free for v1.** No paywall. The entire goal of v1 is growth and retention, so nothing is gated.

- Pricing/packaging is **out of scope** and deferred to a later PRD.
- AI cost (the Claude API drives real marginal cost on every tutor message and live hanzi analysis) is managed in v1 via **sensible per-user rate limits**, not a paywall.

## 6. Goals & Success Metrics

**North Star:** **D7 retention** — % of new users still active 7 days after signup. It is the truest test of the wedge→habit thesis and becomes measurable the moment accounts ship.

**Supporting metrics:**
- Lessons completed per user (activation / engagement depth)
- Tutor conversations per active user (use of the core differentiator)
- Signup → first-lesson-complete conversion (activation)

**v1 target (directional, to be calibrated post-launch):** establish a reliable D7 baseline and a working analytics loop — you cannot improve what you can't yet measure.

## 7. Scope — v1

### Already built (stays as-is)
- **Lesson path** (`/`) — Duolingo-style path of conversational, traveler-focused lessons grouped into units.
- **Conversation practice** (`/chat`) — streaming chat with the robot tutor; replies in Chinese + pinyin + English gloss with gentle in-context corrections.
- **Hanzi component system** (`/hanzi`) — curated characters broken into functional parts, plus live analysis of any typed character.
- **Robot-centered homepage hero**.

### New in v1 — the only addition
**Accounts + persistent progress.** This is the precondition for the entire product thesis: without it, retention cannot be measured or driven.

- User accounts (sign up / sign in).
- Persisted **lesson completion** state.
- **Unit unlocking / progression** across the lesson path.
- Basic profile (identity + progress overview).
- Per-user analytics events sufficient to compute the North Star and supporting metrics.

### Explicitly deferred (fast-follows, in priority order)
1. **Daily streak + XP loop** — the habit mechanic. *Known tension: retention is the v1 goal, yet the streak loop is deferred. It is the obvious v1.1 and the most likely first lever to move D7.*
2. **Trip-aware onboarding** — capture destination + trip date + level at signup to tailor the path and manufacture urgency. Cheap, high-leverage.
3. **SRS vocab review** — spaced repetition over words/characters from lessons. Strongest for the "learner" retention phase; heavier to build.
4. **Mobile/PWA + offline survival phrases + push reminders** — the in-country experience.

## 8. Non-Goals (v1)

- No pricing, payments, or subscription tiers.
- No native mobile apps; no offline mode.
- No in-country / on-the-go optimization.
- No streak/XP gamification (deferred to v1.1).
- No social features (leaderboards, friends).

## 9. Key Decisions Log

| # | Decision | Choice | Rationale |
|---|---|---|---|
| 1 | PRD scope | Whole product | Define the product, not a single feature. |
| 2 | Target user | Travelers **and** learners | Don't pick one; sequence them. |
| 3 | Segment model | Travel wedge → learning retention | One coherent funnel: acquire on urgency, retain on mastery. |
| 4 | Platform | Desktop web, trip-prep framing | Heavy learning happens at a desk before the trip; mobile/in-country deferred. |
| 5 | Monetization | Free (growth) | Optimize purely for retention; defer pricing. |
| 6 | v1 scope | Accounts + progress only | The precondition for measuring the retention goal; keep v1 lean. |
| 7 | North Star | D7 retention | Truest test of wedge→habit; measurable once accounts exist. |

## 10. Open Questions

- **Auth approach** — email/password, magic link, or OAuth (Google/Apple)? Affects signup friction, which directly bears on the North Star.
- **Data store** — what backs accounts/progress (the current stack has no persistence layer)? Needs selection before build.
- **AI rate limits** — what per-user message cap balances cost against the "unlimited conversation" value prop?
- **D7 target** — what D7 number counts as success for v1?
- **Streak timing** — does the retention goal justify pulling the streak loop *into* v1 rather than v1.1?

---

*Generated with the [grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) skill.*
