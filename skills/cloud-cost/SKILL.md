---
name: cloud-cost
description: Finds why a cloud bill is high or jumped and cuts it safely. Use for rising AWS, Azure or GCP bills, idle or oversized resources, NAT and egress costs, savings plans or reserved instances, budgets and cost estimates. Skip for making code faster (performance-work) and writing the infrastructure code (infrastructure-as-code).
---

# Cloud Cost

Cloud bills grow in a few places, not everywhere. So do not start by cutting things that look unused or by buying a discount plan. Start by finding where the money goes and what changed, then take the safe savings, then the risky ones with a named owner's yes. A saving that causes an outage or loses data costs more than it saves.

## 1. Look at the bill before anything else

- Break the cost down by service, account or project, region, environment and tag, for the last three to six months. Find the two or three lines that make most of the total and the ones that grew.
- For a jump, compare week by week and find the day it started, then match it to a deploy, a new customer, a new feature, a log level change or a data load.
- Ask what the business expects to pay: cost per customer, per order or per request is a better target than a total. Say what share of revenue it is.
- If you cannot tell who owns a resource, that is a finding. Tag by owner, environment and purpose from now on, and untagged spend gets its own line in the report.

Use read-only access and the billing tools to do this. Do not change anything yet.

## 2. Safe savings first

These rarely hurt anyone. Still confirm each before acting.

- **Non-production off-hours:** stop dev and test environments at night and weekends.
- **Idle and orphaned items:** unattached disks, old snapshots, unused addresses and load balancers, empty clusters. Check what depends on each first.
- **Logs and storage:** a retention period on logs, a sensible log level in production, lifecycle rules that move old objects to cheaper storage and delete the truly temporary ones, and old backups that are past their retention.
- **Data transfer:** traffic through a NAT gateway to the provider's own storage can use a private endpoint instead, keep chatty services in the same zone and region, and serve public files through a CDN.
- **Right-size:** compare the size of instances and databases with real peak use over a few weeks, and step down one size at a time.

## 3. Commitments only after usage is steady

Discount plans (savings plans, reserved instances, committed use) save money only if you keep using what you committed to. Right-size and clean up first, then commit to the steady baseline, usually for one year and flexible types first. Leave out workloads that may move or shrink. A multi-year, paid-upfront commitment on everything is a bet on the business staying the same; do not make it without the owner's explicit yes. Use spot or preemptible capacity only for work that can be interrupted.

## 4. Never trade reliability for a number

Do not turn off backups, replicas, monitoring or security logging to hit a target. Shorten retention, lower the level or sample instead, and keep what an audit or a recovery needs. Before deleting anything, find its owner, take a snapshot, prefer stopping to deleting for a while, and get a named yes for anything that holds data. Test a smaller size in non-production first.

## 5. Keep it from coming back

- Budgets with alerts at set percentages, sent to a person who can act.
- Anomaly detection on daily spend by service.
- Required tags enforced in the infrastructure code (`infrastructure-as-code`), and a monthly review of the top lines with an owner each.
- A cost estimate in the review of any large new design (`design-decision`), and a cost line in the launch checklist (`launch-gate`).

## 6. Say what is realistic

Give a range with the effort and risk of each step, the saving per month and how sure you are. A target such as "cut 50 percent by Friday" is rarely met safely; say what is achievable by then and what needs more time. Report what you measured, what you assumed, what you did not touch and what needs the user's yes.
