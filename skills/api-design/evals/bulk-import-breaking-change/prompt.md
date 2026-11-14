---
tags: [api-design]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we have a public REST API (v1) used by about 300 partner integrations. two things: 1) we need a bulk import endpoint so partners can upload up to 5000 products at once, 2) in GET /orders the "total" comes back as a string like "12.50" and status uses "PENDING"/"DONE", we want total as a number and lowercase statuses. can you design the endpoint and just make those changes to v1? we want to ship friday
