# dev-suite

A development workflow suite for Claude Code: four skills that cover a job from idea to production, plus a plan for what is still missing (see [ROADMAP.md](ROADMAP.md)).

| Phase | Skill |
|---|---|
| Entry point, routes the work | `dev-lifecycle` |
| Discover: get requirements answered | `grill-me` |
| Design, build, change, verify, review, ship, write | `deep-engineering` (11 modes) |
| Learn: turn repeated work into skills | `skill-capture` |

Each skill below can also be installed on its own.

## deep-engineering

A disciplined workflow for hard engineering work. Claude uses it when you:

- chase a bug you can't explain (flaky tests, "works locally, fails in CI")
- ask for a security review or audit before shipping
- plan a migration or refactor across many files or modules
- hand over a long multi-step task that must stay on track
- are tempted by a risky shortcut on a stuck production issue (drop table, force push)

It does not trigger for one-line fixes, simple questions or routine edits.

What it changes about Claude's behavior:

| Mode | Behavior |
|---|---|
| Bug investigation | Reproduce first, keep competing hypotheses, fix the root cause, add a regression test that fails before the fix |
| Security review | Trace untrusted input to sinks; each finding gets a location, an exploit line, a fix; unverified items are labelled "suspected" |
| Long multi-step work | Numbered plan where every step ends with "Done when ...", small verified increments, final done / unverified / left report |
| Refactors and migrations | Safety net first, migrate in slices behind a flag, pin old-vs-new behavior differences with tests |
| Arena (compare approaches) | For hard-to-reverse design choices: fix judging criteria first, generate 3 independent candidates, cross-judge with evidence, pick a base and graft strengths from the rest |
| New application | Interview, one-page spec, plan with risky unknowns first, walking skeleton with CI, vertical slices with tests, then a hardening and security pass |
| Version upgrade | Pin a green baseline, list breaking changes from the official guide as a checklist, one major at a time, vendor codemods in dry-run and in a separate commit, fix in layers, ship with a rollback |
| Replica (rebuild an app) | Clean-room rebuild from observed behavior: ownership/permission check, scope, black-box behavior spec, fresh design and code, slices with parity tests, and a parity report |
| Writing | Documents for a named reader, plain and specific, machine-sounding filler removed, facts/code/names untouched, user voice matched when a sample is given |
| Integrity | Never deletes, skips or loosens tests, hardcodes expectations or swallows errors to get green; tries distinct approaches, and when stuck stops with a structured report and options for the user |
| Risky shortcuts | Diagnose first, offer the least destructive option, confirm the exact action before anything irreversible |

## skill-capture

Spots repeated work and turns it into a reusable skill. When the same multi-step procedure, the same correction or the same helper script comes up a second time (or you say "make this a skill"), Claude proposes the skill, asks where it should live (project, personal or shared), and only then writes it: a well-named folder, a description that triggers reliably, short imperative steps, bundled scripts for repeated code, no secrets, and a quick test with realistic prompts. For deeper evaluation it points to Anthropic's `skill-creator`.

## grill-me

Interviews you before anything is built. Claude reads what it can first, then asks one question at a time, each with a recommended answer, probes vague words like "fast" or "secure", follows the branches your answers open, and ends with a decision record (goal, decisions, assumptions, out of scope, open risks) for you to confirm. Say "grill me", or hand it a vague plan. The idea is popular in community skill packs; this version is written from scratch.

### Install

**As a plugin (recommended):** inside Claude Code, add the marketplace and install:

```text
/plugin marketplace add amitgaikwad2837/ClaudeSkills
/plugin install dev-suite@amitgaikwad2837-skills
```

All four skills then load and trigger automatically when a task matches. The marketplace files are in `.claude-plugin/`.

**One project, without the plugin system** (commit it so your whole team gets it):

```bash
git clone https://github.com/amitgaikwad2837/ClaudeSkills.git
mkdir -p your-project/.claude/skills
cp -r ClaudeSkills/skills/deep-engineering your-project/.claude/skills/
```

**All your projects:**

```bash
cp -r ClaudeSkills/skills/deep-engineering ~/.claude/skills/
```

**claude.ai:** upload a single skill from `dist/` (for example `dist/deep-engineering.skill`) under Settings, Skills.

**Everything at once, manually:** unzip `dist/dev-suite.zip` into `~/.claude/skills/` (or a project's `.claude/skills/`). It holds all four skills without the test cases.

### Related skills worth installing alongside

`deep-engineering` is a workflow layer. It pairs well with these community and official skills (we did not copy their content; check each repo and read its SKILL.md before installing, since skills run with your agent's permissions):

- [Superpowers](https://github.com/obra/superpowers): a broader development methodology (brainstorming, TDD, debugging, planning, review).
- [GitHub Spec Kit](https://github.com/github/spec-kit): a specify, plan, tasks, implement flow with approval between phases; strong for greenfield work.
- [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills): four short coding principles (think before coding, simplicity first, surgical changes, goal-driven execution) distilled from Andrej Karpathy's notes on LLM coding pitfalls. The "Coding discipline" section of `deep-engineering` reflects the same ideas in our own words.
- [anthropics/skills](https://github.com/anthropics/skills): official skills such as `frontend-design`, `webapp-testing`, `mcp-builder` and `claude-api`.
- Migration helpers such as `migrate-ops` and the Codemod registry skills, for framework-specific upgrade commands.

Popularity figures for these vary between aggregator sites and are unverified.

### How well does it work?

Each skill has test cases in its `evals/` folder. Every case was run once with the skill and once without, and graded by the author against written checks. Results (checks passed, with skill vs without):

| Case | With | Without |
|---|---|---|
| Flaky test root cause | 5/5 | 4/5 |
| Security audit | 6/6 | 5/6 |
| Migration plan | 5/5 | 3/5 |
| Destructive action, user insists | 4/4 | 0/4 |
| New app (greenfield) | 4/5 | 2/5 |
| Django 3.2 to 5.x upgrade | 6/6 | 4/6 |
| Arena (compare designs) | 5/5 | 3/5 |
| Contradictory tests | 6/6 | 5/6 |
| Rebuild legacy app | 5/5 | 5/5 |
| Rewrite a README | 5/5 | 5/5 |
| Fix a failing test (easy) | 5/5 | 5/5 |
| skill-capture | 5/5 | 3/5 |
| grill-me | 5/5 | 3/5 |

Caveats: single runs, graded by the author, not independent. Several cases tie, which means Claude already does that part well; the skills add the most on process and structure. The `dev-lifecycle` case has been written but not run, and the trigger descriptions have not been tuned. Treat this as a sanity check, not a benchmark. Contributions of harder cases are welcome.

### Check the repo

```bash
python scripts/validate.py
```

Checks frontmatter, name-to-folder match, description length, eval layout and plugin JSON.

### License

MIT, see [LICENSE](LICENSE).
