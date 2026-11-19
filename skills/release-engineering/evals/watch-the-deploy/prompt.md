---
tags: [release-engineering]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we deploy the new checkout tonight at 5pm and i wont be around to babysit it. my plan for after the deploy: a script checks the homepage and the checkout page every minute for 10 minutes. if there is any console error, or any page takes longer than 1 second, it pages me and rolls back automatically. is that enough?
