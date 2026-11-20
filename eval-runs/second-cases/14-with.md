Start with Discover, not code. This is a rebuild of a legacy app you didn't write, with one part-time developer and a June date. So I'd do three things in order, and I'd ask you a few questions before any plan.

**Where this sits:** Change existing code (a rebuild of a legacy PHP app), with Discover first, because "a modern app" is not yet a requirement.

**Step 1. Find out what the old site really does (about a week, read-only)**
I'd read the PHP code and database to list every feature: member list, event signups, logins, emails, admin screens, payments, anything hidden. I'd also check how it's hosted, where the backups are, and whether the PHP version is out of support. If it's exposed to the internet and unpatched, that is a risk today, whatever we build. This is the `codebase-onboarding` and `app-replica` approach: describe the behavior first, don't copy the code.

**Step 2. Ask the board (and you) what "modern" means**
Questions that decide the plan:
1. What problem do they feel today? Looks, mobile use, signups failing, hard to update, or security?
2. Who uses it, and how many members? Is it members only, or public too?
3. What must work on day one of June, and what can wait?
4. What personal data is stored (names, emails, phones, children's details, payments)? That affects security and privacy rules.
5. Budget for hosting and tools, and who will maintain it after you?
6. How many hours a week can you really give, and is June a hard date or a hope?

**Step 3. A one-page spec and a plan, which you approve before we build**
With part-time time, the realistic route is usually a small, boring stack you can maintain, not a fashionable one. Two choices are hard to undo, so I'd lay out options for them: rebuild vs. patch and modernize the PHP in place (upgrade PHP, fix security, restyle), and custom code vs. a hosted tool for events and members. Sometimes an off-the-shelf product covers 80% of this. I'd also give you an estimate as a range with its assumptions, not one date.

**Likely shape, if a rebuild wins:** a walking skeleton first (deploy, CI, login), then slices in order of value: member list, then event signups, then admin. Migrate the data last, rehearsed more than once, with the old site kept as a rollback until the new one is proven. Tests on the signup and data-migration paths, and a quick accessibility and security check before launch.

**Gates:** I'll stop after Discover and after the spec for your yes before moving on.

**What I need from you now:** access to the code and database (or a copy), the answers above even roughly, and the hosting details. If the answers are thin, the first deliverable is a one-page brief that you can show the board to settle scope before June is at risk.
