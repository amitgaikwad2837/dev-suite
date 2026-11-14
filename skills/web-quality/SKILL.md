---
name: web-quality
description: Checks a web page or app for accessibility, performance and responsive problems and fixes them. Use when the user says "is it accessible", "audit the page", "it loads slowly", "check Lighthouse", "works on mobile", "keyboard navigation", "screen reader", or before launching a frontend. Covers semantic HTML, keyboard and focus, labels, contrast, images, bundle size, render blocking, layout shift and mobile layouts, with measured before and after. Skip for backend performance.
---

# Web Quality

Check what real users run into: people using a keyboard or screen reader, slow phones, small screens. Measure first, fix the biggest problem, measure again.

## 1. Accessibility

- Structure: one `h1`, headings in order, landmarks (`header`, `nav`, `main`, `footer`), buttons are `button` and links are `a`.
- Keyboard: tab through the whole flow without a mouse. Order matches the visual order, focus is always visible, dialogs trap and return focus, Escape closes overlays, nothing is reachable only by hover.
- Names: every input has a label, every icon-only control an accessible name, every informative image `alt` text (empty `alt` for decoration).
- Colour and motion: contrast per `ui-polish`; errors are described in text; status changes are announced (`aria-live`) where the page updates without navigation.
- Prefer native elements to ARIA. Add ARIA only for what HTML cannot express.
- Run an automated scan (axe via Playwright or the browser tools) and treat it as a floor: it finds about a third of the issues.

## 2. Performance

Measure with Lighthouse or the browser performance panel on a throttled mobile profile, not on a fast desktop. Look at: largest content paint, layout shift, interaction delay, total JavaScript size.
Common fixes in order of payoff: size and format images and give them width and height; lazy-load below-the-fold media; split or remove large JavaScript; defer scripts that block rendering; self-host and subset fonts with `font-display`; cache static files; avoid layout shift from late content.

## 3. Responsive

Test at 320, 375, 768, 1024 and 1440 px, portrait and landscape. No horizontal scroll, text readable without zoom, controls reachable by thumb, tables and long words handled, touch targets large enough. Check zoom to 200%.

## 4. Report

Table of finding, where, effect on a user, fix, and the measure before and after. Fix the worst few; list the rest in order. Don't claim a score you did not measure.
