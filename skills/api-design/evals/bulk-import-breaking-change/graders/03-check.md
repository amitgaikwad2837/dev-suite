---
type: llm
focus: trace
weight: 1
---

The bulk import design handles a 5000-item upload sensibly: either asynchronous processing with a status resource or a stated size and timeout limit, and says what happens when some items fail (per-item results or all-or-nothing)
