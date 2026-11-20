Both are doable in small steps. The main idea is that Stripe is the source of truth. Your admin panel asks Stripe to do things, and your database changes only when a verified webhook comes back.

## Quick scope check (reply only where my default is wrong)

1. **What a refund means for access.** My default is that a full refund removes course access and a partial refund keeps it. Is that right? Is there a refund window, such as 14 or 30 days?
2. **Countries and currencies.** Do you sell in the EU or UK, or only elsewhere? This affects refund rules and tax.
3. **Test mode.** I'll build and test everything in Stripe test mode. I won't use live keys or create real refunds without your explicit yes naming the action.

## Lifecycle states to decide on paper first

For a one-off course purchase:

| State | Customer sees | Access |
|---|---|---|
| paid | normal | yes |
| partially refunded | normal | yes (default) |
| fully refunded | "refunded" | removed |
| dispute opened | normal or flagged | your call: I suggest keep access while it is open, then remove it if you lose |
| dispute won | normal | yes |
| dispute lost | "disputed" | removed |

## Part 1: Refunds from the admin panel

- The admin button calls Stripe's refund API on the payment intent. It does not edit your database directly.
- Send an **idempotency key** with each refund request (for example one derived from the order ID and a refund attempt ID), so a double-click or a retry after a timeout can't refund twice.
- Store amounts as integers in cents with the currency code. Support a full refund and a partial refund, and check the amount against what is still refundable. Don't do your own refund arithmetic.
- Restrict the button to admin roles, ask for a reason, and write an audit log of who refunded what and why.
- Mark the order as refunded and remove access **only when the webhook arrives**: `charge.refunded` (and `refund.updated` or `refund.failed` for refunds that fail later). The button should show "refund requested" until then.
- Refunds you issue in the Stripe dashboard will also arrive through the webhook, so both paths end in the same state.
- Let Stripe send the refund receipt.

## Part 2: Chargebacks (disputes)

A chargeback happens when the customer's bank takes the money back. It comes with a fee and a deadline for evidence, so the webhook has to start your response process.

Events to handle:
- `charge.dispute.created`: flag the order, alert a human right away by email or Slack, and show the evidence deadline.
- `charge.dispute.updated` and `charge.dispute.closed`: record the outcome (won or lost) and apply your access rule.
- `charge.dispute.funds_withdrawn` and `charge.dispute.funds_reinstated` if you want exact accounting.

Evidence is the part you can prepare ahead of time. For digital courses, strong evidence is:
- the customer's login and course-progress history (lessons watched, dates, IP)
- the terms and refund policy shown at checkout
- the receipt and your emails or support messages with the customer
- a clear statement of what was delivered

Start logging lesson access and progress now if you aren't already. Submit evidence in the Stripe dashboard to begin with, and automate it later only if disputes become frequent. A clear refund policy and a recognisable statement descriptor also prevent many disputes, because customers often dispute a charge they don't recognise. Refunding a customer who is clearly unhappy is usually cheaper than losing a dispute.

I can't tell you your legal duties or tell you whether to fight a given dispute. That depends on the case.

## Part 3: Make the webhook safe first (this must come before adding events)

Today it handles only `checkout.session.completed`. Before adding more handlers:

1. **Verify the signature** with Stripe's library and the raw request body. Reject anything unsigned or too old.
2. **Idempotency:** store each Stripe event ID and skip the ones you've handled. Stripe retries and delivers events more than once and out of order. For example, a dispute event can arrive before the redirect or even before the order is saved. When order matters, read the current object from Stripe.
3. **Answer fast:** return 2xx once the event is stored and do heavy work in a queue.
4. Do "mark order refunded" and "revoke access" in one database transaction.
5. Log the event ID and outcome, alert if failures grow, and make it possible to replay missed events.
6. **Grant access only from the webhook,** not from the success page. Check that this is already true for `checkout.session.completed`.
7. Unhandled event types should return 200 and be logged. Don't let them error and cause retries.

Also configure the endpoint in the Stripe dashboard to subscribe to the new events. This is a change to your provider account, so I'll tell you exactly what I'd add and wait for your yes.

## Testing (all in test mode, no real money)

- Use the Stripe CLI to trigger events and test cards. Test card `4000 0000 0000 0259` creates a dispute.
- Cover: full refund, partial refund, a failed refund, an admin double-click, the same event delivered twice, and events out of order. Also cover a dispute opened, won and lost, and a refund done in the dashboard rather than the panel.
- Write automated handler tests with constructed events.
- Keep test and live keys and webhook secrets strictly separate, in environment config and never in the repo.

## Before going live (needs your yes)

- One real small payment and refund to confirm live webhooks arrive and verify.
- Alerts on webhook failures and on new disputes.
- A scheduled reconciliation that compares your orders with Stripe's, and a short runbook for "customer paid but has no access" and "customer was charged twice".

## What I'd build, in order

1. Harden the webhook (signature, event-ID store, queue).
2. Add refund and dispute event handlers plus the status and access rules.
3. Add the admin refund button with idempotency key, permissions and audit log.
4. Add dispute alerts and the evidence checklist.
5. Test in test mode, then agree a go-live checklist.

## Not covered here

Tax and VAT treatment of refunds, payouts, subscription handling (you only sell one-off courses), and legal advice on refund rights in your markets.

Answer the three scope questions (especially the access rule on refunds and where your customers are) and I'll start with step 1. I'd start by looking at your current webhook handler and how orders are stored.
