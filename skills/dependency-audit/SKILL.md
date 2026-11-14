---
name: dependency-audit
description: Audits a project's third-party dependencies for known vulnerabilities, licence problems, abandoned packages and risky update habits, then fixes what matters in safe steps. Use when the user says "audit our dependencies", "npm audit shows 40 issues", "are we using anything vulnerable", "check licences", "can we ship this under MIT", "what's outdated", "set up Dependabot or Renovate", "is this package safe to add" or "SBOM". Judges whether each finding is reachable and fixable, groups updates, keeps lockfiles in order and never runs a blanket force-upgrade. Skip for upgrading one major framework (migrate-and-upgrade) and for reviewing the project's own code (security-review).
---

# Dependency Audit

Scanner output is a list of guesses about risk. The work is to turn it into a short list of things that matter, fix those in small safe steps, and keep the list from growing back.

## 1. Know what is shipped

- Find the manifests and lockfiles for every ecosystem in the repo (npm, pip, Poetry, Maven, Gradle, Go, Cargo, Bundler, NuGet and so on), including Dockerfiles and base images, build tools and CI actions.
- Separate what ships to users or runs in production from what is only build, test or dev tooling. A flaw in a test runner is not the same as one in a web server.
- Ask what the project is: an app, a library others install, or an internal tool. That decides what licences matter and how much to pin.
- Confirm the lockfile is committed and installs reproducibly. If not, fix that first, since nothing else can be trusted without it.

## 2. Run the scanners

Use the ecosystem's own tools (`npm audit`, `pip-audit`, `cargo audit`, `govulncheck`, `bundler-audit`, OWASP dependency-check, `osv-scanner`, `trivy` for images) and a licence tool (`license-checker`, `pip-licenses`, `cargo deny`, `go-licenses`). Run only read-only commands. Note the date and tool versions, since results change daily. If the network or a tool is missing, say what couldn't be checked instead of skipping it quietly.

## 3. Triage, don't forward

For each vulnerability, decide in order:
1. **Is it in what ships?** Dev-only findings go lower.
2. **Is the vulnerable code reachable?** Read the advisory: which function, which input, which configuration. A parser bug matters if you parse untrusted input with it; it doesn't if you never call it. Use call graph tools (`govulncheck`, `npm ls`, `pipdeptree`) to see whether it's reached and who pulls it in.
3. **How bad, and how exposed?** Severity from the advisory, raised if the service is internet-facing or handles sensitive data, lowered if not.
4. **Is there a fix?** A patched version, a workaround, or none. Say which.

Sort into: fix now, fix this sprint, accept with a written reason and an expiry date, and ignore because unreachable. A dismissed finding without a reason will come back.

## 4. Check the other risks

- **Licences.** List each dependency's licence, including transitive ones. Flag copyleft (GPL, AGPL, SSPL), "no licence" and unknown ones against how the project is distributed. This is a flag for a lawyer or owner to decide, not a legal ruling.
- **Health.** Abandoned packages (no release in a long time, archived repo, sole maintainer who has left), packages with one tiny job that you could write yourself, and deprecated ones.
- **Supply chain.** Look-alike names (typosquats), packages added recently with few users, install scripts that run code, dependencies on git URLs or unpinned branches, and unpinned CI actions. Before adding a new package, check its age, maintainers, downloads, licence and what it pulls in.

## 5. Fix in small steps

- Update one group at a time: patch and minor updates of one ecosystem together, each major version separately. Run the tests after each (`test-strategy`) and keep each in its own commit so one can be reverted.
- Prefer the smallest change that clears the finding: bump the direct dependency that pulls in the bad one, then use an override or resolution only if it can't be bumped, with a comment and a removal condition.
- Never run `npm audit fix --force` or its equivalent blindly, and don't loosen version ranges to make a scanner pass. A major bump goes through `migrate-and-upgrade`.
- If a fix needs a code change, or breaks the build, stop and report instead of forcing it (`honest-fixes`).
- Replace or drop a package only if the user agrees.

## 6. Keep it clean

Add what's missing, ask before enabling: a scheduled Dependabot or Renovate config with grouped updates and a weekly cadence, a scanner and licence check in CI that fails on new high-severity findings or banned licences, and a generated SBOM if customers or rules ask for one. Pin CI actions and base images to digests or versions. Write the accepted-risk list in one file with owner and expiry.

Report: what was scanned and when, counts after triage (not raw counts), the fix-now list with the change made, accepted risks with reasons and dates, licence flags for a decision, anything that couldn't be checked, and the guards added.
