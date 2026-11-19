---
name: performance-work
description: Makes slow software faster by measuring, finding the real bottleneck and proving the gain. Use for slow endpoints or queries, high CPU, memory leaks, latency, load capacity and profiling. Sets a target, takes a baseline and fixes the biggest cost first. Skip for slow web pages in the browser (web-quality) and tiny scripts that run once.
---

# Performance Work

Most slow code is slow in one or two places, and they are rarely the ones people suspect. The work is: measure, find, fix the largest cost, measure again.

## 1. Pin down "slow"

Get these in a few lines, asking only for what you cannot find:
- What is slow (a request, a job, a page, a query, startup), and for whom.
- The number today and the number that would be good enough, with the unit (p95 latency, requests per second, memory, cost).
- When it got slow: always, since a change, or only under load. If since a change, diff that change first.

If there is no target, propose one and get a yes. Without it the work has no end.

## 2. Make it measurable

Build a repeatable measurement before any fix: the same input, the same data size, the same machine, run several times, reporting the median and the worst case. Use data shaped like production, since small test data hides most problems. Record the baseline in a file. Don't load-test production or shared systems without an explicit yes; use a copy or a safe window.

## 3. Find where the time goes

Profile, don't guess. Use the tool for the layer: a CPU or flame-graph profiler, a memory profiler, query plans (`EXPLAIN ANALYZE`), tracing across services, or timing around suspected calls. Write down the top few costs as a share of the total. Typical culprits, to check not assume:
- repeated queries in a loop (N+1), missing or unused indexes, fetching more rows or columns than needed
- work repeated that could be cached or batched, and chatty calls between services
- blocking calls on a hot path, lock contention, too small or too large pools
- large objects copied, parsed or serialized again and again, unbounded growth in memory

## 4. Fix the biggest cost first

One change at a time, so you know what helped. Prefer the change that removes work over the one that does the same work faster. Then:
- Re-run the same measurement and compare with the baseline.
- Keep the change only if it moves the number enough to matter. A 3 percent gain that adds complexity is not worth keeping.
- Run the tests (`test-strategy`). A faster wrong answer is a bug. If a fix changes behaviour, such as stale cache data or looser consistency, say so and get a decision (`design-decision`).
- An index or a schema change on a live table goes through `schema-changes`.

Stop when the target is met. Don't keep optimizing.

## 5. Keep it fast

Add a guard: a benchmark or a threshold check in CI, or a dashboard and an alert on the metric. Note the cause and the fix in the commit or PR so the next person doesn't undo it.

Report: baseline, target, what the profile showed, each change with its before and after, what was left alone, and the guard added.

## Related skills

- `cloud-cost`: when the problem is the bill, not the speed
- `web-quality`: slow pages in the browser
