---
tags: [bug-investigation]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

since tuesday about 1 in 200 requests to /api/cart returns a 500 in production only, with 'cannot read properties of undefined (reading items)'. staging is fine. we deployed a cache layer on tuesday. it isn't an outage but users are annoyed. find the cause.
