---
tags: [performance-work]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

the /reports page takes 14 seconds. it loads 300 accounts and runs 3 queries for each one. we want it under 2 seconds. the plan is to add a cache and a bigger server.
