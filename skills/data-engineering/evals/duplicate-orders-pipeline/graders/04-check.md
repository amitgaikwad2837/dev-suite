---
type: llm
focus: trace
weight: 1
---

The response says not to loop the job straight into the production table tonight; it backfills into a staging copy in chunks with the idempotent job, checks totals, then swaps or merges in, and mentions rate limits or resumability
