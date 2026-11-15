---
name: library-cli-work
description: Builds and publishes libraries, packages and command-line tools that others install. Use for publishing to PyPI, npm or crates.io, a library's public surface, semantic versioning, CLI flags and exit codes, supported versions, packaging and release steps. Skip for HTTP or GraphQL services (api-design) and deploying your own app (release-engineering).
---

# Library and CLI Work

Code that other people install is held to a different standard from code only your team runs. Once it is published, every public name, flag and exit code is a promise, and removing one breaks strangers. So make the public surface small and deliberate, keep the command line a thin layer over the library, and test the thing users actually install.

## 1. Know who uses it and what they touch

Write down who installs it, what one job it does, and the five or so things a user does with it. The public surface is those things and nothing else. Everything else is private by default (underscore names, an explicit export list, internal modules) so it can change freely. One obvious way to do each common job is better than three.

## 2. Treat the public surface as a contract

- Use semantic versioning: breaking changes need a new major version, new features a minor, fixes a patch. Stay in 0.x while the surface is still moving, and release 1.0 only when you are ready to keep promises.
- Breaking means more than removing a name: changing a return type, an error type, a default, a flag or an exit code also counts. For the full compatibility rules see `api-design`.
- To rename or remove something, keep the old name working with a deprecation warning for at least one minor release, say what to use instead, and put it in the changelog.
- Libraries do not print, call `sys.exit`, read the process arguments or change global state on import. They return values and raise clear, documented exceptions. Make the types explicit.

## 3. Keep dependencies and requirements small

Each dependency is installed on every user's machine and can conflict with theirs. Drop heavy ones you use for a small part, pin loose ranges rather than exact versions for a library, and state which language and platform versions you support and test them (a matrix in CI). Keep import time and install size low.

## 4. Command-line behaviour people expect

- Put the CLI in its own thin module that parses arguments and calls the library.
- Provide `--help` with examples, `--version`, and a `--json` or similar machine-readable output. Results go to stdout; progress, warnings and errors go to stderr.
- Exit 0 on success and non-zero on failure, with different codes for usage errors and runtime errors. Never print an error and exit 0.
- Work without prompts when not on a terminal. For anything destructive offer `--dry-run` and require `--yes` or a confirmation. Respect `NO_COLOR`.
- Settings come from flags first, then environment variables, then a config file, then defaults. Never take secrets as command-line arguments, since they show in process lists and history.

## 5. Document it for a stranger

The README starts with what it is, how to install it, and a working example that fits on a screen, then the main options and a link to a full reference. Test the examples. Add a changelog, a license and a short contributing guide, and write useful error messages that say what to do next (`plain-writing`).

## 6. Test what ships

- Test the public API the way a user calls it, not the internals. For a CLI, test output, exit codes and `--help` on the real entry point.
- Build the package, install it from the built file into a clean environment and run the example from the README. Many packages work in the repo and fail when installed because a file or dependency was left out.
- Run the tests on every supported version in CI.

## 7. Publish carefully

Publishing is public and mostly cannot be undone. A version number can never be reused, and removing a release may break everyone who depends on it. So:

- Try a test index first, and check the package page, metadata and license.
- Publish from CI with trusted publishing or a scoped token and two-factor authentication on the account, not a personal password from a laptop. Never commit a token.
- Make no real publish, tag or version bump without the owner's clear yes on the exact version (`release-engineering` for the pipeline itself).
- If a bad release goes out, yank or deprecate it and ship a fixed patch, and say so in the changelog.

## 8. Hand over

Report the public surface, the version and why, supported versions, the dependencies kept and dropped, the CLI contract (flags, exit codes), what was tested from the built package, what was not run, and what needs the owner's yes before anything is published.
