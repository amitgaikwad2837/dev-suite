You asked for one number, so here is the number your manager can plan around: **about 4 to 7 months of calendar time for 3 devs (roughly 9 to 14 person-months), with 5 months as the most likely outcome.** I would not promise a single date, because the main risk is something nobody can see yet.

**Why it is a range**

The big unknown is how money is stored. You can settle that in a day or two, and I would do it before committing to anything.

- If amounts are integer minor units (cents) in the database, this is the good case. Expect about 3 to 4 months.
- If amounts are floats or decimals with no currency column, expect about 5 to 6 months. Every table that holds money needs a migration and a backfill, with a currency assumed for the historical data.
- If storage is inconsistent (some tables in cents, some in floats, some as strings), expect 7 months or more. You would have to normalize it before building anything on top.

**What is in the estimate**

- Data model: currency on invoices, line items, payments and customers. A migration with a backfill and a rollback plan.
- Formatting: the 4 places that format amounts become one money/format helper. This is a small piece, about 1 to 2 weeks including finding every call site, and it is the cheapest win.
- Exchange rates: pick a source, store the rate used on each invoice so old invoices don't change, and decide on rounding rules per currency (JPY has 0 decimals, KWD has 3).
- Arithmetic: totals, tax, discounts and rounding in the invoice's currency. Mixing currencies in one calculation has to be blocked.
- Reports, exports, PDFs, emails and any integrations (payment gateway, accounting, tax). These are usually where the surprises turn up.
- Testing, including regression on existing invoices, and a staged rollout.

**What people forget that I have included**

- Tax and legal rules per country, such as VAT and required invoice formats. I treated this as out of scope unless you tell me otherwise. If it is in scope, add 1 to 2 months.
- Data migration rehearsal on a copy of production.
- Having to learn a 6-year-old codebase that nobody fully understands.
- About 20% buffer for the above.

**Questions that would move the number**

1. Does each invoice have a single currency, or can one invoice mix currencies?
2. Which currencies, and do you need live exchange rates or fixed ones?
3. Is tax or legal compliance per country in scope?
4. Which payment gateway and accounting integrations exist?

**Suggested next step**

Spend 2 days on a spike. Read the schema, trace one invoice from creation to PDF, and list every place amounts are formatted or calculated. After that I can narrow the range, likely to within 20%. In the meantime, tell your manager "4 to 7 months, with a firmer date after a 2-day investigation". That is more honest than a single number, and it will hold up better when the data model turns out to be messier than expected.
