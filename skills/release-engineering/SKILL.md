---
name: release-engineering
description: Designs and runs safe releases and deployment pipelines. Use when the user asks to "set up CI/CD", "design our release process", "ship this to production", "cut a release", "roll back", "version this", "write release notes", or when deploys are manual, risky or have broken production. Covers versioning, pipeline design, readiness checks, rollout strategy with abort criteria, rollback including database changes, and release notes. Never deploys, tags or publishes without explicit confirmation. Skip for local-only scripts with no deploy step.
---

# Release Engineering

A release process is good when shipping is boring: the same artifact moves through the same steps, problems show up before users see them, and going back is a rehearsed move, not an emergency.

## 1. Define what gets released and how it is versioned

- Name the release unit (service, library, app, schema) and the thing users depend on.
- Use semantic versioning where others consume the artifact: major for breaking changes, minor for compatible features, patch for fixes. Decide in advance what counts as breaking (API shape, defaults, stored data, supported platforms).
- Keep one source of truth for the version and tag releases from the exact commit that was built.

## 2. Design the pipeline around a few principles

- Build once, promote the same artifact through test, staging and production. Never rebuild per environment.
- Fast feedback first: lint, unit tests and a build within minutes; slower integration and end-to-end checks after.
- Gate on evidence: tests green on the exact commit, security and dependency checks, migration review. Gates that people routinely bypass should be fixed or removed.
- Environments alike: same images, same config shape, secrets from a vault or the platform, never from the repo.
- Reproducible: pinned dependencies and base images, a lockfile, no manual steps outside the pipeline.

## 3. Check readiness before any production step

A short checklist, each item pass or fail: CI green on the release commit; changelog or notes drafted; database and config changes reviewed and backward compatible; feature flags set as intended; dependencies and secrets in place; dashboards and alerts for the changed area exist; a rollback path is written down and fits the change; the people who must know are told.

## 4. Choose a rollout strategy by risk and reversibility

| Strategy | Good when | Watch out for |
|---|---|---|
| **Direct / big-bang** | Low risk, easy to revert, few users | No safety margin |
| **Rolling** | Stateless services with several instances | Two versions run at once, so changes must be compatible |
| **Blue-green** | Need instant switch back | Double capacity, shared database |
| **Canary** | Risky change, many users | Needs good metrics and enough traffic |
| **Feature flag** | Decouple deploy from release, gradual exposure | Flags left behind, untested combinations |

For anything beyond direct, write **abort criteria** before you start: the metrics and thresholds that stop the rollout (error rate, latency, failed payments, support tickets) and who decides.

## 5. Run the release

1. Pre-flight: checklist done, owner and time agreed, no conflicting changes in flight.
2. Deploy to the first small slice or environment.
3. Verify: smoke tests, the key dashboards, logs for new errors; hold for a bake period that matches how fast problems appear.
4. Expand in steps, checking the abort criteria each time.
5. Announce completion with what changed and how to report problems.

## 6. Plan the way back

Decide upfront whether a problem is handled by **rolling back** (revert to the previous artifact) or **rolling forward** (a fast fix), and who calls it. Databases are the hard part: use expand/contract so old and new code both work against the schema (add first, migrate data, switch code, remove last in a later release). Never ship a change that makes rollback impossible without saying so and getting explicit sign-off.

## 7. Release notes and records

Write notes for the reader, grouped by what they can do or must change (new, changed, fixed, removed, upgrade steps), with PR or issue numbers. Call out breaking changes and migrations first. Record the version, date, commit, who released, and anything surprising, so the next release is easier.

## Confirm before acting

Production deploys, tags, package publishes, force pushes, migrations on live data and flag changes affect other people and are hard to undo. Show the exact command, target and effect, and wait for a clear yes for each such action. Approval for one step does not cover the next.
