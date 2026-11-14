# ClaudeSkills

Reusable skills for Claude Code and Claude.

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
/plugin install deep-engineering@amitgaikwad2837-skills
```

The skill then appears as `deep-engineering` and triggers automatically when a task matches. The marketplace files are in `.claude-plugin/`.

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

**claude.ai:** upload `dist/deep-engineering.skill` under Settings, Skills.

### Related skills worth installing alongside

`deep-engineering` is a workflow layer. It pairs well with these community and official skills (we did not copy their content; check each repo and read its SKILL.md before installing, since skills run with your agent's permissions):

- [Superpowers](https://github.com/obra/superpowers): a broader development methodology (brainstorming, TDD, debugging, planning, review).
- [GitHub Spec Kit](https://github.com/github/spec-kit): a specify, plan, tasks, implement flow with approval between phases; strong for greenfield work.
- [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills): four short coding principles (think before coding, simplicity first, surgical changes, goal-driven execution) distilled from Andrej Karpathy's notes on LLM coding pitfalls. The "Coding discipline" section of `deep-engineering` reflects the same ideas in our own words.
- [anthropics/skills](https://github.com/anthropics/skills): official skills such as `frontend-design`, `webapp-testing`, `mcp-builder` and `claude-api`.
- Migration helpers such as `migrate-ops` and the Codemod registry skills, for framework-specific upgrade commands.

Popularity figures for these vary between aggregator sites and are unverified.

### How well does it work?

Four test cases live in `skills/deep-engineering/evals/` (flaky test root cause, security audit, migration plan, destructive-action confirmation). In a small first evaluation, outputs with the skill passed 20 of 20 assertions. Without it, the first three cases passed 12 of 16 and a harder destructive-action prompt passed 0 of 4. Caveats: single runs, graded by the author, no repeats, and the skill's trigger description has not been tuned. Treat these as a sanity check, not a benchmark. Contributions of harder test cases are welcome.

### License

MIT, see [LICENSE](LICENSE).
