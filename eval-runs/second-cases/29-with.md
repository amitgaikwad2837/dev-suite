Before adding a cache or a bigger server, I'd fix the query pattern. 300 accounts x 3 queries is about 900 queries per page load, which is a textbook N+1. That is very likely most of the 14 seconds, and neither a cache nor a bigger server removes it. A bigger server makes each query a bit faster. A cache hides the problem until the first load after expiry, and adds stale-data questions.

Here is what I would do, in order.

**1. Pin down the target**
- Current: 14 s. Goal: under 2 s. I'll treat that as p95 for the /reports page, on production-sized data.
- Quick questions: did it get slow after a change (if so I'd diff that first), or has it always been slow? Are the 3 queries per account the same 3 for each account (e.g. totals, recent activity, balance)?

**2. Baseline, before changing anything**
- I'd write a repeatable measurement: the same account set (300 accounts, production-shaped data on a copy or staging, not prod), 5+ runs, recording the median and worst case, saved in a file.
- I'd count queries per request (query log or the ORM's debug counter), expecting about 900.

**3. Profile, don't guess**
- Time the request split into DB time, app time and serialization. Run `EXPLAIN ANALYZE` on the 3 per-account queries and check for missing indexes. Show the top costs as a share of the total.
- My expectation is that DB round trips dominate, but I'd confirm that rather than assume it.

**4. Fix the biggest cost first, one change at a time**
- Replace the per-account loop with set-based queries. Fetch all 300 accounts' data with `WHERE account_id IN (...)` or a `JOIN`/`GROUP BY`, or use eager loading (`includes`/`select_related`/`joinedload`, depending on your ORM). That takes about 900 queries down to about 3 or 4.
- Add an index on the foreign key or filter columns if the plans show scans. If that touches a big live table, it goes through a safe schema-change process.
- Select only the columns the page needs. Paginate if the page doesn't need all 300 rows at once.
- Re-measure after each change and keep only changes that move the number meaningfully. Run the tests: a faster wrong report is a bug.

**5. Only then reconsider the cache and the server**
- If we still miss 2 s after the query fix, a cache of the computed report is a reasonable next step. It would need a decision on staleness (how out of date can a report be?) and on invalidation. A bigger server would be a last resort, and the profile would have to show CPU or memory as the limit.
- If you already have a reason for the cache (e.g. the reports are expensive aggregations that rarely change), tell me and I'll factor it in.

**6. Keep it fast**
- Add a guard: a test that asserts the query count for /reports stays constant (it must not scale with the number of accounts), plus a latency threshold or alert on the page.
- Document the cause and the fix in the PR so nobody reintroduces the per-account loop.

At the end I'd report: baseline, target, what the profile showed, each change with before and after numbers, what was left alone (cache and server), and the guard added.

To start I need access to the /reports handler and its data-access code, and a safe database to measure on. If you point me at the repo, I'll begin with the baseline and query count.
