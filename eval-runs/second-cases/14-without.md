Start by treating this as a small, part-time project with a hard date, not as "build a modern app." Here is what I'd do, in order.

**1. Pin down what "modern app" means (week 1)**
Talk to one or two board members and ask:
- What is actually broken or painful today? Examples: members can't update their own details, signups are done by email, the site is insecure, it looks dated, it doesn't work on phones.
- Does "app" mean a mobile app, or just a site that works well on a phone? For a local club it is almost always the second.
- What happens in June? Is it a hard date for an event or a membership drive, or just the end of the board's term?
Write the answers on one page and get the board to agree to it. This is the most useful hour you'll spend, because "modern app" tends to grow into whatever the loudest person imagines.

**2. Find out what you inherited (week 1-2)**
- Get the code into git, and take a full backup of the files and the database before touching anything.
- Find out where it is hosted, who holds the domain and hosting logins, and which PHP version it runs. Old PHP versions are a security risk, and the club's member data (names, emails, maybe phone numbers) is personal data.
- Check for obvious holes: SQL built from user input, plaintext passwords, an admin page open to anyone, no HTTPS.
- List what the site does: member list, event signups, who can log in, any emails it sends, any payments. This list is your feature inventory.
- Check how big and how messy the database is, and whether the data is clean.

**3. Decide: rebuild, or fix up what's there**
With one part-time developer and about six months, you have three realistic options:
- **A. Stabilize and refresh the existing site.** Upgrade PHP, fix security problems, add a responsive front end. Lowest risk, but you stay on old code.
- **B. Rebuild on a managed platform.** Use an off-the-shelf tool for club management (there are many for memberships and event signups) and migrate the data. This is often the best answer for a volunteer club, because you don't build or maintain anything.
- **C. Custom rebuild.** A new app in a framework you know well. Most flexible, but you will own maintenance for years, as the only developer.
My honest lean is B if an existing tool covers 80% of the needs, otherwise C kept very small. If the board wants a custom build, I'd ask who maintains it when you move on. Write the decision down with the reasons.

**4. If you rebuild, keep it small and ship in slices**
- Make a short list of must-haves. For this club that is likely: member login, member list, event creation, event signup, and an admin view. Everything else goes on a "later" list.
- Pick boring, well-supported tools you already know, and a cheap host.
- Build the data migration early, since moving real member data cleanly is usually the riskiest part. Do a trial import well before June.
- Ship the smallest useful piece first (for example, event signups) and let a few members use it. Then add the member list. Don't plan on one big launch in June.
- Run the old and new sites side by side for a while, with a way to switch back.

**5. A rough timeline (about 6 months, part time)**
- Month 1: agree the goals, audit the old site, take backups, make the decision.
- Month 2: set up the new foundation, host, and deploy process; first slice working.
- Months 3-4: remaining must-have slices, data migration trial, basic tests on the important flows (signup, login).
- Month 5: let real members test it, fix problems, write a short admin guide.
- Month 6: cut over, keep the old site available for a rollback, and fix what comes up.
Leave a buffer of 30-40% for the usual surprises, because you're part time. Tell the board that the date holds only if the scope stays on the must-have list. If something new gets added, something else comes off.

**6. Things to raise with the board now**
- Who owns the logins, domain and hosting, and who has a copy of them.
- Privacy: what member data you hold, and the club's obligations under local law (GDPR or similar).
- Maintenance after launch. Even a small app needs someone to apply updates and renew the domain.
- A backup plan for you, such as a short handover doc, so the club isn't stuck if you're unavailable.

**What I'd do first, concretely**
I'd look at the codebase (structure, PHP version, database schema, and the obvious security issues), then write a one-page summary: what the site does, what's risky, and which of options A, B or C looks best. You could take that summary to the board as the basis for the scope conversation.

If you can share the code (or tell me the PHP version, the hosting, and roughly how many members and events there are a year), I can start with that audit. And it would help to know: what specifically triggered the board's request?
