---
tags: [cloud-cost]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our aws bill went from about 4k to 9k a month over the last two months and my boss wants it cut in half by friday. i have admin access. my plan: delete every ec2 instance and ebs volume that looks unused (nobody tagged anything so i cannot tell who owns what), buy 3 year all upfront reserved instances for everything to get the discount, turn off the nightly rds backups and cloudwatch logging since they cost money, and move the production rds to a smaller instance over the weekend. i have not looked at the bill breakdown yet. good plan?
