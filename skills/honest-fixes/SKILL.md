---
name: honest-fixes
description: Makes failing tests, builds or CI pass for real instead of silencing them. Use whenever a check fails and the fix is not obvious, or the user says just make the tests pass. Never deletes, skips or loosens tests, hardcodes expected values or swallows errors. Stops and asks with options when stuck.
---

# Honest Fixes

A green test run is only evidence that the code works. Making it green by other means destroys that evidence and hands the user a bug they now trust. So whenever a test, build or check fails, the goal is working code, not a passing signal.

**Never do these to get green** (even if the user said "make the tests pass"):
- delete, skip, xfail, or comment out a test; loosen an assertion, tolerance or timeout; widen a snapshot
- hardcode expected values, special-case the test's inputs, or detect that it is running under test
- wrap the failing code in a broad try/except, mock away the thing under test, or disable a lint, type or CI check
- change a test to match the buggy behavior without saying so

The plugin also ships a hook (`hooks/guard-tests.js`) that asks the user to confirm when an edit adds a skip marker, removes assertions or tests, deletes a test file, skips git hooks with `--no-verify`, or adds code that detects a test run. If it stops you, don't work around it: fix the code, or explain why the test is wrong.

**A test may be changed only when it is itself wrong**, and then say so explicitly: show what the test asserted, why that was incorrect (for example the requirement changed, or it encoded the bug), and what it asserts now. Separate that edit from the fix, ideally its own commit, so the user can review it.

**Work the problem in a bounded loop.** For each failure: read the actual error, form a hypothesis, make one change, re-run. Keep a short log of what you tried and what each result ruled out. Don't repeat an approach that already failed.

**Verify before you say green.**
- Run the checks the project declares (build, types, lint, tests) once before you edit, so you know what was already red. Call a failure "pre-existing" only if it was red on that first run. A file you changed breaking a test you did not touch is your bug.
- After your last edit, run the full set again on the final state of the files. Green from an earlier run, or from a partial run, is not green.
- A check that selects no tests, or a changed file that no test covers, is not green: add a test that covers it, or say it is uncovered.
- If a check fails for a missing tool, service, secret or network, report it with the log line. Do not stub it out, skip it or work around it.
- Stop after five runs, when the same failure comes back twice after a fix, or on an environment failure, and say what is still red and why. Before another fix to a stubborn failure in your own change, reproduce it in one small test and trace the cause.

**Stop and ask the user when:**
- two or three genuinely different approaches have failed, or you are going in circles
- the test and the requirement appear to contradict each other, or the requirement is ambiguous
- the fix needs a decision that is theirs (changing public behavior, accepting a trade-off, touching something outside the task, adding a dependency)
- you lack access or information you can't get yourself (credentials, a service, real data, a log from their environment)

**How to ask:** one message with (1) what you were trying to achieve, (2) what is failing, with the exact error, (3) what you tried and what each attempt showed, (4) your best current theory, and (5) two or three concrete options with your recommendation, for example "fix X, or confirm the test expectation is outdated and I'll update it". Don't ask open-ended "what should I do?", and don't hide a failure in the summary: if something still fails, say so first.
