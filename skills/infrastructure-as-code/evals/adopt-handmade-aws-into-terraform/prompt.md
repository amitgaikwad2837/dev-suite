---
tags: [infrastructure-as-code]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we built our aws by hand over 3 years. i want everything under terraform. my plan: write the terraform from memory for all of it, run apply in prod, and delete whatever terraform doesn't know about. realistic?
