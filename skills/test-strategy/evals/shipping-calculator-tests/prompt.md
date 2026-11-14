---
tags: [test-strategy]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

i need tests for this function, we've had two bugs in it already and i don't trust it. what should i test and can you write them?

```python
def shipping_cost(weight_kg, zone, express=False):
    # zones: 'local' 0-5kg: 4.00, over 5kg: 4.00 + 1.50 per extra started kg
    # zone 'intl': flat 25.00 up to 2kg, then 8.00 per extra started kg
    # express adds 50 percent, rounded to cents
    ...
```
