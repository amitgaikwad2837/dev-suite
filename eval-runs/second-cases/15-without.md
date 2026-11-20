Short version: as written, this plan will make the API hard to adopt. Five decisions are cheap to fix now and expensive to fix after launch. Below they are ranked by how much they hurt a developer's first hour.

## Verdict: change before building

### 1. Keys issued by support after a sales call (highest impact)
A developer can't try the API until they've talked to a person. Most will give up, or pick a competitor they can use today. Time to first successful call (TTFC) is the key metric, and this plan makes it days instead of minutes.
- Self-serve signup that issues a test key instantly. Add a human step only for production or higher limits, if you need it.
- Let developers create, rotate and revoke their own keys. Support-issued keys also mean no rotation after a leak, unless someone files a ticket.
- If the sales call is a business requirement (pricing, compliance), keep it for production access only. Test-mode access should be open.

### 2. No sandbox
Developers can't safely experiment, and every integration test runs against real data or real money. This is closely tied to #1.
- At minimum, provide test-mode keys that hit the same endpoints but use isolated data, with no side effects.
- Add deterministic test fixtures for the cases that are hard to trigger, such as a failed payment or a rate limit.
- If a full sandbox is too much for v1, test keys plus a seeded demo dataset is a reasonable first step.

### 3. Errors are `{message: string}`
Callers can only show the string to a human. They can't branch on it, retry, or tell you what went wrong when they file a bug.
Use a structured shape, such as RFC 9457 problem details or your own equivalent:
- a stable machine-readable `code` (for example `rate_limited`, `invalid_parameter`)
- the correct HTTP status
- a `message` meant for humans
- a `param` or `field` pointer for validation errors
- a `request_id` that support can search for
- a `docs_url` linking to a page on that error
Decide now which errors are retryable, and document it. Adding fields later is compatible, but a bare message means callers will end up parsing your strings, and you'll then be unable to change the wording.

### 4. OpenAPI generated at the end
Docs written last are docs that are wrong or thin. They also mean the API design never gets tested from the caller's side.
- Write the OpenAPI spec first, as the contract, and review it before any code. Awkward naming and inconsistent pagination show up here, when they cost nothing to change.
- Generate server stubs, validation, mock server and tests from it, and fail CI when the implementation drifts from the spec.
- Add hand-written content on top of the reference: a quickstart (first call in under 5 minutes), authentication, errors, pagination, rate limits, idempotency, webhooks if any, and a changelog.
- Every endpoint needs a request and a response example that actually runs.

### 5. SDKs are "curl examples in the readme"
Curl is fine as the universal example format, but it is not an SDK. Developers have to hand-build auth, retries, pagination and error parsing in every language.
- Generate SDKs from the OpenAPI spec for the two or three languages your users actually use. Check which those are before choosing.
- Until then, give runnable examples per language in the docs, plus a Postman or Insomnia collection.
- Put the examples in the docs site or a repo, not only a README, so they can be tested in CI. An example that doesn't run is worse than none.

## Things the plan doesn't mention that you will need
- **Versioning and deprecation policy.** Decide the scheme (URL or header) and how much notice you'll give before breaking changes, before the first customer depends on it.
- **Rate limits** with standard headers and a clear error, and the documented limits per plan.
- **Pagination, filtering and idempotency keys** for writes, designed up front in the spec.
- **Auth details:** key scopes, key prefix (so leaked keys can be detected by secret scanners), never sending keys in URLs.
- **Support path and status page** for developers, and a changelog they can subscribe to.
- **Measurement:** TTFC, signup-to-first-call conversion, and the most common error codes. Without these you won't know whether any of this worked.

## Suggested order of work
1. Write the OpenAPI spec and error model first, and review them with two or three target developers.
2. Build self-serve test keys and the sandbox together.
3. Generate the docs and one or two SDKs from the spec, with a quickstart.
4. Launch to a small group, time how long a new developer takes to make a first call, and fix whatever slows them.

Happy to turn this into a checklist with an owner and a done-when for each item, or to draft the error format and the quickstart outline, if that would help.
