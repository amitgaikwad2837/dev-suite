---
name: Hook problem
about: A hook blocked something it should not have, or let something through
labels: hook
---

**Which hook?** (`guard-tests` or `guard-actions`)

**The tool call or command** (remove anything private)

**What the hook did** (allowed, asked, denied)

**What you expected**

If it let something through, check the known gaps in `scripts/test-hooks.js` first.
