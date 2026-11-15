---
name: security-prompter
description: Asks the security questions only the user can answer, before or while something is built, and turns the answers into security requirements. Use when starting an app, feature, API or integration that handles user data, logins, payments, files, admin access or the internet, or for threat models and security checklists. Skip for auditing finished code (security-review) and tasks with no data or exposure.
---

# Security Prompter

Most security failures come from decisions nobody was asked to make: who may see what, what is public, where secrets live. Code review finds mistakes; this skill gets the decisions made up front, at the cost of about five minutes of the user's time.

## 1. Look before asking

Read the repo, config and README first. Anything findable (framework, auth library, database, hosting, existing secrets handling) is not a question. Ask only what the code cannot tell you.

## 2. Ask in one round, at most seven questions

Number them, give a proposed default for each so the user can reply "defaults" or change one, and mark the ones that block progress. Pick from this pool the ones that fit the work:

1. **Data.** What is the most sensitive thing stored or handled (credentials, payment data, health or personal data, internal documents)? Who would be harmed if it leaked?
2. **People and roles.** Who are the user types, and what must each one never be able to see or do? Is there an admin, and how is that account protected?
3. **Exposure.** Is it on the public internet, behind a VPN or login, or local only? Which endpoints or pages need no login?
4. **Sign-in.** Own accounts, or an identity provider? Is a second factor needed, and how are resets handled?
5. **Secrets and keys.** Where do keys and passwords live today, and who has them? Anything already committed or shared in chat?
6. **Outside input.** What can strangers send (forms, uploads, webhooks, URLs the server will fetch, third-party content)?
7. **Rules and records.** Any legal, customer or company rules (privacy law, payment standards, audit logs, data location, retention)?
8. **Failure.** What is the worst realistic day (account takeover, data dump, abuse costing money, outage)? How would you find out it happened?

State the default after each question, for example "Default: roles are user and admin, admins need a second factor, all data is private to its owner."

## 3. Write the security brief

After the answers, write `SECURITY.md` or a section of the spec, under one page:

- Assets worth protecting, ranked.
- Who can do what (a small role table).
- Entry points and what is checked at each.
- Requirements as testable lines: "a user cannot read another user's invoice by changing the id in the URL"; "uploads are limited to 5 MB and to PDF and PNG"; "no secret appears in the repo or logs".
- Decisions made and who made them, and the ones still open.

Every requirement should be something a test, a config check or `security-review` can later confirm.

## 4. Hand on

Feed the brief to `design-decision` when it changes the design, to `test-strategy` for the testable lines, and to `security-review` before shipping. Revisit the questions when the work adds a new entry point, a new role, a new kind of data or a new third party.

## Rules

- Never guess a sensitive answer. A wrong "default" about who can see data is worse than asking again.
- Don't ask for actual passwords, keys or personal data; ask where they are kept.
- Don't lecture. Questions and a short brief, not an essay about threats.
