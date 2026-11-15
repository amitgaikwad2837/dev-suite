---
name: infrastructure-as-code
description: Writes and changes cloud infrastructure as code (Terraform, OpenTofu, Pulumi, CloudFormation, CDK, Bicep) without destroying production or leaking secrets. Use for terraform plan and apply, state files, drift, importing console-built resources and splitting environments. Skip for app deploy pipelines (release-engineering), cloud bills (cloud-cost) and choosing architectures (design-decision).
---

# Infrastructure as Code

Infrastructure code differs from application code in one way: a bad change deletes a database, opens a bucket to the internet or locks everyone out, and there is no undo. So every change is read as a diff of the real world before it is applied, and applying is a separate, deliberate step. Examples use Terraform words; the same ideas apply to the other tools.

## 1. Know what you are touching

Say which provider account and environment, whether this is new code or a change to resources that already exist, and which resources hold data (databases, buckets, disks, queues, DNS, keys). If real resources already exist and the code does not describe them, import them first and make the plan show no changes before editing anything.

## 2. State comes first

- Keep state in a remote backend with locking and encryption (an S3 bucket with a lock table, Terraform Cloud, Pulumi service), never in git and never on one laptop.
- State holds secret values in plain text. If it was committed, treat everything in it as leaked: rotate it, remove the file from history (`git-hygiene`), and move state to a backend.
- Back up state or turn on versioning on the bucket that holds it.

## 3. Read the plan like a diff

Run the plan and read every line before any apply. Stop and explain when you see:

- **destroy, replace or "forces replacement"** on anything that holds data. A rename of an identifier or a changed immutable field often means delete and create. Fix the code instead of accepting it: keep the old name, use a `moved` block or `state mv`, or set `lifecycle { prevent_destroy = true }`. If a replacement is truly wanted, take a snapshot first and get a named yes.
- Changes to security groups, IAM, public access, encryption or logging.
- Changes you did not make (drift). Find out why before overwriting someone's manual fix.

Never run apply or destroy against a real account unless the user has said yes to that plan. Never use `-auto-approve` on production, and never apply from a laptop to production.

## 4. Limit the blast radius

- One state per environment and per area (network, data, app), not one big state for everything. A mistake in a small stack cannot touch the rest.
- Separate accounts or projects for production and non-production when you can, and always separate state.
- Try changes in a non-production copy first.

## 5. Secrets and access

- No keys, passwords or tokens in code, variable files or state outputs. Use a secrets manager, generated passwords stored there, and mark outputs sensitive.
- CI authenticates with short-lived credentials (OIDC to a role), not stored long-lived keys.
- The role that applies has only the permissions the code needs. Writing the code does not need admin.

## 6. Make the code safe by default

- New buckets block public access, disks and databases are encrypted, databases have backups and deletion protection, and logs go somewhere.
- Public exposure is a decision: serve public files through a CDN with the bucket private, rather than opening the bucket.
- Pin provider and module versions, commit the lock file and upgrade on purpose. Tag resources with owner and environment so cost and ownership can be traced, and look at an estimate for anything large.
- Use small modules for repeated patterns, and avoid clever loops that make the plan unreadable.

## 7. Run it from CI

Plan on every pull request and post the plan for review (`change-review`). Apply only after merge, from CI, with the reviewed plan, and require a human approval for production. Add a scheduled plan to detect drift. Console changes are for emergencies and must be copied back into code.

## 8. Hand over

Report what the plan will change, which lines are destroys or replacements, what was not run, and what needs the user's yes before anything is applied. Include the rollback: what to restore and from where.
