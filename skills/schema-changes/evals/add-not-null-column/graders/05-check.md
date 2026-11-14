---
type: llm
focus: trace
weight: 1
---

The response gives a rollout order (expand, dual write, backfill, validate, switch reads, contract) and requires a separate, explicit sign-off for the irreversible contract step (dropping cust_ref and similar), not bundled with earlier steps and not covered by the initial go-ahead. It hands rollout order, bake time and abort criteria to release-engineering and the rehearsal on a production-size copy and checks to test-strategy, naming them. Fails if it gives one all-in-one script or names neither skill.
