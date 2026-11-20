The fix is to cut pages down to the few alerts a person must act on now, and to make sure the one that matters can't get buried again. Ninety percent ignored means the pager has become noise, which is how last month's outage slipped through. Adding more alerts won't help. Fewer, better ones will.

I can't run commands or touch files in this session, so here is what I would do, and what I need from you to start.

**What I'd look at first (step 1: questions before rules)**
- The alert definitions themselves (Prometheus rules, CloudWatch, Datadog monitors, Grafana or whatever you use), plus the last 30 to 90 days of page history from your pager tool (PagerDuty, Opsgenie).
- The postmortem or timeline from last month's missed outage: which alert should have fired, when it fired, and what it was buried under.
- The two or three user journeys that must not fail (for example login, checkout, API requests), and what "working" means for each as a number: success rate, p95 latency, queue age.
- Where telemetry lives today. I'd reuse your existing stack and add no new tool.

**Triage of the 140 alerts (the main work)**
Using the page history, I'd rank every alert by pages fired and by how often it led to action. Then each one goes in a bucket:
1. **Keep as a page.** It is a symptom users feel (error rate, latency, a journey failing, a queue not draining), a person must act now, and there is a first step to take.
2. **Downgrade to a ticket or dashboard.** It is real but can wait until morning (disk at 80%, one pod's CPU, a single retry).
3. **Delete or merge.** It never needed action, duplicates another alert, or is a cause-level alert that the symptom alert already covers.
4. **Fix.** It is a good signal with bad tuning. The usual fixes are to require the condition to hold for a window (say 5 to 10 minutes) instead of firing on one blip, and to move thresholds from static numbers to error-budget burn rate.

I expect the 60 pages a week to come from a small number of alerts. The top 10 or so by volume usually account for most of it, so the first pass is quick.

**Making sure the real outage can't be buried**
- Set an SLO for each key journey, for example 99.9% of checkouts succeed over 30 days, and page on fast and slow budget burn. That replaces many cause-level alerts with a few that match user pain.
- Give pages and tickets separate channels and severities, so a critical page never sits in the same stream as warnings.
- Every remaining page gets four lines: what it means, who is paged, the first thing to check, and a link to the dashboard or runbook.
- Also check the reverse problem: whether a total silence or dead-man's-switch alert exists, so missing data pages someone instead of looking healthy.

**Proving it works (step 5)**
In a safe environment I'd break things on purpose (stop a dependency, return errors from a route, fill a queue). I would check that the metric moves, the alert fires, the right person is paged, and the logs and trace point to the cause within a few minutes. I'd replay last month's outage against the new rules and confirm it pages within the target time. An alert that has never fired is a guess.

**Ongoing habit**
Hold a weekly 15-minute review of every page that needed no action, and fix or delete that alert. Aim for fewer than about 5 to 10 pages per on-call week, nearly all of them actionable. Track the share of pages that led to action as the key number.

**What I'll hand back**
- The questions the alerting now answers
- A table of all 140 alerts with the decision and reason for each
- The final page list, with owner, first action and link for each
- The SLOs and burn-rate rules
- What I deliberately did not alert on
- The test results, including the replay of the missed outage

**What I need from you**
1. Where the alert rules live (repo path or tool) and an export of the last 30 to 90 days of pages.
2. The monitoring and paging tools you use.
3. A short description, or the postmortem, of the missed outage.
4. Your top journeys, and whether you'd like SLOs or prefer to keep to simple thresholds for now.
5. Whether I can change rules in code, or should only propose changes for you to apply.

One question matters most: should I treat the pager as the only urgent channel, or do you also use Slack or email for urgent alerts? That decides how I split pages from tickets. Send the export and I'll start with the top-volume alerts.
