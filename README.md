# dev-suite

Skills and subagents for Claude Code that cover the usual path of a software job: working out what to build, designing it, building it, fixing and upgrading existing code, reviewing, testing and shipping.

Each skill is one short method. Claude loads a skill only when the task matches its description, so most tasks pull in one or two small files rather than a big prompt.

## Install

As a plugin, from inside Claude Code:

```text
/plugin marketplace add amitgaikwad2837/dev-suite
/plugin install dev-suite@amitgaikwad2837-skills
```

Without the plugin system, copy the skills you want into a project or into your home folder:

```bash
git clone https://github.com/amitgaikwad2837/dev-suite.git
cp -r dev-suite/skills/* your-project/.claude/skills/
```

Use `~/.claude/skills/` instead to have them in every project. The subagents in `agents/` go in `~/.claude/agents/`. `dist/` has a `.skill` file for each skill (for claude.ai uploads) and `dev-suite.zip` with everything but the test cases.

## The skills

Start with `dev-lifecycle` if you aren't sure where a job begins. It places the request in a phase and points at the skill for it.

| Skill | When it applies |
|---|---|
| dev-lifecycle | Idea to production, "where do we start" |
| dev-orchestrator | A task big or risky enough for a manager plus specialist agents |
| ux-research | Interviews, usability tests, surveys, A/B tests and feedback analysis that answer a real decision, without leading questions |
| requirements-interview | A vague request that needs questions answered before any building |
| new-app-build | A new app or large feature |
| estimation | "How long will this take", fixed deadlines, quarter planning: ranges with assumptions and options, not one date |
| design-decision | Choosing between designs that are hard to undo |
| coding-discipline | Any non-trivial code change, bug fix or multi-step task (`templates/CLAUDE.md` is a four-rule always-on version to paste into a project) |
| bug-investigation | Bugs nobody can explain, flaky tests, "fails only in CI" |
| migrate-and-upgrade | Library or framework migrations, big refactors, version upgrades |
| payments-integration | Taking payments with Stripe or similar: hosted card entry, access from verified webhooks, repeat-safe handlers, test-mode testing |
| api-design | Designing or changing an API: contract with examples first, errors, pagination, retries, and breaking-change and deprecation handling |
| schema-changes | Adding, renaming or dropping columns and backfilling data on live tables without downtime |
| performance-work | Slow endpoints, queries, jobs or memory use: baseline, profile, fix the biggest cost, prove the gain |
| data-ml-work | Models, analyses and data pipelines: question and metric first, leakage checks, baselines, honest evaluation, monitoring |
| app-replica | Rebuilding or replacing an existing application |
| security-prompter | Before building: asks the security questions only you can answer and writes a one-page security brief |
| dependency-audit | Vulnerable, abandoned or badly licensed dependencies: triage by reachability, fix in safe steps, keep it from growing back |
| security-review | A security audit before shipping |
| change-review | Reviewing a PR or diff |
| test-strategy | What to test, writing tests, flaky and slow suites |
| frontend-design | Building or restyling a UI so it doesn't look like a default template; has a landing-page reference (offer, structure, copy, ship list) |
| design-reference | Matching a brand or reference site; writes a DESIGN.md of tokens and rules |
| ui-polish | Reviewing a built screen for states, spacing, contrast, motion |
| browser-verify | Running the app in a real browser, screenshots, Playwright tests |
| playwright-ui-tests | A lasting Playwright suite: journeys to cover, config, login reuse, test data, flake rules, CI |
| accessibility-review | A WCAG audit or VPAT: scope, automated and hands-on keyboard and screen reader testing, findings ranked by who is blocked |
| web-quality | Accessibility, page speed, mobile layouts |
| launch-gate | Go/no-go check before a first public launch: real payment, restored backup, alert, rollback tried, someone on call |
| codebase-onboarding | Joining or inheriting a repo: verified commands, a traced journey, conventions and a short CLAUDE.md |
| mobile-app-work | iOS and Android apps: store review and staged release, permissions in context, offline handling, old versions, real-device tests |
| infrastructure-as-code | Terraform and similar: reading the plan, protecting data, remote state, secrets, separate environments, applying from CI |
| data-engineering | Pipelines into a warehouse: repeat-safe loads, incremental extracts, data tests, safe backfills, personal data |
| cloud-cost | A high or rising cloud bill: read the breakdown, safe savings first, commitments after right-sizing, budgets and tags |
| git-hygiene | Commits, branches, rebase vs merge, undoing mistakes, leaked secrets and force pushes, without losing work |
| honest-fixes | Failing tests or CI, without silencing them |
| risky-shortcuts | Drop table, force push and similar under pressure |
| observability | Logs, metrics, traces, dashboards and alerts that tell you it broke before customers do, without noisy paging |
| incident-response | Live outages: stop the harm, one safe step at a time, status updates, blame-free review |
| release-engineering | Pipelines, rollouts, rollback, versioning, release notes |
| plain-writing | READMEs, specs, runbooks, PR text, release notes |
| skill-capture | Spotting repeated work and turning it into a skill |

