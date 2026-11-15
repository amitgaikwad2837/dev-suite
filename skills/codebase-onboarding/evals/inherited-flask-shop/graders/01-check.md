---
type: llm
focus: trace
weight: 1
---

The response reads the CI config or Makefile and finds that the README is stale: it says python app.py on port 5000 and unittest, but there is no app.py and CI and the Makefile use flask on port 8000 with pytest and ruff; it trusts the CI and Makefile and says so
