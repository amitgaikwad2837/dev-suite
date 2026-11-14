# Roadmap

What's here: requirements interviews, new apps, design decisions, bug hunting, migrations and upgrades, app rebuilds, security and change review, testing, honest fixes, risky-shortcut handling, releases, writing, skill capture, plus a router and an agent team.

## Not covered yet

In rough order of how often they come up:

- Git hygiene: commit and PR conventions, safe history rewrites.
- Accessibility and UX review, estimation, data and ML projects.

## Known weak spots

- Evidence is thin. Every case ran once and I graded it myself. It needs repeat runs, an independent grader, multi-turn cases (a whole interview, a skill actually written and tested) and harder prompts. Several cases tie with no skill at all.
- The split of one big skill into ten smaller ones has been checked for routing on 12 cases. Real-world triggering and the token cost of 17 always-loaded descriptions (about 1,700 tokens) haven't been measured.
- Descriptions haven't been tuned with a larger set of should-trigger and should-not-trigger prompts.
- The plugin install hasn't been validated with `claude plugin validate .` or tried on a clean machine, and the agent team hasn't run in a live session.
- `honest-fixes` is instructions only. A hook that blocks edits to test files would enforce it.
- `plain-writing` hasn't been tried on long documents written from scratch.
- Release tags and a license holder name are still to do. The `.skill` files in `dist/` are rebuilt by hand.

## Next

1. Schema changes, incidents and performance skills.
2. Repeat runs of every case, with someone else grading.
3. Validate the plugin and try the agent team on a real task.
4. Tune the descriptions.