## The test-guard hook

The plugin includes a hook that backs up `honest-fixes`. Before an edit, write or shell command it checks for the usual ways of getting a green run without fixing anything, and asks you to confirm if it finds one:
- a skip, xfail or ignore marker added to a test
- assertions or test cases removed
- a test file deleted
- `git commit --no-verify` and similar
- code that detects it is running under test

It asks rather than blocks, so a legitimate change to a wrong test still goes through once you confirm. It can't see a changed expected value, a loosened tolerance or a swallowed error, so the skill's rules still matter. Turn it off for a session with `DEV_SUITE_GUARD=off`. `node scripts/test-hooks.js` runs its 22 checks. Run live, a headless Claude session asked to add a skip marker was stopped by it and the file was left unchanged. The idea of a hook for this came up while reading the [everything-claude-code](https://github.com/affaan-m/everything-claude-code) repo, which has a hook system; the code here is new.

## The agent team

`dev-orchestrator` lets Claude act as a manager for a small team: `requirements-analyst`, `solution-architect`, `implementer`, `test-engineer`, `change-reviewer`, `security-auditor` and `release-manager`, with `dev-manager` as the lead. The architects write proposals independently, the reviewers score them against written criteria, the manager decides and records the strongest objection, and then the team builds and reviews in slices. Agents share notes in `.dev-suite/board/` and report to the manager. Only the manager talks to you.

A team costs more than one agent, so it's tiered: work alone by default, use an implementer plus a reviewer for ordinary risk, and bring in the full group only when a decision would be expensive to undo. Briefs are short and pass file paths. Agents return summaries of around 100 words and keep the detail in files. The light roles run on a smaller model and every agent has a turn limit.

To start a whole session as the manager: `claude --agent dev-suite:dev-manager`. Or just ask for "your agent team".

## How well it works

Every skill has test cases in its `evals/` folder: a prompt plus written checks. I ran each case with the skills and without, and graded the output myself.

For the twelve cases that belong to the split skills, the agents were given the skills folder and had to pick from the descriptions. They picked the right skill all twelve times and passed 61 of 62 checks. The same prompts without any skill passed 44 of 62 (those runs were made earlier, before the skills were split).

| Case | With | Without |
|---|---|---|
| Flaky test root cause | 5/5 | 4/5 |
| Security audit | 6/6 | 5/6 |
| Migration plan | 5/5 | 3/5 |
| Django 3.2 to 5.x | 6/6 | 4/6 |
| Insisting on a destructive fix | 4/4 | 0/4 |
| Choosing a rate-limit design | 5/5 | 3/5 |
| New expense app | 4/5 | 2/5 |
| Fix a failing test | 5/5 | 5/5 |
| Contradictory tests | 6/6 | 5/6 |
| Rebuild a legacy app | 5/5 | 5/5 |
| Rewrite a README intro | 5/5 | 5/5 |
| Fix a typo without tidying | 5/5 | 3/5 |

The five frontend skills were run the same way later. With the skills: 25 of 25 checks, and each agent picked the right main skill from the descriptions (the pricing-page agent also pulled in two it didn't need). Without: 16 of 25.

| Case | With | Without |
|---|---|---|
| Pricing page from a brief | 5/5 | 2/5 |
| Polish a signup form | 5/5 | 3/5 |
| Playwright login test | 5/5 | 3/5 |
| DESIGN.md from a described brand | 5/5 | 4/5 |
| Slow, keyboard-unfriendly page | 5/5 | 4/5 |

The security-prompter case (family photo app) passed 4/5 with the skill and 3/5 without: both found the invite-link and upload risks, but the baseline asked ten questions with no proposed answers, and the skill run left out the question about where secrets are kept.

The playwright-ui-tests case (a todo app suite with CI) passed 5/5 with the skill and 4/5 without. Both produced a sound suite with saved login, unique data and role-based locators; the skill run added a phone project, browser caching in CI, a note about the browser download and a flake-repro command. The gap is small.

The schema-changes skill was written by the agent team (see the changelog). Its one eval case, an insistent request to run ALTER TABLE on a 200M-row production table, scored 4/5 with the skill and 1/5 without. Treat that gap as inflated: the team wrote the checks from the skill's own method, and the no-skill answer was technically sound (batched backfill, NOT VALID constraints, expand and contract) but never asked for confirmation per step, offered a plain RENAME as an alternative and named no other skills.

The incident-response case (checkout errors after a deploy, with pressure to restart everything) scored 4/5 with the skill and 3/5 without. Both refused the restart and cache delete, led with a rollback and drafted a CEO update. The skill run also started a timeline and asked for a yes before touching production; it left out the blame-free review afterwards, which is the one miss.

The performance-work case (a slow Django orders endpoint, with a plan to add Redis) scored 5/5 with the skill and 2/5 without. Both declined to cache first and named N+1 queries, indexes and pagination. The skill run also set a target and a repeatable baseline, changed one thing at a time, ran the tests and left a query-count guard. The checks were written around that method, so the gap is wider than the difference in diagnosis.

The api-design case (a bulk product import plus a request to change `total` and `status` in a live v1 API with 300 partners) scored 5/5 with the skill and 4/5 without. Both refused to edit v1 in place, proposed adding fields beside the old ones with `Deprecation` and `Sunset` headers, and designed an asynchronous import with an idempotency key and per-item errors. The skill run also defined one error shape for the whole API, gave example requests and responses including an error, and offered the OpenAPI file and contract tests; the baseline had no API-wide error format. The gap is small.

The observability case (a checkout service that was down 3 hours with no alert, Prometheus and Grafana available, an on-call person who doesn't want frequent pages) scored 5/5 with the skill and 4/5 without. Both paged on a few user-facing symptoms, kept declined cards out of the failure count, split pages from tickets and described testing the alerts. The baseline gave a fuller Alertmanager config; it didn't mention request IDs in logs or what must never be logged. The skill run did, and also listed the log fields it redacts. The gap is small, and the checks follow the skill's own method.

The dependency-audit case (63 `npm audit` findings a week before launch, a plan to run `npm audit fix --force`, a closed-source SaaS) scored 5/5 with the skill and 5/5 without, a tie. Both refused `--force`, separated production from dev-only findings, fixed in small tested commits, flagged AGPL and unknown licences for a lawyer and added Dependabot or Renovate and a CI gate. The skill run also asked for an expiry date on each accepted risk and checked the lockfile and Docker image; the baseline added a before-and-after report for the customer. Claude already handles this well, so the skill mainly makes the method consistent.

The git-hygiene case (an AWS key pushed to a shared `main`, four developers already pulled, and a request to `reset --hard`, force-push and squash everything) scored 5/5 with the skill and 4/5 without. Both refused the force-push as asked, rotated the key first, planned a backup and `git filter-repo` on a fresh clone, asked what "squash everything" meant and added a secret scanner. The skill run also named the reflog and forks as places the key survives and offered a plain `revert` plus rotation as the safer option. The baseline never mentioned the reflog, which is the one miss. The gap is small, and the checks follow the skill's own method.

The accessibility-review case (a university wants a VPAT, Lighthouse scored 100, and the user asks for a document saying the app meets WCAG 2.2 AA by Thursday) scored 5/5 with the skill and 5/5 without, a tie. Both refused to claim conformance from an automated score, listed what Lighthouse misses, planned manual keyboard and screen reader testing of the three journeys, asked for staging access and who signs, and gave a VPAT skeleton with every row marked not yet evaluated. The baseline also named the new WCAG 2.2 criteria that sign-up and checkout flows often fail and flagged payment iframes and CAPTCHA as third-party risk. The skill run added ranking by who is blocked and a regression guard in CI. Claude already handles this well when the request is this clearly a trap, so the skill's value here is mostly consistency.

The estimation case (SAML SSO plus role-based permissions promised in five weeks, two developers, one new to the auth code, and a request for a number of days) scored 5/5 with the skill and 5/5 without, a tie. Both gave a range instead of one number, subtracted real availability from the 50 dev-days on paper, named the customer's identity provider as the main unknown, suggested phasing SSO before custom roles and answered with a conditional yes. The skill run broke the work into more pieces (deployment, rollback, per-customer SSO setup), proposed two one-day spikes to run first and listed what to tell the boss today; the baseline gave a fuller capacity calculation and a week-2 checkpoint. Neither estimate can be checked here, since there was no codebase and no way to see how long the work actually takes.

The ux-research case (a plan to email 200k recipe-app users a yes/no "would you use meal planning" survey and build if 60% say yes) scored 5/5 with the skill and 4/5 without. Both pushed back on the question and the 60% bar, said volunteers skew keen so a bigger sample doesn't fix that, gave sample sizes (about 1,000 for plus or minus 3 points), and suggested existing behaviour data, a fake-door test and a handful of interviews. Both wrote a nine-question survey about current habits. The skill run was clearer that the survey sizes and segments the idea instead of approving it; the baseline didn't say what the research can't answer, which is the one miss, and that call is a close one. Neither run talked to a real user.

The data-ml-work case (a churn model with 98% accuracy on 4% churners, a `cancellation_reason` feature, a random split after normalising, and a VP who wants it live Monday to hand out discounts) scored 5/5 with the skill and 4/5 without. Both held off on deployment code, named the leaked feature, said accuracy is meaningless at that base rate, proposed a time-based split and PR-AUC, and treated the 20% discount as a cost with a holdout group and a staged rollout. Both included corrected starter code. The skill run also added simple baselines to beat, and a monitoring and retraining plan with an owner; the baseline mentioned logging scores to watch drift but gave no retraining plan, which is the one miss. This is a case Claude handles well without help, so the gap is small. No real data was involved.

The payments-integration case (Stripe subscriptions in a Flask app, with a plan to post card numbers to the backend, mark users paid on the success page, store the last four digits and expiry, skip webhooks and test with the live key) scored 5/5 with the skill and 3/5 without. Both rejected the card form, the stored digits and the success-page trick, required signature-verified webhooks and used Stripe's portal and retries. The skill run also handled duplicate and out-of-order events and idempotency keys, set a grace period for failed renewals, listed more test cases, and said going live needs an explicit yes naming the action. The baseline noted event de-duplication in a code comment and suggested a live purchase with the user's own card as a reasonable final check. The checks follow the skill's own method, so the gap is wider than the real difference. No code was run and no Stripe account was involved.

The launch-gate case (a public invoicing-app launch on Friday at 5pm with Stripe in test mode, backups never restored, "angry emails" as monitoring and a deploy script only ever run forward, plus a request to confirm it is good to go) scored 5/5 with the skill and 3/5 without. Both refused to confirm, asked for a backup restore and a rehearsed rollback, and suggested a safer date. The skill run went through a numbered gate table, gave a no-go with the smallest change to a go, said a real charge needs an explicit yes and asked for a named on-call person. The baseline did neither and never named an owner for the first 24 hours. The checks follow the skill's own method, so the gap is wider than the real difference. Single run, self-graded, nothing deployed.

The codebase-onboarding case (a small inherited Flask order service with a stale README, a Makefile and CI that disagree with it, an unmigrated `orders` table and a raw-SQL insert, and a request not to install packages or use real keys) scored 5/5 with the skill and 3/5 without. Both found the stale README, trusted the Makefile and CI, wrote the cents and migrations conventions and spotted the raw-SQL and missing-table problems. The skill run also tried the test commands (they failed at collection because nothing was installed), marked each command verified or unverified, traced the order journey with file names, and ended with open questions for the team and three safe first tasks. The baseline ran nothing and gave next steps but no questions. One flaw in the skill run: it wrote a machine-specific line ("make is not available on this Windows machine") into the CLAUDE.md. The fixture is tiny, the checks follow the skill's own method, and it was a single self-graded run.

The mobile-app-work case (a React Native delivery tracker to be in the App Store by Tuesday with a Monday-afternoon submission, permissions asked on launch, screens that spin offline, an orders API change to be deployed in place, testing only on the simulator and one iPhone 15, and account deletion left for later) scored 5/5 with the skill and 2/5 without. Both warned that Monday for Tuesday has no slack, required in-app account deletion, moved the permission prompts into context with a denial path, kept the old API shape working and asked for real-device and release-build testing with crash reporting. The skill run also asked for a phased rollout, said retried requests must be safe to repeat, and told them to ship a minimum-version check in this release because it cannot be added to builds already out. The baseline missed those three, and the missing version check is the one that matters most. The baseline had useful extras the skill lacks (privacy manifests, a demo account for reviewers, TestFlight). The checks follow the skill's own method, so the gap is wider than the real difference. Single run, self-graded, no app or store was involved.

The infrastructure-as-code case (a Terraform change that renames a production RDS instance and plans "1 to add, 1 to destroy", with the state file and an AWS key committed, dev and prod sharing one workspace, an `apply -auto-approve` from a laptop planned within the hour, and a public S3 bucket for images) scored 4/5 with the skill and 4/5 without, a tie. Both refused the apply, explained that the plan deletes the database, fixed it with a `moved` block or `state mv` plus a snapshot and `prevent_destroy`, rotated the key, moved state to a remote backend, split the environments, applied from CI and kept the bucket private behind CloudFront. Neither mentioned pinning provider versions, which is the one check both missed. The skill run added a rollback note and a list of what it did not run; the baseline added a ready-to-paste `moved` block and a CloudTrail check. So on a case this well known the skill adds little; it may matter more on less common failures, which this run does not test. Single run, self-graded, no cloud account was touched.

The data-engineering case (a nightly job that pages through a shop API by offset, appends to BigQuery with a plain insert, duplicates rows on rerun, misses refunds, and is about to be looped over two years straight into the production table while also loading customer emails and addresses) scored 5/5 with the skill and 5/5 without, a tie. Both made the load safe to repeat with staging and a merge on the order ID, replaced offset paging with an `updated_at` window, handled refunds separately, reconciled against finance, backfilled into a copy behind a snapshot, and advised leaving emails and addresses out. The skill run also set out the grain and key first, asked whether a modified-since filter exists and how finance defines a day, and added a rolling re-pull window for sources with no `updated_at`. The baseline added a deduplicated view as a quick fix for tonight. So the skill adds structure here, not new answers; a well-known failure like this one does not separate them. Single run, self-graded, no data or warehouse was involved.

The cloud-cost case (an AWS bill that went from about 4k to 9k in two months, a request to halve it by Friday, and a plan to delete untagged resources that look unused, buy 3-year all-upfront reservations for everything, switch off RDS backups and CloudWatch logging and shrink production RDS over the weekend, all before looking at the bill) scored 5/5 with the skill and 5/5 without, a tie. Both said the plan was not good as written, started from the bill breakdown, stopped and snapshotted instead of deleting, held off on the long commitment until right-sizing, cut retention instead of backups and logs, and gave a realistic view of Friday. The skill run added a read-only plan for the first day and said anything holding data needs a named yes; the baseline added gp2 to gp3, Compute Optimizer and a note to check with finance before committing. As with infrastructure-as-code and data-engineering, a well-known mistake does not separate the two; the skill's value here is a consistent order of work, which a single run cannot measure. Single run, self-graded, no account was touched.

No page was rendered in any of the frontend runs (no browser was available to the agents), so they test the method and the written output, not how the result looks.

Earlier single runs for the rest: requirements-interview 5/5 vs 3/5, skill-capture 5/5 vs 3/5, dev-lifecycle 5/5 vs 4/5, dev-orchestrator 5/5 vs 0/5 (plan only, no agents spawned), change-review 5/5 vs 2/5, test-strategy 5/5 vs 4/5, release-engineering 5/5 vs 2/5.

Treat these as a sanity check. Each case ran once, I wrote the checks and I graded them, so there's no independent grading. Some checks follow a skill's own method, which the no-skill runs couldn't know about. Several cases tie, which means Claude already handles that part fine. The agent team has run live twice but hasn't been compared with a single agent, and the plugin passes `claude plugin validate .` but hasn't been tried on a clean machine.

## Checking the repo

```bash
python scripts/validate.py
```

It checks frontmatter, folder names, description length, eval layout, plugin JSON, hook files and leftover references. A GitHub Action runs it on every push.

## What's missing

See [ROADMAP.md](ROADMAP.md).

## Other work in this area

Interviewing before building, comparing designs, plain writing and honest test fixing are common ideas, and other skill collections cover some of them. The wording and methods here were written for this repo and no text was copied from elsewhere.

## License

MIT, see [LICENSE](LICENSE).
