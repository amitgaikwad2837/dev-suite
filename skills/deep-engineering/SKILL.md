---
name: deep-engineering
description: A disciplined workflow for hard engineering work. Use this whenever the user reports a bug they can't explain (flaky/intermittent tests, "works locally but fails in CI", wrong numbers, race conditions, "figure out why"), asks for a security review or audit of code (injection, auth, secrets, "before we ship"), plans a migration or refactor spanning many files or modules, or hands over any task that will take many steps and must stay on track, even if they never say "root cause" or "deep dive". Also use it when a stuck production issue tempts a risky shortcut (drop table, force push) so the risk gets checked first. Skip for one-line fixes, simple questions and routine edits.
---

# Deep Engineering

Hard problems fail in predictable ways: fixing a symptom, trusting an assumption, changing too much at once, or acting irreversibly before understanding. Each mode below guards against one of these. Pick the modes that apply; Mode 3 usually wraps the others.

## 1. Bug investigation

1. **Reproduce first.** Get a failing command, test or log line, and make intermittent bugs deterministic (fixed seeds, `PYTHONHASHSEED` sweeps, fake clocks, N-run loops, permutations). If you can't reproduce, say so and gather evidence before theorizing.
2. **Keep 2-3 hypotheses**, each with what it predicts. Test the cheapest discriminating one first and note which evidence confirmed or refuted each.
3. **Fix the root cause**, the thing that makes the bug impossible, not retries, sleeps, wider tolerances or broad try/except.
4. **Add a regression test** that fails before the fix and passes after. Writing the test is part of the fix; advice to "assert X" is not enough.
5. **Check the blast radius**: grep for the same pattern elsewhere and run the wider suite.

## 2. Security review

1. Map entry points (routes, CLI args, queues, uploads, webhooks) and trust boundaries.
2. Trace untrusted data to sinks: SQL, shell, file paths, templates, deserialization (`yaml.load`, pickle), outbound requests (SSRF), redirects, logs, HTML.
3. Check authn/authz on every route (ownership checks, client-controlled roles or cookies), secrets, crypto, session/CSRF/CORS, races, dependencies, defaults, permissions.
4. Report one entry per finding: `file:line` (or route/function if only snippets exist), severity, exploit in a sentence or two, concrete fix. Mark anything you couldn't trace as **suspected** and list what you couldn't check.
5. Fix at the root (parameterized queries, central authz, allowlists), not per call site.
6. Stay defensive: demonstrate against the user's own code or tests, never build weaponized exploits or hit third-party systems.

## 3. Long multi-step work

1. **Plan as a numbered checklist and end every step with an explicit "Done when …"** (a test passes, a grep returns nothing, a metric holds). This applies to the plan you show the user too, not only to your internal list. One step in progress at a time.
2. **Read before editing**: conventions, tests, build commands, call sites.
3. **Small verified increments**: build and test after each; never stack unverified changes. Keep a notes file (decisions, dead ends) if the task may outlive your context.
4. **Re-plan when an assumption breaks** instead of pushing on. Use subagents for independent reading/searching; keep decisions yourself.
5. **Finish with a report**: done / unverified / left to do. Review your own diff for debug code and unrelated edits first. Never claim tests pass without running them; if nothing could be run, say so up front.

## 4. Refactors and migrations

- State the invariant (e.g. "same requests on the wire, same results to callers").
- Build a safety net first when coverage is thin: characterization tests at the boundary being changed, not a blanket coverage drive.
- Migrate in slices behind a flag or one PR each, build green after every slice, rollback possible without a deploy until cleanup.
- Name the behavior differences between old and new (defaults, error types, semantics) and pin them with tests.
- Finish by removing the old path and grepping for leftovers.
- Present the migration as Mode 3 steps (audit, baseline, safety net, seam, slices, cleanup), each with its "Done when …".

## 5. Risky shortcuts on stuck production issues

When the user wants to unblock fast with something destructive (drop table, force push, kill processes, disable a check):
1. Diagnose what is actually blocking (e.g. `pg_blocking_pids`) so the fix targets it; the shortcut often wouldn't even work.
2. Offer the least destructive option that works (terminate one session, rename instead of drop, revert instead of force push) and say what each can't undo.
3. Do nothing irreversible until the user confirms the exact object and action. "Just do it" in the original prompt is a reason to restate the risk once, not to skip the confirmation.

## Report shape

Short and scannable. Bug: symptom, root cause, evidence, fix, test, remaining risk. Security: findings as above. Long task: done / unverified / left. Lead with what the user must decide or fix first.
