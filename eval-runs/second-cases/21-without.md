Not realistic, and the last step is dangerous. Moving to Terraform is a good goal, but I'd change the plan before you run anything in prod.

**Problems with the plan**

1. **Writing it from memory will miss things.** After three years of hand-built infrastructure, nobody remembers every security group rule, IAM policy, parameter, tag, or the console tweak someone made at 2am. Whatever is missing from your code is a difference between the code and reality.

2. **Running `apply` against prod with brand-new code that doesn't know the existing resources is the wrong move.** Terraform has no state for them. It will try to create everything again. That means name collisions and failed applies at best. At worst you get duplicate resources, or resources that are replaced (destroyed and recreated) instead of left alone. Things like RDS instances, load balancers, and DNS records are costly to replace.

3. **"Delete whatever Terraform doesn't know about" is the part I'd drop entirely.** Terraform doesn't do that. It only manages what is in its state. So you'd be deleting by hand, or with a cleanup tool such as aws-nuke. The things Terraform "doesn't know about" will include whatever you forgot to write: databases, S3 buckets with data, KMS keys, IAM roles that a running service depends on. Deletion of those is often unrecoverable. Treat anything unmanaged as "unknown", not "unused".

**What I'd do instead: import, then converge, then clean up**

1. **Inventory first, read-only.** Use a read-only role to list what exists per account and region (Resource Explorer, AWS Config, or `aws` CLI lists, plus Cost Explorer to see what is actually in use). Tag or note the owner and purpose of each thing. Decide what is in scope.
2. **Start small and non-critical.** Pick one slice, for example a few S3 buckets, a VPC and its networking, or one service. Don't try to do all of it at once.
3. **Set up remote state before anything else.** An S3 bucket with versioning and encryption, plus locking (DynamoDB or the S3 native lock), and a separate state per environment or domain. Pin the provider and Terraform versions.
4. **Import the real resources into state.** Use `import` blocks (Terraform 1.5+) and `terraform plan -generate-config-out=...` to get a first draft of the code from what exists, or a tool like Terraformer or `former2` for a draft. Treat the generated code as a draft: clean it up, use variables and modules, and remove hardcoded IDs and secrets.
5. **Aim for a clean plan: "No changes".** Run `terraform plan` until it shows zero changes for each imported slice. Any diff is a spot where the code doesn't match reality. Look at each one and decide whether the code or the infrastructure is right. Pay attention to anything that says "must be replaced" and don't apply those.
6. **Only then start applying changes**, in staging if you have one, and with the plan output reviewed by a second person. Protect critical resources with `lifecycle { prevent_destroy = true }` and deletion protection (RDS, S3, etc.).
7. **Take backups before touching stateful things:** RDS snapshots, S3 versioning, and a copy of the state file.
8. **Then deal with the leftovers.** Whatever is still unmanaged after import is a list to review. For each item: import it, or confirm with the owner that it is unused, and then retire it in stages (stop or detach it, wait a couple of weeks, snapshot, then delete). Do this one item at a time, never in a bulk sweep.
9. **Stop drift coming back.** Restrict console write access in prod once things are in Terraform, run `terraform plan` on a schedule to detect drift, and run apply through CI with review.

**Rough shape of the timeline:** this is weeks, not a weekend, for anything of real size, mostly because of the verification loop in step 5.

**If you want, I can help with the next step.** If you tell me what services you run (VPC, EC2/ECS/Lambda, RDS, S3, IAM, Route 53) and how many accounts or regions, I can lay out an import order, and I can set up a state backend and write the first import block for one slice. I'd also be careful about running anything against prod myself without you looking at the plan first.
