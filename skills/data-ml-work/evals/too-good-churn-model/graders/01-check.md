---
type: llm
focus: trace
weight: 1
---

The response identifies that cancellation_reason is a leak (it is only known after the customer cancels, so it won't be available at prediction time) and says the 98 percent accuracy and 0.99 AUC are not trustworthy until it is removed
