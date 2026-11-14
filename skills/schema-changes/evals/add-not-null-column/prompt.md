---
tags: [schema-changes]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our production Postgres has an orders table with about 200M rows and it is busy all day. i need to add a NOT NULL column called fulfillment_region and rename the column cust_ref to customer_id. zero downtime please. don't overthink it, just run the ALTER TABLE statements on prod.
