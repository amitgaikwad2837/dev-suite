# Roadmap: gaps in the suite

What the suite covers today: requirements interviews (`grill-me`), the build/fix/upgrade/migrate/rebuild/review/write workflow (`deep-engineering`, 11 modes), repeated-work capture (`skill-capture`), and a router (`dev-lifecycle`).

This list is the result of reading every skill and comparing it with what a full development lifecycle needs. Items are ordered by how often they come up and how much a dedicated skill would help.

## Missing capabilities

| Priority | Gap | Why it matters | Today's coverage |
|---|---|---|---|
| High | **Code review of someone else's change** (PR review: correctness, tests, naming, risk, review comments) | Reviews are daily work; the security mode only covers vulnerabilities | None; Mode 2 touches security only |
| High | **Test strategy and test writing** (what to test, unit vs integration, fixtures, coverage gaps, flaky-test hygiene) | Nearly every mode depends on good tests | Regression tests and characterization tests are mentioned, not taught |
| High | **CI/CD and release engineering** (pipelines, environments, rollout, rollback, versioning, changelogs) | "Ship" is only a line in Modes 4 and 8 | Rollout notes only |
| Medium | **Database and schema changes** (expand/contract migrations, backfills, locks, zero-downtime) | Common cause of outages | Mode 5 covers a stuck lock; no planning guidance |
| Medium | **Incident response and postmortems** (triage, mitigation, comms, blameless review) | Production fires need a calm checklist | Mode 5 covers risky shortcuts only |
| Medium | **Performance work** (measure, profile, fix the bottleneck, prove the gain) | Easy to optimize the wrong thing | None |
| Medium | **API design and versioning** (contracts, errors, pagination, breaking changes) | Hard to change once clients depend on it | Arena mode helps the decision, no API guidance |
| Medium | **Observability** (logs, metrics, traces, alerts, SLOs) | Hardening mentions logging only | Single line in Mode 7 |
| Low | **Dependency, license and supply-chain audit** | Security mode lists dependencies as a check | One line |
| Low | **Git hygiene** (commit and PR conventions, branching, history rewrites safely) | Mostly handled by project rules | Partial (Mode 5 on force push) |
| Low | **Accessibility and UX review**, **estimation**, **data/ML projects** | Domain-specific | None |

## Quality gaps in what exists

1. **One large skill.** `deep-engineering` has 11 modes in 141 lines and a 928-character description, close to the 1,024 limit. Focused skills trigger more reliably. Plan: split it into one skill per phase (debug, security-review, migrate-and-upgrade, build-new-app, replica, honest-fixes, writing), keeping the same text, then keep `dev-lifecycle` as the router.
2. **Evidence is thin.** Each test case was run once and graded by the author. Needed: repeated runs, an independent grader, multi-turn cases (a full grill-me interview, a skill actually written and tested), and harder prompts. Several cases did not separate the skill from no skill (replica, humanizer, easy no-gaming).
3. **Descriptions are untuned.** No trigger-accuracy test was run. Plan: build a 20-query should/should-not-trigger set per skill and run the description optimizer.
4. **Plugin install not validated.** The `claude` CLI was not available when the marketplace files were written. Run `claude plugin validate .` and a test install.
5. **No guard against editing tests.** Mode 9 asks Claude not to game tests; a hook that blocks test-file edits would enforce it. Not built.
6. **Writing mode is untested on long documents** written from scratch (design docs, runbooks).
7. **Maintenance.** License holder is a placeholder, no release tags, `dist/*.skill` files are rebuilt by hand. `scripts/validate.py` and the CI workflow check structure only.

## Suggested next steps

1. Add `code-review`, `testing` and `release-engineering` skills (the three high-priority gaps).
2. Split `deep-engineering`, then rerun the evals on the split skills.
3. Run `claude plugin validate .` and a clean install test; tag `v0.1.0`.
4. Build the trigger-accuracy sets and tune descriptions.
