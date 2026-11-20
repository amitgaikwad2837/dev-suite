I can help you build your own scheduling product, but not the plan as you've described it. Four parts of it are the problem.

**What I won't do, and why**

1. **Saving their HTML and CSS and reusing the frontend code.** That is copying copyrighted code. A trial account doesn't license you to reuse it, and the trial terms almost certainly forbid it.
2. **Having engineers read their JavaScript bundle and copy how it works.** Reading it to reproduce its logic is the same as copying the code. It also leaves your engineers "contaminated", which gives the competitor an easy infringement claim.
3. **Naming it "their-name Pro".** That uses their trademark and invites confusion and a trademark claim. You need your own distinct name and identity.
4. **Using their screenshots in your marketing.** Those are their copyrighted assets, and showing them to promote your product is misleading. Use screenshots of your own product.

Plan on getting a lawyer's view on the trial terms and on how you handle the competitor's materials. I'm not a lawyer.

**What I can do: build a functionally equivalent product from observed behavior**

Matching a competitor's features is legitimate. Copying their code, assets and identity is not. The approach:

1. **Scope.** We write two lists: what must match (booking flows, availability rules, calendar sync, reminders, payments, integrations) and what can differ or be improved (UI, stack, extra or dropped features). Your own customers' needs should drive this more than the competitor's feature list does.
2. **Observe as a black box.** One person, or a small group kept separate from the engineers, uses the product as an ordinary user, if the trial terms allow it. They also read the public docs, help center and API documentation. They record behavior only: user flows, screens, data fields, validation rules, error states, edge cases. The output is a written behavior spec and a parity checklist with one line per behavior. They don't save pages, bundles or assets, and they don't read or deobfuscate the JavaScript. They keep a log of what was looked at.
3. **Wall off the builders.** Your engineers build from the spec alone and never open the competitor's frontend code or bundle. This separation is what protects you if anyone challenges the work.
4. **Design your own.** Your own stack, naming, structure, visual design and brand. Where a choice is costly to reverse, such as the data model or the calendar-sync approach, we can compare options before committing.
5. **Build in slices.** Each slice covers a group of checklist items, with tests that encode the spec.
6. **Report parity.** A table showing each behavior as matched, intentionally different or not yet done, plus the risks. For marketing, we'd write your own copy and use your own screenshots, and you can truthfully compare features without using their branding.

**What I need from you**

- What is the product called, or is a name still open? I'd suggest a distinct brand.
- Which features matter most? For example: booking pages, team round-robin, calendar sync, payments, reminders, or an API.
- Who will do the observation, and are they separate from the engineers?
- Do you have a preferred stack, or should I propose one?

If you send me the answers, I'll start with the scope lists and a template for the behavior spec and parity checklist.
