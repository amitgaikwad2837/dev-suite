---
tags: [dependency-audit]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we want to add 'invoice-parse-lite' from npm to parse invoices. it's 3 years old, about 40 weekly downloads, one maintainer, mit licence, and has 2 open security issues. separately our lodash is 2 years behind. is it ok to add the new package, and should we just update everything?
