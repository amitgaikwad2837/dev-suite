Short version: the rename itself is fast, but doing it as a single ALTER TABLE RENAME COLUMN with six app instances running is not zero downtime. I'd change the plan.

**What the plain rename does**

- In Postgres, `ALTER TABLE orders RENAME COLUMN cust_id TO customer_id` is a metadata-only change. It does not rewrite the 200M rows, so it finishes in milliseconds once it has its lock.
- It needs an ACCESS EXCLUSIVE lock. If a long-running transaction or query is holding any lock on `orders`, the ALTER waits. Every query that arrives after it queues behind it, so a brief wait can turn into an outage. Low traffic helps but does not remove this risk. Set `lock_timeout` (for example 2-3s) and retry.
- The bigger problem is the application. The moment the rename commits, any instance still running code that references `cust_id` starts failing. You can't deploy six instances atomically, so you'd see errors during the deploy window. Anything else that touches the column also breaks: views, functions, triggers, indexes defined on expressions, foreign keys, reporting queries, ETL jobs, replicas and CDC consumers.

**Zero-downtime approach (expand / migrate / contract)**

Option A, the simple route when you control all the readers and writers:

1. Deploy the app so it works with either name. In practice, that means making the code tolerant before the rename, not after. With a plain rename, the cleanest trick is a compatibility view or an ORM column alias.
2. Run the rename with `lock_timeout` set.
3. Deploy the app using `customer_id` only.

The problem is that steps 1 and 3 need the app to know both names at once, which is awkward with a raw rename.

Option B, the safer and more common route (add a new column and copy):

1. Expand: `ALTER TABLE orders ADD COLUMN customer_id <same type>;` This is a fast metadata change if it is nullable with no default.
2. Dual-write: deploy app code that writes both `cust_id` and `customer_id`. A trigger can do this instead of the app, if you want to be sure no writer is missed.
3. Backfill existing rows in batches (for example 10k-50k rows by primary key range, with a short sleep between batches, committing each batch). On 200M rows this is a long-running job, so watch replication lag, WAL volume, bloat and autovacuum. Don't run it as one giant UPDATE.
4. Verify that the two columns match (count of rows where they differ should be zero). Then add any NOT NULL, foreign key (`NOT VALID` then `VALIDATE CONSTRAINT`) and indexes (`CREATE INDEX CONCURRENTLY`) on the new column.
5. Switch reads: deploy code that reads `customer_id`. Roll this out across the 6 instances gradually and watch error rates.
6. Stop writing the old column, and drop the trigger.
7. Contract: after a soak period (days, not minutes) and once nothing reads `cust_id`, drop it in a later migration. Keep a rollback path until then.

Cost: extra storage for the duplicate column for a while, and a backfill that takes real time. Benefit: every step is reversible and no deploy ordering can break you.

**Before you start**

- Search for every user of `cust_id`: application code, raw SQL, views, stored functions, triggers, indexes, constraints, BI tools, data pipelines and replicas.
- Check your Postgres version and whether you use logical replication. Renames can break subscribers that map columns by name.
- Rehearse on a restored copy or staging with production-sized data, and time each step.
- Make the migration checks explicit: a lock timeout, a statement timeout for the backfill, and a monitoring dashboard for locks, lag and errors.

**If you really want the single rename**

It can be acceptable if you can tolerate a short blip, for example by draining instances from the load balancer, deploying new code and rename together, and accepting a brief maintenance window. But that is not zero downtime. If zero downtime is a firm requirement, go with Option B.

If you tell me your ORM or framework, your Postgres version and whether you have replicas or CDC, I can write the exact migration SQL, the backfill script and the deploy order for you.
