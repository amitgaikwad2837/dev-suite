---
name: migrate-and-upgrade
description: Plans and runs migrations, large refactors and version upgrades safely. Use to move between libraries or frameworks, upgrade a language, framework or major dependency (for example upgrade to Django 5 or move to Python 3.13), or restructure a whole codebase. Safety net first, one major version at a time, codemods in their own commit, rollback ready. Skip for a refactor inside one module or a few files (coding-discipline).
---

# Migrate and Upgrade

## Refactors and migrations

- State the invariant (e.g. "same requests on the wire, same results to callers").
- Build a safety net first when coverage is thin: characterization tests at the boundary being changed, not a blanket coverage drive.
- Migrate in slices behind a flag or one PR each, build green after every slice, rollback possible without a deploy until cleanup.
- Name the behavior differences between old and new (defaults, error types, semantics) and pin them with tests.
- Finish by removing the old path and grepping for leftovers.
- Present the migration as `coding-discipline` steps (audit, baseline, safety net, seam, slices, cleanup), each with its "Done when …".

## Upgrading to a new version (framework, language, major dependency)

Upgrades break because the breaking changes were never listed. Make them explicit first:
1. Pin the starting point. Record current versions, a green test run and a clean commit, so any later failure can be blamed on the upgrade. If tests are thin, add characterization tests around what the upgrade touches (see `migrate-and-upgrade`).
2. Read the sources of truth: the official migration guide, changelog and deprecation list for every version in between. Write the applicable breaking changes as a checklist for this codebase (grep for each affected API and count the call sites).
3. Go one major version at a time (or the vendor's recommended path) when jumping several; never skip straight across majors. Upgrade the language/runtime, then the framework, then its plugins, in the order the guide says.
4. Use deterministic tools before hand edits: the vendor's upgrade command or codemod (for example `ng update`, framework codemods, `jscodeshift`, `ast-grep`, `pyupgrade`, `rector`, OpenRewrite), run as a dry run first, in its own commit so its changes review separately from your manual fixes.
5. Fix in layers: build errors, then test failures, then deprecation warnings (turn warnings into errors to find them), then new lints. Re-run the full suite after each layer.
6. Check what tests can't see: bundle size and performance, config and environment differences, CI images, Docker base images, and behavior changes with no compile error (defaults, serialization, time zones, ordering).
7. Ship safely: staging first, canary or flag where possible, a rollback path (previous lockfile and image), and a list of removed deprecations for the release notes.
Report: versions from/to, breaking changes hit (and not hit), what each codemod changed, tests before/after, and anything still deprecated.
