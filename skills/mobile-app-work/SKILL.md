---
name: mobile-app-work
description: Builds and ships iOS and Android apps without store and device surprises. Use for React Native, Flutter, Expo, Swift or Kotlin work, App Store or Play Store submission and rejections, push notifications, permissions, offline mode, forcing updates and bugs that only show on real phones. Skip for responsive websites (web-quality) and the backend API alone (api-design).
---

# Mobile App Work

A phone app differs from a website in four ways that cause most of the pain: you cannot ship a fix in minutes, old versions stay alive for months, the network and the battery are unreliable, and two stores can say no. Plan around those before writing screens.

## 1. Settle the basics before building

- **Approach:** native (Swift, Kotlin), cross-platform (React Native, Flutter) or a web app wrapped as an app. Pick on the team's skills and on what the app needs from the device. If the user already chose, use it and do not reopen it.
- **Minimum OS versions and device range:** state them, because each one multiplies testing.
- **What needs the phone itself:** camera, location, push, background work, payments. Each one brings permissions, store rules and test work.

## 2. Plan the release around the stores

- Store review takes hours to days and can reject the app. Never promise a date that needs a Monday submission for a Tuesday launch; leave at least three working days and a fallback date.
- There is no instant hotfix. Native code needs a new review. Over-the-air updates cover only the JavaScript or asset layer and must not change what the store reviewed in a way the rules forbid.
- Release in stages (a percentage on Android, phased release on iOS), watch crashes and ratings, and keep the ability to halt.
- Guard the signing keys and certificates: back them up somewhere safe, with a second owner. A lost Android upload key or an expired certificate can block every release.
- Prepare what reviewers need: a working demo account with sample data, support and privacy URLs, the privacy manifest and SDK versions the store currently requires, and a TestFlight or internal-track build for a few testers before the real submission.
- Check the current store policies when the app uses payments, subscriptions, user accounts, kids' data or tracking (`payments-integration` for the money side).

## 3. Permissions, privacy and accounts

- Ask for a permission at the moment the feature needs it, after a one-line reason in your own screen, never on first launch. Design the "no" path: the app still works, and a way to change it later in settings.
- Collect the least data. Fill in the store privacy answers (App Privacy labels, Data safety form) from what the code and its SDKs actually do, and list third-party SDKs.
- If people can create an account in the app, they must be able to delete it in the app, and the store expects it.
- Keep tokens in the system keychain or keystore, not in plain storage or logs.

## 4. Design for a bad network and a short life

- Assume the connection drops mid-request. Show cached data first, queue writes, retry with backoff and make each retried request safe to repeat with an idempotency key (`api-design`). Decide how conflicts are settled when two devices edit.
- The OS can kill the app at any time. Save state as the user goes, restore it on launch and handle a notification opening a cold app.
- Respect battery and data: batch background work, avoid constant polling, compress images, and test with the phone on low-power mode.

## 5. Keep old versions working

Users stay on old versions for months. Every API change must work for versions already out (`api-design`: add, do not break). Ship a minimum-supported-version check from the first release, with a gentle "update available" prompt and a hard block you can switch on remotely for emergencies. Without it, a breaking server change strands real users.

## 6. Test where it will run

- Test on real devices, including an old, low-memory Android phone and the lowest iOS version you support. Simulators miss performance, push, camera, sensors and slow networks.
- Test with airplane mode, a throttled connection, a denied permission, a full disk, a changed language and large text, and screen readers (`accessibility-review`).
- Add crash and error reporting before launch and check that a test crash arrives with a readable stack trace (`observability`). Run the main journey by hand on the release build, not just the debug build.

## 7. Hand over

Give the release plan with dates and the fallback, the permission and privacy list, the minimum-version mechanism, the devices tested and the ones not, and what could still be rejected. Say what you could not run (store submission, real devices) rather than implying it passed.
