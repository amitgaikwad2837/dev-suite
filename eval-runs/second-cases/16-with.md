With six developers, keep both documents small, put them in the repo, and start with the runbook. Here is the order I'd work in and what each document should look like.

## Where to start

1. **Runbook first, ADRs second.** A missing runbook costs you at 3 a.m. during a payments incident. A missing ADR costs you a repeated argument. Write the first runbook entries this week and fill in ADRs over the following weeks.
2. **Start from what exists, not a blank page.** I'd begin by listing what already runs in production: the alerts that fire, the routine operations (deploys, rollbacks, refunds and reconciliation, key rotation, provider outages), and the last few incidents. Each alert and each routine operation gets one runbook entry. Past incidents tell you which entries matter most.
3. **Backfill ADRs only for decisions that are hard to reverse and that people keep asking about.** Examples: the payment provider, idempotency and retry design, how you store card or customer data, sync vs. async processing, the database and ledger model, and how you handle webhooks. Aim for 5 to 8 records to begin with, not a full history. After that, write a new one whenever a hard-to-reverse choice is made.
4. **Keep both in the repository** (for example `docs/adr/` and `docs/runbooks/`), reviewed in the same pull request as the code. Add a "docs updated?" line to the PR template.

## What an ADR should look like

One short page per decision, numbered and dated (`0001-use-provider-x-for-card-payments.md`). Use this template:

- **Title and status:** proposed, accepted, superseded by ADR-00NN.
- **Date and who decided.**
- **Context:** the problem and the constraints at the time (compliance, volume, team size).
- **Decision:** one or two sentences, stated plainly.
- **Options rejected:** each with the reason it lost.
- **Consequences:** what gets easier, what gets harder, and what you now have to live with.

Keep it to one page. Don't rewrite an old record when the decision changes. Write a new ADR and mark the old one superseded. For backfilled decisions, say so ("recorded retrospectively; reasoning reconstructed from X"), and don't invent rationale you can't verify. If you are still choosing between options, `design-decision` covers how to make the choice before you record it.

## What a runbook should look like

One entry per alert or routine operation. It must work for someone who is half asleep and did not write it. Each entry has:

- **Trigger:** the alert name or situation, and its impact in plain terms (for example "payments failing, customers cannot check out").
- **First checks:** the dashboards or queries to look at first, in order.
- **Exact commands:** paste-ready, with the expected output and what to do if the output differs.
- **Confirm it worked:** the specific metric or check that tells you the problem is fixed.
- **Roll back:** how to undo the change you just made.
- **Who to call:** the on-call rotation, the escalation path, and the payment provider's support contact.
- **Owner and last-verified date.**

For payments specifically, I'd expect the first entries to cover: provider outage or elevated error rate, failed or stuck webhooks, duplicate-charge or idempotency problems, reconciliation mismatches, a bad deploy and its rollback, and credential or key rotation. Also include a short section on when to stop and escalate to finance, security or legal. Don't improvise on a suspected data exposure.

Then test it. Have a teammate who did not write an entry follow it once in staging, and fix every place they get stuck. Re-verify after each real incident.

## Keeping them true with six people

- Give each document an owner (a person or a rotation is fine) and a last-verified date.
- After every incident, update the relevant runbook entry as part of the follow-up, and write an ADR if the incident led to a design change.
- Check on each change: which behaviour changed, which runbook or ADR describes it, and has it been updated?
- Prune occasionally. A few correct pages beat many half-wrong ones.

## Suggested first two weeks

- Day 1: agree on the folders, the ADR template and the runbook template (an hour of work).
- Days 2 to 5: write runbook entries for the top 3 to 4 alerts or operations, and have a teammate follow one.
- Week 2: write 3 to 5 ADRs for the biggest existing decisions, then set a rule that new hard-to-reverse choices get an ADR.

## What I'd need from you, or could not verify from here

I haven't looked at your repo, alerts, or incident history, so I can't say which entries or decisions matter most. If you give me the list of alerts and the main architectural choices, or point me at the repo, I can draft the templates and the first runbook entries and ADRs for you to correct. I'd treat anything about why a past decision was made as something your team confirms, not something I infer.
