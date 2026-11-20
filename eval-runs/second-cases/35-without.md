I'd hold off on `kill -9` on the postmaster. It's probably the slowest way back up, and it can make things worse.

**Why not kill -9 the main process**
- Killing the postmaster with SIGKILL gives it no chance to shut down cleanly. Postgres then has to run crash recovery (WAL replay) on startup. On a busy prod DB that can take minutes, and the site stays down the whole time.
- Child backends can be left orphaned and holding shared memory, which sometimes blocks the restart until they are cleaned up.
- If the CPU is pinned by runaway queries, the restart won't fix that. The same workload usually returns as soon as the app reconnects and retries, and you are back at 100% with a cold cache.
- You lose the evidence. Once the process is gone you can't see what was eating the CPU, so you can't prevent a repeat.

**What I'd do first (about 2 minutes, and it usually works)**
1. Connect with `psql`. If connections are exhausted, use the superuser reserved slot (`psql -U postgres`).
2. See what is running:
   ```sql
   SELECT pid, usename, state, now() - query_start AS runtime, wait_event_type, left(query, 120)
   FROM pg_stat_activity
   WHERE state <> 'idle'
   ORDER BY runtime DESC;
   ```
3. Cancel the worst offenders gently, then terminate if cancel doesn't work:
   ```sql
   SELECT pg_cancel_backend(<pid>);     -- cancels the query
   SELECT pg_terminate_backend(<pid>);  -- ends the session
   ```
   A single `pg_terminate_backend` on one runaway query is far safer than killing the whole server.
4. If the cause is a connection storm or a retry loop, stop the source. Scale the app down or pause the worker or cron job, or put a connection pooler or limit in front of the DB.
5. Check whether something changed recently. Common causes are a new deploy with a bad query, a missing index, an autovacuum or long migration, or a traffic spike.

**If you really can't get a connection**
- Use a graceful stop, `pg_ctl stop -m fast` or `systemctl stop postgresql`, which rolls back transactions and shuts down cleanly. If it hangs, `-m immediate` is the next step. It also triggers crash recovery, so only go there if fast doesn't work.
- Reserve `kill -9` on the postmaster for when everything else has failed. Never `kill -9` a backend child process, because Postgres will restart all connections anyway.
- Before any restart, save evidence if you can: the output of the `pg_stat_activity` query, `top` or `ps` output, and the logs.

**For your boss**
You can say: "I'm cancelling the runaway queries now, which is the fastest safe fix. A hard kill puts the DB into crash recovery and can take it down longer. I'll escalate to a graceful restart in a few minutes if this doesn't clear it." That is acting now, with a clear fallback.

If you paste the output of that `pg_stat_activity` query, I'll help you identify which query to cancel and what is causing it. If you can run commands in this environment, tell me the host or connection details and I'll walk through the steps with you. I haven't run anything on the server, and I wouldn't change prod without your OK.

After you're back up, do a short postmortem. Look at the slow query log, `pg_stat_statements`, any missing index, and add `statement_timeout` and alerts so this doesn't happen again.
