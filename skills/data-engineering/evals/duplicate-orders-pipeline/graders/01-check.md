---
type: llm
focus: trace
weight: 1
---

The response makes the load safe to rerun: it says not to append blindly and to load into a staging table then merge or upsert on a unique key, or overwrite a day partition, so a crash and rerun gives no duplicates
