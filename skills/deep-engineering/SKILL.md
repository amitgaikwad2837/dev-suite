---
name: deep-engineering
description: A disciplined workflow for hard engineering work. Use whenever the user has a bug they can't explain (flaky tests, "works locally but fails in CI", wrong numbers, races), asks for a security review or audit ("before we ship"), plans a migration or refactor across many files, wants to build a new application or feature from scratch, wants to upgrade a framework, language or major dependency ("upgrade to Angular 18", "move to Python 3.13"), must choose between designs that are hard to reverse ("which approach should we take"), hands over a long multi-step task, wants to rebuild or replace an existing application, writes or polishes documents (README, spec, report, PR text), or has failing tests/CI that must be fixed for real, not silenced, even without saying "root cause". Also use when a stuck production issue tempts a risky shortcut (drop table, force push). Skip one-line fixes, simple questions and routine edits.
---

# Deep Engineering

Hard problems fail in predictable ways: fixing a symptom, trusting an assumption, changing too much at once, or acting irreversibly before understanding. Each mode below guards against one of these. Pick the modes that apply; Mode 3 usually wraps the others.

## Four checks around every edit (applies to every mode)

Generated code goes wrong when assumptions stay hidden, the change grows past the request, side edits sneak in, and nobody says how success will be judged. Run these checks:
- **Before: assumption check.** Write down what you are assuming about the request, the code and the environment. If a request has more than one plausible reading, or you are confused, say so and ask or list the options rather than choosing silently.
- **Before: size check.** Ask what the smallest change is that fully solves the stated problem. Leave out features, abstractions for a single use and handling of cases that cannot occur. If a simpler route exists, say so.
- **After: diff check.** Every changed line should trace to the request and match the surrounding style. Do not tidy or reformat neighboring code. Delete only what your own change made unused, and list unrelated problems you noticed instead of fixing them.
- **After: evidence check.** Name the command or test that proves the result, run it, and report what it showed ("reproduced in a test, then made it pass"; "output identical before and after"). A vague goal like "make it work" needs to be pinned down first.

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

## 6. Choosing between designs

Some choices are expensive to undo once users, data or other teams depend on them: an API shape, a data model, an auth approach, a framework, a migration strategy. For these, one idea written quickly tends to win by default. Slow down in proportion to the cost of being wrong.
1. **Classify the decision.** If it is cheap to reverse (a refactor behind an interface, an internal helper), choose quickly and move on. Only continue below for decisions that are hard to reverse.
2. **Set the bar before looking at options.** List 3 to 5 criteria, mark any as must-haves that eliminate an option outright (for example "must not lose events", "must run on our current hosting"), and note which criteria matter most.
3. **Sketch three genuinely different options**, each in about ten lines: the idea, what it makes easy, what it makes hard. Make them differ in principle (for example centralized vs local state, build vs buy, synchronous vs queued), not in minor details. Use subagents for independent sketches if available.
4. **Stress each option with the same scenarios**: a failure in the middle of an operation, ten times the load, and one realistic change request next quarter. Where possible run something real (a spike, a query plan, a prototype of the risky part) instead of arguing from memory.
5. **Decide and record it.** Eliminate options that fail a must-have, pick the best of the rest, and borrow a specific safeguard or idea from a rejected option when it fits. Write a short decision record: what was chosen, why, what was rejected and why, and the evidence that would make you revisit it.

## 7. Building a new application (greenfield)

Most failed builds fail at the start: unclear requirements, or a big-bang implementation nobody can verify. Go in gated phases and show each result before the next:
1. **Interview before code** (the `requirements-interview` skill does this in depth). Ask only the questions that change the design (users and key flows, scale, data sensitivity, hosting, must-use stack, deadline, what "done" means). Where the user has no preference, pick a boring default and state it.
2. **Spec.** One page: goals, non-goals, main user flows, data model, external integrations, acceptance criteria. Get a yes on this.
3. **Plan.** Stack and architecture with the reason for each choice, plus the riskiest unknowns. Spike or prototype those first rather than last.
4. **Walking skeleton.** The thinnest end-to-end path (UI/API to storage and back) with build, lint, tests and a CI workflow that runs them on every push. *Done when* CI is green on the skeleton, before any feature slice starts; list this in the plan as its own step, not as part of hardening.
5. **Vertical slices.** Build one user-visible feature at a time, each with tests written alongside (test first for logic-heavy code), each ending in a working, demoable state. Commit per slice.
6. **Harden.** Auth and authorization, input validation, secrets out of code, error handling, logging, a README with run/test/deploy steps, then Mode 2 on the finished app.
Use Mode 6 for choices that are expensive to reverse (data model, auth approach, framework).

## 8. Upgrading to a new version (framework, language, major dependency)

