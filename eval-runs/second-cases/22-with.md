**Short answer: not yet a clean go. Right now it is a "go with conditions" at best, and it becomes a no-go if the one-person on-call item isn't fixed.** I can't call it Go from what you've told me, because several lines are claimed but not shown, and a couple haven't been mentioned at all.

**The launch in four lines**
- What goes live: a pilot for 20 users of one paying customer, Monday, billed by invoice.
- If it goes badly: one customer's data or trust, plus an invoice dispute. It is small and contained, which helps a lot.
- Decider: I assume you. Who else can say stop?
- Date: fixed by the customer? What does slipping a day cost?

**Gate table (based on what you said, not on evidence I've seen)**

| # | Line | Status |
|---|------|--------|
| 1 | Real signup, real payment, real refund | Adapted: no Stripe, so the money path is invoice creation, delivery, and a credit note or void. **Open**: has someone run one full invoice cycle (create, send, arrive in the customer's inbox, correct amount and tax, cancel or credit)? Test amounts only are not enough. |
| 2 | Emails arrive in a real inbox | **Open**: invite, verify, reset and invoice emails to a real address at the customer's domain, not in spam. Their mail filters are the usual trap. |
| 3 | Terms, privacy, contract | **Open**: is there a signed pilot agreement or order form, and are terms and privacy linked? Billing by invoice means the contract is your payment mechanism. |
| 4 | Backup restored | **Done, pending evidence**: you restored last week. Please give me the date and the restored row you read. Confirm it covers the current production database and has been re-verified since any recent migrations. |
| 5 | Migrations on production-size data | **Open**: not mentioned. Does the launch need any manual database edit? |
| 6 | Alert reaches a person, acknowledged | **Open**: you have monitoring, but has an alert fired on a test failure and been acknowledged on your phone, outside working hours settings? |
| 7 | Errors and health check visible without a server login | **Open/likely Done**: confirm. |
| 8 | Named on-call for first 24 hours | **Open, the main concern.** Just you, with no backup and no second contact for the decider. |
| 9 | Rollback tried, under five minutes, written down | **Done, pending evidence**: when was it last tried against the current version? |
| 10 | Can turn off new users without breaking existing | **Open**: not mentioned. For a 20-user pilot, can you disable signups or invites cleanly? |
| 11 | Smoke test on the live address, capacity | **Open**: smoke test on production; load is trivial at 20 users, so a rough estimate suffices. |
| 12 | Rate limits, no secrets in repo, no default admin or test passwords | **Open**: quick check, and remove or disable test accounts before the customer logs in. |
| 13 | Support readiness | **Open**: where does the customer report problems, who answers, and what are three prepared answers (login, wrong data, invoice question)? Give them your direct contact. |
| 14 | Not tired, not a Friday | Monday is fine. Do you start the day rested and free of other commitments for the first hours? |
| Extra | Invoice-specific | **Open**: invoice numbering, tax and currency, payment terms, who sends the first invoice and when, and what happens if the customer's usage exceeds 20 users. |

**Verdict:** On what you've said, money and data are probably fine, and rollback is claimed. But the verdict is **No-go until on-call is fixed, then Go with conditions.** A single person with no backup is a hard gate in this check. You don't need a team, but you need a named reachable second person, even if only "if I don't acknowledge in 15 minutes, call X," plus the decider.

**Smallest change to turn it into a go (about half a day to a day):**
1. Name a backup contact, and tell the customer how to reach you.
2. Run one real end-to-end invoice and email test to an external inbox (1 to 2 hours).
3. Fire a test alert to your phone and acknowledge it.
4. Send me evidence for the backup restore and rollback (dates and links).
5. Confirm you can disable new signups, and remove test and default accounts.
6. Confirm the signed agreement exists and terms and privacy are linked.

If items 2, 3 and 5 can't all be done by Sunday, shrink the launch rather than slip: start with 3 to 5 of the 20 users on Monday and widen on Tuesday or Wednesday if the first day is clean. Because it's a pilot, that costs very little.

**First hour on Monday:** Watch the error rate, failed logins, invite delivery and any support message. Stop and roll back if invites don't arrive, the customer sees wrong data, or errors spike. Widen to all 20 once the first few users have completed their main journey. Write down the accepted risks (single on-call, anything you left open) so Tuesday's review can compare.

Send me the evidence for the Open lines and I'll re-run the gate and give a final verdict.
