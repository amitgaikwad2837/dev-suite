Treat this as a live incident now. Stop the harm first, find the cause second. Here is the order I would work in.

**1. Declare it and split roles (next 2 minutes)**
- Open an incident channel or thread. Name one incident lead (you, or whoever is most senior on call) who coordinates and doesn't debug.
- Name one person to write the Slack updates, so the person fixing things isn't also writing for the CEO. Name one person to keep a timeline.
- Start the timeline now: "T-20min: payments page timeouts begin, ~30% of users." Add every action with a timestamp.

**2. Confirm what is actually happening (5 minutes)**
- Don't assume it's the vendor just because their status page says "degraded". That page lags and is often vague. Check on our side:
  - Do the timeouts line up with calls to the payment provider? Look at the latency and error rate on outbound provider calls, and at your own p95/p99 on the payments endpoint.
  - Is the 30% random, or tied to a region, payment method, card type, provider endpoint, app version, or server instance? A partial failure usually points to one of these.
  - Did anything change in the last hour? Check deploys, config or feature-flag changes, certificate or DNS changes, and traffic spikes. If something shipped just before it started, roll it back first.
  - Check our connection pools, thread or worker saturation, and retry behavior. A slow vendor plus aggressive retries and long timeouts can use up your own capacity and turn a vendor problem into a bigger outage of your own.

**3. Mitigate. Cheapest and least risky first**
- If a deploy or change lines up, roll it back.
- If it's the vendor, options include:
  - Lower the timeout on provider calls and fail fast, so pages don't hang and workers aren't tied up.
  - Add a circuit breaker or turn off retries, so you stop piling load onto a degraded provider.
  - Fail over to a secondary provider or region if you have one already integrated.
  - Show a clear message and offer a retry or an alternative payment method instead of a spinner.
  - Queue the payment and confirm it afterward, if your business logic allows it safely.
- Before touching production, tell the group what you plan to do and what could go wrong, and get a yes from the lead. Prefer changes that can be undone quickly (flags, config) over code changes.
- Contact the provider's support or your account rep now. Give them your failure rate, timestamps, and request IDs. Ask if they have an ETA and whether there's a different endpoint or region you can use.

**4. Slack updates for the CEO, every 10 minutes (even if nothing has changed)**
Use the same short format each time:

> **Update HH:MM**
> **Impact:** About 30% of users see timeouts on the payments page. Started ~HH:MM.
> **Cause:** Under investigation / suspected provider degradation (provider status page shows "degraded"), not yet confirmed on our side.
> **Doing now:** (e.g. shortening timeouts, checking failover, in contact with provider)
> **Next update:** HH:MM

Rules for these:
- Say what you know, what you don't, and what you're doing. Don't guess at a cause or promise an ETA you can't back up.
- "No change, still working on X" is a valid update, and it's better than silence.
- Leave blame and technical detail out. Keep the working chatter in the incident channel and send only the summary to the CEO's channel.

**5. Also do these early**
- Tell support and customer-facing teams what's happening and give them a line to use with customers. Update your own status page or banner if you have one.
- Find out what the business impact is: failed payments per minute, revenue at risk. It helps with priorities and with the CEO's questions.
- Check whether failed attempts could cause double charges. Make sure payment calls are idempotent before you retry or fail over.

**6. Resolve and verify**
- Resolve only when error rates and latency are back to normal on your own dashboards, not just when the provider's status says "operational". Watch for 15-30 minutes.
- Send a final "resolved" message that says impact, duration, and what you did.
- Pick up any stuck or failed payments and reconcile them.

**7. Afterward**
- Within a few days, write a blameless postmortem: timeline, impact, what worked, what was slow, root cause, and follow-up actions with owners and dates.
- Likely follow-ups are timeouts and circuit breakers around the provider, a fallback provider or graceful degradation, alerts that tell you about provider latency before customers do (this one was 20 minutes in), and a standing template and cadence for executive updates.

If you want, tell me what you can see right now (error rates, which calls are slow, any recent deploys) and I'll help you decide which mitigation to try first and draft the first Slack update.
