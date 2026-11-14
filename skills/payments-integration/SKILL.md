---
name: payments-integration
description: Adds payments to an app safely, with Stripe or a similar provider. Use when the user says "add Stripe", "take payments", "subscriptions", "billing", "checkout", "webhooks", "failed payments", "refunds", "invoices", "free trial", "customer portal", "PCI" or "sales tax". Keeps card data off your servers, grants access only from verified webhooks, makes handlers safe to repeat, stores money as integers, tests failure paths in the provider's test mode, and reconciles against the provider. Never uses live keys or moves real money without a named yes. Skip for deciding what to charge, and for general API design (api-design).
---

# Payments Integration

Payment bugs cost real money and trust, and many are silent: someone pays and gets nothing, or gets access without paying. The design goal is that the provider is the source of truth, your app listens to it, and every step can be repeated without harm.

## 1. Scope it first

Get these in a few lines, asking only what you can't find:
- What is sold: one-off purchases, subscriptions, usage-based, marketplace payouts. Each has different states.
- Which provider is already in use, and which countries and currencies matter, since tax, payment methods and rules vary.
- What a customer gets and loses at each step: access on payment, access kept during a failed renewal, access removed on cancel or refund.
- Whether anything needs real money to be moved. If you can't test it in the provider's test mode, say so before building.

Start with the least code that works: a hosted payment link or invoice for the first customers, then the provider's hosted checkout and customer portal. Build custom billing screens only when there is a reason.

## 2. Keep card data out of your system

Use the provider's hosted page or its embedded fields so card numbers never reach your servers, logs, database or analytics. Never build your own card form that posts numbers to your backend, and never store card numbers, expiry or security codes, even "just the last four and the expiry". Store the provider's customer, subscription and payment IDs instead. This keeps you in the simplest compliance category. Check that error logs, request traces and support tools don't capture payment fields (`observability`).

## 3. The provider is the source of truth

- **Grant and remove access from verified webhooks, never from the redirect page.** The success redirect can fail, be reloaded or be forged. Use it only to show a message and poll or wait for the webhook.
- **Verify every webhook's signature** with the provider's library and the raw request body, and reject anything unsigned or too old.
- Store the subscription or order status in your database, updated only by webhook events (and by a periodic sync that corrects drift). Handle at least: payment succeeded, payment failed, subscription updated, subscription cancelled, refund, dispute.
- Keep price and product definitions in the provider's dashboard and refer to them by ID or lookup key, not by amounts in your code.

## 4. Make every step safe to repeat

- **Idempotent handlers.** Providers retry and deliver events more than once and out of order. Record each event ID and skip the ones you've handled. Write handlers so a repeat changes nothing, and don't assume order: read the current object from the provider when it matters.
- **Idempotency keys** on every request that creates a charge, an order or a customer, so a retry after a timeout can't charge twice.
- **Answer fast.** Return a success status once the event is stored, and do the heavy work in a queue. A slow handler gets retried and runs twice.
- **Failures leave a trail.** Log the event ID and outcome, alert on a growing failure rate, and have a way to replay missed events.
- Wrap "mark order paid" and "grant access" in one database transaction.

## 5. Money and edge cases

- Store amounts as integers in the smallest unit (cents) with the currency code, never floats. Don't calculate tax or exchange rates yourself if the provider can; if tax matters, use its tax tool or a tax service and ask a professional about obligations.
- Design the lifecycle states on paper first: trial, active, past due, grace period, cancelled at period end, cancelled now, refunded, disputed, paused. Decide what the user sees and can do in each.
- Failed renewals: retries and reminder emails (the provider's dunning settings), a clear "update your card" path, and a defined grace period.
- Refunds, proration and plan changes: use the provider's behaviour, not your own arithmetic, and test them.
- Receipts and invoices: let the provider send them, and keep the legal fields it requires.

## 6. Test without real money, then go live carefully

- Build against test mode with the provider's test cards and CLI or dashboard event triggers. Cover: success, declined card, card needing authentication, failed renewal, cancellation, refund, duplicate and out-of-order webhooks, and a webhook that arrives before the redirect.
- Write automated tests for the handlers using recorded or constructed events (`test-strategy`).
- Keep test and live keys, webhook secrets and endpoints strictly separate, in environment config or a secret manager, never in the repo, the frontend bundle or logs (`security-review`).
- Before launch, with the owner's yes: one real payment and refund on a small amount, a check that live webhooks arrive and verify, alerts on failures, and a reconciliation report that compares your records with the provider's (`release-engineering`).
- **Never use live keys, create real charges, refunds or payouts, or change the provider account's settings without the user's explicit yes naming the action.**

## 7. Keep it honest after launch

Reconcile your database against the provider on a schedule and investigate every mismatch. Watch the numbers that show trouble early: failed payment rate, webhook failures, refunds and disputes. Keep a short runbook for "customer paid but has no access" and "customer was charged twice" (`incident-response`).

Report: what is sold and the lifecycle states, the flow and where card data stays, which events are handled and how repeats are made safe, how it was tested, what is not covered (tax, disputes, payouts), and what must be confirmed before going live.
