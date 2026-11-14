---
type: llm
focus: trace
weight: 1
---

The response rejects a direct RENAME COLUMN of cust_ref on the live table and uses expand and contract instead: add customer_id, dual write from the application, backfill, switch reads to the new column, then drop cust_ref in a later release. It flags the rename and the drop as hard to reverse. Fails if RENAME COLUMN is proposed as the way to do it.
