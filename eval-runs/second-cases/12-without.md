Short answer: don't build it. Buy, and pick the vendor mainly on SAML pricing, organization support and how easily you can export your users later.

**Why not build**
- Three backend devs can build password login in a week. The hard part is the long tail: SAML/SSO with per-customer IdP quirks, MFA, account recovery, session and token handling, brute-force protection, audit logs, SCIM later, and being the team that gets paged when an auth bug is a breach. That is a permanent tax on a team of three.
- SAML is the deciding requirement. Two customers need it now, and B2B means more will ask. Building and maintaining SAML correctly (signature validation, XML attack surface, metadata rotation, IdP-initiated flows) is exactly where homegrown auth goes wrong.

**Your "hard to switch later" concern is real, but it is about lock-in, not about build vs buy**
Building does not remove lock-in. It moves it into your own code. You manage lock-in by choosing a vendor and structuring the integration well:
- Make sure you can export users, including password hashes (bcrypt or a documented format). Check this per vendor before signing. Cognito is the weakest here: it will not export password hashes.
- Keep your own user table keyed by your own internal user ID, with the vendor's subject ID as a mapped column. Never use the vendor's ID as your primary key.
- Use standard OIDC/OAuth with JWTs, and put the vendor behind a thin auth module in your code, so the rest of the app only sees "current user and org".
- Avoid vendor-specific features (custom rules or hooks, proprietary user metadata) for core logic.

**The three options for your situation (40k users, B2B, SAML)**
- **Auth0**: the most mature for B2B enterprise SSO, with Organizations, SAML connections and good docs. Cost is the catch. Enterprise SSO connections and the B2B plan are priced by connection, and 40k MAU gets pricey. Get a quote at your projected growth, not today's numbers.
- **Cognito**: cheapest at scale, and a good fit if you are already deep in AWS. But it is clunky: SAML works but needs more manual setup, the multi-tenant model is awkward, customization is limited, the developer experience is weak, and exporting hashes is not possible. This is the one that makes switching later hardest.
- **Clerk**: the nicest developer experience, especially for React/Next.js, and it has organizations and enterprise SSO. It is younger, and enterprise SAML is a paid add-on per connection. Check its maturity against your needs (SCIM, audit logs, data residency, SLAs).
- Also worth a look: **WorkOS** (built specifically for SSO and SCIM in B2B, priced per SAML connection, and you can pair it with a simpler login layer), **Keycloak** or **Ory** if you want self-hosted (but then you are running it, which partly defeats the purpose with three devs).

**My recommendation**
For a B2B product with SAML as a hard requirement and a small team, I'd shortlist Auth0 and WorkOS (or Clerk if your stack is React-heavy and you value speed), and treat Cognito as the budget option only if you accept the migration risk. Whichever you choose, the abstraction layer and own-ID mapping above is what actually protects you from "hard to switch."

**What I'd do next (about a week)**
1. Pin down must-haves: SAML (and SCIM?), MFA, organizations/tenants, data residency, SLA, audit logs, hash export.
2. Get pricing for 40k MAU today and 100k in two years, plus the per-SAML-connection price for 2, 10 and 30 customers. This often decides it.
3. Spike the top two: set up one real SAML connection with one of your two customers' IdPs (Okta or Entra) and migrate a sample of users. This tests the real thing.
4. Write the decision down (options, criteria, the choice, and what would make you revisit), including an exit plan.

**Questions that could change my answer**
- Do you already have 40k users with existing password hashes? That affects migration, because some vendors can import hashes and some cannot.
- Is there a compliance or data-residency constraint (HIPAA, EU-only)?
- Is your stack mostly AWS? That raises Cognito's appeal.
- What is the budget ceiling per month?

Happy to build the comparison matrix and the integration abstraction layout if you tell me your stack and the answers above.
