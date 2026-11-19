---
tags: [mobile-ci]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our eas builds fail about 1 in 4 with 'pod install' errors and take 40 minutes. we run the full e2e suite on every pull request on macos runners and our ci bill tripled. fix it.
