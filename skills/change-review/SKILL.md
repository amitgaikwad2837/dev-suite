---
name: change-review
description: Reviews a code change (pull request, diff, patch or the user's own branch) and returns a verdict with ranked, actionable comments. Use for review this PR, look over this diff, is this safe to merge, or feedback on a change. Starts from what the change is meant to do and where it can hurt most. Skip for security-only audits of a whole app and for writing the change itself.
---

# Change Review

A good review answers one question: is it safe and worthwhile to merge this change? Most of the value is in a few risky spots, so the method spends time there first and says plainly what it did not look at.

## 1. State the intent

Read the PR description, linked ticket, commit messages and the diff summary. Write one sentence: what is this change supposed to do, and for whom? If the intent is unclear or the diff does not match it, say so first; reviewing code against a guessed purpose wastes everyone's time.

Then check for **scope drift** before judging quality: compare the stated intent with the files that changed. Name any **scope creep** (unrelated files, unrequested features or refactors that widen what can break) and any **missing requirements** (items the description promises that the diff does not deliver, missing tests, half-finished work).

## 2. Judge the size and shape

Count files and changed lines and look at how they cluster. If unrelated concerns are mixed (a refactor with a behavior change, a formatting sweep with a fix), say how to split it. Review what is there anyway, but flag that mixed changes hide bugs.

## 3. Rank the risk before reading line by line

List the behaviors that changed, then rank them by what breaks if they are wrong: money or data loss, authorization, public API or contract, concurrency, migrations and config, error handling on critical paths, performance on hot paths, then everything else. Read the highest-risk parts first and slowest. Skim the rest.

## 4. Check the evidence

- Do the tests exercise the changed behavior, including a failure or edge case? Would any of them fail if the change were wrong? If a test was edited or removed, read why.
- Run the tests, build or linter when you can, and say what you ran. Never report "tests pass" from reading alone.
- Compare claims in the description with the code ("no behavior change", "backwards compatible").
- List every edit to a gate by name: a changed or removed test, a loosened timeout or tolerance, an edited snapshot or golden file, a CI or lint configuration change, a new suppression or ignore comment. Say for each whether it weakens a check. A weakened gate is a finding, not a footnote.

## 5. Read the risky code through these lenses

Correctness and edge cases (empty, null, boundaries, ordering, time zones, retries), failure handling (what happens on error, partial failure, timeout), compatibility (callers, stored data, rolling deploys), security (untrusted input, authorization, secrets, logging of sensitive data), concurrency, resource use, readability and naming, and whether the change fits the surrounding design. Only comment on unchanged code when the change affects its behavior.

**Shared code:** flag duplicated behavior only when pulling it into one place would make it more reliable or save net code; code that merely looks similar is not enough. Recommend at most three, each with the evidence, the likely saving and the callers affected, and mark them optional.

**Docs:** if the change alters behavior that a README, guide, changelog or example describes, say which page is now out of date.

## 6. Write comments that can be acted on

For each comment give: the location (`file:line`), a label, the problem and why it matters, and a concrete suggestion or question.
- Blocker: wrong, unsafe or breaks something; must change before merge
- Should fix: real weakness with a reasonable fix, not worth blocking if the author disagrees with a reason
- Question: you need information to judge
- Nit: taste or style; keep these few and group them

**Verify before you report.** Quote the line that motivates each finding (`file:line` and the text). If you cannot quote it or reproduce it, label the comment unverified and put it in a short "maybe" list at the end, never among the blockers. Do not invent confidence. Where the fix is mechanical and obvious (an unused import, a typo, a missing null check with one clear answer), offer it as a ready patch; for anything riskier, ask.

Don't restyle code that matches the project's conventions, and don't rewrite their approach unless it fails a requirement. Mention what is done well when it is specific and useful.

## 7. Give a verdict

Open the review with the verdict and the one to three things that decide it:
- Approve: nothing blocks it
- Approve with comments: merge after small fixes or at the author's discretion
- Request changes: at least one blocker

Close with what you did not review (generated files, parts you could not run, areas outside your view) so nobody mistakes silence for approval.

## Reviewing your own change before asking others

Run the same steps against your diff: write the intent sentence, list the riskiest behaviors, make sure a test would fail if each were wrong, remove debug code and unrelated edits, and write a description that says what changed, why and how to verify it.
