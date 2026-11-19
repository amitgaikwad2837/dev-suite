---
name: documentation
description: Plans, audits and maintains a project's documentation. Use when docs are out of date or a mess, new people take too long to get started, deciding what docs a project needs, setting up a docs site (MkDocs, Docusaurus, Sphinx), API reference, runbooks, or keeping docs in sync with code. Skip for polishing one document's wording (plain-writing) and writing a repo's CLAUDE.md (codebase-onboarding).
---

# Documentation

Bad documentation is rarely a writing problem. It is a structure and upkeep problem: everything lives in one long page, nobody can tell which pages are still true, and the reference is typed by hand and drifts from the code. Wrong docs are worse than missing docs, because people follow them. So audit by using the docs, organise by what the reader is trying to do, generate what can be generated, and tie updates to the change that makes them necessary.

## 1. Start from readers and their jobs

List who reads the docs (new teammate, user, integrator, on-call engineer, contributor) and the job each one is trying to do ("run it locally in 15 minutes", "call the API", "fix the outage at 3 a.m."). Docs exist for those jobs. The first job to serve is usually getting a newcomer to a running system.

## 2. Audit by using them

- Follow the quickstart on a clean machine or a fresh clone, as a stranger would, and note every point where it fails or needs knowledge it does not give. A new person's first day is the best test there is.
- Go through each existing page and mark it accurate, stale or missing a reader's need. Check dates, version numbers, commands and links. Delete or clearly mark stale pages instead of keeping them as a trap; an archive folder is better than a wrong page that looks current.
- Rank the gaps by cost: whatever blocks onboarding or causes repeated questions first.

## 3. Organise by what the reader needs

Keep four kinds of page apart, because mixing them makes each one worse:

- **Tutorial:** a guided first success for a beginner ("build your first X").
- **How-to guide:** steps to finish one real task for someone who knows the basics.
- **Reference:** exact facts to look up (commands, options, endpoints, config), complete and dry.
- **Explanation:** why it is built this way, the concepts and trade-offs.

A useful minimum for most projects: a short README that says what it is and links on, a quickstart, how-tos for the five most common tasks, reference, a troubleshooting page, a changelog, a contributing guide, an architecture overview with decision records, and runbooks for anything operated in production.

## 4. Generate and test what you can

- Generate reference from the source of truth: OpenAPI for HTTP APIs, docstrings or type signatures for libraries, `--help` output for command lines, the schema for configuration. Hand-written reference drifts.
- Run the examples. Put code samples in files that are executed in CI, or use doctests, so a broken example fails a build. Check links the same way.
- Give commands that can be pasted as they are, with the output to expect and what to do if it differs.

## 5. Keep it true after today

- Keep docs in the repository next to the code, reviewed in the same pull request. Add "docs updated?" to the PR template and make a code change that alters behaviour update the page that describes it.
- Give each page an owner (a team is fine), a last-verified date or version, and a way to report an error from the page itself.
- Reminders to "update the docs monthly" do not work. Checks in CI and updates tied to changes do.
- On every change, check the docs: list the behavior that changed, find the pages that describe it, and mark each updated, reviewed and still correct, or blocked, then report the gaps that remain.
- Prune on a schedule. A smaller set of correct pages beats a large set that is half wrong.

## 6. Decision records and runbooks

- **Decision record:** one short page per hard-to-reverse choice with the context, the decision, the options rejected, the consequences, the date and its status. It answers "why did we do it this way?" years later (`design-decision` for making the choice).
- **Runbook:** for each alert or routine operation, the trigger, the first checks, exact commands, how to confirm it worked, how to roll back and who to call. Have someone who did not write it follow it once (`incident-response`, `observability`).

## 7. Make it findable

Titles should match what people search for. One topic per page, a clear navigation, consistent terms, a working search, and links between how-to, reference and explanation. Put the answer first. For the wording of any single page use `plain-writing`.

## 8. Hand over

Report what was audited and what failed the stranger test, the structure proposed, what is generated and what is hand-written, the checks added to CI, the owners, the pages deleted or marked stale, and what you could not verify without running the project or asking the team.

## Related skills

- `codebase-onboarding`: a short verified CLAUDE.md for a repo
- `session-handoff`: state for the next session, not project docs
- `devex-review`: scoring the developer experience
