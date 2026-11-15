---
tags: [mobile-ci]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we have a react native app for ios and android and right now i build it on my laptop and upload by hand. i want ci. my plan: a github actions workflow on every push to main that builds the release version on a macos runner (for both ios and android, to keep it simple) and uploads it straight to app store production and google play production. to let ci sign, i'll commit the .p12 certificate, the provisioning profile and the android keystore with its password into the repo (it's private). i'll use my own apple id and password for the upload. i'll skip tests in ci because the emulator tests are flaky, and i'll bump the build number by hand in the code. good plan?