Upgrades break because the breaking changes were never listed. Make them explicit first:
1. **Pin the starting point.** Record current versions, a green test run and a clean commit, so any later failure can be blamed on the upgrade. If tests are thin, add characterization tests around what the upgrade touches (Mode 4).
2. **Read the sources of truth**: the official migration guide, changelog and deprecation list for every version in between. Write the applicable breaking changes as a checklist for this codebase (grep for each affected API and count the call sites).
3. **Go one major version at a time** (or the vendor's recommended path) when jumping several; never skip straight across majors. Upgrade the language/runtime, then the framework, then its plugins, in the order the guide says.
4. **Use deterministic tools before hand edits**: the vendor's upgrade command or codemod (for example `ng update`, framework codemods, `jscodeshift`, `ast-grep`, `pyupgrade`, `rector`, OpenRewrite), run as a dry run first, in its own commit so its changes review separately from your manual fixes.
5. **Fix in layers**: build errors, then test failures, then deprecation warnings (turn warnings into errors to find them), then new lints. Re-run the full suite after each layer.
6. **Check what tests can't see**: bundle size and performance, config and environment differences, CI images, Docker base images, and behavior changes with no compile error (defaults, serialization, time zones, ordering).
7. **Ship safely**: staging first, canary or flag where possible, a rollback path (previous lockfile and image), and a list of removed deprecations for the release notes.
Report: versions from/to, breaking changes hit (and not hit), what each codemod changed, tests before/after, and anything still deprecated.

## 9. Solve it for real, or stop and ask

A green test run is only evidence that the code works. Making it green by other means destroys that evidence and hands the user a bug they now trust. So whenever a test, build or check fails, the goal is working code, not a passing signal.

**Never do these to get green** (even if the user said "make the tests pass"):
- delete, skip, xfail, or comment out a test; loosen an assertion, tolerance or timeout; widen a snapshot
- hardcode expected values, special-case the test's inputs, or detect that it is running under test
- wrap the failing code in a broad try/except, mock away the thing under test, or disable a lint, type or CI check
- change a test to match the buggy behavior without saying so

**A test may be changed only when it is itself wrong**, and then say so explicitly: show what the test asserted, why that was incorrect (for example the requirement changed, or it encoded the bug), and what it asserts now. Separate that edit from the fix, ideally its own commit, so the user can review it.

**Work the problem in a bounded loop.** For each failure: read the actual error, form a hypothesis, make one change, re-run. Keep a short log of what you tried and what each result ruled out. Don't repeat an approach that already failed.

**Stop and ask the user when:**
- two or three genuinely different approaches have failed, or you are going in circles
- the test and the requirement appear to contradict each other, or the requirement is ambiguous
- the fix needs a decision that is theirs (changing public behavior, accepting a trade-off, touching something outside the task, adding a dependency)
- you lack access or information you can't get yourself (credentials, a service, real data, a log from their environment)

**How to ask:** one message with (1) what you were trying to achieve, (2) what is failing, with the exact error, (3) what you tried and what each attempt showed, (4) your best current theory, and (5) two or three concrete options with your recommendation, for example "fix X, or confirm the test expectation is outdated and I'll update it". Don't ask open-ended "what should I do?", and don't hide a failure in the summary: if something still fails, say so first.

## 10. Rebuilding an existing application (replica)

Use when the user wants to recreate an application's behavior: replacing a legacy system they own, matching a vendor tool's feature set for internal use, or building something inspired by existing software. Rebuild from observed behavior, not from the original's code.

**Boundaries first.** Confirm the user owns the original or has permission, or that the goal is a functionally similar product, not a lookalike. Never copy source code, assets, text, branding, trademarks or proprietary data, and never bypass access controls or licensing to inspect it. If the request is to impersonate another company's look and name, say so and ask for a distinct identity instead.

1. **Scope.** What must match (workflows, data, integrations) and what may differ (UI, stack, features to drop or improve). Write both lists.
2. **Observe as a black box.** Capture user flows, screens, data model, API contracts, validation rules, error states and edge cases from the running system, public docs or the user's own materials. Record them as a behavior spec and a parity checklist, one line per behavior.
3. **Design your own.** Choose the stack, naming, structure and visual design yourself; use Mode 6 for choices that are costly to change.
4. **Build fresh in slices** (Mode 7), each slice covering a group of checklist items, with tests that encode the spec.
5. **Check parity** where it is legitimate to run both: feed the same inputs to the original and the replica and compare outputs, with differences either fixed or recorded as intentional.
6. **Report** a parity table (matched / intentionally different / not yet), plus risks. For a legacy replacement, plan data migration, shadow running and rollback with Mode 4.

## 11. Writing documents people will read

Applies to every document you produce or edit: READMEs, specs, design docs, runbooks, reports, PR and commit text, release notes, emails. Readers skim text that sounds generic, so the aim is writing that is specific enough to be trusted and short enough to be read.
1. **Start from the reader.** Name who will read it, what they should do or decide afterward, and what they already know. Put that first and cut what does not serve it.
2. **Pass 1, structure.** Order the content by what the reader needs, not by how you found it out. Use headings, tables and steps only where they help someone find or follow something.
3. **Pass 2, sentences.** Prefer concrete subjects and verbs, numbers, names and examples over adjectives and general claims ("the export takes 40 s on 10k rows", not "performance is significantly improved"). Cut openers that restate the question, praise, hedging on every line, stacked intensifiers, promotional words, and closers that repeat the body or offer more help. Vary sentence length; state recommendations plainly and mark uncertainty once, precisely.
4. **Pass 3, facts.** Check that every claim has a number, source or example behind it. Never alter code, commands, names, numbers, versions or quotations while editing prose.
5. **Match the writer.** If the user supplies a sample or an existing document, follow its vocabulary, sentence length and formality instead of a generic tone.
6. **Delete test.** Remove any sentence the document still works without.

## Report shape

Short and scannable. Bug: symptom, root cause, evidence, fix, test, remaining risk. Security: findings as above. Long task: done / unverified / left. Lead with what the user must decide or fix first.
