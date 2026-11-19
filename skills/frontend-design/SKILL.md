---
name: frontend-design
description: Makes a user interface look deliberately designed instead of generic. Use before building or restyling any page, component or screen, for landing pages and dashboards, or when output looks like a default template. Starts from a design brief, then builds from tokens. Skip for backend work and tiny copy or colour tweaks.
---

# Frontend Design

Default UI output looks the same everywhere: a centered hero, three feature cards, a purple gradient, system fonts. This skill replaces defaults with decisions made on purpose, written down before any markup.

## 1. Write a design brief first (6 lines)

- Who uses it and what are they doing when they see this screen?
- Tone, in two words that exclude something ("calm, not clinical").
- The one thing a visitor should remember. Everything else supports it.
- Type: one display face and one text face, with a size scale (for example 12, 14, 16, 20, 28, 40).
- Colour: one base neutral, one accent, and a status set (success, warning, error). Pick values, don't say "modern blue".
- Spacing: a base unit (4 or 8 px) and a layout grid; a max content width.

If the user gave a reference, brand or existing app, take the brief from it (see `design-reference`). If the project already has tokens or a component library, use those and skip this step.

**Landing, marketing or launch page?** Read `references/landing-page.md` before the brief. It adds the part a visual brief misses: one offer, one audience, one primary action, then page structure, conversion copy, no invented facts and a ship list. Fill its intake first, then do the six lines above.

## 2. Build from tokens, not literals

Put colours, sizes, radii, shadows and durations in variables (CSS custom properties or the framework's theme) before writing components. A raw hex code or pixel value inside a component is a bug. Support light and dark from the start if the product will ever need both; retrofitting is expensive.

## 3. Choose structure on purpose

- Decide hierarchy by size, weight and space before colour. A screen that works in greyscale is usually sound.
- Vary the rhythm: not every section should be a centered block of equal cards. Use asymmetry, a dominant element, or a dense area next to an empty one when it serves the one memorable thing.
- Write real copy. Placeholder text hides layout problems and makes every page feel the same.
- Reuse the existing component set. Add a new component only when nothing fits.

## 4. Check against the usual defaults

Before reporting done, scan for these and change any you did not choose deliberately: default font stack, purple-to-blue gradient, equal three-card row, emoji used as icons, shadows on everything, centered everything, rounded corners of mixed sizes, lorem ipsum, generic stock phrases ("seamless", "unlock", "supercharge").

## 5. Hand over

Report the brief in six lines, where the tokens live, and which parts you left as defaults on purpose. Then run `ui-polish` for states and detail, and `browser-verify` to see it rendered.

## Related skills

- `ux-research`: what users need before the design
- `accessibility-review`: a formal audit of the result
