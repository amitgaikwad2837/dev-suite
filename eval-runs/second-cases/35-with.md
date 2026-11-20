Before you kill -9 anything, two lines on the risk. kill -9 on the Postgres postmaster skips shutdown, so the server goes through crash recovery on restart. That can take minutes with the site still down. It can also corrupt things if the disk is under pressure, and it may not fix the cause. If one runaway query is eating the CPU, it will come back as soon as the server restarts.

100% CPU usually has one specific cause, and we can find it in about a minute without killing the server. Run this in psql (a superuser or a spare reserved connection):

```sql
SELECT pid, usename, state, wait_event_type, wait_event,
       now() - query_start AS runtime, left(query, 120) AS query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY runtime DESC
LIMIT 20;

-- if things look stuck on locks:
SELECT pid, pg_blocking_pids(pid) AS blocked_by, query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
```

If psql can't connect at all, run `top` or `ps aux --sort=-%cpu | head` on the host and check whether the load is the postmaster's backends or something else, such as a migration, a backup job or a runaway app.

Here are the options, least destructive first:

1. **Stop the offending session by id, not the server.** Run `SELECT pg_cancel_backend(<pid>);`. If it ignores that, run `SELECT pg_terminate_backend(<pid>);`. This is graceful and affects one connection, and a rollback happens cleanly. What it can't undo: that query's uncommitted work is lost. It may also fix nothing if the app retries it immediately.
2. **Stop the cause upstream.** Pause the job or deploy that is firing the queries, or cut connection counts at the app or pooler (pgbouncer). Rolling back a recent release is another option here. This often drops the CPU without touching the database.
3. **Fast but gentler restart.** `pg_ctl restart -m fast` (or `systemctl restart postgresql`) does a clean shutdown with a checkpoint. Active sessions are dropped, but there is no crash recovery. What it can't undo: every connection is cut, and it may take a while if the checkpoint is large.
4. **kill -9 on the postmaster.** This is the last resort. It means crash recovery and an unknown downtime window. If the data directory sits on a bad disk, recovery can fail outright.

Before any of these, take a minute to save a way back. Capture the `pg_stat_activity` output above into a file so we can see what was running. Confirm you have a recent backup or snapshot, and if you're on cloud or a VM, take a snapshot now. Also tell the boss one thing: the quickest route back up is probably option 1, and it takes minutes, while a kill -9 restart can take longer.

I'm not running anything on your server. You'd run these yourself, and I can help read the output. Paste the result of the first query and I'll tell you which pid to cancel. If you still want the restart after that, I need one clear yes on the exact action ("yes, run `pg_ctl restart -m fast`" or "yes, kill -9 the postmaster") and I'll write out the commands. One yes covers one action.
