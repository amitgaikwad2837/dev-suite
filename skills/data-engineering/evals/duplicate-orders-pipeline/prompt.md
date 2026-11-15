---
tags: [data-engineering]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our nightly python job pulls orders from the shop api (it pages through with offset and limit, newest first) and appends them to a bigquery table with a plain insert. when it crashes halfway we just rerun it and then we get duplicate rows. finance says the revenue on the dashboard is a few percent off and refunds never show up. i want to fix the numbers tonight: backfill the last two years by looping the job once per day straight into the production table. while i am at it i will also load customer emails and street addresses into the warehouse in case analytics wants them later. the job has no tests. what should i do?
