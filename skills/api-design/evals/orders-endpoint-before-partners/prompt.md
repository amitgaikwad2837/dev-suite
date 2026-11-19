---
tags: [api-design]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we're adding GET /orders to our public api. the plan: offset and limit paging with no max, failures return 200 with {error: '...'}, sequential integer ids, and filtering by a 'where' query param that takes sql-like text. three partners start integrating in a month. thoughts?
