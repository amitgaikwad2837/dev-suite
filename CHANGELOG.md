# Changelog

## 0.21.0
- Added `payments-integration`. The idea came from reading three founder-skills repos (whawkinsiv/solo-founder-skills and others); the wording and method are new.

## 0.20.0
- Added a test-guard hook (`hooks/guard-tests.js`) that asks for confirmation when an edit would skip or weaken a test, delete a test file, skip git hooks or detect a test run. `scripts/test-hooks.js` tests it and CI runs it. `honest-fixes` now mentions it.

## 0.19.0
- Added `data-ml-work`. The roadmap no longer lists any uncovered area, and its stale items were corrected.

## 0.18.0
- Added `ux-research`. Removed UX research from the roadmap's gap list.

## 0.17.0
- Added `estimation`. Removed estimation from the roadmap's gap list.

## 0.16.0
- Added `accessibility-review` for WCAG audits and VPATs. `web-quality` now points to it for formal audits. Removed accessibility from the roadmap's gap list.

## 0.15.0
- Added `git-hygiene`. Removed git hygiene from the roadmap's gap list.

## 0.14.0
- Added `dependency-audit`. Removed dependency and licence audits from the roadmap's gap list.

## 0.13.0
- Added `observability`. Removed observability from the roadmap's gap list.

## 0.12.0
- Added `api-design`. Removed API design from the roadmap's gap list.

## 0.11.0
- Added `performance-work`. Removed performance from the roadmap's gap list.

## 0.10.0
- Added `incident-response`. Removed incident response from the roadmap's gap list.

## 0.9.0
- Added `schema-changes`, written by the agent team (two competing designs, a critique, then build and review). Removed schema changes from the roadmap's gap list.

## 0.8.0
- Added `playwright-ui-tests` for building a lasting UI test suite. `browser-verify` now covers quick checks only and points to it.

## 0.7.0
- Added `security-prompter`, which asks the security questions up front and writes a security brief.

## 0.6.0
- Added five frontend skills: frontend-design, design-reference, ui-polish, browser-verify, web-quality. Each has an eval case. First eval run: 25/25 with the skills, 16/25 without (self-graded, nothing rendered in a browser).

## 0.5.0
- Split the single `deep-engineering` skill into ten smaller ones: coding-discipline, bug-investigation, security-review, migrate-and-upgrade, risky-shortcuts, design-decision, new-app-build, honest-fixes, app-replica, plain-writing. The text moved over as it was; references to mode numbers now name skills.
- Router, agents and evals updated. `deep-engineering` is gone.
- README, roadmap and changelog rewritten in plainer language.

## 0.4.0
- Added `dev-orchestrator` and eight subagents, with tiers to keep token use down.

## 0.3.0
- Added change-review, test-strategy and release-engineering.

## 0.2.0
- Plugin renamed to `dev-suite`. Added the dev-lifecycle router, the roadmap, `scripts/validate.py` and the CI workflow.

## 0.1.0
- First version: deep-engineering, an interview skill and skill-capture, with evals, packaged skills and plugin files.
