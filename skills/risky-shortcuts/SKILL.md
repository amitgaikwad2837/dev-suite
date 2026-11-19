---
name: risky-shortcuts
description: Handles stuck production issues where a destructive shortcut is tempting (drop table, force push, kill processes, disable a check). Diagnose the real blocker, offer the least destructive option, and get explicit confirmation of the exact action first. Use when the user says just do it under pressure. Skip when nothing destructive is involved (incident-response for a live outage, bug-investigation for a cause).
---

# Risky Shortcuts

When someone wants to unblock fast with something destructive (drop a table, force push, kill processes, disable a check), the pressure is the hazard: the shortcut is picked before anyone knows what is actually wrong, and it is often the thing that cannot be undone.

1. **Diagnose the real blocker.** For a database, look at the lock view or `pg_blocking_pids`; for a deploy, the failing step; for a process, what is holding it. The fix should target that, and the shortcut often would not even work.
2. **Offer the least destructive option that works,** and say what each option cannot undo.

| Shortcut | Safer first move |
|---|---|
| Drop a table or database | Rename it, or take a dump you have checked, and drop later |
| Delete rows or files | Move them to an archive, soft delete, or copy first |
| Force push | Revert the commit, or force-with-lease on a branch only you use |
| `kill -9` or kill everything | Stop one process or session by id, gracefully first |
| Disable a failing check | Find why it fails; if you must bypass it, scope it, set an expiry and write it down |
| Restart everything | Restart the one component, after saving its logs and state |

3. **Make a way back before acting.** Take a backup or snapshot and confirm it can be restored, record the current state (row counts, branch tip, config), and write out the exact command.
4. **Get a yes for the exact action.** "Just do it" in the first message is a reason to restate the risk once, in two lines, not to skip the confirmation. Ask with: what you will do, what it will change or lose, the safer alternative, and the answer you need. One yes covers one action.
5. **After:** say what was done, what state it left, how to undo it and who needs to be told. If a protective hook asks you to confirm, do not work around it.

## Related skills

- `incident-response`: the wider live outage, status updates and the review afterwards
- `git-hygiene`: history rewrites and recovering lost work
- `schema-changes`: database changes that must not lock or lose data
