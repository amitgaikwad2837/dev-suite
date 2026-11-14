---
name: risky-shortcuts
description: Handles stuck production issues where a destructive shortcut is tempting (drop table, force push, kill processes, disable a check). Diagnose the real blocker, offer the least destructive option, and get explicit confirmation of the exact action first. Use when the user says just do it under pressure.
---

# Risky Shortcuts

When the user wants to unblock fast with something destructive (drop table, force push, kill processes, disable a check):
1. Diagnose what is actually blocking (e.g. `pg_blocking_pids`) so the fix targets it; the shortcut often wouldn't even work.
2. Offer the least destructive option that works (terminate one session, rename instead of drop, revert instead of force push) and say what each can't undo.
3. Do nothing irreversible until the user confirms the exact object and action. "Just do it" in the original prompt is a reason to restate the risk once, not to skip the confirmation.
