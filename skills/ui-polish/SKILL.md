---
name: ui-polish
description: Critiques and refines a built interface until it feels finished. Use when the user says polish this, it looks off, make it feel professional, review the UI or tidy the design, or after building any screen. Checks states, spacing, type, contrast, motion and responsive behaviour. Skip for non-visual code.
---

# UI Polish

A screen is finished when the unhappy paths look as intentional as the happy one. Review in the order below; fix as you go, then report what changed.

## 1. See it first

Open the real screen (use `browser-verify` if a dev server exists) at phone, tablet and desktop widths. Judging from the code alone misses most of what this skill targets.

## 2. States

For each data-driven part check: empty, loading, error with a next step, partial data, very long text, very large numbers, a single item, hundreds of items. Check hover, focus, active, disabled and selected for every control. A missing state is the most common gap.

## 3. Space and alignment

- Spacing comes from the scale, not eyeballing. Related things sit closer than unrelated things.
- Edges line up: left edges of text and inputs, baselines in rows, icon and label centres.
- Nothing touches the viewport edge on small screens; tap targets are at least 44 px.

## 4. Type and colour

- One clear heading level per region; body text 16 px or larger; line length around 45 to 80 characters.
- Text contrast at least 4.5:1 (3:1 for large text and icon-only controls). Colour is never the only signal.
- Few weights and sizes. If three look almost the same, make them the same.

## 5. Motion and feedback

Every action gets feedback within 100 ms (pressed state, spinner, toast). Transitions are 120 to 250 ms with easing, only on properties that are cheap to animate (opacity, transform). Honour `prefers-reduced-motion`.

## 6. Score it

Score states, space, type and colour, motion and responsive behaviour from 0 to 10. For each, say what a 10 looks like for this screen, then close the gap. Zero means nobody thought about it.

## 7. Fix, then report

Fix in priority order: broken or missing states, then alignment and spacing, then type and colour, then motion. Keep the diff to styling and markup; don't change behaviour. End with a short list: what you fixed, what you left, and anything that needs a decision from the user (brand colour, copy).

## Related skills

- `accessibility-review`: a formal accessibility audit
- `ux-research`: whether the design works for users
