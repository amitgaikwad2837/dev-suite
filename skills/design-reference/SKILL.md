---
name: design-reference
description: Turns a visual reference into a written design guide to build from. Use for make it look like this site, match our brand, a screenshot or mockup to follow, creating a design system, writing a DESIGN.md or extracting styles. Copies no logos, images, text or code. Skip when there is no reference and the user wants colours, type or layout chosen (frontend-design).
---

# Design Reference

A reference becomes useful once it is written as rules. Without that, every screen drifts back to defaults. The output is one short file, `DESIGN.md`, kept at the project root and read before any UI work.

## 1. Collect the source

Take what the user gives: a URL, screenshots, a Figma export, brand colours, an existing app. For a live page, open it (`browser-verify` explains how) and read computed styles for the main elements instead of guessing from a screenshot. Note anything you could not observe.

## 2. Record what you see as tokens and rules

- Colour: background, surface, text, muted text, border, accent, and status colours, as values, with where each is used.
- Type: faces, the size scale, weights, line heights, which element uses which.
- Space and shape: base unit, common paddings, content width, radii, border and shadow styles.
- Components: for button, input, card, nav and table, write the look in a line each and the states that differ.
- Voice: tone of the copy, capitalisation, length of labels.
- Do and don't: three of each, specific ("one filled button per view", "never grey text on tinted backgrounds").

Keep it under about 120 lines. A list a person can scan beats a long essay.

## 3. Stay original

Reproduce a style, not a product. Don't copy logos, trademarks, photography, illustrations, distinctive copy or source code. If the user wants a close match of someone else's site, suggest a variation with the same qualities and different details, and say so.

## 4. Use it

Turn the file into tokens (CSS variables or the theme) and have `frontend-design` and `ui-polish` build and check against it. When a screen needs something the file doesn't cover, decide, then add the rule so the next screen agrees.

## 5. Confirm

Show the user the file and the main swatches and type sample rendered in the browser. Ask only about gaps (brand accent, dark mode, fonts that need a licence).
