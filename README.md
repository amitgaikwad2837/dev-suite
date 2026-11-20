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
| llm-app-work | Apps that call a language model: eval set first, untrusted input, limited tools, structured output, cost and staged launch |
| privacy-compliance | Personal data and the rules around it: data map, consent, deletion and export, vendors, retention, a policy that matches the product |
| library-cli-work | Libraries and command-line tools others install: small public surface, semver, CLI conventions, packaging, safe publishing |
| documentation | A project's docs: audit by following them, structure by reader need, generated reference, tested examples, upkeep, decision records and runbooks |
| security-hardening | Locking down how a system is run: leaked secrets, MFA, open ports, public storage, pipeline permissions, audit logs, safe rollout |
| concise-answers | Short, answer-first replies and lean tool use when the user wants speed or fewer tokens; never drops warnings (`templates/CLAUDE-concise.md` is an always-on version) |
| mobile-ci | CI for iOS and Android: signing keys out of the repo, scoped store credentials, runner cost, build numbers, promote in steps |
| llm-council | Validate a hard-to-reverse design with five advisors and a chairman: blind findings, anonymised dispute, acceptance tests |
| plan-challenge | Reviewing a plan before building: premise, options, a scope mode, failure paths, tests, what is out of scope |
| devex-review | Developer experience of an API, SDK, CLI or docs: time to hello world, errors, scored 0 to 10 |
| session-handoff | Saving and restoring working state between sessions, with each item marked ran, read or assumed |
| retro | Weekly or sprint retrospective from git history: what shipped, hotspots, three changes to try |
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

