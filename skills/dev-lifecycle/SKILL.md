---
name: dev-lifecycle
description: The entry point for building or changing software end to end. Use when the user asks to build, ship, fix, upgrade, migrate or rebuild something and it is unclear where to start, or says things like "take this from idea to production", "what's the process", "do this properly", "build me X", or "where should we begin". Routes the work through discover, design, build, verify, review, ship and learn, and says which skill or mode handles each phase. Skip for small edits and questions.
---

# Dev Lifecycle

A map for the whole job. It decides the order of work and hands each phase to the skill that does it well, so nothing important is skipped and nothing is explained twice.

## The phases

| # | Phase | Do this | Skill or mode |
|---|---|---|---|
| 1 | **Discover** | Get requirements, constraints and success criteria answered by the user | `grill-me` |
| 2 | **Design** | One-page spec; compare options for choices that are hard to reverse | `deep-engineering` Mode 7 (spec, plan), Mode 6 (arena) |
| 3 | **Build** | Walking skeleton with CI first, then tested vertical slices | `deep-engineering` Mode 7, plus Coding discipline |
| 4 | **Change existing code** | Bug, refactor, migration, version upgrade, or rebuild of a legacy app | Modes 1, 4, 8, 10 |
| 5 | **Verify** | Real fixes, no gamed tests; stop and ask when stuck | Mode 9 |
| 6 | **Review** | Security pass on what was built or changed | Mode 2 |
| 7 | **Ship** | Staged rollout, rollback path, release notes and docs that read like a person wrote them | Mode 4 and 8 (rollout), Mode 11 (writing) |
| 8 | **Learn** | Capture repeated work as a skill | `skill-capture` |

Mode 3 (plan every step with a "Done when") wraps all of it.

## How to use the map

1. **Place the request.** Name the phase it starts in. "Build me an expense app" starts at Discover; "CI is red" starts at Change existing code or Verify; "upgrade to Django 5" starts at Change existing code (Mode 8). Say the phase in one line.
2. **Don't skip an earlier phase that matters.** If requirements are vague, do Discover before Design. If tests are thin, build the safety net before changing behavior. If the user already has a spec, say so and start at Build.
3. **Hand off, don't duplicate.** Follow the named skill or mode for the details instead of restating them here.
4. **Gate between phases.** After Discover and Design, show the result and get a yes before the next phase. After Build and Change, run the checks before calling it done. Keep the gates light for small tasks.
5. **Close the loop.** At the end report done / unverified / left to do, and if a procedure repeated during the work, offer `skill-capture`.

## When the task falls outside the suite

The suite does not yet have dedicated skills for code review of other people's changes, performance tuning, incident response, CI/CD pipeline design, database schema changes, API design and versioning, observability, or dependency and license audits (see `ROADMAP.md` in the repo). For those, say so, then apply the Coding discipline and Mode 3 (plan with "Done when", small verified steps) and ask the user about anything that is their call.
