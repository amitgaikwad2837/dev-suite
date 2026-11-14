---
name: grill-me
description: Interviews the user until every requirement and decision is clear before any building starts. Use when the user says "grill me", "interview me", "ask me questions first", "what do you need to know", or hands over a plan, idea, spec or design that is vague, ambitious or missing details, even if they never ask for questions. Also use before building a new app or feature, a migration, or an architecture change. Skip when the request is already specific, small and unambiguous.
---

# Grill Me

Most rework comes from questions nobody asked on day one. This skill draws out the answers first, one decision at a time, so the build starts from a shared understanding instead of guesses.

## How to run the interview

1. **Read first, ask second.** If a question can be answered by looking at the code, docs, config, existing tests or earlier conversation, look there and don't spend the user's time. Open the interview with a one-line statement of what you already understand, so the user can correct it.
2. **Map the decisions.** Privately list the open decisions for this task and the order they depend on (goal and users before scope, scope before design, design before rollout). Settle the early ones first because they change the later ones.
3. **Ask one question at a time.** Each question has the options that matter, a recommended answer and a one-line reason, so the user can reply "yes" or "option 2". Number the questions so answers are easy to reference.
4. **Probe vague answers.** If the answer is "fast", "secure", "simple" or "like the old one", ask for a number, an example or a boundary ("under 200 ms for 95% of requests?").
5. **Follow the branches.** An answer can open new questions, or make some moot. Drop the ones that no longer matter.
6. **Surface contradictions and risks.** If two answers conflict, or a choice has a known cost, say so plainly and let the user decide.
7. **Respect their time.** If the user says "you decide", record your choice as an assumption and move on. Stop asking when the remaining unknowns would not change what you build.

## What to cover

Pick what applies; don't recite the whole list.
- **Purpose and success**: who is this for, what problem, how will we know it worked, what is explicitly out of scope
- **Users and flows**: roles, the main journeys, edge cases and failure paths
- **Data**: what is stored, where it comes from, how long it lives, who can see it, privacy and compliance
- **Constraints**: stack, hosting, budget, deadline, team skills, things that must not change
- **Integrations**: other systems, APIs, auth, migrations from what exists
- **Quality**: performance, scale, availability, security, accessibility, observability
- **Delivery**: slices, who reviews and approves, rollout and rollback, what "done" means

## Finish with a decision record

When the interview ends, write a short summary and ask for confirmation before building:
- **Goal** in one sentence
- **Decisions** made, each with the reason
- **Assumptions** you made where the user deferred
- **Out of scope**
- **Open risks or questions** still unanswered

Then continue with the work (for builds, `deep-engineering` Mode 7 picks up from the confirmed spec). Do not start building while important questions are still open, but do not stall either: if the user wants to go ahead, proceed on the stated assumptions.
