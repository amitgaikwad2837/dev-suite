Stop the harm first, understand the cause second. Here is what I'd do, in order.

## Right now (first five minutes)

**State of play, as I understand it:**
- Users see: the payments page timing out for about 30% of them, for 20 minutes so far.
- What changed: unknown. The provider status page says "degraded", which is a strong lead but not yet proof.
- Who leads: one person (you, or whoever you name) decides and everyone else reports to them.
- Updates: Slack, every 10 minutes, to the CEO.

**Quick questions to answer (2 minutes):**
1. Did anything of ours change in the last hour: a deploy, config or flag change, expiring cert or key, traffic spike? If yes, that is the first rollback candidate, even with the vendor degraded.
2. Do our logs and traces show the timeouts happening on calls to the provider (latency or errors on their API), or somewhere else (our DB, queue, load balancer)? This tells you whether it is the vendor or us.
3. Is the 30% a pattern? For example one region, one payment method, one provider endpoint or one app version. A pattern points to a specific route to fail around.

**Start a timeline now.** One line per entry: time, what was seen or done, by whom. For example "14:02 payments timeouts reported ~30%; 14:05 provider status says degraded". You will need it for the review.

## Stop the harm: options, smallest and most reversible first

1. **Roll back or turn off the flag**, if question 1 turned up a recent change of ours. Cheapest and most reversible.
2. **Reduce what the slow dependency costs us.** If the provider is slow and our calls hang, the timeouts are partly self-inflicted. Candidates:
   - Lower our timeout on the provider call and fail fast with a clear "try again" message, so users don't sit on a spinner.
   - Retry once with backoff, but only for idempotent calls. Use idempotency keys so a retry cannot double-charge.
   - Shed load or add capacity if our workers are piling up waiting on the provider.
3. **Fail over or degrade deliberately.** If you have a second provider or payment method, route to it. If not, show a "payments are slow, we're working on it" banner, or queue the order for later confirmation.
4. **Fix forward** only if a rollback is impossible, or the fix is trivial and well understood. It is not that here.

My suggested first step: check for a recent change of ours (quick), then propose the timeout and fail-fast change or the failover, whichever your setup supports.

**I will not touch production on my own.** For each step I'll show you the exact action, what it affects, and how to undo it, and wait for your clear yes. I won't restart services, delete anything or change data without that. I'd also make one change at a time and check the effect before the next. Three changes at once would ruin the evidence on what actually helped.

Two other things to do now, in parallel and with no risk:
- **Open a ticket with the provider** and check their status page for the affected components, incident ID and ETA. Subscribe to updates. Ask your account contact whether others are seeing the same.
- **Watch the money, not just the page.** Check for failed or "pending" payments and double-charge risk, and have support ready with a holding line for customers.

## Slack updates every 10 minutes

Post on schedule even if nothing has changed. A short, fixed format works best because the CEO is reading it cold:

> **Payments incident, update 1 (14:10)**
> **Impact:** about 30% of users see timeouts on the payments page. Started around 13:50. Ongoing.
> **What we know:** our payment provider reports "degraded" status. We are confirming whether the slowness is on their side, ours, or both.
> **What we're doing:** checking for any recent changes on our side and preparing to fail fast / route around the slow calls. Provider ticket opened.
> **Next update:** 14:20.

Rules for these updates:
- Only state what is confirmed. "The provider says degraded" is a fact. "The provider is the cause" is a guess until the logs back it up. Don't promise an ETA that you don't have; say "no ETA yet, next update 14:20".
- No blame, and no speculation written as fact.
- Name one person as the sender so updates don't conflict.
- Ten minutes is demanding. Ask the CEO if a 15 to 30 minute rhythm plus an immediate message on any big change would do. Otherwise, give one person the job of writing updates so the people fixing it aren't interrupted every 10 minutes.

## While it's contained: find the cause

Once users are no longer being hurt, or while waiting on the provider, test the hypothesis against evidence: provider call latency and error rate over time, whether the start time lines up with their degradation, and a diff of what changed on our side. Save the logs, queries and graphs into the incident folder before they roll off.

## Closing it

Declare it over only when timeout rates are back to normal and stay there for a period you name (for example 30 minutes). Say what remains risky, such as a lowered timeout, a banner or a failover that is still in place.

## After (within a few days)

A blame-free review written from the timeline: impact and the detection gap (did monitoring tell you, or did users?), the cause as a chain, what went well and what was luck, and actions with an owner, a due date and a way to check they worked. Likely candidates: a circuit breaker and sane timeouts on the provider call, a fallback provider or degraded mode, and an alert on payment success rate so you hear it from a graph before 20 minutes pass.

## What I need from you now

1. Any recent deploys, flags or config changes in the last few hours?
2. Do the logs show the timeouts on the provider call?
3. Do you have a second provider or fallback path?
4. Who is leading, and who is writing the Slack updates?

Send me those and I'll write the first update and the exact first mitigation step for your yes.
