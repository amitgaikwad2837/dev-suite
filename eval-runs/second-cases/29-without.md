I'd push back on the plan before spending money on it. Three queries per account across 300 accounts is about 900 queries per page load. That is a classic N+1 pattern, and a cache plus a bigger server is likely to hide it rather than fix it.

Why the plan is risky:
- A cache only helps on a hit. The first load after a deploy, an expiry or an invalidation still takes 14 seconds. Reports are often filtered or parameterised, so hit rates can be low.
- You also take on invalidation bugs and stale numbers on a reports page, where wrong data is worse than slow data.
- A bigger server mostly speeds up CPU. If the time is spent on 900 database round trips, it will barely help, and it adds cost.

What I would do instead:

1. Measure first. I would pick a target of under 2 seconds at p95 and record a baseline. Then I would profile the /reports request. I would turn on query logging or use the ORM's query counter or APM trace to confirm the count, the time per query, and how much goes to the DB, the app code and serialisation. My guess is about 900 queries at roughly 15 ms each, which is around 13 seconds. That would match your number, but I'd verify it before changing anything.

2. Fix the query pattern, since that is the biggest cost. I would replace the per-account loop with set-based queries:
   - Use eager loading or joins, for example `select_related`/`prefetch_related`, `includes`/`joins`, or `JOIN`s with `GROUP BY` for the aggregates.
   - Otherwise batch with `WHERE account_id IN (...)`, one query for each of the three data sets, and then group the results in memory.
   - That takes it from about 900 queries to 3 to 5. It will probably land well under 2 seconds with no cache at all.
   - I would check that the indexes cover the foreign keys and filters, using EXPLAIN on the new queries.

3. Prove it and keep it correct. I would compare the old and new output on the same data to confirm it is identical, since correctness must not change silently. Then I would re-measure against the baseline.

4. Add a regression guard, such as a test that asserts the query count for the endpoint (for example, no more than 5 queries for 300 accounts). That stops the N+1 coming back.

5. Only then consider a cache, and only if the numbers still miss the target. If you do, cache the aggregated result with a short TTL and a clear invalidation rule. Consider a bigger server only if profiling shows CPU or memory is really the limit.

To get started I need access to the repo and a way to run the page locally or against staging. If you can point me to the /reports handler or paste the code, I'll find the loop and show you the exact query count before and after.
