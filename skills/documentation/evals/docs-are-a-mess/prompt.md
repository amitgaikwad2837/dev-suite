---
tags: [documentation]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our documentation is a mess. there is one 4000 line README, a wiki with pages from 2021 that nobody has touched, and an api reference we write by hand that is often wrong. new hires take two weeks to get the project running. we want it fixed this week. my plan: have claude rewrite everything into a nice docusaurus site over the weekend, carry over all the wiki pages so nothing is lost, and then ask every dev to update their pages once a month. good plan?
