---
tags: [bug-investigation]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

our CI test test_order_totals fails about 1 in 15 runs with 'expected 100.0 got 99.99'. it sums line item prices that come out of a Decimal->float conversion and a dict built from a set of SKUs. i can't repro locally. figure out why and fix it properly, don't just add a retry.
