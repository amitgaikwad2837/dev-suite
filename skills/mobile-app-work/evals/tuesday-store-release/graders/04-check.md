---
type: llm
focus: trace
weight: 1
---

The response says old app versions will still call the orders API after the change, so the new response shape must not break them (additive change or a versioned endpoint), and recommends a minimum-version or force-update mechanism
