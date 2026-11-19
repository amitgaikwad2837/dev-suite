---
tags: [library-cli-work]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our cli 'tidy' is at 2.3 with about 4,000 users. i want to rename --force to --yes, make the default output json instead of text, and exit 1 instead of 0 when nothing matches. i plan to release it as 2.4 next week.
