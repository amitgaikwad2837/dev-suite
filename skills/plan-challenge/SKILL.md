---
name: plan-challenge
description: Reviews a plan before anything is built, challenging its premise, scope and completeness. Use for review my plan, is this worth building, think bigger or smaller, scope review, what am I missing. Skip for choosing between designs (design-decision), validating with several advisors (llm-council) and estimating time (estimation).
---

# Plan Challenge

Most plans fail before the first line of code: they solve a proxy for the real problem, they are the wrong size, or they describe only the happy path. This review reads a plan the way a skeptical founder and a careful engineer would, says what is wrong with it, and leaves the decisions to the user. It is a review. Do not write or change code.

## 1. Restate the plan

In three lines: what is being built, for whom, and what outcome it is meant to produce. If you cannot, the plan is not ready, and that is the first finding. Ask the user only for facts nobody else can give.

## 2. Challenge the premise

- What is the real problem, and does the plan solve it directly or only a proxy for it?
- What happens if nothing is built? Is the pain real and recent, or hypothetical?
- Who has this problem, how do you know, and what would you see if the plan worked?
- If the result is something people must obtain (a library, an app, a package), how will they get it?

Write the premises as statements the user can agree or disagree with, and revise if they disagree.

## 3. Look for what already exists

Map each part of the plan to code, libraries or services that already do some of it. For anything rebuilt, say why extending the existing thing is worse.

## 4. Set out the options

Give three: the plan as requested, the smallest version that proves the idea, and a larger approach only if there is evidence it is worth it. For each, give the effort, the main risk and what you learn. Recommend one.

## 5. Choose a mode, and get the user's choice

| Mode | Posture | Recommend when |
|---|---|---|
| **Expand** | Find the version that is ten times better for twice the effort | A new product or system |
| **Selective expand** | Harden the scope, then offer each extra idea with its cost and risk, one at a time | New capability on something that exists |
| **Hold** | Keep the scope and make it bulletproof | A fix or a refactor |
| **Cut** | Propose the minimum core and cut the rest | A plan touching more than about fifteen files, or too much for the time |

Recommend one with a concrete reason from the plan, then let the user choose; their choice wins. Each scope change needs approval. After a mode is chosen, work inside it and do not argue for the one you did not get.

## 6. Walk the failure paths

For every new flow, trace the happy path, the empty or null case, an upstream failure and a slow response. Then fill a small table: each error, what triggers it, what handles it, what the user sees and which test covers it. A catch-all that swallows errors is a finding. Also check double clicks, going back, stale data and two people at once. Logs, metrics, alerts and a runbook are part of the launch, not an afterthought, and so are the rollout, the rollback and any feature flags.

## 7. Tests and a picture

List the behaviors that must be tested. Draw a short text diagram of any new flow, state machine or data path, so the plan is something people can point at.

## 8. Completeness and honest shortcuts

Prefer covering the whole requirement, with tests, edge cases and error paths, over a ninety percent shortcut. At equal coverage choose the smaller change. When a shortcut is deliberate, record it with its limit and the trigger that means it should be upgraded.

## 9. Deliver the review

1. Verdict: proceed, proceed with changes, or rethink, and the one to three reasons.
2. The agreed premises and the chosen mode.
3. The scope that is in, and a **not in scope** list with a reason for each deferral.
4. The failure map and the test list.
5. Open questions only the user can answer.

Say what you could not check (the code you did not read, numbers you could not verify).
