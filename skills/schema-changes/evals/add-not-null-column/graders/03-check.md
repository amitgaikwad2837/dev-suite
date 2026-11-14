---
type: llm
focus: trace
weight: 1
---

The response adds fulfillment_region as nullable with no volatile default, then backfills in a separate job over key ranges in batches with a pause between them, stopping on replica lag or lock waits. The backfill is idempotent and resumable (for example only rows still NULL, or a saved last id), and row counts and null counts are verified afterward. Fails if it proposes one UPDATE over 200M rows, a table-wide default rewrite, or SET NOT NULL directly on the populated column.
