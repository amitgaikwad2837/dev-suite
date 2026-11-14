---
tags: [deep-engineering]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we need to migrate our 40-module python service from requests to httpx (async) without breaking prod. there are some tests but coverage is maybe 50%. how would you do this, and start on it
