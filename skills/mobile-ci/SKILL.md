---
name: mobile-ci
description: Sets up build, test, signing and distribution pipelines for iOS and Android apps. Use for mobile CI/CD, Fastlane, EAS, Bitrise, GitHub Actions for mobile, certificates, provisioning profiles, keystores, TestFlight and Google Play uploads, build numbers, flaky emulator tests, macOS runner cost and crash symbols. Skip for web and server pipelines (release-engineering) and store policy or app design (mobile-app-work).
---

# Mobile CI

A mobile pipeline differs from a web one in three ways: builds must be signed with keys that can lock you out of your own app if lost or leaked, iOS builds need expensive macOS machines, and a published release cannot be pulled back quickly. So protect the keys, spend macOS minutes only where needed, and let people, not every push, decide what goes to the stores.

## 1. Decide what the pipeline does

Three jobs with different triggers:

- **Pull request checks:** lint, type check, unit tests and a build of both platforms. Fast, no signing, no store access.
- **Main branch builds:** signed test builds sent automatically to testers (TestFlight, Play internal track), with a build number and notes.
- **Releases:** a tagged build promoted to production by a person, with a staged rollout.

Say who approves a release and who can stop it.

## 2. Shape the pipeline and control cost

- Build Android on Linux runners and use macOS only for the iOS steps that need it. macOS minutes cost several times more.
- Cache dependencies and build outputs, pin the versions of Xcode, Gradle, Node and the SDKs, and set job time limits so a stuck build does not burn money.
- Run the cheap checks first and in parallel. Do not run lint and unit tests on a macOS runner.
- Keep the pipeline in code in the repo (Fastlane lanes, EAS profiles or workflow files) so a build can be reproduced by anyone and not only from one laptop.

## 3. Signing keys

- Never commit certificates, provisioning profiles, keystores or their passwords, even to a private repository.
- Keep them in the CI secret store or a signing tool (Fastlane match with an encrypted private repository, Apple managed signing, EAS credentials). Use a temporary keychain on the runner and delete it after the build.
- On Android use Play App Signing, so the key that signs what users get is held by Google and you hold only an upload key you can reset. Keep a backup of the upload key and its passwords with a second owner.
- Use separate credentials for development and production, and know the expiry dates of certificates and profiles.

## 4. Store credentials and secrets

Upload with an App Store Connect API key and a Google Play service account, each limited to the role it needs, stored as CI secrets. Do not use a person's Apple ID and password, which breaks on two-factor prompts and leaves with that person. Do not expose secrets to builds from forked pull requests (`security-hardening`).

## 5. Version numbers

Build numbers must increase on every upload, and the stores reject duplicates. Derive them from the CI run number or a counter, never by hand. Take the user-visible version from a tag, tag each release, and generate the notes from the changes (`release-engineering`).

## 6. Tests that can be trusted

- Unit tests and lint on every pull request.
- A small set of emulator or simulator smoke tests on main, with a retry for infrastructure failures, and screenshots or video saved as artifacts. Run a larger suite on real devices or a device farm before a release.
- If emulator tests are flaky, find the cause, quarantine the worst and track them; do not delete the tests or turn them all off (`test-strategy`, `honest-fixes`).

## 7. Distribute in steps

Main builds go to internal testers automatically. A person promotes a chosen build to production through a protected step, and the first release uses a phased or percentage rollout with the ability to halt (`mobile-app-work`). Never publish to production on every push. Do not submit to a store, change a live release or tag without the owner's clear yes.

## 8. After the build

Upload debug symbols (dSYMs, ProGuard or R8 mapping files, source maps) to crash reporting so crashes are readable. Keep the build artifacts and logs for a while, and post the result and the build number where the team will see it.

## 9. Hand over

Report the pipeline stages and triggers, where each secret lives, who can approve a release, the runner and cost choices, the tests included and left out, and what you could not run (signing and store upload need real credentials).
