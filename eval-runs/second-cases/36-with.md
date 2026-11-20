Please don't run a plain `ALTER TABLE orders RENAME COLUMN cust_id TO customer_id` on this table, even at low traffic.

**Why it breaks.** The statement is fast, because on Postgres a rename is metadata-only and does not rewrite 200M rows. The problem is the order of events:

- It needs an ACCESS EXCLUSIVE lock. If any long-running transaction touches `orders`, the rename queues behind it, and every later query queues behind the rename. That is a stall of the whole table.
- Your 6 instances run code that references `cust_id`. The moment the rename commits, every query using the old name fails until all 6 are redeployed. During a rolling deploy, old and new code are live at the same time, so neither name works for both. That is downtime.

**Classification:** destructive (rename) and data-moving (backfill). It is hard to reverse, so I'd use the expand and contract sequence below. Each step is safe for both old and new code.

**Safe sequence (each step is its own release or job):**

1. **Expand.**
   - Set `lock_timeout = '3s'` and `statement_timeout` for the session. Retry later if it fails, rather than raising the timeouts.
   - Run `ALTER TABLE orders ADD COLUMN customer_id <same type as cust_id>;`.
   - The column is nullable with no default. That is metadata-only and takes a brief lock with no table rewrite.
2. **Dual write.**
   - Deploy app code that writes both `cust_id` and `customer_id` and still reads `cust_id`.
   - Alternatively, use a trigger to keep them in sync. A trigger covers writers you may have missed, such as scripts and other services.
3. **Backfill, as a separate job and not inside the migration or deploy.**
   - Copy `cust_id` into `customer_id` in batches by primary-key range, for example 10k to 50k rows per batch, with a pause between batches.
   - Make it idempotent and resumable, using `WHERE customer_id IS NULL`.
   - Stop it if replica lag or lock waits rise.
   - Afterwards, verify that row counts match and that `customer_id` has no nulls where `cust_id` is not null.
4. **Constraints and indexes.**
   - Build any index with `CREATE INDEX CONCURRENTLY`, and check for invalid leftovers afterwards.
   - Add NOT NULL or foreign keys in two phases: add `NOT VALID`, then `VALIDATE CONSTRAINT` separately.
   - On Postgres 12 or later, a validated CHECK constraint lets you set NOT NULL without a full scan.
5. **Switch reads.** Deploy code that reads `customer_id`, still dual-writing. Let it bake.
6. **Contract.** In a later release, once nothing reads or writes `cust_id` (check the code, other services, reporting and ETL), stop writing it. Then drop `cust_id` in its own step, with its own confirmation.

If you want the name to be identical afterwards, you can create a compatibility view, but that is optional.

**Before any of this runs:**
- Rehearse on a copy at production size. Watch lock waits and how long the backfill takes.
- I'd hand the rollout order, bake time and abort criteria to release-engineering.
- Rollback is easy through step 5, because the old column is still intact. After the drop it is not, which is why the drop waits.

**Rough timing.** Steps 1 and 2 take seconds. The backfill of 200M rows in paced batches is hours, not minutes. Exact duration depends on your hardware and the pause between batches, so the rehearsal will tell you.

**What needs your yes.** I haven't run anything. I'll show the exact statement, target database, lock and rewrite risk for each step, and I need a clear yes before each one is run, including on staging copies of prod. A yes covers one run, not the next. The final drop of `cust_id` needs its own separate yes.

Questions that would help me tailor this:
- Which Postgres version are you on?
- Is `cust_id` indexed or part of foreign keys, views or constraints?
- Does anything else read it, such as other services, BI or ETL?

If you tell me the type and indexes, I'll write the exact SQL for step 1 and the backfill script so you can review them.
