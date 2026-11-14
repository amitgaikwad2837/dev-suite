# dev-suite

Skills and subagents for Claude Code that cover the usual path of a software job: working out what to build, designing it, building it, fixing and upgrading existing code, reviewing, testing and shipping.

Each skill is one short method. Claude loads a skill only when the task matches its description, so most tasks pull in one or two small files rather than a big prompt.

## Install

As a plugin, from inside Claude Code:

```text
/plugin marketplace add amitgaikwad2837/dev-suite
/plugin install dev-suite@amitgaikwad2837-skills
```

Without the plugin system, copy the skills you want into a project or into your home folder:

```bash
git clone https://github.com/amitgaikwad2837/dev-suite.git
cp -r dev-suite/skills/* your-project/.claude/skills/
```

Use `~/.claude/skills/` instead to have them in every project. The subagents in `agents/` go in `~/.claude/agents/`. `dist/` has a `.skill` file for each skill (for claude.ai uploads) and `dev-suite.zip` with everything but the test cases.

## The skills

Start with `dev-lifecycle` if you aren't sure where a job begins. It places the request in a phase and points at the skill for it.

| Skill | When it applies |
|---|---|
| dev-lifecycle | Idea to production, "where do we start" |
| dev-orchestrator | A task big or risky enough for a manager plus specialist agents |
| requirements-interview | A vague request that needs questions answered before any building |
| new-app-build | A new app or large feature |
| design-decision | Choosing between designs that are hard to undo |
| coding-discipline | Any non-trivial code change or multi-step task |
| bug-investigation | Bugs nobody can explain, flaky tests, "fails only in CI" |
| migrate-and-upgrade | Library or framework migrations, big refactors, version upgrades |
| app-replica | Rebuilding or replacing an existing application |
| security-review | A security audit before shipping |
| change-review | Reviewing a PR or diff |
| test-strategy | What to test, writing tests, flaky and slow suites |
| frontend-design | Building or restyling a UI so it doesn't look like a default template |
| design-reference | Matching a brand or reference site; writes a DESIGN.md of tokens and rules |
| ui-polish | Reviewing a built screen for states, spacing, contrast, motion |
| browser-verify | Running the app in a real browser, screenshots, Playwright tests |
| web-quality | Accessibility, page speed, mobile layouts |
| honest-fixes | Failing tests or CI, without silencing them |
| risky-shortcuts | Drop table, force push and similar under pressure |
| release-engineering | Pipelines, rollouts, rollback, versioning, release notes |
| plain-writing | READMEs, specs, runbooks, PR text, release notes |
| skill-capture | Spotting repeated work and turning it into a skill |

## The agent team

`dev-orchestrator` lets Claude act as a manager for a small team: `requirements-analyst`, `solution-architect`, `implementer`, `test-engineer`, `change-reviewer`, `security-auditor` and `release-manager`, with `dev-manager` as the lead. The architects write proposals independently, the reviewers score them against written criteria, the manager decides and records the strongest objection, and then the team builds and reviews in slices. Agents share notes in `.dev-suite/board/` and report to the manager. Only the manager talks to you.

A team costs more than one agent, so it's tiered: work alone by default, use an implementer plus a reviewer for ordinary risk, and bring in the full group only when a decision would be expensive to undo. Briefs are short and pass file paths. Agents return summaries of around 100 words and keep the detail in files. The light roles run on a smaller model and every agent has a turn limit.

To start a whole session as the manager: `claude --agent dev-suite:dev-manager`. Or just ask for "your agent team".

## How well it works

Every skill has test cases in its `evals/` folder: a prompt plus written checks. I ran each case with the skills and without, and graded the output myself.

For the twelve cases that belong to the split skills, the agents were given the skills folder and had to pick from the descriptions. They picked the right skill all twelve times and passed 61 of 62 checks. The same prompts without any skill passed 44 of 62 (those runs were made earlier, before the skills were split).

| Case | With | Without |
|---|---|---|
| Flaky test root cause | 5/5 | 4/5 |
| Security audit | 6/6 | 5/6 |
| Migration plan | 5/5 | 3/5 |
| Django 3.2 to 5.x | 6/6 | 4/6 |
| Insisting on a destructive fix | 4/4 | 0/4 |
| Choosing a rate-limit design | 5/5 | 3/5 |
| New expense app | 4/5 | 2/5 |
| Fix a failing test | 5/5 | 5/5 |
| Contradictory tests | 6/6 | 5/6 |
| Rebuild a legacy app | 5/5 | 5/5 |
| Rewrite a README intro | 5/5 | 5/5 |
| Fix a typo without tidying | 5/5 | 3/5 |

The five frontend skills were run the same way later. With the skills: 25 of 25 checks, and each agent picked the right main skill from the descriptions (the pricing-page agent also pulled in two it didn't need). Without: 16 of 25.

| Case | With | Without |
|---|---|---|
| Pricing page from a brief | 5/5 | 2/5 |
| Polish a signup form | 5/5 | 3/5 |
| Playwright login test | 5/5 | 3/5 |
| DESIGN.md from a described brand | 5/5 | 4/5 |
| Slow, keyboard-unfriendly page | 5/5 | 4/5 |

No page was rendered in any of these runs (no browser was available to the agents), so they test the method and the written output, not how the result looks.

Earlier single runs for the rest: requirements-interview 5/5 vs 3/5, skill-capture 5/5 vs 3/5, dev-lifecycle 5/5 vs 4/5, dev-orchestrator 5/5 vs 0/5 (plan only, no agents spawned), change-review 5/5 vs 2/5, test-strategy 5/5 vs 4/5, release-engineering 5/5 vs 2/5.

Treat these as a sanity check. Each case ran once, I wrote the checks and I graded them, so there's no independent grading. Some checks follow a skill's own method, which the no-skill runs couldn't know about. Several cases tie, which means Claude already handles that part fine. The agent team has not been run live, and the plugin hasn't been validated with the `claude` CLI.

## Checking the repo

```bash
python scripts/validate.py
```

It checks frontmatter, folder names, description length, eval layout, plugin JSON and leftover references. A GitHub Action runs it on every push.

## What's missing

See [ROADMAP.md](ROADMAP.md).

## Other work in this area

Interviewing before building, comparing designs, plain writing and honest test fixing are common ideas, and other skill collections cover some of them. The wording and methods here were written for this repo and no text was copied from elsewhere.

## License

MIT, see [LICENSE](LICENSE).
