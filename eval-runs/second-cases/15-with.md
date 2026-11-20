# Developer Experience Plan Review: public REST API

Mode: plan review. Nothing is built, so I walked the intended journey on paper. Nothing here was run. Where the plan says nothing, I mark it "unspecified" and score it low.

## 1. Who the developer is

A backend engineer at another company, evaluating your API for a first integration. They want an authenticated call returning real data, inside their own app, today. They start from a clean machine with only your public docs. A second user is an agent or CI job calling the API non-interactively, and it meets your error bodies before any human does.

## 2. The first-run path as planned

| Step | What the developer does | Est. time | Friction |
|---|---|---|---|
| 1 | Finds the API, wants a key, finds no self-serve path | 2 min | High |
| 2 | Contacts sales, books a call, waits for the call and for support to issue a key | Days (1 to 5 business days) | High, likely a drop-off |
| 3 | Receives key, finds the README curl examples | 5 min | Medium |
| 4 | Runs curl against production, because there is no sandbox, with a real key against real data | 5 to 10 min | Medium to high (risk of side effects) |
| 5 | Hits an error, gets `{message: "..."}`, and has to guess the cause | 10+ min | High |
| 6 | Looks for the full reference. The OpenAPI file was generated at the end, so it may be stale or thin | 10+ min | Medium to high |
| 7 | Writes their own HTTP client, auth, retries and parsing | Hours | High |

Time to hello world: days of elapsed time, and about 30 to 45 minutes of active work once the key arrives. Against the rule of thumb (under 2 minutes excellent, over 10 loses most people), this loses nearly everyone who is only evaluating. Most will pick a competitor with a self-serve key.

## 3. Scorecard

| Area | Score | Evidence in the plan | What a 10 looks like | Fix |
|---|---|---|---|---|
| Zero friction at start | 1 | Keys issued by support after a sales call | Self-serve signup, a key in under a minute, no human in the loop | Self-serve test keys immediately; reserve sales for production limits or pricing |
| Time to hello world | 1 | Days of waiting, no quickstart | Under 5 minutes from landing page to first successful call | A quickstart with one copy-paste call, a pre-filled key in the docs when logged in |
| Sandbox / safe experimentation | 0 | No sandbox | Test-mode keys, fake data, and the same behaviour as production | Test and live keys, with a test environment or a `test_` key prefix |
| Errors | 2 | `{message: string}` only | Stable machine code, human message, the fix, a doc link, a request ID, the field at fault, and a correct HTTP status | Define an error envelope now (below) |
| Docs | 3 | OpenAPI generated at the end | A spec written first, a quickstart, auth guide, error catalogue, one realistic end-to-end example, and examples tested in CI | Spec-first design, plus hand-written guides on top of the reference |
| SDKs / ergonomics | 2 | curl in the README | At minimum a typed SDK in the top one or two languages the audience uses, generated from the spec | Generate SDKs from the OpenAPI spec, and ship Postman or Insomnia collections as a cheap first step |
| Agent-readiness | 2 | Nothing specified | Non-interactive auth, structured errors, an LLM-friendly spec, idempotency keys, stable codes | Same as the error and spec fixes; add idempotency keys on writes |
| Defaults and escape hatches | 0 (unspecified) | Not addressed | Sensible pagination and timeouts, with overrides | Decide pagination, rate-limit and versioning conventions in the spec |
| Upgrades and versioning | 0 (unspecified) | Not addressed | Versioned API, changelog, deprecation headers, migration guides | Pick a versioning scheme before launch; it is very hard to add later |
| Speed and iteration | 1 | Nothing specified | Fast responses, rate-limit headers, a quick edit-and-retry loop | Publish latency goals and rate-limit headers |
| Help and community | 0 (unspecified) | Nothing specified; the only contact is sales | Status page, support channel, an issue tracker, a searchable FAQ | A status page and a public support route |
| A moment that feels like magic | 1 | None | A first call that returns something visibly useful | Design the hello-world response to show real value |

Overall: this plan scores about 1 to 2 out of 10. Each choice is defensible in isolation, but together they put every barrier in front of the developer before they see any value.

## 4. Top three fixes (impact over effort)

1. **Self-serve test keys plus a sandbox.** This is the biggest change and removes steps 1 and 2 and the live-data risk in step 4. Issue test-mode keys on signup, with no sales call. Keep sales for production access, limits and contracts. If a human gate is needed for abuse or compliance, put it on live keys and not on first contact. Even a small sandbox with canned or seeded data is enough.
2. **Design errors now.** Replace `{message}` with a stable envelope, for example `{ "error": { "code": "invalid_parameter", "message": "...", "param": "limit", "fix": "limit must be 1 to 100", "doc_url": "...", "request_id": "..." } }`. Use correct HTTP statuses (400, 401, 403, 404, 409, 422, 429 with Retry-After). Changing error shapes after launch breaks every client, so this one is cheap now and costly later.
3. **Write the OpenAPI spec first, not last, and generate from it.** A spec-first approach lets you review the API's ergonomics before any code exists. You get docs, SDKs, mock servers and contract tests from it. A spec generated at the end only describes whatever was built, mistakes included, and teams usually run out of time for it.

## 5. Further fixes

4. SDKs: generate typed clients from the spec in the top one or two languages, and keep the curl examples as the "no-dependency" option. Curl-only is acceptable as a day-one floor but not as the plan.
5. A quickstart that gets a first call working in under 5 minutes, plus one realistic example covering auth, pagination, an error and a retry.
6. Decide versioning, pagination, rate limits and idempotency now. Each is cheap to decide on paper and expensive to retrofit.
7. Publish a changelog and deprecation policy before launch.
8. Add a status page and a named support route for developers who are stuck.

## 6. Where the sales-call model might be right

If this API is regulated, high-risk or priced per contract, some human gate is legitimate. The fix is not to remove it but to move it: let developers experiment freely in test mode, and gate only production credentials.

## 7. What I could not verify

This is a plan review only. I did not run anything and have no docs, endpoints or spec to inspect. The time estimates are my assumptions, not measurements. Once a prototype exists, I recommend a live audit: start from a clean container with only the public docs, run each step, time it and trigger real errors, then compare against this review and note where the plan was wrong.
