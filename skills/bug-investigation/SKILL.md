---
name: bug-investigation
description: Finds the root cause of bugs people cannot explain. Use for flaky or intermittent tests, works locally but fails in CI, wrong numbers, race conditions, or when asked to figure out why. Reproduce first, test hypotheses, fix the cause, add a regression test. Skip obvious one-line fixes.
---

# Bug Investigation

1. Reproduce first. Get a failing command, test or log line, and make intermittent bugs deterministic (fixed seeds, `PYTHONHASHSEED` sweeps, fake clocks, N-run loops, permutations). If you can't reproduce, say so and gather evidence before theorizing.
2. Keep 2-3 hypotheses, each with what it predicts. Test the cheapest discriminating one first and note which evidence confirmed or refuted each.
3. Fix the root cause, the thing that makes the bug impossible, not retries, sleeps, wider tolerances or broad try/except.
4. Add a regression test that fails before the fix and passes after. Writing the test is part of the fix; advice to "assert X" is not enough. Before writing it, answer four questions: what does it protect, what makes it fail, why does existing coverage not already catch this (prefer a new row in an existing table-driven test over a near-duplicate), and does it need a production hook that nothing else uses (if so, test at the real boundary instead). Run it before the fix and confirm it fails because of the bug, not a bad fixture, import or missing service.
5. Check the blast radius: grep for the same pattern elsewhere and run the wider suite.
6. When fixing a run of bugs, stop every five fixes and after any revert, and ask whether the loop is helping. Stop after two reverts, or after an edit to a file unrelated to the bug, and show the user what is done before going on. Set a cap so a loop cannot run forever.
6. Keep the fix surgical and prove it, as in `coding-discipline`: change only the lines the cause requires, list unrelated problems instead of fixing them, and report the command that showed the bug and then showed it gone. If a test fails and the cause is not clear, use `honest-fixes` rather than loosening the test.
