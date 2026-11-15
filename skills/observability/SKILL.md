---
name: observability
description: Makes a running system easy to understand and alert on, with logs, metrics, traces, dashboards and alerts. Use for adding logging or monitoring, finding out about problems from customers, noisy or missing alerts, SLOs, error budgets and tracing. Starts from the questions asked during an outage and ties every alert to an action. Skip for debugging one known bug (bug-investigation) and a live outage (incident-response).
---

# Observability

The goal is to answer, quickly and without redeploying: is it working, for whom, what changed, and where is the time or the error. More data does not help if nobody can find the answer in it.

## 1. Start from the questions

Look at the code, config and any existing dashboards first. Then settle, in a few lines:
- What the service does that matters to a user (the two or three journeys that must not fail).
- What "working" means as a number: success rate, latency (p95 or p99, not the average), freshness of data, queue age.
- How the team finds out today when it's broken, and how long that takes.
- Where telemetry can go (existing stack, budget, retention). Use what they have before adding a tool.

## 2. Pick the signals

- **Metrics for "is it healthy".** For anything that serves requests: rate, errors and duration per route or operation. For jobs and queues: throughput, failures, oldest item age. For resources: saturation (CPU, memory, connections, disk). Add a business metric for each key journey, such as orders placed. Keep label values few and bounded; a user ID or URL with an ID in it as a label will blow up cost and slow the system.
- **Logs for "what happened".** Structured (JSON or key-value), one event per line, with a level, a timestamp, the service name, a request or trace ID, and the relevant IDs. Log decisions and failures with their cause, not every step. Errors get the stack and the input shape, not the input.
- **Traces for "where did the time go".** Propagate one trace ID across services, queues and background jobs, and span the slow calls: database, outbound HTTP, cache. Sample to control cost, but keep every error and slow trace.
- **Health checks** that tell a load balancer if the instance can serve, separate from a deeper check that tells a person if dependencies are fine.

## 3. Keep it safe and affordable

Never log secrets, tokens, passwords, full card numbers or personal data; mask or drop them at the logging layer, and check with `security-review` if unsure. Set retention and sampling so the bill and the log volume don't surprise anyone. Debug logging should be switchable at runtime for one component, not a redeploy.

## 4. Alerts that someone acts on

Alert on symptoms users feel (error rate, latency, a journey failing, a queue not draining), not on every cause (one pod's CPU). For each alert write down: what it means, who is paged, the first thing to check and a link to the dashboard or runbook (`plain-writing`). Rules that keep it quiet:
- Alert when a threshold is held for a window, or on how fast an error budget is burning, not on a single blip.
- Page only if a person must act now. Everything else is a ticket or a dashboard.
- Review every page that needed no action and fix or delete that alert.

If the team wants targets, set an SLO per key journey (for example 99.9 percent of checkouts succeed over 30 days), alert on budget burn and use the remaining budget in release decisions (`release-engineering`).

## 5. Prove it works

Break something on purpose in a safe place (stop a dependency, return errors from a route, fill a queue) and check that the metric moves, the alert fires, the right person is told, and the logs and trace lead to the cause in a few minutes. An alert that has never fired is a guess. Add one dashboard per service with the key journeys on top and the cause-finding panels below.

Report: the questions it answers, signals added with their names and labels, the alerts with owner and first action, what is deliberately not logged, the cost and retention settings, and the test that proved it.
