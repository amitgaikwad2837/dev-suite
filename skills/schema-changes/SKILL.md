---
name: schema-changes
description: Plans and runs database schema changes on live tables without downtime. Use for adding, renaming or dropping columns or tables, changing types, adding indexes, backfilling data and writing migrations when the app must stay up. Skip for local throwaway databases and rollout planning (release-engineering).
---

# Schema Changes

A schema change is safe when old and new code both work against every intermediate state, and no single statement holds a lock longer than the app can tolerate.

## Confirm before acting

Never run, apply or hand over as ready to run any migration against real data (staging copies of prod included) without a clear yes. Show the exact statement, the target database, the lock it takes and whether it rewrites the table. A yes covers one run, not the next. "Just run it on prod" is not enough on its own for a big or hard-to-reverse change; propose the safe sequence and ask.

## 1. Classify the change

- Additive: new nullable column, new table, new index. Usually safe; skip to step 2.
- Destructive: drop, rename, type change, new constraint on existing rows. These are hard to reverse, so say so out loud. If the target shape is not settled, hand off to `design-decision` first.
- Data-moving: backfills, splits, merges. Go to step 3.

## 2. Expand

- Add the new column or table nullable, with no volatile default. Check your engine and version, because some versions rewrite the whole table for a default and others do not.
- Set `lock_timeout` and `statement_timeout` for the session, so a blocked statement fails fast instead of queueing every query behind it. Retry later rather than raising the timeout.
- Build indexes without blocking writes (Postgres `CREATE INDEX CONCURRENTLY`, MySQL online DDL). Check for and clean up invalid leftovers after a failure.
- Add NOT NULL, foreign keys and check constraints in two phases. First add them unvalidated, then validate in a separate statement that does not block writes. On Postgres 12 or later a validated check constraint lets NOT NULL be set without a full scan; on older versions say it will scan and plan for that.
- A direct rename or type change takes a strong lock and breaks running code. Do not use it on a live table.

## 3. Backfill

- Work in batches by key range, with a pause between them. Stop when replica lag or lock waits rise.
- Make it idempotent and resumable, so a crash or a stop loses nothing.
- Run it as a separate job, not inside the deploy or the migration transaction.
- Verify row counts and null counts before moving on.

## 4. Switch and contract

- Rename is add new, dual write, backfill, read new, then drop old in a later release.
- Drop only after no code reads or writes the old column. Confirm each drop on its own.
- Rollback mechanics live in `release-engineering` section 6. Do not restate them here.

## 5. Test and hand off

- Rehearse on a copy at production size and watch lock waits and duration. Write the checks with `test-strategy`.
- If a lock is stuck or a drop, kill or force step looks tempting, stop and use `risky-shortcuts`. Never kill sessions or drop objects unprompted.
- Rollout order, bake time and abort criteria go to `release-engineering`.

Report: the classification, each step with its lock and rewrite risk, how long it should take, and what needs a yes.
