---
name: incident-response
description: Guides the handling of a live production incident and the review afterwards. Use when the user says "production is down", "we have an outage", "users are seeing errors", "site is slow right now", "something broke after the deploy", "we got paged", "write the postmortem", "incident review" or "what went wrong last night". Puts stopping the harm before finding the cause, keeps a timeline and status updates, proposes the least risky mitigation and waits for a yes before touching production, then writes a blame-free review with follow-up actions. Skip for bugs that are not hurting users now (bug-investigation).
---

# Incident Response

During an incident the goal is to stop the harm, not to be right about the cause. Understanding comes afterwards, with the system calm and the evidence kept.

## 1. First five minutes

Ask or find out, and state back in four lines:
- What users see, since when, and how many are affected.
- What changed recently: a deploy, a config or flag change, a dependency, a traffic spike, an expiring certificate or credential.
- Who is working on it and who decides. One person leads and the others report to them.
- Where updates go (the incident channel or ticket).

Start a timeline file now. Every entry is a time, what was seen or done, and by whom.

## 2. Stop the harm first

Rank the options by how small and reversible they are, and propose the top one:
1. Roll back the recent change or turn off the flag.
2. Shed load, scale up, or fail over to a healthy copy.
3. Disable the failing feature or dependency.
4. Fix forward only when a rollback is impossible or the fix is trivial and understood.

Do not restart, delete, kill, force-push, or change data in production on your own. Show the exact action, what it affects and how to undo it, and wait for a clear yes for each step. If the person is pushing for a destructive shortcut, use `risky-shortcuts`. Take one step at a time and check the effect before the next; changing three things at once ruins the evidence.

## 3. Find the cause while it is contained

Once users are no longer hurt, work as in `bug-investigation`: form a hypothesis from the timeline, test it with logs, metrics and a diff of what changed, and record what was ruled out. Copy logs, queries and graphs into the incident folder before they roll off. Never guess the cause into the status update.

## 4. Communicate on a rhythm

Post a status at a fixed interval (for example every 30 minutes) even if nothing changed. Each update has four lines: impact, what we know, what we are doing, next update time. Write for people who will read it cold, in plain language (`plain-writing`), with no blame and no speculation stated as fact.

## 5. Close it

Declare the incident over only when the metrics are back to normal and stay so for a period you name. Say what remains risky (a temporary workaround, a disabled feature).

## 6. Review within a few days

Write the review from the timeline, blame-free, with the people closest to the event reading it before it is shared:
- Summary, impact (who, how long, how bad) and the detection gap (how long before anyone knew).
- Timeline.
- Cause, as a chain: the trigger and the conditions that let it cause harm. Ask why until a system or process answer appears, not a person.
- What went well and what was luck.
- Actions, each with an owner, a due date and how we will know it worked. Prefer fixes that make the failure impossible or loud over reminders to be careful. Add a test or alert with `test-strategy` and rollout changes with `release-engineering`.

Report: the current state, the last action taken, what needs a yes, and who needs to be told.
