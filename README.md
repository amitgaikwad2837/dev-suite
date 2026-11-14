# dev-suite

A development workflow suite for Claude Code: seventeen focused skills and eight subagents that cover a job from idea to production, plus a plan for what is still missing (see [ROADMAP.md](ROADMAP.md)).

| Phase | Skill |
|---|---|
| Entry point, routes the work | `dev-lifecycle` |
| Team mode: manager plus specialist subagents | `dev-orchestrator` |
| Discover: get requirements answered | `requirements-interview` |
| Verify: decide what to test and write tests that catch bugs | `test-strategy` |
| Review: PRs and diffs before merge | `change-review` |
| Ship: pipelines, rollouts, rollback, release notes | `release-engineering` |
| Design | `new-app-build`, `design-decision` |
| Change existing code | `bug-investigation`, `migrate-and-upgrade`, `app-replica` |
| Fix for real, handle emergencies | `honest-fixes`, `risky-shortcuts` |
| Security review | `security-review` |
| Write documents | `plain-writing` |
| Edit discipline for any code change | `coding-discipline` |
| Learn: turn repeated work into skills | `skill-capture` |

Each skill can also be installed on its own.

## The focused skills

Each skill is one method, short enough to load only when the task calls for it.

| Skill | Use it when | Method in one line |
|---|---|---|
| `coding-discipline` | Any non-trivial code change or multi-step task | State assumptions, make the smallest change, keep the diff clean, prove it with a command; every plan step ends with a "Done when" |
| `bug-investigation` | A bug you cannot explain, flaky tests, "fails in CI" | Reproduce first, keep competing hypotheses, fix the root cause, add a regression test |
| `security-review` | Audit or "before we ship" | Trace untrusted input to risky sinks; each finding has location, exploit and fix; unverified items marked suspected |
| `migrate-and-upgrade` | Migrations, big refactors, framework or language upgrades | Safety net first, one major version at a time, codemods in their own commit, rollback ready |
| `design-decision` | Choosing between designs that are hard to reverse | Criteria and must-haves first, three different options, same stress scenarios, a decision record with what would make you revisit it |
| `new-app-build` | A new app or large feature | Interview, one-page spec, plan, walking skeleton with CI, tested vertical slices, hardening |
| `app-replica` | Replacing or recreating an application | Ownership check, black-box behavior spec, fresh build in slices, parity checks, cutover with rollback |
| `honest-fixes` | A check fails and the fix is not obvious | Never silence tests; bounded loop; stop and ask with options when stuck |
| `risky-shortcuts` | Drop table, force push, "just do it" under pressure | Diagnose the real blocker, least destructive option, explicit confirmation of the exact action |
| `plain-writing` | Writing or polishing any document | Reader first, three passes (structure, sentences, facts), facts and code never altered |

## skill-capture

Spots repeated work and turns it into a reusable skill. When the same multi-step procedure, the same correction or the same helper script comes up a second time (or you say "make this a skill"), Claude proposes the skill, asks where it should live (project, personal or shared), and only then writes it: a well-named folder, a description that triggers reliably, short imperative steps, bundled scripts for repeated code, no secrets, and a quick test with realistic prompts. For deeper evaluation it points to Anthropic's `skill-creator`.

## requirements-interview

Gets the missing requirements before anything is built. Claude sorts what it needs to know into three groups: things it can look up, things it can safely default, and things only you can decide. It asks only the last group, in a short numbered round where every question has a proposed answer, so you can reply "defaults" or change a few numbers. Follow-up rounds happen only where answers open new decisions. It ends with a one-page brief (goal, decisions, assumptions, out of scope, risks) for you to confirm.

## change-review

Reviews a pull request or diff and returns a verdict with ranked, actionable comments. Claude first states what the change is meant to do and whether the description matches it, ranks the changed behaviors by what breaks if they are wrong, reads the riskiest code first, checks that tests would actually catch a failure (and runs them when it can), then writes comments with a location, a severity label (blocker, should fix, question, nit), the reason and a suggested fix. It ends with a verdict and what it did not review. It can also review your own change before you ask others.

## test-strategy

Decides what deserves a test and writes tests that catch real bugs. Behaviors are listed and ranked by risk, each is tested at the cheapest level that catches it, and tests are named for behavior, cover boundaries, stay deterministic and mock only at the edges. New tests are checked by deliberately breaking the code to see them fail. It also covers characterization tests for legacy code, flaky-test triage (fix the cause, quarantine only with an owner and a date) and slow suites.

## release-engineering

Designs and runs safe releases. It covers versioning, a build-once-promote pipeline, a pass/fail readiness checklist, rollout strategy chosen by risk (rolling, blue-green, canary, flags) with abort criteria written before starting, rollback and database expand/contract changes, and release notes for the reader. It asks for explicit confirmation before any production deploy, tag, publish or live migration.

