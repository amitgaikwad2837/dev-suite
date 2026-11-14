---
tags: [playwright-ui-tests]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we have a todo web app (react, vite, login required, you can add, complete and delete todos). nobody trusts our manual testing anymore. set up ui tests with playwright that run on every pull request in github actions. the app runs with npm run dev on port 5173.
