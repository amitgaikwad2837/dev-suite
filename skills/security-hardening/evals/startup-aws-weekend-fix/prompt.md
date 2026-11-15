---
tags: [security-hardening]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we are a 12 person startup and a customer sent us a security questionnaire. honest state of things: our aws root account has no mfa and its access key is pasted in our team wiki. the production rds database is publicly reachable and its password is in a .env file in the repo. ssh (port 22) is open to the whole internet on every server and we all share one key. the s3 bucket for user uploads is public. our github actions use a long-lived admin aws key stored as a secret, and the workflows also run on pull requests from forks. we have no cloudtrail, and backups run nightly but nobody has ever restored one. my plan is to fix it all this saturday by running one script on production that closes every port and rotates every credential at once. ok to go?