## dev-orchestrator and the agent team

For work with a real design choice or risk, a manager runs a small team of specialist subagents (`agents/` folder): `requirements-analyst`, `solution-architect`, `implementer`, `test-engineer`, `change-reviewer`, `security-auditor`, `release-manager`, led by `dev-manager`. Each specialist loads the skill for its role. They propose designs independently, critique each other against written criteria, the manager decides and records the dissent, then the team implements in slices and reviews the result.

Subagents report to the manager and share files in `.dev-suite/board/`; they can also message each other for short questions. Only the manager talks to you.

It is built to spend few tokens:
- **Tiers:** solo by default, a pair (implementer plus reviewer) for normal risk, a council only for hard-to-reverse choices.
- **Short briefs, file paths instead of pasted text, summaries of at most about 100 words**, with details kept in files.
- **Small models** for light roles (analyst, release prep), a mid model for implementer, tester and reviewers, and turn limits on every agent.

Start it by asking for "use your agent team to ...", or run the whole session as the manager: `claude --agent dev-suite:dev-manager`. A team still costs more than one agent, so use it only when the decision is worth it.

### Install

**As a plugin (recommended):** inside Claude Code, add the marketplace and install:

```text
/plugin marketplace add amitgaikwad2837/dev-suite
/plugin install dev-suite@amitgaikwad2837-skills
```

All seventeen skills and the agents then load and trigger automatically when a task matches. The marketplace files are in `.claude-plugin/`.

**One project, without the plugin system** (commit it so your whole team gets it):

```bash
git clone https://github.com/amitgaikwad2837/dev-suite.git
mkdir -p your-project/.claude/skills
cp -r dev-suite/skills/* your-project/.claude/skills/
```

**All your projects:**

```bash
cp -r dev-suite/skills/* ~/.claude/skills/
```

**claude.ai:** upload a single skill from `dist/` (for example `dist/bug-investigation.skill`) under Settings, Skills.

**Everything at once, manually:** unzip `dist/dev-suite.zip` into `~/.claude/skills/` (or a project's `.claude/skills/`). It holds all seventeen skills and the `agents/` folder (copy `agents/` to `~/.claude/agents/`), without the test cases.

### Prior art

Interviewing before building, comparing designs, plain writing and test integrity are all long-standing engineering practice, and other collections of skills for Claude touch some of the same ground. The methods and wording in this repo were written for it, from the failure cases we tested, and no text was copied from other skill packs.

### How well does it work?

Each skill has test cases in its `evals/` folder. The first eleven rows were measured on the single `deep-engineering` skill before it was split into focused skills; the text moved unchanged, but the split has not been re-measured. Every case was run once with the skill and once without, and graded by the author against written checks. Results (checks passed, with skill vs without):

| Case | With | Without |
|---|---|---|
| Flaky test root cause | 5/5 | 4/5 |
| Security audit | 6/6 | 5/6 |
| Migration plan | 5/5 | 3/5 |
| Destructive action, user insists | 4/4 | 0/4 |
| New app (greenfield) | 4/5 | 2/5 |
| Django 3.2 to 5.x upgrade | 6/6 | 4/6 |
| Design decision (measured on the earlier wording) | 5/5 | 3/5 |
| Contradictory tests | 6/6 | 5/6 |
| Rebuild legacy app | 5/5 | 5/5 |
| Rewrite a README | 5/5 | 5/5 |
| Fix a failing test (easy) | 5/5 | 5/5 |
| skill-capture | 5/5 | 3/5 |
| Requirements interview (measured on the earlier wording) | 5/5 | 3/5 |
| Idea to production (`dev-lifecycle`) | 5/5 | 4/5 |
| Team for a hard choice (`dev-orchestrator`, plan only) | 5/5 | 0/5 |
| Review a PR with hidden risks (`change-review`) | 5/5 | 2/5 |
| Tests for a shipping calculator (`test-strategy`) | 5/5 | 4/5 |
| Release process for manual Friday deploys (`release-engineering`) | 5/5 | 2/5 |

Three of these skills were rewritten after the run and need a rerun. Caveats: single runs, graded by the author, not independent. Several cases tie, which means Claude already does that part well; the skills add the most on process and structure. The checks for the last five rows were written for each skill's own method, so the baseline loses points it could not know to earn (the team case was run as a plan only, without spawning agents). The agent team has not been run live, and the trigger descriptions have not been tuned. Treat this as a sanity check, not a benchmark. Contributions of harder cases are welcome.

### Check the repo

```bash
python scripts/validate.py
```

Checks frontmatter, name-to-folder match, description length, eval layout and plugin JSON.

### License

MIT, see [LICENSE](LICENSE).
