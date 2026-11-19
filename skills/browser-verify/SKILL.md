---
name: browser-verify
description: Drives a real browser with Playwright to check that a web UI works and looks right. Use for test the UI, does it work in the browser, take a screenshot, check the login flow, works on my machine but the page is broken, or after a frontend change worth seeing. Captures screenshots and console errors. Skip for API or unit-level work; for a lasting suite use playwright-ui-tests.
---

# Browser Verify

Frontend code that was never rendered is unverified. This skill gets the page in front of a browser, exercises it like a user, and leaves behind tests that stay green for the right reasons.

## 1. Get the app running

If a browser tool is already available in the session, use it instead of installing anything. Otherwise find the start command (`package.json` scripts, README) and the URL. Start the server in the background and wait until the URL answers; don't sleep for a fixed time. If Playwright is missing, ask before installing it: `npm i -D @playwright/test` then `npx playwright install chromium` (a download of a few hundred MB).

## 2. Look before you script

Open the page, go through the flow once by hand (a quick script or the browser tool), and collect: the screenshot at phone and desktop width, console errors and warnings, failed network requests. Report anything broken before writing tests.

## 3. Write stable tests

- Locate elements the way a user would: `getByRole`, `getByLabel`, `getByText`. Add `data-testid` only where no accessible name exists, and say that this is itself an accessibility gap.
- Wait for conditions (`expect(locator).toBeVisible()`), never `waitForTimeout`.
- Each test sets up its own data and does not depend on another test's order. Use a saved login state for authenticated flows instead of logging in through the UI every time.
- Mock the network only for third-party services or error cases you cannot trigger; test the real backend otherwise.
- One behaviour per test, named for the behaviour ("shows an error when the card is declined").

## 4. Check what a user would notice

Assertions on visible outcomes: text, URL, enabled and disabled state, focus after a dialog opens, no console errors. Use screenshot comparison only for stable, important screens, with the threshold and the update command written down.

## 5. A failing test is information

Read the trace (`npx playwright show-trace`) before changing anything. Decide whether the app or the test is wrong. Don't add retries or longer timeouts to make it pass; that hides flakiness (see `honest-fixes` and `bug-investigation`).

## 6. Report

Say what you ran, at which widths, what passed, the screenshots and errors you saw, and how to rerun (`npx playwright test`).
