---
name: retro
description: Runs a weekly or sprint engineering retrospective from git and pull request history. Use for weekly retro, what did we ship, sprint review, how did this week go, or team velocity and health. Counts what shipped, fix and test trends, hotspots and pull request sizes, compares with the previous period, and writes wins, what slowed us and what to change. Skip for incident postmortems (incident-response) and for estimating future work (estimation).
---

# Retro

A retrospective is useful when it turns history into two or three changes the team will actually try. The numbers are evidence for that, not a scoreboard. Lead with what shipped for users, treat lines of code as context and never as performance.

## 1. Set the window

Default to the last seven days, or since the last tag or the last retro. Say the window and the branch you analysed. Fetch first so remote work is included. If the repository has no history in the window, say so and stop.

## 2. Gather the facts

Use read-only commands and show which you ran:

- Commits and their changes: `git log --since=<date> --numstat`, per author and per file.
- Merged pull requests: `gh pr list --state merged --search "merged:>=<date>" --json number,title,mergedAt,additions,deletions` where `gh` is set up.
- Shipped features: changelog entries added in the window, and merged pull request titles.
- Debt markers: `TODO`, `FIXME` and `HACK` comments added and removed in the window.

## 3. Build the table

Put what shipped for users first. Then: pull requests merged, commits, contributors, lines added and removed, test files changed, fix commits that came with a regression test, the median and largest pull request, and the days with activity. Commits grouped by type (feature, fix, refactor, tests, docs, chores) show where the effort went; a high share of fixes can signal quality debt.

## 4. Look for patterns

- **Hotspots:** the files changed most often. Repeated churn in one place usually means a design problem or missing tests.
- **Size:** very large pull requests merged late in the week, or sitting open for days.
- **Quality signals:** fixes without tests, tests weakened, reverts.
- **Debt:** markers that name no owner or no trigger for revisiting them. Count new against resolved.

## 5. Compare with before

If `.dev-suite/retro/` has the previous period, show the change in each key number. Save this period's numbers there as a small JSON file named by the date, for next time. Say plainly when there is nothing to compare.

## 6. Write the narrative

- **Shipped:** the three things that mattered most to users.
- **What went well,** with evidence.
- **What slowed us,** with evidence from the data (large pull requests, a hotspot, rework).
- **Three changes to try next period,** each with a signal that would show whether it worked.
- Credit people for specific work. Do not rank people by volume. Show a per-person breakdown only if the user asks, and frame it as where someone might need help or recognition.

## Rules

- Report what the data shows and what it cannot show (reviews, meetings, design work and non-code effort do not appear in git).
- Never put secrets, tokens or private details from commit messages into the report.
- Keep the report short enough to read in five minutes.
