---
name: requirements-interview
description: Gets missing requirements from the user before anything is built. Use when a request is vague or underspecified (add notifications, build me an app for X), when the user says interview me or what do you need to know, and before a new app, large feature, migration or architecture change. Asks only what Claude cannot look up or default. Skip when the request is already specific and small.
---

# Requirements Interview

Rework mostly comes from decisions nobody made out loud. The goal here is a short, high-value round of questions, not an interrogation: look up everything that can be looked up, propose a sensible default for everything that can be defaulted, and spend the user's attention only on what is truly theirs to decide.

## 1. Build an unknowns ledger

Before asking anything, list what you need to know and sort each item into one of three groups:

| Group | Meaning | What you do |
|---|---|---|
| **Findable** | Answerable from the repo, docs, config, tickets or the conversation | Look it up. Do not ask. |
| **Defaultable** | A reasonable default exists and a wrong guess is cheap to fix | Pick the default and state it. |
| **Theirs** | A business, risk, budget, policy or taste decision where a wrong guess is expensive | Ask. |

Only the third group becomes questions. If it is empty, say what you assumed and proceed.

## 2. Ask in short rounds, with a proposed answer for each

- Ask at most five questions per round, grouped by theme, numbered so the user can answer by number.
- Give every question a proposed answer and the reason in a few words, plus the main alternative. The user can reply "defaults" or override only the numbers they care about.
- Put the questions that change the most first: purpose and success, scope and non-goals, users and roles, data and privacy, constraints (stack, hosting, deadline, budget), integrations, quality bars (speed, security, availability), rollout and ownership. Pick what applies to this task; do not recite the whole list.
- Turn vague words into checks. "Fast", "secure" or "like the old one" get a number, an example or a boundary in the proposed answer ("under 300 ms for most requests?").
- Open with one line stating what you already understand, so a wrong premise is caught immediately.

## 3. Follow up only where answers open new decisions

A second round is for questions the first answers created or for contradictions between answers (name both and ask which wins). Stop when the remaining unknowns would not change what you build. If the user says "you decide", record your choice as an assumption.

## 4. Close with a one-page brief and get a yes

- Goal in one sentence and the **success check**
- Decisions, each with its reason
- Assumptions you made, marked so they are easy to challenge
- Out of scope
- Risks and open questions

Ask for confirmation before building. If the user wants to move on without answering, proceed on the stated assumptions and say which ones carry the most risk. For builds, `new-app-build` continues from the confirmed brief.

## Related skills

- `estimation`: once the scope is clear, how long it takes
- `ux-research`: finding out what users need, not asking a stakeholder
