---
name: playwright-ui-tests
description: Builds and maintains a Playwright end-to-end test suite for a web UI. Use when the user says "add UI tests", "set up Playwright", "end-to-end test suite", "test the critical flows", "visual regression tests", "run the UI tests in CI", "our Playwright tests are flaky", or wants regression protection for a frontend. Covers which journeys to test, config, login reuse, test data, selectors, network handling, screenshots, accessibility checks, flake rules and a CI workflow. Skip for one-off visual checks (browser-verify) and for unit tests (test-strategy).
---

# Playwright UI Tests

A UI suite earns its keep when it is small, fast, and trusted: a red run means something broke, a green run means the main journeys work. Slow or flaky suites get ignored, so every choice below favours trust over coverage.

## 1. Choose what to test

List the journeys a user cannot live without (sign in, the core create-edit-delete loop, checkout or the equivalent, one permission boundary) and test those end to end. Everything finer goes to unit or component tests (`test-strategy`). Aim for under 20 tests at the start; each one named for the behaviour it protects.

## 2. Set up once

- Install with the user's go-ahead (it downloads browsers): `npm i -D @playwright/test` then `npx playwright install --with-deps chromium`. Add Firefox and WebKit only if users need them.
- In `playwright.config.ts`: `baseURL`, a `webServer` entry that starts the app and waits for its URL, `fullyParallel: true`, `retries: 0` locally and 1 in CI, `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, and a second project with a phone viewport.
- Keep tests in `e2e/`, separate from unit tests, with `npm run test:e2e` as the one command.

## 3. Reuse login, isolate data

- Sign in once in a `setup` project, save `storageState`, and let the other projects load it. Test the login screen itself in its own test with no saved state.
- Each test creates the data it needs through the API or a seed helper, with unique names (a timestamp or random suffix), and does not rely on another test having run. Clean up what it created, or run against a database that is reset per run.
- Use page objects or helper functions only once the same steps appear in three tests. Before that, plain steps are easier to read.

## 4. Write steps that don't flake

- Locate by role, label or visible text; `data-testid` is the fallback.
- Assert with `expect(locator)` so Playwright retries; never `waitForTimeout`; wait on a response or a visible state when something loads (`page.waitForResponse`, `expect(...).toBeVisible()`).
- Stub only third parties or errors you can't trigger (`page.route`); let your own backend answer for real.
- Freeze what changes between runs: the clock (`page.clock`), random ids, animations, and masks for dynamic regions in screenshots.

## 5. Add the checks that catch more

- Visual: `toHaveScreenshot()` on a few stable pages with a small tolerance. Produce baselines on the same OS and browser as CI (a container), and write down the update command.
- Accessibility: run axe (`@axe-core/playwright`) on each key page and fail on serious violations.
- Console: fail a test on an unexpected `console.error` or a failed request.

## 6. Flakes are bugs

When a test fails intermittently, reproduce with `--repeat-each=20`, read the trace (`npx playwright show-trace`), and fix the cause: a missing wait, shared data, an animation, a real race in the app (`bug-investigation`). Retries are a safety net, not a fix. Never delete a failing test or loosen it to pass (`honest-fixes`); quarantine only with a written reason and an owner.

## 7. Run it in CI

Add a workflow that installs dependencies and browsers (cache them), runs `npx playwright test`, and uploads the HTML report and traces as artifacts on failure. Shard across machines once the suite takes more than a few minutes. Report the workflow file, the run command and how to read a failure, and how long the suite takes.
