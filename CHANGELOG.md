# Changelog

## 0.4.0
- Added `dev-orchestrator` and eight plugin subagents (`dev-manager` and seven specialists) so a manager can run a team that proposes, critiques, decides and implements.
- Token-lean by design: solo, pair and council tiers, file-path briefs, short summaries, cheaper models for light roles, turn caps.

## 0.3.0
- Added `change-review`, `test-strategy` and `release-engineering`, each with its own method and an eval case.
- Router and roadmap updated to point at them.

## 0.2.0
- `grill-me` is now `requirements-interview`, with its own method: an unknowns ledger, short numbered rounds with proposed answers, and a closing brief.
- Rewrote the coding checks, the design-choice mode and the writing mode in the suite's own structure and wording.
- Plugin renamed to `dev-suite` (install id `dev-suite@amitgaikwad2837-skills`).
- Added `dev-lifecycle`, a router that places a request in a phase and hands it to the right skill or mode.
- Added `ROADMAP.md` with the gaps found when reviewing every skill.
- Added `scripts/validate.py` and a GitHub Actions workflow that runs it.

## 0.1.0
- `deep-engineering` with eleven modes, an interview skill and `skill-capture`.
- Evals for each skill, packaged `.skill` files in `dist/`, plugin marketplace files.
