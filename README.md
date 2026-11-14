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
| Risky shortcuts | Diagnose first, offer the least destructive option, confirm the exact action before anything irreversible |

### Install

**One project** (commit it so your whole team gets it):

```bash
git clone https://github.com/<your-user>/ClaudeSkills.git
mkdir -p your-project/.claude/skills
cp -r ClaudeSkills/skills/deep-engineering your-project/.claude/skills/
```

**All your projects:**

```bash
cp -r ClaudeSkills/skills/deep-engineering ~/.claude/skills/
```

**claude.ai:** upload `dist/deep-engineering.skill` under Settings, Skills.

### How well does it work?

Four test cases live in `skills/deep-engineering/evals/` (flaky test root cause, security audit, migration plan, destructive-action confirmation). In a small first evaluation, outputs with the skill passed 20 of 20 assertions. Without it, the first three cases passed 12 of 16 and a harder destructive-action prompt passed 0 of 4. Caveats: single runs, graded by the author, no repeats, and the skill's trigger description has not been tuned. Treat these as a sanity check, not a benchmark. Contributions of harder test cases are welcome.

### License

MIT, see [LICENSE](LICENSE).
