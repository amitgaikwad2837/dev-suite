# Roadmap

What's here: requirements interviews, UX research, new apps, design decisions, API design, bug hunting, migrations and upgrades, schema changes, performance work, app rebuilds, data and ML work, security prompting and review, dependency audits, change review, testing, honest fixes, risky-shortcut handling, incident response, releases, observability, git hygiene, frontend design and accessibility, estimation, writing, skill capture, plus a router and an agent team.

## Not covered yet

Nothing is on the list and no area is marked light-touch. Not yet covered in depth: provider-specific details (AWS, Azure and GCP service names and console steps), and desktop or game development.

## Known weak spots

- Evidence is thin. Every case ran once and I graded it myself. It needs repeat runs, an independent grader, multi-turn cases (a whole interview, a skill actually written and tested) and harder prompts. Many cases tie or come close with no skill at all, which means Claude already handles them.
- Routing is tested with 179 prompts in `scripts/routing/` (easy and hard sets, including near-miss and should-not-trigger prompts). It scores about 98 to 100 percent, but it is simulated: fresh subagents pick from the description list, which is not the same as a real session with the skills loaded. The prompts were written by the same author as the descriptions, and every miss so far is a pair of neighbouring skills. The 42 descriptions cost about 4,600 tokens in every session (estimated from characters, not measured).
- The plugin validates with `claude plugin validate .` and loads in a fresh headless session, but hasn't been tried on a clean machine. The agent team ran live twice and worked, but nobody has compared it with one agent doing the same task.
- The test-guard hook catches skip markers, removed assertions and tests, deleted test files, `--no-verify` and test-run detection. It can't see a changed expected value, a looser tolerance or a swallowed error. It was live-tested with one Edit in a headless session; Write, MultiEdit and Bash are covered only by the unit tests, not by long real sessions. It is regex-based, so it can misfire.
- `plain-writing` hasn't been tried on long documents written from scratch.
- Release tags and a license holder name are still to do. The `.skill` files in `dist/` are rebuilt by hand.

## Next

1. Repeat runs of every case, with someone else grading.
2. Tune the descriptions and measure how often the right skill is picked.
3. Compare the agent team with a single agent on the same task.
4. Release tags.
