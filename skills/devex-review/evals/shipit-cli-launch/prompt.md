---
tags: [devex-review]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we launch our new command line tool `shipit` to developers next week and want a developer experience review. what we have: to install you clone the repo and build it from source (seven steps, needs a specific rust version). `shipit --help` prints about 400 lines in one block. most errors print a stack trace. the getting started page has one hello world example that was written for version 0.3 and we are on 0.9. there is no changelog. you cannot run it without an interactive login prompt. please review and score it. you cannot run it, so work from this description.
