I can't give you one honest number yet. Here is a range you can hand your manager, and a two-day plan that narrows it. A single number will be treated as a commitment, and right now the biggest cost driver is something nobody has looked at: how money is stored.

**Working range (before any investigation): about 8 to 20 weeks of calendar time for 3 devs, with low confidence.**

That is roughly 20 to 50 dev-weeks of effort. I'd bet on 12 to 14 weeks. The width is real. It comes from the unknowns below, not from caution.

**What I assumed "done" means:** live in production, with real invoices issued in at least two currencies, existing data migrated, and monitoring and rollback in place. If it only means "code merged behind a flag", it is shorter. Please confirm which one your manager means.

**Rough breakdown (effort in dev-weeks, best to worst case)**

| Piece | Range | Notes |
|---|---|---|
| Money storage: add currency, fix amount types, migrate existing rows | 2 to 8 | The biggest unknown. Floats, or integers with no currency, are very different from decimals. |
| Money handling in business logic: totals, tax, rounding, discounts | 3 to 8 | Rounding rules differ per currency (JPY has 0 decimals, KWD has 3). |
| Formatting in the 4 places | 1 to 3 | Consolidate into one formatter first, then add locales. Small if the 4 places are similar. |
| Exchange rates: source, caching, which rate applies when | 2 to 5 | A product decision as well as a technical one. |
| Reports, exports, PDFs, integrations (payments, accounting) | 2 to 8 | Anything that sums amounts across invoices now has to deal with mixed currencies. |
| Tests, review, rework | 3 to 6 | An old codebase with no money tests needs characterization tests first. |
| Rollout, backfill, monitoring, rollback | 1 to 3 | Money data migrations need a reversible plan. |
| Docs, support handover | 0.5 to 1 | |
| **Total** | **~14 to 42, plus unknowns** | I've rounded the range to 20 to 50 to include coordination and waiting. |

I haven't looked at your code, so these ranges come from general experience with this kind of change, not from your history. If you have past tickets for similar cross-cutting changes, tell me how long they took and I'll anchor on those.

**Unknowns that dominate the risk, and how to resolve each**

1. **How money is stored (1 to 2 days).** Read the schema and the code that does arithmetic on amounts. Is it a float, an integer in cents, or a decimal? Is there a currency column, or an implicit single currency? This one answer could move the estimate by weeks.
2. **The 4 formatting sites (half a day).** Grep for them and check whether they share logic. Also check whether amounts are formatted on the server, the client, or in PDFs and emails.
3. **Product decisions (a short conversation).** Which currencies? Do you store the invoice currency only, or also convert to a base currency? Which exchange-rate source, and is the rate fixed at invoice time? What happens to existing invoices? These are quick to answer but they block design.
4. **Everything downstream.** What reads invoice amounts: reports, payment provider, accounting export, tax? Make a list. Each item is hidden work.

I'd run a spike on points 1 and 2 first. It costs one dev about 2 days and will probably cut the range in half.

**What most likely moves the range**
- Floats or missing currency in storage push you to the top of the range.
- Tax and rounding rules per country.
- Third-party integrations that assume one currency.

**What I'd tell your manager today**
"Early range is 2 to 5 months with low confidence. After a 2-day investigation I can give a range I'd stand behind. Please don't treat today's range as a commitment."

If they insist on a date, I'd pick the upper-middle of the range (about 4 months) and treat anything earlier as a stretch. If the date is fixed, we should talk about scope: for example, "invoice in a chosen currency, store it, display it correctly, no conversion or multi-currency reporting" is a much smaller first release. Adding people helps only where the work can be split (formatting, tests, reports). It won't speed up the storage migration, and new people slow things down for the first weeks.

**Assumptions to confirm:** 3 devs available about 4 days a week for this work, no other major project competing, and a staging environment with realistic data. If any of these is wrong, the calendar time moves.

If you share access to the repo, I'll do the spike on points 1 and 2 and come back with a tighter range and a breakdown based on your actual code. I'll record this estimate with today's date (2026-11-20) so we can compare it with the actual outcome later.
