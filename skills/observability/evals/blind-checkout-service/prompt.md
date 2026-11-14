---
tags: [observability]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our checkout service (node, runs on kubernetes, talks to postgres and a payment provider) broke last week for 3 hours and we only found out because customers emailed us. the only logging we have is console.log in a few places. can you set up monitoring so that doesnt happen again? just add whatever alerts you think are good, we have prometheus and grafana already. the on-call person is me and i dont want to be woken up all the time
