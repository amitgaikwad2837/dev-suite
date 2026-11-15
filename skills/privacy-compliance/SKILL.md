---
name: privacy-compliance
description: Finds and fixes privacy and data-protection gaps in a product so it handles personal data lawfully and honestly. Use for GDPR, CCPA, HIPAA, COPPA and similar rules, what personal data we store, consent and cookie banners, privacy policies, deleting or exporting a user's data, data retention, sending customer data to vendors or AI providers, DPAs, data breaches and children's data. Maps the data, finds which rules apply, builds the mechanisms, and says what needs a lawyer. Not legal advice and never certifies compliance. Skip for finding code vulnerabilities (security-review) and for threat-modelling a new feature (security-prompter).
---

# Privacy and Compliance

Most privacy trouble comes from three things: nobody knows what personal data the product holds and where it goes, the policy says one thing and the code does another, and a person's request to see or delete their data has no mechanism behind it. Fix those in order. You are an engineer's aid, not a lawyer: say what applies as far as you can tell, build what the code needs, and name what a lawyer or the data owner must decide. Never state that the product is compliant.

## 1. Map the data first

List every kind of personal data (name, email, device IDs, IP address, location, health, payment, photos, anything about a child) and, for each: why it is collected, where it comes from, where it is stored (databases, logs, backups, analytics, support tools, data warehouse), which vendors receive it (including AI providers), who inside can see it, and how long it is kept. Read the code, schemas, event tracking and vendor settings instead of asking only what people remember. Anything with no clear purpose is a candidate to stop collecting.

## 2. Work out which rules probably apply

Ask where the users are and what kind of data it is. Common triggers: people in the EU or UK (GDPR), California and other US states (CCPA and similar), health data (HIPAA in the US for covered organisations, and special-category rules in the EU), children (COPPA under 13 in the US; higher age limits for consent in parts of the EU), cards (PCI), and sector rules. Say which seem to apply and why, state what you are unsure about, and mark what needs counsel. Health, biometric, precise location and children's data are the high-risk kinds.

## 3. Collect less, and say why

- Collect only what the feature needs. Replace precise data with coarse data where it will do (a city instead of a location history), and pseudonymise or aggregate for analytics.
- Each purpose needs a lawful basis. Where consent is required it must be specific, freely given and as easy to withdraw as to give. "Keep it forever in case we want it for machine learning later" is not a purpose.
- Cookie and tracking banners: non-essential tracking is off until the person agrees, and Reject is as easy as Accept. No pre-ticked boxes and no hidden options.

## 4. Build the mechanisms for people's rights

- People can ask for a copy of their data, correction, deletion and to stop certain uses. Build a real path (a setting or a form is best; an email address can work if a process stands behind it), with identity checks and the legal deadline in mind (about a month under GDPR, 45 days under CCPA).
- Deletion must reach every copy: the main database, search indexes, caches, files, analytics, the warehouse, support tools and vendors. Backups may expire on a schedule, which should be written down.
- Test it with a real account end to end and check what is left.

## 5. Vendors and transfers

Every vendor that receives personal data (analytics, email, support, hosting, AI providers) needs a data processing agreement, an entry in a list of sub-processors, and a check that it uses the data only for you (for example, no training on customer data). Sending personal data across borders needs a lawful transfer mechanism. Do not send health, financial or children's data to a vendor without a decision and a basis. Strip what the vendor does not need before sending (`llm-app-work` for AI providers).

## 6. Retention and security

Write a retention schedule with a period for each kind of data and delete automatically when it ends. Encrypt in transit and at rest, limit who can read personal data, keep it out of logs and error messages, and use separate environments for test data (`security-review`, `data-engineering`). Have a breach plan before you need it: who decides, who is told (regulators often expect notice within 72 hours), how users are told, and how to find what was exposed.

## 7. Make the documents match the product

The privacy policy must describe what the product actually does, in plain language: what is collected, why, who gets it, how long it is kept, and how to use your rights. A policy copied from a competitor is wrong by construction. Draft it from the data map, then send it to the owner and counsel; do not publish it yourself. For high-risk processing, a data protection impact assessment is usually needed. Keep a record of what you process and the decisions made.

## 8. Hand over

Give the data map, the rules that probably apply and why, the gaps ranked by risk, what was built or changed, what needs a lawyer or the data owner, and what was not checked. State plainly that this is not a compliance sign-off.
