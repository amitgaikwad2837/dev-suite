---
name: accessibility-review
description: Audits a product against WCAG and tests it the way disabled people use it, then reports findings by who is blocked and how to fix each. Use when the user says "accessibility audit", "WCAG", "VPAT", "ADA or Section 508 or EAA compliance", "will a screen reader work with this", "can you use it without a mouse", "colour blind", "accessibility statement", "we got an accessibility complaint" or "review the UX for accessibility". Sets scope and target level, runs automated checks, then tests keyboard, screen reader, zoom and motion by hand, because tools find only part of the problems. Skip for quick fixes while building a page (web-quality) and for visual polish (ui-polish).
---

# Accessibility Review

Automated tools catch roughly a third of accessibility problems. The rest need a person using the keyboard, a screen reader, zoom and the product's real journeys. The review is judged by who is blocked from doing what, not by a count of rule failures.

## 1. Set the scope

Get these in a few lines, asking only what you can't find:
- What is reviewed: which journeys and screens (sign-up, checkout, the dashboard), platform (web, iOS, Android, PDF, email) and which browsers and screen readers are in use.
- The target: WCAG 2.2 level AA unless a contract or law says otherwise. Note any legal driver (ADA, Section 508, EN 301 549 or the European Accessibility Act) and who asked, since that decides the report format, such as a VPAT or accessibility conformance report.
- Whether this is a first audit, a re-check of earlier findings, or a response to a complaint.

Review the journeys users must complete, not every page. Sample the page types: a template is reviewed once, then spot-checked.

## 2. Run the automated pass

Use axe-core (or `@axe-core/playwright`), Lighthouse, or the linters the project has, plus the HTML validator. Record results per page and treat a clean run as proof of nothing: tools can't judge whether alt text is meaningful, whether focus order makes sense, or whether an error message helps. Don't report tool output as the audit.

## 3. Test by hand

For each journey, check what a user actually meets:
- **Keyboard only.** Everything reachable and usable with Tab, Shift+Tab, Enter, Space, arrows and Escape. The focus ring is always visible and never trapped. The order follows the reading order. Skip links, modals returning focus, menus and custom widgets behave like their native equivalents.
- **Screen reader.** Use NVDA or JAWS on Windows, VoiceOver on Mac and iOS, TalkBack on Android. Check page titles, headings and landmarks, link and button names that make sense out of context, form labels, error messages announced when they appear, live regions for status changes, and names, roles and states of custom controls. Prefer native elements; ARIA is for what HTML can't express, and bad ARIA is worse than none.
- **Vision.** Text contrast 4.5:1 (3:1 for large text and for UI components and focus indicators). Zoom to 200 percent and 400 percent (320 px wide) with no lost content or sideways scrolling. Text spacing and larger system fonts don't break layout. Colour is never the only signal, which colour-blind simulation shows.
- **Motion, time and input.** Respect reduced motion, no flashing above three times a second, pause control for moving content, no timeouts without warning and a way to extend. Touch targets at least 24 px (44 is better), no gestures without an alternative, and no drag-only actions.
- **Content.** Meaningful alt text (empty for decoration), captions and transcripts for media, plain language, clear error and help text, and the page language declared.

## 4. Report by impact

For each finding give: the page and element, what happens for whom (for example "a screen reader user hears 'button' and can't tell it deletes the account"), the WCAG success criterion, severity, a concrete fix with code where useful, and how to retest. Rank by:
- **Blocker:** a user can't complete a core journey.
- **Serious:** completes it with great difficulty or a workaround.
- **Moderate or minor:** friction, or a problem with a clear workaround.

Group repeated issues from one template into a single finding with the pages affected. Name what works well, since teams copy it. List what was not tested, and why, so a clean report isn't read as a full guarantee. Don't claim "WCAG compliant": say which criteria were checked at which level on which pages.

## 5. Fix and keep it fixed

Fix blockers first, then serious ones, in small commits (`coding-discipline`), and retest each with the same method that found it. Add checks that prevent regression: axe in CI or in the Playwright suite (`playwright-ui-tests`), lint rules, and design tokens that guarantee contrast. Add an accessibility line to the definition of done and to design review. If a legal document is needed (VPAT or accessibility statement), draft it from the findings, with the contact route for feedback, and leave the legal sign-off to the owner.

Report: scope and standard, method and tools with versions, findings ranked with fixes, what passed, what was not tested, fixes made, guards added and the next review date.
