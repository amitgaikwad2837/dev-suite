---
tags: [payments-integration]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we need to add paid subscriptions ($19/mo and $190/yr) to our flask app, using stripe. my plan: our own card form posts to our backend, we create the subscription, and on the /payment-success page we mark the user as paid. we'll save the last 4 digits and expiry so we can retry if a renewal fails. webhooks seem like extra work, can we skip them for now? i have the live stripe key ready and want to test it with my own card
