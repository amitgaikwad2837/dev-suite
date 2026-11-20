Short answer: conditional go. You have the hard infrastructure basics (monitoring, a tested rollback, a recent backup restore). For a 20-user pilot that is a reasonable base. The gaps are in the areas you didn't mention, and most of them are cheap to close before Monday.

**What is solid**
- Monitoring plus a tested rollback.
- A backup restore done last week. Run one more before Monday if you deploy anything in between, and note how long the restore took, because that is your real recovery time.

**What I'd close before Monday**

1. **Alerts that reach you.** Monitoring only helps if it pages you. Check that alerts go to your phone, not only a dashboard. Test one end to end. Also add an external uptime check, because if your whole stack is down your internal monitoring may be down with it.

2. **You are the only on-call.** For a pilot that is acceptable, but make it explicit.
   - Name a backup person, even if informal, for when you are asleep, on a plane or sick.
   - Tell the customer your support hours and response times so they don't assume 24/7.
   - Write a one-page runbook (how to roll back, how to restore, who to contact) so you can act at 3am without thinking.

3. **Invoice billing.** No Stripe means no automated safety net, so the failure modes are manual.
   - Confirm the contract or order form states price, term, payment terms, and what happens if they don't pay.
   - Decide how you'll track usage, issue the first invoice, and chase it.
   - Check you can legally invoice (tax or VAT details, company details on the invoice).
   - Decide how you cut off or downgrade access if they don't pay. Ideally this is a manual switch you have tested.

4. **Customer data and security basics.** Check these before real users log in.
   - Check data isolation: can user A see user B's data? Test it with two accounts.
   - Check that secrets are not in the repo, that production credentials are separate from dev, and that admin access is limited and uses MFA.
   - Make sure you have a privacy policy and terms, and a data processing agreement if the customer asks for one (a first enterprise customer often will).
   - Check that the customer can export or delete their data on request.

5. **Onboarding of the 20 users.** Know how accounts are created (invites, SSO, manual), what happens if someone is locked out, and where support requests go (a shared inbox rather than your personal one). Run through the signup and first-use flow as a brand-new user on production.

6. **Capacity and limits.** 20 users is small, but confirm you have rate limits or at least sensible resource limits, and that one heavy user can't take the service down. Do a quick load check on the main flows if you haven't.

7. **A rollout plan for Monday itself.** Don't deploy other changes over the weekend. Freeze the release, onboard in the morning (not Friday evening or late Monday) so you have working hours to react, and consider onboarding a few users first and the rest the same day or the next.

8. **Stop conditions.** Decide now what would make you pause the pilot or roll back (for example data exposure, repeated errors above a threshold, or a billing mistake), so you aren't deciding under stress.

**Verdict**
- If items 1 to 4 are covered, I'd say go.
- If you have not tested alert delivery, data isolation between users, or the contract and invoicing path, I'd hold until you have. Each takes under an hour and each is the kind of thing that goes badly with a first paying customer.
- Being the only on-call is not a blocker by itself. It becomes one if nobody knows that and nothing is written down.

If you'd like, tell me what the product does and how the customer's data is stored, and I can turn this into a specific checklist with pass/fail checks for Monday.
