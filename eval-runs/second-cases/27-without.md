That's a serious situation: 90% ignored pages plus a missed real outage means the pager has stopped working as a safety mechanism. The fix isn't tuning 140 alerts one by one. It's changing what is allowed to page a human. Here is how I'd approach it, and what I need from you to start.

## What I would do

**1. Get the data (first, before changing anything)**
I'd export the last 30-90 days of alert history from your tool (Prometheus/Alertmanager, Datadog, CloudWatch, PagerDuty, etc.) and compute per alert:
- times fired, times paged, times acknowledged vs auto-resolved
- median time to resolve, and whether anyone took an action
- the share that led to a real fix

I'd also do a short post-mortem on the missed outage: why that alert was buried (routing, severity, same channel as noise?) and what signal would have caught it earlier. That alert becomes the first thing we protect.

**2. Classify every alert into one of four buckets**
- **Page**: user-visible impact now or imminent, and a human must act within minutes. Expect this to be perhaps 10-20 alerts, not 140.
- **Ticket**: needs action, but within a day (disk 80%, cert expiring in 14 days, slow-burn error budget).
- **Dashboard/log only**: useful context, never interrupts anyone (CPU high, single pod restart, queue depth with no impact).
- **Delete**: never actioned, duplicates another alert, or has no clear owner or action.

Test for a page: "Is a customer hurt or about to be, and does the responder know what to do?" If either answer is no, it doesn't page.

**3. Move from cause-based to symptom-based paging**
Replace most resource and component alerts (CPU, memory, pod down) with a few alerts on what users feel: error rate, latency, availability, and key business flows (checkout, login). Use SLOs with multi-window burn-rate alerts (for example 2% budget in 1h pages; 5% in 6h creates a ticket). This catches real outages faster and fires far less on harmless blips.

**4. Cut noise mechanically**
- Add `for:` durations / sustained-condition windows so transient spikes don't page.
- Group and deduplicate: one incident should produce one page, not 15 (Alertmanager grouping, PagerDuty event rules, dependency-based inhibition so a down database doesn't also page every service that uses it).
- Route by severity: pages to the pager, tickets to a queue, info to a channel. Real pages should look different from everything else.
- Every paging alert gets an owner, a runbook link, and a "what to do first" line. No runbook, no page.

**5. Keep it fixed**
- Weekly 30-minute alert review for the first month: every page that was ignored or had no action gets demoted or deleted.
- Track metrics: pages per on-call shift, % actionable (target above 80-90%), time to ack, pages outside business hours.
- Add a rule: a new alert must declare its bucket, owner, runbook and the action it triggers; any alert that pages and isn't actioned twice gets reviewed.
- Set a budget, e.g. no more than 2 pages per on-call shift on average.

**6. Roll out safely**
Don't delete in one go. Demote first (page to ticket or dashboard), watch for two weeks, then delete. Keep the buried-outage scenario as a test: confirm the new alerting would have paged on it, clearly and early. Do the changes in version-controlled config (alert rules as code) so they're reviewable and reversible.

## What I need from you
1. Which monitoring and paging stack do you use, and where do the alert definitions live (repo, UI)? If they're in a repo, point me at it and I can start the audit directly.
2. Can you export alert/page history (or give me access) for the last 1-3 months?
3. What was the missed outage (service, symptom, which alert should have caught it)?
4. Do you have SLOs or agreed user-facing targets, or should we propose them?
5. Team size and on-call rotation, so I can size a sensible page budget.

If you give me the repo or an export, my first deliverable would be a spreadsheet of all 140 alerts with fire counts, ack rates and a proposed bucket, plus a first-pass list of alerts to delete or demote, and a draft of the 10-20 symptom-based paging alerts to replace them.
