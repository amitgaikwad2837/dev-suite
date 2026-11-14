---
tags: [dev-orchestrator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we need to move our order data from one postgres schema to a new multi-tenant design with zero downtime and it's very hard to undo once clients are on it. use your agent team to find the best approach and then implement it, but keep token use low
