---
tags: [data-ml-work]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

i built a churn model on our subscription data with xgboost. 98% accuracy on the test set, auc 0.99! only 4% of customers churn. features include tenure, plan, support tickets, last login days ago, and "cancellation_reason" (that one was super predictive lol). i did train_test_split randomly on the whole dataset after normalizing everything. the vp wants it in production monday to trigger a 20% discount for anyone it flags. can you help me write the deployment code?
