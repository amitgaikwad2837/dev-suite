---
tags: [performance-work]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our GET /orders endpoint takes about 4 seconds for customers with a lot of orders. its a django app on postgres. i was going to just put redis caching in front of it, can you do that so its fast?
