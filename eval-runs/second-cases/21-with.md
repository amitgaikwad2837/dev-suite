Not realistic as written. The goal is right: get everything under Terraform. Three parts of the plan would likely take down production, and the order is backwards.

**1. Writing it from memory**
Three years of hand-built AWS has drift you've forgotten: console tweaks, one-off security group rules, IAM policies someone patched in, settings that exist only in the console. Code written from memory describes the AWS you think you have, not the one you do. Write the code from what actually exists, and prove it matches.

**2. Running apply in prod**
Terraform doesn't know these resources exist. A first apply would try to create duplicates and fail on name collisions, or it would create new things next to the old ones. Where it does touch existing resources, it overwrites settings with whatever your memory-based code says. Applying to production from a laptop, with no reviewed plan, is exactly what I'd avoid.

**3. Deleting whatever Terraform doesn't know about**
This is the dangerous one. "Terraform doesn't know about it" is not the same as "unused". That list will include things nobody remembers, such as a database someone relies on, a bucket with the only copy of some data, DNS records, IAM roles that other services assume, and KMS keys. Deleting a KMS key or a database is not undoable. Nothing should be deleted just because it isn't in code. Put anything unclaimed on a list and decide on each item, with an owner and a snapshot or backup first.

**What I'd do instead**
1. **Inventory.** List what exists per account and region, by service. Tag owner and environment as you go. Mark which resources hold data: databases, buckets, disks, queues, DNS and keys.
2. **Set up state first.** Use a remote backend (S3 with locking and encryption, or Terraform Cloud) with versioning turned on. Never keep state in git or on one laptop. State holds secrets in plain text.
3. **Import, don't create.** Pick one small area first, such as networking or a single service. Write the code for what's really there (using `import` blocks, and generating config from the existing resources where it helps). Then run `terraform plan` until it shows no changes. A clean plan is the proof that the code matches reality. Only after that do you edit anything.
4. **Small states, not one giant one.** Split by area (network, data, app) and by environment, so a mistake in one can't touch the rest. If you have a non-prod account, rehearse there first.
5. **Protect the data.** Put `prevent_destroy` on databases, buckets and keys. Read every plan line. Any "destroy", "replace" or "forces replacement" gets stopped and explained, and fixed in code rather than accepted. Snapshot before anything is replaced.
6. **Move to CI.** Plan on every pull request and post it for review. Apply only after merge, from CI, with human approval for prod. CI should use OIDC to a role, not stored keys. Add a scheduled plan to catch drift, since console changes will keep happening.
7. **Cleanup comes last.** Once everything in use is imported and stable, go through the unmanaged leftovers one at a time. Check CloudTrail, cost data and tags for evidence of use. Stop or snapshot first, wait a while, then delete with a named yes for each.

**Rough shape**
Expect this to take weeks to months, depending on how many resources you have, not one big-bang apply. Tools like `terraformer` or `former2` can speed up generating the first draft, but treat the output as a draft and verify it with the plan.

I haven't run anything and I won't apply or delete anything in your account without a plan you've reviewed and said yes to. To start, tell me which services you use, whether you have a non-prod account, and whether any state or Terraform already exists. I can then help you pick the first area to import and draft the backend and import blocks.
