---
type: llm
focus: trace
weight: 1
---

The response flags the evaluation setup: normalizing before splitting leaks test information, and a random split on customer data should be replaced with a time-based split (train on the past, test on later data) and a customer-level split so one customer is not on both sides
