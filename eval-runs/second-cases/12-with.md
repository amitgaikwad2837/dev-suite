My recommendation is to buy a hosted identity provider and keep it replaceable. Don't build your own login system. This is hard to reverse, so below is how I got there. The call is yours, and I've listed what would change my answer.

## Why this deserves care

Login touches every user, every session and every customer's IT team. Once 40k accounts, password hashes, SAML connections and your own code depend on one approach, changing it means migrating live users. Switching away from a hosted provider is also hard, mainly because password hashes may not be exportable. So I'm treating it as hard to reverse.

## Criteria

Must-haves, each of which eliminates an option if it fails:
1. SAML SSO for the two customers who need it now, and a repeatable way to add more customers later, because B2B demand for SAML usually grows.
2. Can be run and secured by three backend developers without anyone becoming a full-time identity engineer.
3. You can get your users out later (export, or a migration path that doesn't force everyone to reset passwords).

Weighted criteria, most important first:
1. Security and ongoing maintenance burden
2. Total cost at 40k users with a few SAML connections
3. B2B features: organizations or tenants, roles, invitations, SCIM later
4. Time to ship
5. Lock-in

## Three options that differ in principle

**A. Build it yourselves** (own the user table, password hashing, sessions, MFA, reset flows, and SAML via a library).
- Easy: full control, no per-user fee, any custom flow.
- Hard: the SAML part is the trap. Every customer's IdP (Okta, Entra, Google) behaves a little differently, and SAML implementations have a history of signature-validation bugs. Add MFA, account recovery, breach handling, rate limiting, audit logs and compliance questionnaires. For three developers this is an open-ended maintenance load that never ships a feature.
- Reversal cost: high. You own all the data, so moving later is possible, but only after you've spent months on it.

**B. Hosted identity provider** (Auth0, Clerk, Cognito, or a B2B-focused one such as WorkOS).
- Easy: SAML, MFA, reset, bot protection and hosted login are done for you. Fast to ship and security patches are theirs.
- Hard: a per-user and per-connection bill, vendor limits, and their model shapes your data. Roughly: Cognito is cheap and handles SAML federation, but its B2B tenant model and customisation are weak. Auth0 is the most mature for enterprise and B2B, but the price climbs at your size, and SAML connections are priced into higher tiers. Clerk has the best developer experience, but check how its enterprise SAML is priced and how its organization model fits you. Verify current pricing for all of them. I'm not quoting numbers from memory.
- Reversal cost: medium to high, unless you plan for it (see safeguards below).

**C. Self-hosted open-source identity server** (Keycloak, Ory, or similar) running on your infrastructure.
- Easy: SAML and OIDC supported, no per-user fee, and you hold the data.
- Hard: you now run a security-critical service: upgrades, high availability, backups, patching. Three developers still carry that on-call load.
- Reversal cost: medium. Standard protocols and your own database make exit easier than B.

## Stress tests

| Scenario | A. Build | B. Hosted | C. Self-host |
|---|---|---|---|
| Failure mid-operation (an IdP outage or a bad deploy during login) | Your outage, your fix | Their outage, you can't fix it; check their SLA and status history | Your outage, but mature tooling |
| 10x load (400k users) | Scales with your own work | Cost jumps, since per-user pricing is the risk | Infrastructure cost only |
| Next quarter: a third customer wants SAML plus SCIM provisioning | Weeks of work per feature | Usually a configuration change | Config plus some effort |
| A customer sends a security questionnaire | You must prove everything yourself | You can cite the vendor's certifications | Mixed |

I haven't run a spike for this reply. Before committing, I'd do two cheap tests: (1) get a real SAML connection working with one of your two customers' IdPs in a trial tenant of your top two vendors, and (2) check whether each vendor can export your users with password hashes.

## Decision

Pick **B**, with the following safeguards. Some come from the options I'd otherwise reject.
- Keep your own `users` table with your own internal user ID. The vendor's ID is only a link. This is the main protection against lock-in.
- Put authentication behind a thin interface in your code (verify token, get user, list organizations), so that only one module knows the vendor.
- Use standard OIDC and SAML, not proprietary SDK features, wherever you can. This is the safeguard borrowed from C.
- Choose a vendor whose contract lets you export users and password hashes, or plan a gradual migration where users get a new hash on next login.
- Model the customer organization yourself, because that is the part that spans vendors.

I'd shortlist Auth0 (the enterprise and B2B path) and one B2B-oriented option (WorkOS or Clerk), and use the two tests above to pick. Cognito is the cheapest, but I'd choose it only if cost outweighs B2B polish and your team is already on AWS.

Why not A: you have three developers, and the SAML and compliance work is the kind of effort that never shows up on a roadmap. Why not C: it keeps most of the operational burden of A while saving you the per-user fee.

## What would change my mind

- The quote at 40k users plus your SAML connections is so high that it exceeds the cost of roughly one developer. Then reconsider C.
- No vendor can export password hashes and you can't tolerate a forced reset. Then the lock-in is worse than I'm assuming.
- Data residency or regulation prevents using a third-party cloud service. Then C.
- Authentication is your actual product, with unusual flows no vendor supports. Then A.

## Next steps

1. You decide: do you accept B with the safeguards above, or want to challenge it? Given the stakes, I can also run it through `llm-council`.
2. I'd write this up as a decision record at `docs/decisions/NNN-identity-provider.md` with today's date (2026-11-20), status "proposed", the options, the rejections and the revisit triggers above.
3. Run the two spikes, then fill in the vendor choice.

A few facts would sharpen this. What is your hosting (AWS or something else)? Do you expect SCIM or more than a handful of SAML customers in the next year? Do you have a rough auth budget per month?
