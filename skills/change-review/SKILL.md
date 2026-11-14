---
name: change-review
description: Reviews someone else's code change (a pull request, a diff, a patch, or the user's own change before they ask others) and returns a verdict with ranked, actionable comments. Use when the user says "review this PR", "look over this diff", "is this safe to merge", "give me feedback on this change", or shares a diff or branch to check, even if they don't say review. Starts from what the change is meant to do and where it can hurt most, not from the first line. Skip for security-only audits of a whole app, and for writing the change itself.
---

# Change Review

A good review answers one question: is it safe and worthwhile to merge this change? Most of the value is in a few risky spots, so the method spends time there first and says plainly what it did not look at.

## 1. State the intent

Read the PR description, linked ticket, commit messages and the diff summary. Write one sentence: what is this change supposed to do, and for whom? If the intent is unclear or the diff does not match it, say so first; reviewing code against a guessed purpose wastes everyone's time.

## 2. Judge the size and shape

Count files and changed lines and look at how they cluster. If unrelated concerns are mixed (a refactor with a behavior change, a formatting sweep with a fix), say how to split it. Review what is there anyway, but flag that mixed changes hide bugs.

## 3. Rank the risk before reading line by line

List the behaviors that changed, then rank them by what breaks if they are wrong: money or data loss, authorization, public API or contract, concurrency, migrations and config, error handling on critical paths, performance on hot paths, then everything else. Read the highest-risk parts first and slowest. Skim the rest.

## 4. Check the evidence

- Do the tests exercise the changed behavior, including a failure or edge case? Would any of them fail if the change were wrong? If a test was edited or removed, read why.
- Run the tests, build or linter when you can, and say what you ran. Never report "tests pass" from reading alone.
- Compare claims in the description with the code ("no behavior change", "backwards compatible").

## 5. Read the risky code through these lenses

Correctness and edge cases (empty, null, boundaries, ordering, time zones, retries), failure handling (what happens on error, partial failure, timeout), compatibility (callers, stored data, rolling deploys), security (untrusted input, authorization, secrets, logging of sensitive data), concurrency, resource use, readability and naming, and whether the change fits the surrounding design. Only comment on unchanged code when the change affects its behavior.

## 6. Write comments that can be acted on

For each comment give: the location (`file:line`), a label, the problem and why it matters, and a concrete suggestion or question.
- Blocker: wrong, unsafe or breaks something; must change before merge
- Should fix: real weakness with a reasonable fix, not worth blocking if the author disagrees with a reason
- Question: you need information to judge
- Nit: taste or style; keep these few and group them

Don't restyle code that matches the project's conventions, and don't rewrite their approach unless it fails a requirement. Mention what is done well when it is specific and useful.

## 7. Give a verdict

Open the review with the verdict and the one to three things that decide it:
- Approve: nothing blocks it
- Approve with comments: merge after small fixes or at the author's discretion
- Request changes: at least one blocker

Close with what you did not review (generated files, parts you could not run, areas outside your view) so nobody mistakes silence for approval.

## Reviewing your own change before asking others

Run the same steps against your diff: write the intent sentence, list the riskiest behaviors, make sure a test would fail if each were wrong, remove debug code and unrelated edits, and write a description that says what changed, why and how to verify it.
