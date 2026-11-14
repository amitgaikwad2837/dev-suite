---
type: llm
focus: trace
weight: 1
---

The response makes webhook handling safe to repeat: it records event IDs or otherwise de-duplicates, handles out-of-order or retried events, and returns a success response quickly with heavy work done separately, and mentions idempotency keys on requests that create charges or subscriptions
