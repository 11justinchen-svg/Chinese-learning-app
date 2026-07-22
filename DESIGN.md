# MoZhi Design System

## Creative thesis

MoZhi is a **street-print study book**: a fast, tactile Mandarin tool that
feels assembled from hand-lettered posters, photocopied language notes,
risograph ink, stamped labels, and found paper. Hanzi are the visual subject,
not ornamental symbols added around a conventional app.

The interface should feel like a traveler opened a lively field notebook at a
desk before a trip: focused, imperfect, confident, and immediately useful.
The light theme is primary because the physical scene is paper under daylight.
The ink theme is a true night-print variant, not a neon dashboard.

## What the references contribute

1. **Spring pictorial:** rough ink, visible paper grain, cropped typography,
   asymmetrical panels, pale botanical green, and dense editorial rhythm.
2. **Office cow poster:** one absurd real-life object, loud red handwritten
   headline, marginal annotations, and a deliberately awkward cutout outline.
3. **Cloud poster:** black field, overprinted cyan and magenta, extreme scale,
   vertical Latin type, and form that crosses the page boundary.
4. **Dustpan collage:** primary red and cobalt, found ephemera, cut-paper
   silhouettes, mixed type directions, and cultural material used as content.
5. **Tiger-bag poster:** marker-like drawing, flat market green, tiger yellow,
   imperfect hand lettering, and humor without childish UI chrome.

Do not reproduce any reference literally. Extract their print behavior,
typographic courage, physical texture, and compositional imbalance.

## Brand voice

- **Handmade:** visible human rhythm, dry ink, uneven baselines.
- **Direct:** short labels, real situations, verbs before explanations.
- **Alive:** surprising scale and placement, never sterile courseware.
- **Legible:** expressive display type never compromises answers or pinyin.

## Color system

Use OKLCH tokens. This is a full-palette strategy, but each screen chooses one
dominant poster color plus ink and paper. Do not use every accent everywhere.

| Role | Token | Light target | Use |
| --- | --- | --- | --- |
| Rice paper | `--background` | `0.955 0.018 92` | Main reading field |
| Fresh paper | `--card` | `0.982 0.012 94` | Exercises and dialogue |
| Print ink | `--foreground` | `0.205 0.025 55` | Body, outlines, dark type |
| Poster red | `--primary` | `0.59 0.225 29` | Primary action, current item |
| Market green | `--poster-green` | `0.57 0.145 151` | HSK 1 identity |
| Electric cobalt | `--poster-blue` | `0.50 0.205 265` | HSK 2 identity |
| Tiger yellow | `--poster-yellow` | `0.83 0.165 87` | Attention and mnemonic cues |
| Cloud cyan | `--poster-cyan` | `0.70 0.145 190` | Listening and audio |
| Overprint pink | `--poster-pink` | `0.62 0.22 352` | Conversation variation |

Success uses a deep green with text and an icon. Errors use red with a specific
correction and retry. Never communicate state by color alone.

## Typography

### Display Hanzi

Use **ZCOOL KuaiLe** for oversized lesson titles, level posters, seals, and
single-character art. It has the hand-drawn block rhythm visible in the
references without pretending to be historical calligraphy. Fall back to
`"Kaiti SC"`, `STKaiti`, then the existing Song/Ming stack.

Display Hanzi may be cropped, slightly rotated (maximum 3 degrees), or placed
off-grid. It must never be used below 28px or for multi-line instructional
copy.

### Handwritten Latin annotations

Use **Kalam** for short English annotations, mnemonic notes, and section
scribbles. Never use it for buttons, form controls, pinyin, scores, or body
copy.

### Interface and reading

Use the existing geometric sans for navigation, controls, pinyin, explanations,
and tests. Use the native Song/Ming stack for normal Chinese sentences. Keep
pinyin at least 14px and Chinese dialogue at least 22px.

## Texture and image behavior

- Add one subtle global paper grain layer using a tiny inline SVG noise filter
  or a lightweight repeating texture. Opacity stays below 7%.
- Poster panels may use imperfect clip paths, 1px ink outlines, and offset
  shadows with hard edges. Avoid soft floating-card shadows.
- Use overprint effects only on non-essential decoration. Never blur learning
  text or lower its contrast.
- Found imagery should be one decisive cutout, not a stock-photo grid.
- Architecture can remain as an occasional block-print corner or roofline,
  linking the prior MoZhi direction to the poster system. It must not frame
  every panel.

## Composition

