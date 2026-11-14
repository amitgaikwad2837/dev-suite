---
tags: [design-decision]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we have to pick how to do per-tenant rate limiting for our API and it will be painful to change once clients depend on it. options i can think of are a redis token bucket, a gateway plugin, or in-process counters. can you compare them properly and tell me what to build?
