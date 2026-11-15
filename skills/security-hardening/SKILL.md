---
name: security-hardening
description: Hardens how a system is configured and run, so an attacker or a mistake has less to work with. Use for locking down a cloud account, servers, containers, networks, databases, CI/CD pipelines and secrets, preparing for a pen test, a security audit or a customer security questionnaire, fixing pen test findings such as open ports or missing headers, MFA and least privilege, and exposed admin panels or public buckets. Fixes the riskiest exposure first, in small reversible steps that never lock you out. Skip for reviewing application code for bugs (security-review), threat modelling a new feature (security-prompter) and a live attack (incident-response).
---

# Security Hardening

Most break-ins use the plain things: a database open to the internet, an admin account without a second factor, a key left in a repository, a bucket anyone can read, a pipeline with too much power. Hardening is closing those, riskiest first, without breaking production or locking yourself out. It is configuration and operations work; for bugs in your own code use `security-review`.

## 1. Know what is exposed

Before changing anything, list what an outsider could reach and who can do what:

- Internet-facing services, ports, admin panels, storage buckets, and DNS names (including forgotten ones).
- Accounts and their rights: who is an admin, which keys and tokens exist, which are old or unused, which have no second factor.
- Where secrets live (repositories, wikis, chat, environment files, images, CI settings).
- The deploy pipeline, who can change it, and what it can reach.
- What is logged, what is backed up, and who would notice an attack.

Read the real configuration (cloud console or code, security group rules, IAM policies, pipeline files) instead of relying on memory.

## 2. Rank by risk and fix the worst first

Order by how easy it is to exploit and how much it costs if exploited. The usual top of the list:

1. Secrets that have leaked (in a repository, wiki, chat or logs). Rotate them now; deleting the file is not enough (`git-hygiene`).
2. Admin and root accounts without multi-factor authentication, and long-lived root or admin keys.
3. Databases, caches, admin panels and management ports open to the whole internet.
4. Public storage that holds anything not meant to be public.
5. Over-powerful automation: a pipeline or service using an admin key.
6. No audit log and no alerts, so an attack goes unseen.
7. Unpatched software on internet-facing systems.

## 3. Identity and access

Require multi-factor authentication for every human, above all the cloud root account, administrators and source control. Remove the root keys and use root only for break-glass. Give each person and service the least permission that does the job, prefer short-lived credentials (roles, OIDC, single sign-on) over stored keys, remove leavers and unused keys, and keep a separate admin identity for admin work.

## 4. Network and exposure

Default deny: open only the ports that must be open and to whom they must be open. Put databases and internal services in private networks. Replace SSH from anywhere with a bastion, a session manager or a VPN, and one personal identity per person instead of a shared key. Use modern TLS everywhere and set sensible security headers and CORS. Put rate limits or a web firewall in front of public endpoints. Serve public files through a CDN with the bucket kept private.

## 5. Hosts, containers and dependencies

Patch on a schedule and faster for internet-facing systems. Use minimal images, run as non-root, avoid privileged containers, remove services nobody uses, and scan images and dependencies in the pipeline (`dependency-audit`). Compare against a published baseline such as the CIS benchmarks for your platform and treat each deviation as a decision.

## 6. Secrets

Keep secrets in a secrets manager, not in code, images, wikis or logs. Scan repositories and history for them, rotate on a schedule and whenever someone leaves, and keep each secret scoped to one use. Add a pre-commit or CI scan so the next leak is caught early.

## 7. Pipeline and supply chain

Protect the main branch and require review. Give the pipeline its own least-privilege role, never an admin key. Do not expose secrets to builds that run code from forks or untrusted pull requests. Pin third-party actions and dependencies to exact versions or hashes, and require approval for production deploys.

## 8. See it and recover from it

Turn on audit logging for the cloud account and the systems that matter, send it somewhere an attacker cannot erase, and alert on the actions that matter (new admin, disabled logging, key creation, a public bucket) with a named responder (`observability`). Keep backups that an attacker cannot delete, and restore one to prove it works. Write down who does what in an incident (`incident-response`).

## 9. Change it safely

Hardening can break things and can lock you out. Change one thing at a time, in staging first, with the way back written down. Before you close a port or tighten a rule, keep a second way in and test it. Do not apply a sweeping script to production in one go. Changes to production need the owner's clear yes on the exact change. Test only systems you own or are authorised to test; this skill is for defence.

## 10. Hand over

Report what you inspected, the findings ranked by risk, what was changed and how it was checked, what remains and who owns it, and what you could not verify. Offer a short checklist the team can rerun each quarter.
