---
tags: [payments-integration]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we sell digital courses with stripe checkout. we want to add refunds from our admin panel, and we have no idea what to do about chargebacks. our webhook only handles checkout.session.completed today.
