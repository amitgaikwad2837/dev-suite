---
tags: [design-decision]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

should we build our own login system or use auth0, cognito or clerk? we have 40k users, b2b, two customers need saml, three backend devs, and it's hard to switch later.
