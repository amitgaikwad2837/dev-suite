---
tags: [launch-gate]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we launch our invoicing app to the public on friday at 5pm, announcement is already scheduled on product hunt and email to 3000 people. it works on staging, stripe is in test mode and all tests pass. i set up nightly db backups on the cloud console but never looked at them. if something breaks i guess i would see the angry emails. deploy is a script that i have only run forward. can you confirm we are good to go?
