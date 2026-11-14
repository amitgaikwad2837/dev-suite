---
name: app-replica
description: Rebuilds or replaces an existing application from its observed behavior, without copying its code. Use for replacing a legacy system you own or matching an existing tool's features for internal use. Scope, black-box behavior spec, fresh build in slices, parity checks, cutover with rollback.
---

# App Replica

Use when the user wants to recreate an application's behavior: replacing a legacy system they own, matching a vendor tool's feature set for internal use, or building something inspired by existing software. Rebuild from observed behavior, not from the original's code.

**Boundaries first.** Confirm the user owns the original or has permission, or that the goal is a functionally similar product, not a lookalike. Never copy source code, assets, text, branding, trademarks or proprietary data, and never bypass access controls or licensing to inspect it. If the request is to impersonate another company's look and name, say so and ask for a distinct identity instead.

1. **Scope.** What must match (workflows, data, integrations) and what may differ (UI, stack, features to drop or improve). Write both lists.
2. **Observe as a black box.** Capture user flows, screens, data model, API contracts, validation rules, error states and edge cases from the running system, public docs or the user's own materials. Record them as a behavior spec and a parity checklist, one line per behavior.
3. **Design your own.** Choose the stack, naming, structure and visual design yourself; use `design-decision` for choices that are costly to change.
4. **Build fresh in slices** (see `new-app-build`), each slice covering a group of checklist items, with tests that encode the spec.
5. **Check parity** where it is legitimate to run both: feed the same inputs to the original and the replica and compare outputs, with differences either fixed or recorded as intentional.
6. **Report** a parity table (matched / intentionally different / not yet), plus risks. For a legacy replacement, plan data migration, shadow running and rollback with `migrate-and-upgrade`.
