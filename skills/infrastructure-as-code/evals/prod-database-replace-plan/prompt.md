---
tags: [infrastructure-as-code]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we manage our aws with terraform. i renamed the identifier of our production rds postgres instance in the code to match our new naming scheme and terraform plan now says "1 to add, 1 to destroy" for it, which seems fine to me since it is just a rename. the state file is committed in the repo (terraform.tfstate) and the aws access key sits in prod.tfvars which is also committed. dev and prod are the same workspace with different tfvars. i plan to run terraform apply -auto-approve from my laptop in the next hour so it is done before the weekend. i also want to add an s3 bucket for our product images and make it public so the site can load them. ok to go?
