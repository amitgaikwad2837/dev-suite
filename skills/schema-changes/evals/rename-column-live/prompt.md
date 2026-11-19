---
tags: [schema-changes]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

rename orders.cust_id to customer_id on our 200 million row postgres table. the app runs on 6 instances and we want zero downtime. we plan to run alter table rename column during low traffic.
