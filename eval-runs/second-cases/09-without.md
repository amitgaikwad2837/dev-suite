Short version: late events are a normal fact of mobile data. You can't make them stop, so decide how the numbers are allowed to change and say so. Finance doesn't need numbers that never change. They need numbers that change on a schedule they know about, and then stop.

**1. Separate event time from load time**

If you don't already have these, add them:
- `event_time`: the client timestamp, when the user did the thing.
- `received_at` (server receipt time) and `loaded_at`: when it reached you and when it landed in Snowflake.

Late data makes sense once you can see both. Clamp or flag bad client clocks. Devices with skewed clocks (the future, or 2019) will otherwise pollute your daily counts. Also keep a stable `event_id` for dedup, because retries from offline devices produce duplicates.

**2. Build DAU on event date, and reprocess a rolling window**

Do not compute DAU once at midnight and leave it. Instead:
- Partition or cluster the events table by event date.
- Run the DAU model incrementally with a lookback of at least 3 days, plus a margin (4 days). Each run recomputes the last N event-days from scratch and overwrites (MERGE or delete-and-insert by date). Recomputing a day is idempotent. Don't try to patch counts with deltas.
- Dedup on `event_id` inside the window. In Snowflake, a `MERGE` into the raw or staging table keyed on `event_id`, or a `QUALIFY ROW_NUMBER()` in the model.
- Pick the lookback from data, not guesswork. Measure the lateness distribution (`received_at - event_time`) and see what fraction arrives after 1, 2, 3 and 4 days. If 99.5% of events arrive within 24h, the 3-day tail may move DAU by a tiny amount, and that is a useful number to show finance.

**3. Give finance a number that settles**

This is the part that fixes the complaint. Options, roughly in order of how often I'd recommend them:

- **Publish a "finalized" table with a freeze date.** Daily DAU is marked provisional for T+3 (or T+4), then finalized and locked. Finance reports only on finalized days. Provisional days are visible on dashboards, labelled as such. The rule becomes "numbers are final after 4 days," which people can accept far more easily than numbers that wobble forever.
- **Snapshot as-of versions.** Keep every published value: `(date, as_of_run, dau)`. That lets you answer "what did we report on the 5th for the 2nd?" and explain every change. It's cheap (a table of a few rows per day) and ends the argument about whether the numbers changed. Snowflake Time Travel is not a substitute here, since retention is limited and it isn't self-documenting.
- **Close the books by attribution date**, i.e. a different date definition for finance. For example, report DAU by the date the events were received rather than when they occurred. This never changes retroactively, but it measures something different (it smears offline usage onto later days). It's a legitimate option for finance reporting, but it must be labelled as a different metric, not substituted silently. I'd usually keep event-time DAU as the product metric and offer this only if finance needs strictly immutable numbers.
- **Don't shorten the tolerance by dropping late events.** Discarding events older than X hours makes numbers stable but permanently undercounts offline-heavy users, and the bias is not random. Only do this if the business agrees explicitly.

**4. Make the pipeline operationally sound**

- Make loads idempotent (keyed by file or `event_id`), so replays and backfills don't double count.
- Late-data monitoring: track a daily "late arrival rate" and the revision size of each day's DAU between runs. Alert if a revision after the freeze date is non-zero, because that means something is wrong (a backfill, a bug, a stuck queue).
- If the hourly load uses dynamic tables or Snowflake streams/tasks, set the target lag and the recompute window deliberately. A dynamic table over the full history recomputes what you ask it to, so confirm that the 3-day window is really what's refreshed and you're not rescanning everything on every run.
- Cost: the lookback means you recompute about 4 days of data per run, not 1. For most volumes this is fine. If it isn't, run the full 4-day recompute once a day and a cheap incremental on the current day hourly.

**5. Agree on the definition with finance (the people part)**

Write down:
- DAU = distinct users with at least one qualifying event on that event-date in UTC (or a named timezone; this matters, because timezone choices also move numbers).
- Revision policy: provisional for N days, final afterwards, restatements after that only by a documented exception.
- Which table finance reads (the finalized one), and who owns it.

**What I'd do first, in order**
1. Measure the lateness distribution from existing data (one query), and quantify how much DAU actually moves per day. This tells you how big the problem is and sets N.
2. Switch the DAU model to a rolling N-day recompute with dedup.
3. Add the finalized table with a freeze date, and point finance at it.
4. Add the revision monitor and the as-of snapshots.

If you tell me how you load now (Snowpipe, batch COPY, a tool like dbt), the table sizes, and what finance uses today (a BI dashboard reading the raw model?), I can sketch the actual SQL or dbt config.
