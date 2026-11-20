The numbers for past days keep changing because the pipeline is correct but the metric has no rule for when it is final. Events that arrive up to 3 days late will always change old days. You can't remove that, so you have to decide how to handle it. Here is what I'd do.

## 1. Agree on the contract with finance first

Before changing any code, write these down:

- **Grain:** one row per event. Key: `event_id`, a client-generated UUID. If the apps don't send one, that is the first thing to fix, because dedup and safe reruns depend on it.
- **Two timestamps:** keep both `event_time` (client clock, in UTC) and `received_at` / `loaded_at` (server clock). Define "day" once, in UTC or a business time zone. Client clocks are unreliable, so clamp or flag events with `event_time` in the future or far in the past.
- **Finality rule:** a day's DAU is provisional for 3 days plus a safety margin (say 4), then locked. Finance reports only on locked days. Dashboards show the last 4 days with a "provisional" label.
- **How a correct number is known:** reconcile against raw event counts in the source or the app backend, or against a finance-approved report.

If finance can't accept "final after day 4", that is a business decision they own. The alternative is to be told why the old numbers moved. Either way, the rule gets written down.

## 2. Make the load idempotent

Hourly loads must be safe to repeat, so a rerun gives the same result as one clean run:

- Load into a staging table, then `MERGE` into the events table on `event_id`. Never plain append.
- Make each task depend on its inputs, not the clock, so it can run for any hour or date and give the same answer.

## 3. Pick up late data on purpose

Partition and filter by `received_at` (the load watermark), not `event_time`.

- Incremental extraction runs on `received_at`, with a small overlap. Save the watermark only after the load succeeds.
- Late events then land automatically, because they arrive in a later `received_at` window and merge in by `event_id`.
- Rebuild the DAU model with a rolling reprocess window. Each run recomputes the last 4 days of `event_time` dates, as an idempotent overwrite of those partitions. In dbt this is an incremental model with `incremental_strategy: delete+insert` or `merge`, using a `unique_key` and a lookback filter. In Snowflake, cluster the events table by event date so recomputing 4 days doesn't scan everything.
- Run a final recompute at day 4, then freeze the day. Later arrivals past the window go to a late-data audit table and an alert, rather than silently changing locked numbers.

## 4. Give finance a stable number

Publish two things:

- `dau_daily` (locked days only): immutable after day 4. This is what finance reports from.
- `dau_provisional` (or a view over the same table with an `is_final` flag): the latest days, labelled provisional.

Optionally, keep a snapshot of what was published each day, so "the number I saw on Tuesday" can be answered later. If a restatement is ever needed after the lock, make it an explicit, logged correction with a reason, not a silent change.

## 5. Test the data, not just the code

Add checks to the pipeline and alert on them:

- `event_id` unique and not null.
- Row counts against the source within a tolerance.
- Freshness of `received_at`.
- Share of events arriving more than 3 days late. Track this as a metric. If it grows, the window is wrong.
- Sudden drops or spikes in DAU.
- Future-dated `event_time`.

Alerts should go to a person.

## 6. Backfill the history carefully

Past numbers are already wrong or unstable, so you will probably want a restatement:

- Run the same idempotent job over a date range, not a separate script.
- Run it into a copy or staging schema first, and check totals against the source.
- Chunk it one day at a time, make it resumable, and swap or merge in afterwards. Tell finance in advance which historical numbers will change and by how much.
- Don't loop a new job over production data the same evening it is written.

## 7. Cost and personal data

- Keep only the columns DAU needs. Use a hashed or tokenised user ID rather than emails, phone numbers or device identifiers where possible.
- Set a retention period, and make sure a deletion request can be carried out in the warehouse too.
- Reprocessing 4 days hourly can be expensive. Clustering by event date helps. A cheaper option is to recompute the full 4-day window once or twice a day, and only today's partition hourly.

## What I need from you

1. Does every event carry a unique `event_id`?
2. Is 3 days the true maximum lateness, or is it the typical worst case? Measure the lateness distribution (for example, 99th percentile of `received_at - event_time`) before choosing the lock delay.
3. Can finance accept "final after day 4"? That decision is theirs.
4. Which time zone defines a day?

## What I would not do

- Don't wait to "fix" it with more frequent loads. It isn't a speed problem.
- Don't drop late events to keep numbers steady. It makes the number stable but wrong.
- Don't silently change locked days.

## Not yet run

I haven't touched your pipeline, so nothing has been verified. Once I can see the model and DAU definition, I can write the staging and merge, the lookback model and the checks, and reconcile the results against the source.
