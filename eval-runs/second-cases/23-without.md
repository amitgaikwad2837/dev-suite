All three changes break existing users, so I wouldn't ship them as 2.4. With semantic versioning, a minor release promises that nothing existing breaks. Here is what each change does to your 4,000 users.

**1. Renaming --force to --yes.** Any script, CI job or alias that calls `tidy --force` will fail with an unknown-flag error.

**2. Making JSON the default output.** Anything that parses the text output, such as grep, awk or cut pipelines, or tools that wrap tidy, will silently get wrong results. This is the worst of the three because nothing fails loudly.

**3. Exiting 1 when nothing matches.** Scripts running under `set -e` or `&&` chains, and CI steps that currently succeed on an empty result, will start failing. Some users will see this as a regression, others as a fix, but either way it is a behaviour change.

**What I recommend**

Option A is to release these as 3.0. This is the simplest and most honest choice. You can still ship next week. Add a clear "Breaking changes" section to the changelog with a before and after for each item, and a short migration note.

Option B is to ship a compatible 2.4 now and make the breaking changes in 3.0 later.
- **--force to --yes:** add `--yes` and keep `--force` as a deprecated alias. It prints a warning to stderr and still works. Remove it in 3.0.
- **JSON default:** add `--format json|text`, or an env var such as `TIDY_FORMAT`, so users can opt in to JSON today. Keep text as the default and announce that JSON becomes the default in 3.0. If you want a smoother path, add a `--format text` flag in 2.4 so people can pin the old behaviour before the switch.
- **Exit code:** add an opt-in flag such as `--fail-on-empty` (or `--exit-code`) in 2.4. Make exit 1 the default in 3.0, and document the old behaviour as `--no-fail-on-empty`.

If you want these in as defaults next week, Option A is the one to pick. You can also mix them. For example, ship the additive parts (`--yes`, `--format`, the exit-code opt-in) as 2.4 next week, and cut 3.0 a few weeks later with the default flips once users have had time to adapt.

**Whichever option you choose**
- Add tests that pin the old and new behaviour for each change: flags, output format and exit codes. Treat these as part of the public contract.
- Make the deprecation visible: a warning on stderr (not stdout, so it doesn't corrupt output), release notes, and the `--help` text.
- Document the exit codes explicitly (0 for success with matches, 1 for no matches, 2 for usage errors, for example). Check that 1 doesn't collide with an existing "error" code, because scripts can't tell "no matches" from "failed" if both exit 1. Many tools, such as grep, use 1 for no match and 2 for errors, so you could follow that convention.
- Write a migration guide with the exact replacement for each old usage.

**What I'd do next if you'd like me to work on it:** look through the repo to find where the flags, the output formatting and the exit codes are handled, and make the changes as either the 3.0 set or the 2.4 compatible set. I'd also draft the changelog entry and the deprecation warnings. Which option do you prefer?