- Build pages as posters with a predictable task column inside them.
- Use oversized cropped Hanzi as section anchors.
- Allow marginal vertical labels and rotated annotations on wide screens;
  return them to normal flow below 768px.
- Prefer alternating full-width strips and unequal columns over identical card
  grids.
- Dense collage belongs on discovery pages. Exercise and conversation states
  simplify to one prompt, one response area, and one obvious action.

## Component language

### Poster panel

Hard 1px ink outline, square or lightly clipped corners, flat paper fill, and
an optional 4px offset ink shadow. No glass, blur, or generic rounded card.

### Stamp button

Rectangular, high-contrast, and direct. Default, hover, focus, active,
disabled, and loading states are required. Primary buttons use poster red;
secondary buttons use paper with an ink outline.

### Scribble label

Kalam or display Hanzi, short enough to read at a glance. It can rotate up to
2 degrees. It is decorative context, never the only accessible label.

### Word specimen

One large Hanzi or word, pinyin immediately below, concise meaning, one honest
component note, one spoken example, and a visible audio replay action.

### Hanzi evidence map

Show form/meaning, sound, and contextual-use evidence as three labeled checks.
The status language is Not tested, Started, Building, and Proficient. Always
pair the status with a numeric evidence percentage and never rely on color.
Word tiles include a separate semantic square control for adding that form to
a custom test; opening the specimen and selecting it for a test remain two
distinct actions.

### Real-life Hanzi set

Each set has one oversized Hanzi title, a plain-language situation, a stable
word count, a mixed test, and a direct link to the matching speaking scenario.
Shopping, small talk, food and drink, getting around, and hotel check-in use
the existing poster palette without becoming five identical rounded cards.

### Answer state

Keep the learner's answer visible. Confirm intended meaning first, then show
at most one high-value correction. Provide Retry and Continue as separate
semantic buttons.

## Learning-screen rules

- The learner should speak, choose, type, or order within 45 seconds.
- Every lesson shows duration, real-life goal, and a visible **Skip section**
  control. Skipping never writes mastery evidence.
- Pinyin and English begin visible or one tap away, then can be hidden by the
  learner. Do not remove scaffolds abruptly.
- A Fast test is available from every lesson header and every Hanzi set.
- HSK 1 uses market green; HSK 2 uses cobalt. Both remain fully accessible.
- No streaks, guilt, lock icons, or copy that implies a required linear path.

## Conversation-screen rules

- Put the role, goal, and current turn above the transcript.
- Accept multiple natural replies that achieve the same intent.
- Show a variation after acceptance so the learner sees another useful form.
- When wording is understandable but imperfect, continue the conversation and
  attach one small correction. Reserve blocking retries for replies that do
  not accomplish the communicative goal.
- Voice always has a text fallback. Permission prompts are never automatic.
- Accept Hanzi or pinyin in the reply field. In guided mode, keep the model
  Hanzi, tone-marked pinyin, meaning, and audio replay together.
- A phrase warm-up may reveal all target lines for listening and echoing before
  the call. It is optional and never awards proficiency by itself.
- Label AI wording feedback separately from authored feedback. If AI becomes
  unavailable, switch labels immediately and continue with authored content.

## Motion

- State transitions: 160 to 220ms, ease-out-quart.
- Use motion for reveal, answer feedback, and progress only.
- No orchestrated page-load sequence, bouncing, parallax, or continuous float.
- Respect `prefers-reduced-motion` for every non-essential transition.

## Accessibility

- WCAG AA for text and controls, including on poster colors.
- Keyboard access, visible focus, semantic landmarks, and 44px touch targets.
- Expressive handwritten fonts always have a readable accessible name.
- Decorative type, grain, cutouts, and background Hanzi are `aria-hidden`.
- Pinyin, English, and typed speech fallback remain available on every level.

## Anti-patterns

- Generic edtech card grids and trophy dashboards.
- Fake brush-stroke calligraphy used as shorthand for Chinese culture.
- Red-and-gold “Chinese” theming without a functional visual role.
- Tiny handwritten copy, handwritten buttons, or decorative pinyin.
- Soft cream SaaS minimalism, glass panels, gradient text, and pill overload.
- Decorative culture imagery that does not support the lesson or brand voice.

## Implementation checklist

1. Use the semantic tokens instead of one-off hex values.
2. Keep handwritten type to display Hanzi and annotations.
3. Test light and ink themes at 390px, 768px, and 1280px.
4. Verify focus, disabled, error, success, and reduced-motion states.
5. Confirm a learner can skip any section and open any HSK 1 or HSK 2 lesson.
6. Run content validation, progression tests, TypeScript, and production build.
