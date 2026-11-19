---
name: data-engineering
description: Builds and fixes data pipelines into a warehouse or lake so the numbers can be trusted. Use for ETL or ELT jobs, duplicates after a rerun, warehouse totals that do not match the source, backfills, incremental loads, late data and data quality checks (Airflow, dbt, Spark, BigQuery, Snowflake). Skip for training models (data-ml-work) and app database schema changes (schema-changes).
---

# Data Engineering

Data pipelines fail quietly: a rerun doubles the rows, an update never arrives, a time zone shifts a day, and the dashboard is wrong for weeks before anyone notices. So the aim is not "the job ran" but "the numbers match the source and the job can be safely run again." Design for reruns, partial failures and late data from the start.

## 1. Pin down the contract

Write down in a few lines: the source and who owns it, the target table and its grain (one row per what?), the key that makes a row unique, how fresh it must be, who reads it and for what decision, and how a correct total is known (a finance report, a source count). If nobody can say how to check a number, that is the first problem.

## 2. Make every load safe to repeat

A job that fails halfway will be rerun, so a rerun must give the same result as one clean run.

- Do not append blindly. Load into a staging table, then merge on the unique key, or overwrite the whole partition (for example one day) in one step.
- Keep the final swap atomic so readers never see half a load.
- Make each task depend on its inputs, not on the clock, so it can run for any date and give the same answer.

## 3. Extract changes, not just new rows

- Rows change after they are created: refunds, status changes, corrections, deletes. Paging through the latest records by offset misses these, and offsets shift while you read.
- Prefer change data capture, an `updated_at` watermark with a small overlap, or a snapshot comparison. Save the watermark only after the load succeeds.
- Decide how deletes are shown (soft delete flag, tombstone, periodic full compare) and how late-arriving data is picked up.
- Store timestamps in UTC with the original zone kept if it matters, and define "day" once.
- Expect the source schema to change. Detect new, removed or retyped columns, fail loudly or quarantine instead of loading garbage.

## 4. Test the data, not only the code

Put checks in the pipeline and fail or alert on them: unique key, not-null on required columns, accepted values, row counts against the source within a tolerance, totals that match a trusted report, freshness, and no sudden drop or spike. When a number is disputed, reconcile first (sum by day, by status, against the source) to find which rows differ before changing code.

## 5. Backfill without hurting the live table

- Write the backfill as the same idempotent job run over a date range, not a separate script.
- Run it first into a copy or a staging dataset, check totals against the source, then swap or merge in.
- Chunk it (one day or one partition at a time), limit the request rate to the source, and make it resumable. Say how long it will take and what it costs.
- Do not loop a new job over production data on the same evening it is written.

## 6. Treat personal data as a liability

Load only the columns the analysis needs. Leave out emails, phone numbers and addresses, or replace them with a hashed or tokenised key. Restrict access, set a retention period, and make sure a deletion request can be carried out in the warehouse too. Never copy production secrets or raw personal data into a test dataset (`security-review`).

## 7. Run and watch it

Use an orchestrator or scheduler with retries, timeouts and alerts that reach a person (`observability`). Record run time, rows in and out and the watermark. Keep transformations in version-controlled code with reviews (`change-review`), keep the lineage from source to report documented, and watch cost (partition and cluster large tables, avoid full scans).

## 8. Hand over

Report the grain and key, how reruns and late data are handled, the checks added and their results, how the totals reconcile with the source, what was not run, and what the user must decide (retention, who may see personal data).
