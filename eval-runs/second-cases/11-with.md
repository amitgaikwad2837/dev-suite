Short answer: don't add invoice-parse-lite yet, and don't update everything at once. Treat these as two separate jobs.

## 1. Adding invoice-parse-lite: not yet

Nothing here is a hard blocker, but several things point the same way:

- **Two open security issues.** I haven't read them. That is the first thing I'd do. I'd check whether they are real vulnerabilities or minor reports, whether they are reachable in how you would use it, and whether the maintainer has replied. Invoices are untrusted input, often PDFs or XML from outside parties, so a parser flaw would be reachable in your setup.
- **Small and thinly maintained.** About 40 weekly downloads, one maintainer and 3 years old. Few people are looking at it, and there is one point of failure. Check the date of the last release and last commit, whether the repo is archived, and whether issues get answered.
- **MIT licence.** That is fine for most uses. It is a flag for your owner or a lawyer to confirm, not a legal ruling. Also check the licences of what it pulls in.
- **Check what it pulls in.** Look at its transitive dependencies, any install scripts, and any git-URL or unpinned dependencies. Confirm the name isn't a look-alike of a better-known package.

What I would do, read-only and before anything is installed:

1. Read the 2 security issues and the repo's recent activity.
2. Inspect its dependency tree and install scripts using `npm view` and the registry metadata, without installing it.
3. Run a vulnerability scan (`osv-scanner` or similar) against it.
4. Compare with alternatives. For parsing invoices, a more widely used library, or a small piece of code you write and own, may be safer. If the package does one tiny job, writing it yourself is often better.

If you still want it after that, I'd pin the exact version, commit the lockfile, add it behind a thin wrapper so it can be swapped out, and treat all parser input as untrusted. I would not add it or replace anything without your agreement.

## 2. "Update everything": no

Don't run a blanket update, and never `npm audit fix --force`. Do it in small steps instead:

- **Make sure the lockfile is committed** and installs reproducibly. Everything else depends on that.
- **Run `npm audit` and `npm outdated`**, and note the date and tool versions. Separate what ships to production from dev and test tooling.
- **Lodash, 2 years behind.** First find out whether you are on a version with a known vulnerability (older lodash had prototype pollution and command injection advisories) and whether the vulnerable functions are reachable in your code. If it's a patch or minor bump within the same major, it is usually low risk. Do that on its own, run the tests, and commit it separately so it can be reverted.
- **Group the rest.** Patch and minor updates together per ecosystem, each major version on its own (a major bump goes through a proper migration, not a bulk update). Run the tests after each step.
- **Triage the scanner output** into fix now, fix this sprint, accept with a written reason and expiry date, and ignore because unreachable. Prefer bumping the direct dependency that pulls in a bad transitive one. Use an override only if you can't, with a comment saying when to remove it.
- **If a fix breaks the build or needs code changes**, I'd stop and report rather than force it.

## Afterwards

With your agreement I would add a scheduled Dependabot or Renovate config with grouped weekly updates, a CI check that fails on new high-severity findings or banned licences, and an accepted-risk file with owner and expiry dates. I would ask before enabling any of it.

## What I need from you

- Is this an app, a library others install, or an internal tool? That affects which licences matter.
- Can I run `npm audit`, `npm outdated` and `npm ls lodash` in the repo? They are read-only.
- Do you want me to compare invoice-parse-lite with alternatives, or with a small in-house parser?

I haven't run any scans yet, so none of the above reflects actual findings. It is the plan and my recommendation.
