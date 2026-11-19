---
tags: [llm-app-work]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our docs chatbot (rag) sometimes invents api parameters that don't exist. when someone reports a wrong answer we edit the prompt to add a rule. we have 14 rules in the prompt now. how do we stop this?
