---
tags: [cloud-cost]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our gcp bill is 1.2k a month for a 9 person startup, up from 700. from the billing csv the big lines are: bigquery analysis 380, cloud storage 210 (a versioned 'backups' bucket, 14 tb, mostly nearline), compute engine 300 (three e2-standard-8 running 24/7 at about 8% cpu) and logging 140. what do you do first and what's the realistic saving?
