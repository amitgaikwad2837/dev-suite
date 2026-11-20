I'd hold off on calling this 2.4. All three changes are breaking, and with about 4,000 users, scripts and CI jobs will be affected. Under semantic versioning, a CLI's flags, default output and exit codes are part of its contract.

**Why each change breaks people**

1. **Renaming `--force` to `--yes`.** Every script that passes `--force` will fail with an unknown-flag error, or silently stop confirming. This one is the easiest to soften.
2. **Making the default output JSON instead of text.** Anything parsing or grepping today's text output will break, and it can break without any error. That is the worst kind of break.
3. **Exiting 1 instead of 0 when nothing matches.** This is the most dangerous change. Any script running under `set -e` or CI will start failing builds, even though it was working correctly before.

**What I'd do**

- **Make `--yes` an alias for `--force` in 2.4.** Keep `--force` working, but have it print a deprecation warning to stderr saying "use `--yes`". List it in the changelog. Remove `--force` in 3.0, or at the earliest after at least one minor release of warning.
- **Don't change the default output.** Add `--json` (or `--format json`) in 2.4 as a purely additive feature. If you really want JSON as the default, make that change in 3.0. Optionally, add an environment variable or config setting in 2.x so people can opt in early.
- **Don't change the exit code on no match.** Add an opt-in such as `--fail-on-empty` (or a distinct code like 1 for "no match") in 2.4. Make the new behaviour the default only in 3.0. Document it clearly, and keep usage errors on a different code from runtime errors.
- **Collect the breaking changes into a 3.0 release.** That release would have a migration guide and a changelog that lists all three changes. Optionally, ship a 2.x release that warns about each upcoming change before 3.0.

**If you want 2.4 next week**

2.4 can include `--yes` (with `--force` deprecated), the opt-in `--json`, and the opt-in no-match exit. That is a safe, honest minor release. The default output and default exit code changes wait for 3.0.

**If you want all three defaults changed now**

Then release it as 3.0, not 2.4. Calling it a minor release would break the trust of 4,000 users.

**Before I do anything**

I would not bump the version, tag, or publish anything without your clear yes on the exact version number. Publishing can't be undone, and a version number can never be reused. When you're ready, I would:

- Make the changes in the CLI module.
- Add tests for each flag's output and exit code on the real entry point.
- Build the package, install it into a clean environment, and run the README example.
- Update the changelog.

Which route do you want: the non-breaking 2.4, or the full 3.0?
