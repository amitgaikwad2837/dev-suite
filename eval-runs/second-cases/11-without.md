Short answer: not yet for invoice-parse-lite, and no to "update everything" in one go. Treat them as two separate decisions.

## 1. Adding invoice-parse-lite

I wouldn't add it as it stands. The licence is fine (MIT). The problem is the combination of risks, and a library that handles invoices touches untrusted files and financial data.

- **Two open security issues.** Read them before deciding. Are they parsing bugs (ReDoS, path traversal, prototype pollution, XXE if it handles XML) or something minor? Have they been triaged or answered? Check whether we would reach the affected code. If the issues are unanswered, that tells you more than the issues themselves.
- **One maintainer, about 40 weekly downloads, 3 years old.** Few people are looking at this code, and a security fix may never arrive. Find out when the last release and last commit were. A package this small is also an easier target for takeover or a malicious release.
- **We would be parsing untrusted input.** Invoices usually come from outside, so a parser bug is exposed directly.

Before saying yes, I would:
1. Read the two issues and the source. A "lite" parser is probably small enough to review in an hour or two.
2. Check the last publish and commit dates, install scripts (`preinstall` or `postinstall`), the number of transitive dependencies, and whether the npm package matches the repo.
3. Compare alternatives: a better-maintained library, a hosted extraction API, or writing the narrow parsing we need ourselves.
4. If we still want it, limit the risk. Pin the exact version, commit the lockfile, run it in an isolated worker with no network or secrets, validate input size and type, and wrap it in a thin adapter so we can swap it out later. Be ready to vendor or fork it if the maintainer disappears.

If the issues turn out to be serious and unfixed, I would pick an alternative.

## 2. "Should we just update everything?"

No. A blanket update (`npm update`, `npm audit fix --force`, or bumping every package to latest) mixes many changes together. When something breaks you can't tell which change caused it, and `--force` can pull in major versions with breaking changes.

For lodash, handle it on its own:
1. Check the current version and what it is behind. Lodash 4.17.21 is the last 4.x release and fixes the known prototype-pollution and command-injection advisories. If we are on something older than that, upgrading matters. If we are already on 4.17.21, "2 years behind" may mean nothing needs fixing, since 4.x is very stable.
2. Run `npm audit` or `npm ls lodash` to see whether the vulnerable versions are actually used by us or only by transitive dependencies.
3. Bump lodash in its own commit and PR, run the tests, and merge it.
4. Then work through the rest in groups: security fixes first, then patch and minor updates together, then majors one at a time, each with its own changelog read and test run.
5. Set up Dependabot or Renovate with grouped updates so this does not pile up again.

## Summary

- invoice-parse-lite: hold off until the two issues are read and alternatives compared. If it is adopted, pin it and isolate it.
- lodash: update it on its own, carefully, and do not bundle it with a mass upgrade.
- Everything else: triage by actual risk and update in small, tested batches.

If you share the package.json and lockfile, plus the links to the two issues, I can go through them and give you a specific recommendation.
