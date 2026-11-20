Good time to ask. Three partners integrating in a month means this API is about to have callers you can't edit, so anything you ship now is a promise. Four of your five decisions would be expensive to undo. I'd change all four before partners start.

**1. Offset/limit with no max**
- With no cap, `?limit=1000000` is a denial-of-service waiting to happen, and partners will write code that depends on whatever size you happen to allow.
- Offset paging also skips or repeats rows when orders are created while someone pages through. Orders change constantly.
- Use a cursor: `?limit=50&cursor=<opaque>`, with a documented default (say 50), a hard max (say 200), and a stated sort order (for example `created_at desc, id desc`). The response returns `next_cursor`, which is null on the last page.
- Adding a cap later is a breaking change for anyone who relied on large pages. Adding it now costs nothing.

**2. Failures returning 200 with `{error: '...'}`**
- This breaks every HTTP client, retry library, proxy and monitoring tool, since they all treat 200 as success. Your own error-rate dashboards will read zero.
- Use correct status codes (400, 401, 403, 404, 429, 5xx) and one error shape for the whole API:
```json
{ "error": { "code": "invalid_filter", "message": "Unknown field 'statu'", "field": "filter[statu]" } }
```
- `code` is stable and machine-readable, `message` is for humans, and `field` is present for validation errors. Partners will write `switch` statements on `code`, so don't change codes later.

**3. Sequential integer ids**
- Anyone can enumerate your orders, and anyone can read your order volume off the ids. If an authorization check is ever missed on one endpoint, enumeration turns that bug into a data leak.
- Use opaque string ids (for example `ord_8f3k2...`). Treat them as opaque in the docs so you can change the internals later.
- This is cheap now and nearly impossible later, because partners store these ids.

**4. A `where` param taking SQL-like text**
- This is the one I'd push back on hardest. Even if you parse it yourself, you've created a query language that is a public API. Every quirk becomes a promise, and injection and expensive-query risks come with it.
- It also invites filters on unindexed columns, and one partner's `where` can slow the database for everyone.
- Use explicit, allow-listed filters on fields you've indexed: `?status=shipped&created_after=2026-01-01T00:00:00Z&customer_id=...`. Add `sort=` on indexed fields only.
- If partners later need richer queries, add specific filters one at a time. Adding a filter is a safe change. Removing a query language is not.

**Other things to settle in the contract this week**
- Money as integer minor units plus a currency code, never a float. Timestamps as ISO 8601 in UTC. One naming style (snake_case) across paths, fields and enums.
- Tell partners to ignore fields they don't recognize. That is what makes adding fields safe later.
- Auth and scoping: a partner sees only their own orders. Document rate limits and return the headers that report them.
- When you add `POST /orders`, accept an `Idempotency-Key` so a retry doesn't create duplicates.

**What I'd do next**
1. I'd write the contract as an OpenAPI file before any code: `GET /orders` and `GET /orders/{id}`, each with a real request and response example, including one error example. I can draft this for you.
2. Send it to the three partners for a quick look. Changing a document costs minutes, and changing a shipped endpoint costs months.
3. Build against the spec and add contract tests that fail if a response stops matching it.

**Questions for you**
- Are the partners the only callers, or will the public API open up wider? That affects rate limits and how strict deprecation needs to be.
- Is there an existing spec or an internal version of `/orders` whose naming I should match?
- Do you need any filtering beyond status, date range and customer for launch?

Once the first partner goes live, every change needs to pass the question "does code written against the old version still work, unchanged?" Fixing these four now means none of them will ever need a deprecation path.
