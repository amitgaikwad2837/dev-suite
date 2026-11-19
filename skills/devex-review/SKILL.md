---
name: devex-review
description: Reviews and scores the developer experience of an API, SDK, CLI or docs by following the first-run path. Use for review our developer experience, time to first success, is onboarding good, getting started is slow, are error messages helpful, or before launching a developer-facing product. Skip for end-user interfaces (ui-polish, web-quality) and writing docs (documentation).
---

# Developer Experience Review

Developers decide in the first five minutes whether a tool is worth their time, and an agent or a CI job meets your error messages before a person does. This review measures that experience by doing it, not by reading about it. There are two modes: a **plan review** before anything is built (walk the intended journey on paper) and a **live audit** of something that exists (run it).

## 1. Say who the developer is

Name the person (a backend engineer adopting your SDK, an operator running your CLI, an agent calling your API), what they want to get done first, and the environment they start from. Everything below is judged from their seat.

## 2. Principles the review checks against

1. Zero friction at the start: one way to begin, no sales call, hello world without reading the docs.
2. Incremental steps: value from one part before understanding the whole.
3. Learn by doing: copy-paste examples that work in a realistic context.
4. Decide for me, let me override: good defaults and an escape hatch for each.
5. Fight uncertainty: the developer always knows what to do next, whether it worked and how to fix it when it did not.
6. Real examples: authentication, errors and deployment, not only hello world.
7. Speed: response, build and iteration time are part of the experience.
8. A moment that feels like magic, early.
9. Agents are users too: non-interactive by default, structured output, layered `--help`, errors that tell the next step.

## 3. Walk the first-run path for real

Start from nothing: a clean directory or container, no private knowledge, only the public docs. Follow them step by step and record, for each step, what the developer does, how long it takes and how much friction it has (low, medium or high), with the evidence (the command and its output, or a screenshot). Never report a step as working unless you ran it. Do not use real credentials or install global tools without asking. Total the steps and minutes.

Rules of thumb for time to a working hello world: under two minutes is excellent, two to five is competitive, five to ten needs work, and over ten loses most people.

## 4. Audit the rest of the journey

- **Ergonomics:** run `--help`, check names and flags for consistency, defaults and escape hatches, machine-readable output, and whether it works without prompts.
- **Errors:** trigger real errors. Each should say what happened, how to fix it, how to recover, carry a stable code and give context, and be useful to someone (or something) who cannot read the source. Stack traces are not error messages.
- **Docs:** do the examples run as written? Is there one complete, realistic example?
- **Upgrades:** changelog, deprecation warnings, migration help. Will an upgrade break production?
- **Environment:** supported platforms and versions, install friction, offline use.
- **Help and community:** where does a stuck developer go?

In a plan review, walk the same list against the design and mark what is unspecified.

## 5. Score and close the gap

Score each area from 0 to 10: 9 to 10 best in class, 7 to 8 good with small gaps, 5 to 6 works with friction, 3 to 4 poor, 1 to 2 developers give up, 0 not considered. For each, say what a 10 looks like for this product, then list the fixes that close the gap, ranked by impact over effort. Give the top three first.

## 6. Report

A scorecard table (area, score, evidence, what a 10 looks like, fix), the time to hello world with its steps, the top three fixes, and what you could not verify. If an earlier plan review exists, compare it with what you found, and say where the plan was wrong.
