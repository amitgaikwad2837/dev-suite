# Changelog

## 0.37.0
- Added `scripts/routing/prompts_mobileci.json` (9 prompts); routing with the new skill present scored 9 of 9.
- Added `mobile-ci`: pipeline shape and runner cost, signing keys kept out of the repo, scoped store credentials, automatic build numbers, tests that can be trusted and promotion in steps instead of publishing on every push.

## 0.36.0
- Added `scripts/routing/prompts_concise.json` (9 prompts); routing scored 9 of 9, including that a request to explain in detail does not trigger it.
- Added `concise-answers` and `templates/CLAUDE-concise.md`: answer first, no preamble or recap, read only what is needed, batch tool calls, and never cut a safety warning or a failed check. In the one eval case the reply was 104 words against 257 without the skill.

## 0.35.0
- Added `scripts/routing/prompts_hardening.json` (11 prompts); routing with the new skill present scored 11 of 11.
- Added `security-hardening`: inventory what is exposed, fix the riskiest first (leaked secrets, missing MFA, open databases, public storage, over-powerful pipelines, no audit log), and change production one step at a time without locking yourself out. `security-review` keeps application code.

## 0.34.0
- Added `scripts/routing/prompts_docs.json` (11 prompts); routing with the new skill present scored 11 of 11. Three older README prompts now also accept `documentation`, and `plain-writing` gained a skip pointer to it.
- Added `documentation`: audit docs by following them, organise by reader need (tutorial, how-to, reference, explanation), generate and test what can be generated, tie upkeep to pull requests, decision records and runbooks. `plain-writing` keeps the wording of single documents.

## 0.33.0
- Added `scripts/routing/prompts_lib.json` (10 prompts); routing with the new skill present scored 10 of 10. One easy-set prompt about versioning and publishing a library now accepts either `release-engineering` or `library-cli-work`.
- Added `library-cli-work` for reusable libraries and command-line tools: a small public surface, semantic versioning and deprecation, CLI conventions, dependencies, testing the built package and publishing carefully.

## 0.32.0
- Added `scripts/routing/prompts_privacy.json` (12 prompts); routing with the new skill present scored 12 of 12.
- Added `privacy-compliance`: map the data, find which rules probably apply, collect less, build deletion and export that reach every copy and vendor, retention, breach plan and a policy that matches the product. It is not legal advice and never certifies compliance.

## 0.31.0
- Added `scripts/routing/prompts_llm.json` (10 prompts); routing with the new skill present scored 10 of 10 on it and 46 of 46 on the hard set.
- Added `llm-app-work` for apps that call a language model: build the eval set first, treat all input as untrusted, limit what tools may do, validate structured output, pin the model version, watch cost and launch in steps. Provider-neutral.

## 0.30.0
- Shortened 19 skill descriptions (the descriptions loaded in every session went from about 23,600 to 18,300 characters, roughly 22% fewer, about 5,900 to 4,600 tokens). Kept the trigger situations and the skip pointers between neighbouring skills. Added a skip pointer to `design-reference`.
- Added a pair set (`scripts/routing/prompts_pair.json`) of 10 prompts for the `frontend-design` and `design-reference` confusion; the added skip clause got 10 of 10.
- Added a routing test (`scripts/routing/`): 179 prompts, run by fresh subagents that see only the description list. Before the change 132 of 133 and 45 of 46 chose an accepted skill; after, 133 of 133 and 45 of 46.

## 0.29.0
- Added `cloud-cost`: read the bill breakdown first, safe savings, commitments only after right-sizing, never trading backups or logging for a number, and budgets, tags and anomaly alerts. Tool-neutral.

## 0.28.0
- Added `data-engineering`: repeat-safe loads, incremental extracts that catch updates and deletes, data tests, backfills away from the live table and personal data in the warehouse. Tool-neutral.

## 0.27.0
- Added `infrastructure-as-code`: read the plan like a diff, treat destroy and replace of stateful resources as a stop sign, remote state out of git, secrets, separate environments and apply from CI. Tool-neutral; examples use Terraform words.

## 0.26.0
- Added `mobile-app-work`, covering store review and release planning, permissions and privacy, offline behaviour, keeping old app versions working and real-device testing. It is general guidance; it has no Swift, Kotlin, React Native or Flutter specifics.

## 0.25.0
- Added `codebase-onboarding`, which reads CI and build files first, checks commands before recording them, traces one journey and writes a short CLAUDE.md with verified and unverified marked. The idea came from reading everything-claude-code; the method and wording are new.

## 0.24.0
- Added `templates/CLAUDE.md`, a short always-on version of `coding-discipline` (think first, keep it simple, change only what was asked, prove it), based on Karpathy's public notes via the MIT-licensed forrestchang/andrej-karpathy-skills. `coding-discipline` now says it covers bug fixes, `bug-investigation` ends with a surgical-fix step, and a stale line in `dev-lifecycle` was corrected.

## 0.23.0
- Added `launch-gate`, a go/no-go check for a first public release. The idea came from reading founder-skills repos; the checks and wording are new.

## 0.22.0
- `frontend-design` now has a landing-page reference (`references/landing-page.md`): intake, page structure, conversion copy, no invented facts, motion and a ship list. Adapted from the MIT-licensed elayadesign/ai-design-skills; wording is new and its fixed font and icon bans were left out.

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
