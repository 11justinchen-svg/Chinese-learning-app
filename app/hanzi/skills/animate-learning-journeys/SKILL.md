---
name: animate-learning-journeys
description: Design and implement restrained, accessible scroll-driven learning-path interfaces with in-view stagger, sticky journey navigation, position progress, and reduced-motion fallbacks. Use when building or refining lesson maps, curriculum overviews, chapter journeys, sticky section navigation, scroll progress indicators, or entrance motion in React, Next.js, HTML, or CSS.
---

# Animate Learning Journeys

Use scroll motion to explain position and sequence. Never let scrolling award learning evidence, complete work, or unlock content.

## Establish constraints

1. Read the project's design system and canonical learning/progression implementation.
2. Inspect `package.json` before importing a motion library. Prefer CSS, `IntersectionObserver`, and native sticky positioning; add no dependency for simple reveals or progress.
3. Identify the actual scroll root and test whether any ancestor's `overflow`, `transform`, or height breaks `position: sticky`.
4. Preserve semantic DOM order and make every destination reachable without scrolling through prior lessons.
5. Keep instructional copy, answers, pinyin, and controls visually still and highly legible.

Before specifying or coding motion, write:

```text
INTERACTION MODEL: [scroll-driven | combined: scroll + click]
TRIGGER: [viewport entry, section intersection, journey scroll position, or explicit navigation]
STATES: [named visible/active states]
TRANSITION: [property, distance, duration, easing, and reduced-motion result]
LEARNING EFFECT: [position only; never completion, correctness, proficiency, or access]
```

## Choose the smallest pattern

### Reveal lesson groups in view

- Use one-shot `IntersectionObserver` class changes for section entrances.
- Keep the source visible until JavaScript adds a motion-ready root class; a failed script must not leave content at `opacity: 0`.
- Reveal with `opacity` and a `translateY` of 8–16px over 400–600ms using an ease-out curve.
- Stagger siblings by 60–80ms and cap the total cascade near 320ms. Do not delay a control the learner needs.
- Set the observer `root` explicitly for a custom scroll container and disconnect it on cleanup.
- Remove `will-change` after the entrance completes.

### Keep journey navigation sticky

- Use a semantic `<nav aria-label="Lesson journey">` containing ordinary links or buttons in recommended order.
- Mark the intersecting destination with `aria-current="step"`; pair color with type, marker, or label.
- Let a navigation action scroll to and focus its destination. Preserve URL fragments when appropriate.
- Keep lesson access click-driven even when the active marker is scroll-driven.
- Use a sticky rail only when the viewport has room. Collapse to a compact normal-flow index on narrow or short screens.
- Avoid scroll hijacking, mandatory scroll snap, fake multi-viewport spacer sections, and passive content switching that replaces reachable lesson content.

### Show journey position

- Label scroll position as `Journey position`, not progress, mastery, or completion.
- Render a decorative bar with `transform: scaleX(var(--journey-position))` and `transform-origin: left`; do not animate width.
- Keep decorative progress `aria-hidden`. If a numeric value is useful, update visible text without a live region so scrolling does not create announcement noise.
- Clamp the value to 0–1 and handle `scrollHeight <= clientHeight` as complete or hidden, never `NaN`.
- Prefer section intersections for active-step state; use a passive scroll listener only when continuous position is necessary.

### Build a sticky learning story only when it teaches

- Reserve sticky state machines for a short orientation or genuine step comparison, not routine exercises.
- Keep the authored content in normal DOM order so keyboard, search, screen readers, and reduced motion retain the full story.
- Drive only decorative emphasis with scroll. Use discrete state boundaries instead of continuously re-rendering React on every pixel.
- Use `min-height: 100dvh` where viewport height matters and provide a normal-flow mobile fallback.
- Do not use parallax, continuous float, or orchestrated page-load animation in focused learning flows.

## Engineer the hot path

- Animate only `transform` and `opacity`; never animate `top`, `left`, `width`, or `height`.
- Use passive listeners and strict effect cleanup. Cache geometry outside the hot path and refresh it with `ResizeObserver` when layout changes.
- Update a CSS custom property inside one scheduled `requestAnimationFrame` for continuous progress rather than setting React state on every scroll event.
- Use `IntersectionObserver` for active sections and entrance motion instead of repeated `getBoundingClientRect()` calls.
- Isolate interactive motion in a small client component. Keep static lesson content server-renderable.
- Apply paper grain or similar texture only as a fixed, pointer-free decorative layer; never attach expensive filters to a scrolling container.

## Honor reduced motion and input modes

- Under `prefers-reduced-motion: reduce`, remove entrance transforms, stagger delays, smooth scrolling, parallax, and animated progress interpolation. Render every item immediately.
- Use `matchMedia('(prefers-reduced-motion: reduce)')` when JavaScript behavior must change, and clean up its listener.
- Keep sticky positioning only if it remains useful and non-disorienting; otherwise return the journey to normal flow.
- Preserve natural tab order, visible focus, 44px touch targets, and a skip link around long navigation.
- Never move keyboard focus because an item merely entered the viewport.
- Do not make hover the only way to discover or operate a lesson.

## Fit the learning product

- Keep all lessons, sections, tests, and conversations directly operable. Recommended order is guidance, not a gate.
- Separate scroll position from the product's stored completion and evidence lanes.
- Do not write progress when a card is revealed, intersected, selected, or scrolled past.
- Prefer tactile, asymmetric composition around the journey, but simplify exercise and conversation states to one prompt, response area, and action.
- Keep expressive display type decorative. Use a legible interface face for controls, explanations, answers, and pinyin.

## Verify

1. Test desktop and mobile widths, a short-height viewport, zoom, and both window and custom scroll roots where applicable.
2. Navigate the full journey by keyboard and activate every lesson out of order.
3. Test with reduced motion, JavaScript failure, and motion CSS loading late; content must remain available.
4. Confirm active navigation, fragments, back/forward behavior, and sticky boundaries.
5. Profile scrolling: no layout-thrashing hot path, runaway listeners, persistent `will-change`, or React render per pixel.
6. Confirm scrolling writes no completion, correctness, proficiency, or unlock state.
7. Run TypeScript, relevant interaction tests, and the production build.
