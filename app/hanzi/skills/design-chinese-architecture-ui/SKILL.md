---
name: design-chinese-architecture-ui
description: Translate references to Chinese architecture into original, accessible web-interface systems using structural motifs such as eaves, gates, lattice, timber joints, courtyards, ink, and paper. Use for frontend design or implementation involving Chinese architectural inspiration, roof or corner ornament, architectural framing, culturally grounded visual direction, or scroll-led architectural composition without literal copying or stereotyped red-and-gold theming.
---

# Design Chinese Architecture UI

Turn architectural observation into interface structure, not costume. Keep the product task legible and treat motifs as a small visual grammar.

## Start from evidence

1. Read the repository design system and inspect the current interface before proposing styles.
2. Inspect every supplied reference. Separate visible facts from interpretation; do not invent a building period, region, symbolism, or construction claim.
3. Record the reference's silhouette, rhythm, material, depth, color, and negative space. Ignore incidental scenery unless it supports the product.
4. Read [motif-library.md](references/motif-library.md) when selecting or implementing motifs.

For MoZhi, follow `DESIGN.md`: use architecture as an occasional block-print corner or roofline within the street-print study-book language. Keep Hanzi—not architecture—as the visual subject.

## Build an original visual grammar

Select at most one item from each group per screen:

- **Structure:** layered eave silhouette, gate opening, courtyard sequence, or stepped bracket rhythm.
- **Surface:** rice paper, dry ink, dark timber, weathered stone, or quiet water reflection.
- **Detail:** one restrained lattice, ridge, joint, lantern, or seal-like accent.

Transform rather than trace. Redraw motifs as simplified geometric SVG or CSS primitives, change proportions, and connect them to interface hierarchy. Never lift a facade, ornament arrangement, photograph, or identifiable illustration.

Reject shorthand that is not present in the source: dragons, pseudo-calligraphy, random seals, red-and-gold everywhere, temple clichés, or invented symbolism. Use accurate terms such as eave, lattice, gate, or timber bracket; do not assign a dynasty or regional style without evidence.

## Compose the interface

1. Write the page's task hierarchy in plain form first.
2. Place the primary task in a stable reading column.
3. Let one architectural gesture organize the page:
   - an eave defines a section edge;
   - a gate frames an entry or transition;
   - a lattice separates related choices;
   - a courtyard creates a sequence of increasingly focused spaces;
   - a reflection mirrors nonessential progress or context.
4. Add asymmetry through cropping, offset alignment, or unequal columns—not arbitrary rotation.
5. Keep decorative corners outside hit targets and learning text. Collapse them to a simple edge or remove them below 768px.
6. Reuse a motif component or SVG symbol instead of drawing unrelated ornaments in every component.

Use a motif budget: one dominant architectural gesture per viewport, one secondary pattern, and one accent color. More is usually themed clutter.

## Use type and color responsibly

- Keep controls, answers, pinyin, and explanations in a highly legible interface face.
- Reserve expressive Hanzi for large display moments; never imitate historical calligraphy with a generic brush font.
- Prefer paper, charcoal ink, weathered timber, mineral green, mist blue, or stone neutrals.
- Use red only as a functional print accent when the product palette supports it. Do not pair red and gold merely to signal “Chinese.”
- Maintain WCAG AA contrast over every texture and illustration.

## Add motion with purpose

Use motion to reveal spatial hierarchy, not to simulate a theme park.

- Reveal an eave or gate with clipped `transform` and `opacity` transitions when its section enters view.
- Draw a short SVG roofline or path once to mark progress through a section.
- Use a restrained sticky threshold only when the content itself benefits from staged disclosure.
- Animate only `transform` and `opacity`; never animate layout properties.
- Avoid scroll hijacking, continuous parallax, perpetual floating ornament, bouncing, and orchestrated page-load sequences.
- Respect `prefers-reduced-motion`; render the complete static composition when reduction is requested.
- Use the project's existing motion dependency. Verify `package.json` before importing anything new.

For MoZhi, prefer 160–220ms ease-out state transitions and a single optional section-entry reveal. The learning flow must remain immediately operable.

## Implement accessibly

- Mark decorative architecture `aria-hidden="true"`, `focusable="false"`, and `pointer-events: none`.
- Give meaningful architectural diagrams or reference images concise alt text; never put instruction text only inside an image.
- Preserve semantic landmarks, DOM reading order, visible focus, keyboard operation, and 44px touch targets.
- Keep decoration out of live regions, answer feedback, and form labels.
- Ensure clipped corners never clip focus rings, text, or error messages.
- Use one fixed, pointer-free grain layer below 7% opacity; do not filter scrolling containers.

## Verify before handing off

- Compare the result with the reference for principle, not likeness.
- Confirm the cultural rationale can be stated without a stereotype or unsupported claim.
- Test at 390px, 768px, and 1280px in light and dark themes where supported.
- Test keyboard focus, reduced motion, zoom, long pinyin/English, success, error, loading, and disabled states.
- Confirm no decoration obstructs the product's fastest path.
- Run TypeScript, relevant tests, and the production build.
