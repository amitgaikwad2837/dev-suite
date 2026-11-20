With 6 developers, keep both lightweight. Start with the runbook, then write ADRs for the decisions already in your code, and only after that for new ones.

## Where to start

**Week 1: runbook first.** A payments service gets paged at 3am, and an incident is where a missing runbook costs you most. Don't try to document everything. Write the 5 to 8 situations that have already hurt you, or that you fear most.

**Week 2 onward: ADRs for decisions already made.** Pick the 5 to 10 choices that a new hire would ask "why on earth did we do it this way?" about. You are reconstructing history, so write each one short and mark it "Status: Accepted (recorded retroactively)". After that, write an ADR before making any new hard-to-reverse decision.

**Habit:** make "does this need an ADR or a runbook update?" a checkbox in your PR template. Without a habit like this, both documents go stale within a quarter.

## ADRs

**Where they live:** in the payments repo, at `docs/adr/0001-title.md`, numbered and never renumbered. Because they sit in the repo, they go through PR review like code.

**Template (Michael Nygard style, about one page):**

```
# 0007. Use idempotency keys on all payment-provider calls

Date: 2026-11-20
Status: Proposed | Accepted | Superseded by 0012
Deciders: names

## Context
The forces at play: what problem, what constraints (PCI scope, provider limits, team size, deadlines).

## Decision
What we are doing, in one or two plain sentences. "We will..."

## Alternatives considered
Each one in one or two lines, and why it lost.

## Consequences
What gets easier, what gets harder, what we now have to live with or revisit.
```

**Rules that matter:**
- One decision per ADR. The "alternatives" and "consequences" sections are the valuable part, so don't skip them.
- ADRs are immutable once accepted. If you change your mind, write a new ADR that supersedes the old one and update the old one's status line only.
- Aim for 15 minutes to write. If it takes longer, the decision probably isn't settled yet.
- Don't write ADRs for small or easily reversed choices (library for date formatting, naming).

**Good first ADR candidates for a payments service:**
1. Which payment provider(s) and why
2. How you guarantee idempotency and avoid double charges
3. Sync vs. async payment confirmation (webhooks, polling, queue)
4. Data model for money (integer minor units, currency handling, ledger vs. mutable balance)
5. What card or PII data you store, and how you keep PCI scope small (tokenization)
6. Retry and failure-handling strategy, including reconciliation with the provider
7. Database and consistency choices (transactions, outbox pattern)
8. How secrets and keys are managed and rotated

## Runbook

**Where it lives:** `docs/runbook/` in the repo, or wherever on-call will look first at 3am (linked from the alert). One file per scenario, plus a short index.

**Start with a one-page index:**
- What the service does and what depends on it (upstream and downstream)
- Dashboards, log queries and alert links
- Who is on call, how to escalate, and who can talk to the payment provider
- How to deploy, roll back and flip any kill-switch or feature flag
- Provider status page and support contacts

**Per-scenario template:**

```
# Alert/Scenario: Payment provider returning 5xx / timeouts

Severity & impact: who is affected, and how badly
How you'll know: the alert name, the dashboard, the symptom
Check first (2 to 5 minutes): exact commands or queries, with expected output
Fix / mitigate: numbered steps, copy-pasteable commands; the safest option first
Rollback / abort: how to undo what you just did
Escalate if: not resolved in N minutes, or any sign of money being wrongly moved
After: what to record, who to notify, link to the postmortem template
```

**First scenarios to write:**
1. Provider outage or elevated error rate
2. Webhooks not arriving or failing signature checks
3. Suspected duplicate charges or a stuck payment (and how to refund or reconcile safely)
4. Queue backlog or delayed settlement
5. Database failover or connection exhaustion
6. Bad deploy: rollback
7. Reconciliation mismatch with the provider's report
8. Expired or compromised API keys: rotation

**Make it trustworthy:**
- Every command must be copy-pasteable and tested. Put "last verified: date" at the top of each page.
- Have someone who didn't write a page follow it, ideally in staging. Do this once, and you will find the gaps.
- After every incident or page, update the runbook as part of closing it out. That is how it grows to fit your real failures.
- Never put secrets in it. Link to your secret store.

## A practical plan for 6 people

- Pick one person as the owner of each doc set to keep it moving. This is a role for steering, not for writing everything.
- Spend one hour in a team session listing the incident scenarios and the 10 key decisions. That gives you your backlog.
- Split the writing: each developer takes one or two items per week, so you have a useful first version in 3 to 4 weeks.
- Review the docs in PRs the same as code, and revisit the runbook quarterly.

If you want, tell me your stack (cloud, provider, language, how you deploy and alert). I can draft the index page, the first few ADRs, or the top runbook scenarios with real commands for your setup.
