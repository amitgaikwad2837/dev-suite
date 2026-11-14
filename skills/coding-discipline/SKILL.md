---
name: coding-discipline
description: Rules for any non-trivial code change. Use before and after editing code, when planning a multi-step task, or when a request is ambiguous. Covers stating assumptions, the smallest sufficient change, a clean diff, evidence that it works, and plans where every step has a Done when. Skip for one-line edits and plain questions.
---

# Coding Discipline

Generated code goes wrong when assumptions stay hidden, the change grows past the request, side edits sneak in, and nobody says how success will be judged. Run these checks around every edit.

- Before: assumption check. Write down what you are assuming about the request, the code and the environment. If a request has more than one plausible reading, or you are confused, say so and ask or list the options rather than choosing silently.
- Before: size check. Ask what the smallest change is that fully solves the stated problem. Leave out features, abstractions for a single use and handling of cases that cannot occur. If a simpler route exists, say so.
- After: diff check. Every changed line should trace to the request and match the surrounding style. Do not tidy or reformat neighboring code. Delete only what your own change made unused, and list unrelated problems you noticed instead of fixing them.
- After: evidence check. Name the command or test that proves the result, run it, and report what it showed ("reproduced in a test, then made it pass"; "output identical before and after"). A vague goal like "make it work" needs to be pinned down first.

## Plan long work with a Done when on every step

1. Plan as a numbered checklist and end every step with an explicit "Done when …" (a test passes, a grep returns nothing, a metric holds). This applies to the plan you show the user too, not only to your internal list. One step in progress at a time.
2. Read before editing: conventions, tests, build commands, call sites.
3. Small verified increments: build and test after each; never stack unverified changes. Keep a notes file (decisions, dead ends) if the task may outlive your context.
4. Re-plan when an assumption breaks instead of pushing on. Use subagents for independent reading/searching; keep decisions yourself.
5. Finish with a report: done / unverified / left to do. Review your own diff for debug code and unrelated edits first. Never claim tests pass without running them; if nothing could be run, say so up front.

## Report shape

Short and scannable. Bug: symptom, root cause, evidence, fix, test, remaining risk. Security: findings as above. Long task: done / unverified / left. Lead with what the user must decide or fix first.
