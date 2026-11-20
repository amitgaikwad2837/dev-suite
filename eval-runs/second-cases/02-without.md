I'd change all four before partners start integrating. Each is cheap to fix now and expensive once three outside teams have built against it. Once partners depend on the contract, you can't change it without breaking them.

**1. Offset/limit paging with no max**
- With no cap, one call with `limit=10000000` can scan the whole table, so it is a denial-of-service risk and an easy way to scrape your data.
- Offset paging also gets slower as the offset grows, and it skips or repeats rows when orders are inserted while a partner is paging. Partners syncing orders will hit this.
- Use cursor (keyset) pagination: `?limit=50&cursor=<opaque>`. Return `next_cursor` in the response, or null on the last page.
- Set a default (say 50) and a hard max (say 100 to 200). Reject anything above the max with a 400, or clamp it, and document whichever you pick.
- Order by a stable key, such as `created_at` plus `id`, so pages are deterministic.

**2. Failures returning 200 with `{error: '...'}`**
- This breaks HTTP clients, retry logic, monitoring, caches and API gateways. They all treat 200 as success, so your error rate dashboards will read 0% while things are failing.
- Use real status codes: 400 or 422 for bad input, 401 or 403 for auth, 404, 429 for rate limits, and 5xx for server faults.
- Use one consistent error body. Machine-readable `code`, human `message`, optional `details` and a `request_id` work well. RFC 9457 (problem+json) is a good standard shape. Partners should be able to branch on `code`, never on message text.

**3. Sequential integer ids**
- They leak your order volume and growth rate to competitors and partners.
- They invite enumeration. If any authorization check is missing, `GET /orders/1001`, `1002` and so on becomes a data leak. That is an IDOR, a classic bug.
- They also lock your database design into the public contract, which makes sharding, merging systems or migrating harder later.
- Expose opaque ids instead, such as UUIDv7/ULID or a prefixed id like `ord_8f3k...`. Keep the integer as an internal primary key if you like.
- Whatever you pick, enforce per-partner authorization on every read. Opaque ids do not replace that check.

**4. Filtering with a `where` param that takes SQL-like text**
- This is the one I would block outright. Even if you parse it rather than pass it through, you have created a query language that is a SQL injection risk, a performance risk (unindexed or expensive filters) and a security risk (filtering on columns the partner should not see).
- It also makes your internal schema part of the public API. Every column rename becomes a breaking change.
- Use explicit, allowlisted filter params: `?status=shipped&created_after=2026-01-01&created_before=...&customer_id=...`. Add only the filters partners actually need, each backed by an index. You can add more later, but you can never take one away.
- Add a `sort` param limited to a few allowlisted fields, if sorting is needed.

**Other things to settle in the same pass**
- Auth and scoping: a partner should only ever see their own orders, enforced server side.
- Rate limits per partner, with 429 and `Retry-After`.
- Response envelope: `{ "data": [...], "next_cursor": "..." }` rather than a bare array, so you can add fields later without breaking anyone.
- Money as integer minor units plus a currency code, and timestamps in ISO 8601 UTC. Pick the conventions now.
- Versioning and deprecation: `/v1/` in the path, or a version header, plus a written policy on how much notice partners get for breaking changes. Adding fields is non-breaking, so tell partners to ignore unknown fields.
- Write an OpenAPI spec first, with example requests and responses, and share it with the three partners before you build. A month is enough time to get their feedback on the contract and to publish a sandbox.

**Suggested shape**

```
GET /v1/orders?status=shipped&created_after=2026-01-01&limit=50&cursor=abc
200 { "data": [ { "id": "ord_01H...", ... } ], "next_cursor": "def" }

GET /v1/orders?limit=5000
400 { "code": "invalid_limit", "message": "limit must be between 1 and 100", "request_id": "req_..." }
```

If it helps, I can draft the OpenAPI spec for this endpoint, or write a short deprecation and versioning policy to send to the partners. Which would you rather start with?