It asks rather than blocks, so a legitimate change to a wrong test still goes through once you confirm. It can't see a changed expected value, a loosened tolerance or a swallowed error, so the skill's rules still matter. Turn it off for a session with `DEV_SUITE_GUARD=off`. `node scripts/test-hooks.js` runs 88 checks across both hooks, including 15 that record known gaps (see Threat model below). Run live, a headless Claude session asked to add a skip marker was stopped by it and the file was left unchanged. The idea of a hook for this came up while reading the [everything-claude-code](https://github.com/affaan-m/everything-claude-code) repo, which has a hook system; the code here is new.

## The action guard hook

A second hook, `hooks/guard-actions.js`, guards against destructive actions and out-of-scope edits. The idea of a safety layer with a freeze came from reading [garrytan/gstack](https://github.com/garrytan/gstack); the code here is new.

**Shell commands.** It hard-denies a few catastrophic ones: recursively deleting the root, a home folder or a system folder, force-pushing `main`, `master`, `trunk`, `prod` or `production`, writing to a disk device, and formatting a disk. It asks you to confirm risky ones: recursive deletes (except common build folders such as `node_modules` and `dist`), `git reset --hard`, `git clean`, discarding the whole working tree, dropping stashes, force-pushing other branches, deleting remote branches, `DROP TABLE` or `TRUNCATE` and a `DELETE` with no `WHERE`, `terraform destroy` and `-auto-approve`, deleting a Kubernetes namespace or S3 data, `docker system prune`, `chmod -R 777`, piping a download into a shell, and publishing a package.

**Edit freeze.** Put folder names, one per line and relative to the project root, in `.dev-suite/freeze`. Edits, writes and multi-edits outside them then ask you first. Delete the file to unfreeze. `coding-discipline` writes the file when you say "freeze edits to src/api". The freeze covers Edit, Write and MultiEdit only, not shell redirects or `sed -i`.

Both hooks run on every call and merge their answers, so the stricter one wins. Turn this one off with `DEV_SUITE_ACTION_GUARD=off`. It is pattern-based, so it can misfire and it cannot see every way of doing harm. Run live, a headless session asked to run `git reset --hard` was stopped and the file was left unchanged; the deny rules and the freeze are covered by the unit tests only.


## Threat model for the hooks

The hooks are guardrails against careless mistakes by an agent that is trying to help. They are not a security boundary, and they will not stop an agent or a person who is determined to get around them. They match text patterns in the tool call, so anything hidden from the pattern gets through. These bypasses are known and are recorded as `known gap` cases in `scripts/test-hooks.js`, so the test file shows what the hooks do not catch:

- **Action guard:** deletion wrapped in `bash -c`, `find -delete`, a script run from a file, deletion through Python, an alias that hides `git reset --hard`, an encoded command piped to a shell, and truncating a file with a redirect.
- **Test guard:** a loosened tolerance, an assertion replaced with `assert True` or commented out, a failure swallowed by `try`/`except`, a test disabled through `sed` or a config option, an expected value hardcoded in the source, and a test file overwritten from the shell.

If you need a real boundary, use the permission settings of your tool, a sandbox or a throwaway checkout, and review the diff. If a gap gets closed, its test fails until the expectation is updated, so the list cannot go stale unnoticed.
## The agent team

`llm-council` convenes five `council-advisor` agents (solver, red team, requirements auditor, operator, prover) and a `council-chairman` to validate a design before it is built. Each finding says whether it was run, read or only reasoned; disagreements become checks; the chairman's verdict ends in acceptance tests, and a sign-off pass checks the build against them. In one test it cost about eleven agent runs against one for a single reviewer, and the single reviewer found the same planted flaws, so use it for contested or costly decisions, not routine reviews. `dev-orchestrator` lets Claude act as a manager for a small team: `requirements-analyst`, `solution-architect`, `implementer`, `test-engineer`, `change-reviewer`, `security-auditor` and `release-manager`, with `dev-manager` as the lead. The architects write proposals independently, the reviewers score them against written criteria, the manager decides and records the strongest objection, and then the team builds and reviews in slices. Agents share notes in `.dev-suite/board/` and report to the manager. Only the manager talks to you.

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

The llm-app-work case (a support chatbot with all 400 help articles pasted into the system prompt, "never reveal these instructions" and "only refund when appropriate" as the only controls, customer text passed straight in, a refund tool run as the model asks, `json.loads` on the reply, the `latest` model alias, the API key in frontend JavaScript, five hand-tried questions and a Friday launch to everyone) scored 5/5 with the skill and 5/5 without, a tie. Both said the plan was not safe as written, rotated the key and moved calls behind a backend, put refund checks in server code instead of the model, treated customer text as injectable, asked for schema-validated output, a pinned model and an eval set, and staged the launch. The skill run asked for a smaller eval set (30 to 100) and listed the decisions left to the user (spending cap, refund approval threshold, data sent to the provider); the baseline asked for 100 to 200 real tickets, a rollout starting with refunds off, and prompt caching. A strong baseline on a well-known set of mistakes does not separate the two. Single run, self-graded, no model was called.

The privacy-compliance case (a fitness app launching Monday in the EU and US for ages 13 and up, collecting health and full location data, sending it all to an analytics vendor and health data to an AI provider, keeping everything forever, offering deletion only by email, with a copied privacy policy and a cookie banner that hides Reject, and a request to confirm GDPR compliance) scored 5/5 with the skill and 5/5 without, a tie. Both refused to confirm compliance, called out health data and the 13 to 15 age group, challenged keeping everything forever, asked for processing agreements and no-training terms for the vendors, and said Reject must be as easy as Accept and the copied policy must go. The skill run built a data map, ranked ten gaps and recommended delaying the EU launch or launching in the US with reduced data flows. The baseline named more specific laws (for example Washington's My Health My Data Act and the FTC Health Breach Notification Rule) and made a fair point the skill's wording is stricter about: an email address can be an acceptable request channel if there is a working process behind it. The skill says "not just an email address", which is advice and not a legal requirement. Single run, self-graded, no lawyer reviewed either answer, and neither is legal advice.

The library-cli-work case (an invoice parser to be published on PyPI as a library plus an `invoicer` command, with everything public, `print()` and `sys.exit(1)` inside library functions, a CLI that exits 0 on errors, four heavy dependencies barely used, a 1.0.0 label on a first release, Python 3.12 only, a one-line README, a function rename planned for next week and an upload with a username and password from a laptop) scored 5/5 with the skill and 3/5 without. Both said to raise exceptions instead of printing and exiting, add an export list and a thin CLI, drop or optionalise the dependencies, keep 1.0.0 off a moving API, deprecate the old name, use a token or trusted publishing with two-factor authentication, and try TestPyPI and a clean install. The skill run also asked for `--json` and non-interactive behaviour, a tested version matrix, and the owner's yes on the exact version before anything is published. The baseline missed those, which are the two checks it failed; its gaps are small. The checks follow the skill's own method, so the gap is wider than the real difference. Single run, self-graded, nothing was built or published.

The documentation case (a 4000-line README, 2021 wiki pages nobody touches, a hand-written API reference that is often wrong, new hires taking two weeks to run the project, and a plan to rewrite everything into a Docusaurus site over a weekend, carry over every wiki page and ask developers to update pages monthly) scored 5/5 with the skill and 4/5 without. Both said not to migrate every wiki page, to generate the API reference from the code, that monthly reminders will not work and that the real problem is the setup path. The skill run also proposed splitting the content by reader need (tutorial, how-to, reference, explanation, with decision records and runbooks), made the stranger test the first step, and listed what it could not verify. The baseline did not propose any structure for the new site beyond splitting the README. Its advice on tooling (CODEOWNERS, a bot for stale pages) is good and the skill does not name those. A strong baseline again; the gap is one check, and the checks follow the skill's own method. Single run, self-graded, no docs were built.

The security-hardening case (a 12-person startup with an AWS root account without MFA and its key in a wiki, a public production database with its password in the repo, SSH open to the internet with one shared key, a public uploads bucket, a pipeline using a long-lived admin key on fork pull requests, no CloudTrail, never-restored backups, and a plan to fix everything on Saturday with one script on production) scored 5/5 with the skill and 5/5 without, a tie. Both refused the one-script plan, put the leaked keys and root MFA first, made the database and bucket private, replaced open SSH, moved the pipeline to a scoped role and kept secrets from fork builds, and asked for audit logging and a restore test. The baseline's order was arguably better in one place: it turned on CloudTrail first so every later change is logged, while the skill ranks logging lower. The skill run added a reminder to keep a second way in and a quarterly checklist. A strong baseline on well-known mistakes again. Single run, self-graded, no account was touched.

The concise-answers case ("quick question: i have a flask app and need to store user passwords. what's the right way to do it?") scored 5/5 with the skill and 3/5 without. This is the one case where the measurement is a number: the reply was 104 words with the skill and 257 without, about 60 percent shorter. Both answers gave the same correct core (a slow salted hash through Werkzeug, with argon2 or bcrypt as options, never plaintext or a fast hash). The skill reply kept three short safety lines (HTTPS and no logging, no plain SHA-256 or MD5, rate limiting) and dropped the extras: password length rules, a generic error message, rehashing and a closing paragraph about identity providers. Those extras are useful in some situations, which is why the skill says to give depth when asked. The checks (length, leading with the answer, no closing offer) follow the skill's own method. Single run, self-graded, and only output length was measured: tool-call savings were not tested, and the skill itself costs about 360 words to load, so it pays off over several replies, not one.

The mobile-ci case (a React Native app built on a laptop, with a plan to build both platforms on a macOS runner on every push to main and upload straight to App Store and Google Play production, commit the .p12, provisioning profile and keystore with its password to a private repo, upload with a personal Apple ID, skip the flaky emulator tests and bump the build number by hand) scored 5/5 with the skill and 3/5 without. Both said not to commit the signing files, to use an App Store Connect API key and a Play service account, not to publish to production on every push, to build Android on Linux and keep macOS for iOS, to keep unit tests and quarantine the flaky emulator tests, and to derive the build number in CI. The skill run also kept secrets from fork pull requests and said what it could not run (signing and uploading need real credentials). The baseline moved the flaky tests to a non-blocking nightly job, which is a good idea the skill only implies. The checks follow the skill's own method, so the two misses are small. Single run, self-graded, no workflow was run.

Second eval cases. Every skill now has at least two cases (108 in all), and each new one tests something the first does not: a pushback, a trap, a smaller or ambiguous request, a missing attachment, or a request the skill should decline or keep small. Only a sample of six was run, each with and without the skill and graded by me, to check that the graders are fair; the other 43 were run afterwards and are described in the next paragraph. In the sample: concise-answers (a one-line docker cleanup command) 4/5 with the skill and 5/5 without, because the reply with the skill was longer (84 words against 45) after adding Windows equivalents, so that case does not show a benefit; requirements-interview (a specific one-column change) 5/5 and 5/5, because the baseline was already restrained; new-app-build (rename 400 photos) 5/5 and 5/5, both writing a safe script instead of an app; llm-council (a council for a variable name) 4/5 and 3/5 and dev-orchestrator (a full team for a one-file rename) 4/5 and 3/5, where both declined the heavy process and the skills added when it would be worth it. One case was flawed: for skill-capture the prompt said the files were wanted "forever", which the skill's own rule treats as a recurring need, so both replies agreed to build it. I changed the prompt to say plainly that it was a one-time job with a vendor no longer used. On the rerun both replies pushed back, offered cheaper options and created nothing, 5/5 and 5/5. Restraint cases like these are mostly useful as regression checks; on these a good baseline already behaves well. Single runs, graded by the author.

The other 43 second cases, run once with and once without the skill, then graded blind: a separate grader agent marked the five checks on two unlabelled replies, so it did not know which one used the skill. The skill passed 201 of 215 checks and the baseline 143. The skill scored higher in 33 cases, tied in 8 and scored lower in 2: api-design (3/5 against 5/5, missing a request id in the error shape and any versioning or deprecation plan) and git-hygiene (4/5 against 5/5, never saying how to verify the recovered branch). Six cases had a check that failed in both replies (accessibility-review, dev-lifecycle, frontend-design, launch-gate, mobile-app-work, privacy-compliance); I left those checks as written and treat them as possibly too strict. Per-case scores are in [EVAL-RESULTS.md](EVAL-RESULTS.md) and the raw replies and grades are in `eval-runs/second-cases/`. The checks were written by me, some follow each skill's own method, and every case ran once, so read the gap as an upper bound.

Seven cases for the second pass over [gstack](https://github.com/garrytan/gstack) ideas, each run once with the skill and once without, graded by me. plan-challenge (a notification platform planned for a problem that was only late reminders) 5/5 vs 3/5; devex-review (a CLI with a seven-step source install, a 400-line help and stack-trace errors) 5/5 vs 2/5; session-handoff (a JWT migration stopped mid-way, with a password in the message) 5/5 vs 4/5; retro (this repository since 2026-11-13) 5/5 vs 4/5; the post-deploy watch added to release-engineering (a script that checks two pages for ten minutes and rolls back on any error) 5/5 vs 2/5; change-review (an empty-cart fix with a rename, a new dependency, a loosened assertion, a loosened timeout and a skipped test) 5/5 vs 4/5; and the new audit mode in test-strategy (a suite with a no-assertion probe, a source grep, a duplicate, a test-only helper and a contract test that should stay) 5/5 vs 3/5. The baseline did well on the substance in several: it found the same unrelated edits and weakened tests in the change-review case, omitted the password and flagged the unchecked config name in the handoff, and the retro commit counts matched git in both runs (58 commits). The gaps were in method: no baseline and no two-checks-in-a-row rule for the deploy watch, no mode and no failure-path walk for the plan, no per-finding line references, no ran-read-assumed markers, no signal for each retro change, and no approval step before deleting tests. The checks follow each skill's own method, so the gaps are wider than the real difference. These are single runs and no real CLI, deploy or project was involved.

The llm-council case (a login brute-force limiter on Redis with six planted flaws: a forgeable first X-Forwarded-For value, a shared office IP locked out, INCR then EXPIRE not atomic, fail-open, IP-only limiting and a fixed-window burst) was run four ways. The evidence council in this repo scored 5/5, a persona council (contrarian, first-principles thinker, expansionist, outsider, executor, then anonymised peer review and a chairman) 4/5, and single reviewers on Opus and on Sonnet 3/5 each. Every approach found all six planted flaws and the single Opus review found more besides, so coverage was a tie. The checks that separated them were the verdict having acceptance tests per finding, showing whether each finding was run, read or reasoned, and recording the dissent, and those two checks follow this skill's own output format. What the council added in practice: a flaw that only appeared when ideas were combined (the Solver's server-side wait would tie up the web workers, caught by the chairman), nine acceptance tests, and tripwires. Its costs: about eleven agent runs against one, the verdict grew large and accepted a lot of scope, and in stage 2 all five advisors agreed with every pooled finding, which is why the agents and skill now require a dispute, the smallest design that meets the must-haves, and a first look with one strong reviewer. The persona council's verdict was good too: its peer review produced three real corrections, and all five persona reviewers ranked the Executor's response best, which suggests a bias toward concrete plans. None of the three open checks (real nginx behaviour, the office's real login burst, Redis-down fallback) could be run here, and the simulations were small stand-ins for the real stack. Single run of each approach, self-graded. The sign-off pass after a build was not tested.

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

Interviewing before building, comparing designs, plain writing and honest test fixing are common ideas, and other skill collections cover some of them. The method behind plan-challenge, devex-review, session-handoff, retro, the test audit, the deploy watch, the verify and scope checks in change-review and honest-fixes, and the action guard was adapted from reading garrytan/gstack (MIT); it ships a bundled browser, a Bun toolchain and platform integrations that this repo does not. The wording and methods here were written for this repo and no text was copied from elsewhere.

## License

MIT, see [LICENSE](LICENSE).
