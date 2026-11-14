---
name: api-design
description: Designs and changes HTTP, GraphQL or library APIs so callers don't get broken. Use when the user says "design the API", "add an endpoint", "REST or GraphQL", "what should this return", "rename this field", "change the response", "version the API", "deprecate this", "is this a breaking change" or "write the OpenAPI spec". Works out who calls it, writes the contract with examples before code, fixes the details people regret later (errors, pagination, idempotency, naming), and treats every change to a live API as a compatibility question with a deprecation path. Skip for choosing between whole architectures (design-decision) and for internal functions with one caller.
---

# API Design

An API is a promise to people whose code you can't edit. Mistakes in it are cheap to make and expensive to undo, so the work is: know the callers, write the contract first, and treat changes as compatibility questions.

## 1. Know who calls it

Get these in a few lines, asking only for what you can't find in the code or docs:
- Who the callers are (your own frontend, partners, the public, other teams) and roughly how many. Look at the existing spec, routes and access logs before asking.
- Whether the API already has callers. If it does, section 5 applies to every change.
- What the callers are trying to do, in tasks, not in tables. Design the operations from those tasks.

## 2. Shape the contract

- **Resources and names.** Nouns for things, verbs only for actions that aren't CRUD (`POST /orders/{id}/cancel`). One naming style for paths, fields and enums, copied from what already exists.
- **Same thing, same shape.** One representation per resource everywhere it appears. Money as an integer in minor units or a string with a currency, never a bare float. Timestamps as ISO 8601 in UTC. IDs as opaque strings.
- **Lists.** Paginate from day one, with a cursor if the data changes while people page. Say the maximum page size and the sort order. Filtering and sorting only on fields you will index.
- **Errors.** One error shape for the whole API: an HTTP status that is right, a stable machine-readable code, a human message, and the field at fault for validation errors. Never return 200 with an error inside.
- **Writes.** Say which operations are safe to retry. Accept an idempotency key on creates and on anything that moves money. Decide what happens on partial failure in a bulk call: all or nothing, or a per-item result.
- **Limits.** Authentication and what each caller may see, rate limits with the headers that report them, maximum body size and timeouts. Long work returns `202` and a status resource, not a held-open request.
- **Unknowns.** Callers should ignore fields they don't know, and you should say so in the docs. That is what makes adding fields safe.

## 3. Write the contract before the code

Write it as an OpenAPI file, a GraphQL schema or the equivalent, with a real request and response example for every operation, including one error. Show it to a caller or the user before building. Changing a document costs minutes; changing a shipped endpoint costs months.

## 4. Build against it

Generate or check the implementation against the contract so they can't drift. Add contract tests that fail when a response stops matching, and a test for each documented error. Use `test-strategy` for the rest, and `security-prompter` or `security-review` for auth and exposure.

## 5. Changing a live API

Ask of every change: can code written against the old version still work, unchanged?
- **Safe:** a new optional request field, a new response field, a new endpoint, a new enum value only if callers were told to expect them.
- **Breaking:** removing or renaming a field, changing a type or unit, changing a status code or error code, making an optional field required, tightening validation, changing defaults, changing the meaning of a value.

For a breaking change, don't edit the existing contract in place. Pick the lightest path that works:
1. Add the new field or endpoint beside the old one and keep both.
2. Let callers opt in with a version header, a path version or a flag.
3. If it has to be a hard break, publish a new version.

Then deprecate the old one on purpose: mark it in the docs and spec, send a `Deprecation` or `Sunset` header, tell callers by name with a date, watch usage until it reaches zero, and only then remove it. Keep one change log for callers. Whatever the plan, say who is affected and get a yes before the old behaviour is removed. If the change also touches stored data, use `schema-changes`.

## 6. Report

Give the contract (or its path), the decisions on errors, pagination, retries and limits, which changes are breaking and the path chosen for each, the deprecation dates, and what was left open.
