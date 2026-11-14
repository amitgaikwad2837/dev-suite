---
name: estimation
description: Estimates how long software work will take, and says how sure it is. Use when the user says "how long will this take", "estimate this", "can we ship by the 30th", "give me a timeline", "story points", "t-shirt size", "what can we fit in the quarter", "my manager wants a date", "we're behind, can we still make it" or "scope vs deadline". Breaks the work into pieces, estimates each as a range with its assumptions, lists the unknowns that dominate the risk, adds the work people forget, and answers with a range and a confidence instead of one date. Skip for deciding what to build (requirements-interview) and for the build itself (new-app-build).
---

# Estimation

An estimate is a forecast with a range, not a promise. A single number invites being treated as a commitment, and people are reliably too optimistic about work they haven't broken down. The aim is a range the person can plan around, with the reasons it could move.

## 1. Pin down what is being estimated

Settle in a few lines, asking only what you can't find in the code, tickets or docs:
- **What "done" means.** Merged, deployed, used by customers, documented? The gap between "code works" and "live and supported" is where estimates die.
- **Who does it.** The people, their familiarity with this code, and their availability after meetings, support, reviews and holidays. A person has about 4 to 5 productive days of build work in a week, often fewer.
- **Why it's asked.** A commitment to a customer, a plan for the quarter, a rough sense of size, or a pushback on a date someone else set. This decides how much precision is worth spending.
- **The constraint.** A fixed date, fixed scope or fixed team. When someone offers all three fixed, say that one has to give and ask which.

## 2. Break it down

Split the work until each piece is something you could finish in a day or two, and could describe in a sentence. Look at the code for each piece rather than guessing from the title. Include the work people leave out:
- tests, review and rework after review
- migrations, data backfills and config (`schema-changes`)
- security, accessibility and performance checks the feature needs
- deployment, rollout, monitoring and rollback (`release-engineering`)
- documentation, support handover and meetings
- waiting: other teams, approvals, vendors, environments

If a piece can't be broken down because nobody knows how to do it, mark it as an unknown, not as a number.

## 3. Estimate each piece as a range

- Give a best case and a realistic worst case, not one number. A wide range on a piece is information: it says where the risk is.
- Anchor on evidence: how long similar work took in this code (git history, past tickets) beats a feeling. Say which comparison you used.
- Know the usual error: the real time is more often well over the typical guess than under it. If the plan has no slack, it has no margin for the first surprise.
- Count unknowns separately. For each, say what would resolve it and how long that takes: a spike of one or two days to try the risky part, a question to ask, a vendor to confirm. Do the spikes first because they shrink the range fastest.
- Don't multiply a number by a magic factor. Add explicit buffers for named risks instead.

## 4. Roll up and state confidence

Add the best cases and the worst cases, then give the range with a confidence in words and the three things most likely to move it. Don't add up many worst cases and call that a promise, and don't hide behind a very wide range: say where you'd bet. Convert effort to calendar time using the real availability from step 1, and mark any waits on others.

If a team uses points or t-shirt sizes, use them for relative size only and convert to time from the team's actual past throughput, never from a fixed hours-per-point rule.

## 5. When the date is already set

Don't just say yes or no. Show what fits: the work in order of value, which part fits before the date at the realistic range, and what must move. Offer the options in the open: cut scope, move the date, add people only where work can be split (new people slow the first weeks), or accept a stated risk. Say what the earliest date is that you'd commit to and what you'd tell the stakeholder today.

## 6. Keep it honest

Record the estimate, its assumptions and the date it was made. Check it at milestones and update as soon as an assumption fails, telling stakeholders early with the new range. After the work, compare the estimate to the actual and note why it differed; that history is the best input for the next one (`skill-capture`).

Report: what was estimated and what "done" means, the breakdown with ranges, the unknowns and the plan to resolve them, the rolled-up range and confidence, the assumptions, and the options if the date is fixed.
