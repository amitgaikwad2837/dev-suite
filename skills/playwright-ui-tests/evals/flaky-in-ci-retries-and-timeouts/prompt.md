---
tags: [playwright-ui-tests]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our playwright suite (120 tests) passes locally and fails about 20% of the time in ci with timeouts. we already raised the timeouts to 60s and added retries: 3. what now?
