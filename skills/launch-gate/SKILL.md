---
name: launch-gate
description: Runs a go or no-go check before a first public release or big launch and gives a verdict with named owners for open items. Use for are we ready to launch, go-live checklists, pre-launch reviews and what could go wrong on launch day. Checks a real payment, a restored backup, alerts, rollback and on-call. Skip for routine releases (release-engineering) and live outages (incident-response).
---

# Launch Gate

A first launch fails in the same few ways: the money path was only tested with fakes, nobody has restored a backup, nobody hears about the outage, and rollback was never tried. This skill turns "I think we're ready" into a verdict backed by things someone actually did. A check counts only if it was done and seen, not if it was planned.

## 1. Fix the launch in four lines

- What goes live, to whom (everyone, a waitlist, 5% of users) and when.
- What happens if it goes badly: who is hurt, and how much (money, data, reputation).
- Who decides go or no-go, and who is reachable for the first 24 hours.
- The date is fixed by whom, and what is the cost of slipping a day.

If the decider or the on-call person is missing, that is the first open item.

## 2. Run the gate

Mark each line **Done and seen**, **Open (owner, time needed)** or **Not applicable (why)**. Do not mark Done from memory; ask for the evidence (a link, a screenshot, a log line, a date).

**Money and accounts**
1. A real signup, a real payment and a real refund have run end to end in production or an identical environment. Test mode alone does not count for the final pass. Spending real money needs the user's named yes (see `payments-integration`).
2. Emails that users must get (verify, receipt, reset) arrive in a real inbox, not spam.
3. Terms, privacy policy and any required consent are published and linked.

**Data**
4. A backup exists, and someone restored it into a clean place and read real rows from it.
5. Migrations ran on a copy of production-sized data (`schema-changes`), and the launch needs no manual database edit.

**Seeing and responding**
6. An alert fires to a person on a test failure, and that person acknowledged it (`observability`).
7. Errors and a basic health check can be seen without logging into a server.
8. A named person is on call for the first 24 hours, with a way to reach them and the decider.

**Rolling back**
9. Rollback or a kill switch was tried once and took under five minutes; the steps are written down (`release-engineering`).
10. The launch can be turned off for new users without breaking existing ones.

**Load and abuse**
11. A smoke test of the main journeys passed against the live address (`browser-verify`), and a rough load test or capacity estimate covers the expected first-hour traffic with room to spare.
12. Rate limits or limits on signups exist, secrets are not in the repo, and no test or admin account has a default password (`security-review`).

**People**
13. Support knows the launch time, has a place to receive reports and has three prepared answers for the likeliest questions.
14. Nobody is launching tired late on a Friday without a reason; if it must be, the first-hour staffing is explicit.

Add lines for anything particular to this product (an app store review, a legal sign-off, a partner's date).

## 3. Give the verdict

- **Go:** every line is Done or Not applicable with a reason.
- **Go with conditions:** open lines are small, each has an owner and a time, and none is in money, data or rollback. Say what is accepted and by whom.
- **No-go:** any open line in money (1), data (4) or rollback (9), or no one on call. State the smallest change that turns it into a go and how long it takes.

Show the table, the verdict in one sentence, and the list of open items with owners. Do not soften a no-go because the date is fixed; say what slipping costs and what a smaller launch (waitlist, 5%, a single region) would allow instead.

## 4. After the go

Plan the first hour: who watches which dashboard, the numbers that mean stop (error rate, failed payments, signup drop), and when to widen the audience. Write down the decision and the accepted risks so the postmortem can compare.
