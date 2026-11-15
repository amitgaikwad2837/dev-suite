---
name: dev-lifecycle
description: The entry point for building or changing software end to end. Use when the user asks to build, ship, fix, upgrade, migrate or rebuild something and it is unclear where to start, or says things like "take this from idea to production", "what's the process", "do this properly", "build me X", or "where should we begin". Routes the work through discover, design, build, verify, review, ship and learn, and says which skill handles each phase. Skip for small edits and questions.
---

# Dev Lifecycle

A map for the whole job. It decides the order of work and hands each phase to the skill that does it well, so nothing important is skipped and nothing is explained twice.

## The phases

| # | Phase | Do this | Skill |
|---|---|---|---|
| 1 | **Discover** | Get requirements, constraints and success criteria answered by the user; for anything holding data or exposed to the internet, ask the security questions too | `requirements-interview`, `ux-research`, `security-prompter` |
| 2 | **Design** | One-page spec; choose between options that are hard to reverse | `new-app-build` (spec, plan), `design-decision`, `api-design`, `estimation` |
| 3 | **Build** | Walking skeleton with CI first, then tested vertical slices | `new-app-build`, `coding-discipline`, `data-ml-work`, `payments-integration` |
| 4 | **Change existing code** | Bug, refactor, migration, version upgrade, or rebuild of a legacy app | `bug-investigation`, `migrate-and-upgrade`, `schema-changes`, `performance-work`, `api-design` (changing a live API), `app-replica` |
| 3b | **Build a UI** | Design brief and tokens first, then states and polish, then check in a real browser | `frontend-design`, `design-reference`, `ui-polish`, `browser-verify`, `playwright-ui-tests` |
| 5 | **Verify** | Decide what to test and write tests that catch real bugs; fix failures for real, stop and ask when stuck | `test-strategy`, `honest-fixes`, `browser-verify`, `web-quality`, `accessibility-review` |
| 6 | **Review** | Review a change before merge; security pass on what was built or changed | `change-review`, `security-review`, `dependency-audit` |
| 7 | **Ship** | Pipeline, versioning, staged rollout with abort criteria, rollback, release notes; careful handling of production emergencies | `launch-gate` (first public release), `release-engineering`, `git-hygiene`, `observability`, `plain-writing`, `risky-shortcuts`, `incident-response` |
| 8 | **Learn** | Capture repeated work as a skill | `skill-capture` |

`coding-discipline` (assumptions, smallest change, clean diff, evidence, a "Done when" on every step) wraps all of it.

**Team mode.** For work with a hard-to-reverse choice or real risk, hand the whole job to `dev-orchestrator`: a manager with specialist subagents that propose, critique, decide and implement. It is tiered to keep tokens low (solo by default, a pair for normal risk, a council only when a decision is expensive to undo).

## How to use the map

1. Place the request. Name the phase it starts in. "Build me an expense app" starts at Discover; "CI is red" starts at Change existing code or Verify; "upgrade to Django 5" starts at Change existing code (`migrate-and-upgrade`). Say the phase in one line.
2. Don't skip an earlier phase that matters. If requirements are vague, do Discover before Design. If tests are thin, build the safety net before changing behavior. If the user already has a spec, say so and start at Build.
3. Hand off, don't duplicate. Follow the named skill for the details instead of restating them here.
4. Gate between phases. After Discover and Design, show the result and get a yes before the next phase. After Build and Change, run the checks before calling it done. Keep the gates light for small tasks.
5. Close the loop. At the end report done / unverified / left to do, and if a procedure repeated during the work, offer `skill-capture`.

## When the task falls outside the suite

If a task fits no skill above (see `ROADMAP.md` for known gaps), say so, then apply `coding-discipline` (plan with "Done when", small verified steps) and ask the user about anything that is their call.
