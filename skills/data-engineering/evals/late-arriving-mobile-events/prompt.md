---
tags: [data-engineering]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our clickstream pipeline loads hourly into snowflake. mobile apps send events with timestamps up to 3 days late when users are offline, so the daily active users numbers for past days keep changing and finance is unhappy. what should we do?
