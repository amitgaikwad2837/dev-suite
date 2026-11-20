Raising timeouts and adding retries: 3 mostly hides the problem. A test that needs 3 attempts is still failing, and 60s timeouts make each failure slow. Retries also stretch CI time and let real regressions through as "passed on retry". Passing locally and failing about 20% of the time in CI usually means one of these causes, so I would work through them in order.

**1. Get evidence first**
- Set `trace: 'on-first-retry'` (or `retain-on-failure`), `video: 'retain-on-failure'` and `screenshot: 'only-on-failure'`. Upload `playwright-report/` and `test-results/` as CI artifacts.
- Run the failing tests a few times in CI with `--repeat-each=5`. Look at which tests fail and what they were waiting on. Open the trace viewer and check whether the failure is an action timeout, a navigation timeout or an expect timeout.
- Check whether the failures cluster on the same tests or are spread randomly. Clustered failures point to specific test bugs. Random failures point to the environment.

**2. Common causes of local-pass, CI-fail timeouts**
- **Resource starvation.** CI runners often have 2 vCPUs. If you run with the default workers (half the cores) or `workers: 8`, the browsers fight for CPU and the app under test slows down. Try `workers: 1` or `2` in CI and compare. This is the most common cause.
- **App server not ready or cold.** Use `webServer` in `playwright.config` with a `url` health check, not a sleep. A dev server compiling on first request (Next, Vite) causes first-test timeouts, so use a production build in CI.
- **Race conditions that a fast machine hides.** Look for:
  - `waitForTimeout` or fixed sleeps. Replace them with web-first assertions such as `await expect(locator).toBeVisible()`.
  - Clicking before hydration or before a handler is attached.
  - Asserting on a value read once with `.textContent()` or `isVisible()`, which does not retry. Use `expect(locator).toHaveText()` instead.
  - Not waiting for the network response that drives the UI. Use `page.waitForResponse` or assert on the resulting UI state.
- **Shared state between tests.** With 120 tests, shared accounts, shared database rows or order dependence break when workers run in a different order or in parallel. Each test should create its own data, or use unique names or IDs. Reuse login via `storageState`, not through a shared mutable session.
- **Network dependencies.** Calls to third parties (analytics, fonts, payment sandboxes) are slow or blocked in CI. Mock or `route.abort()` the ones you don't own.
- **Environment differences.** Different browser versions, fonts, viewport, timezone or locale. Use the official Playwright Docker image or `npx playwright install --with-deps` pinned to the version in your lockfile.
- **Backend and database in CI.** A small or shared test database, rate limits, or an unseeded environment can all make API calls slow.

**3. Fix the timeouts properly**
- Put the timeouts back to Playwright's defaults, or something modest like 30s per test and 5-10s per `expect`. A test that needs 60s to pass is telling you something is wrong. A long timeout only makes the failure slower.
- Reduce `retries` to 1 or 2 in CI, and keep 0 locally. Treat any test that passes only on retry as flaky. Playwright reports these as "flaky" in the summary, so track the list and fix or quarantine each one. Tag quarantined tests with `test.fixme` or a `@flaky` tag, with an owner and a ticket, and not a silent skip.
- Shard (`--shard=1/4`) across several CI jobs if the suite is too slow for the runner, instead of squeezing more workers into one small machine.

**4. Suggested order of work**
1. Turn on traces and artifacts, then run a batch of CI runs to find which tests fail and why.
2. Try `workers: 2` (or 1) in CI. If the failure rate drops sharply, it is resource contention, and sharding is the fix.
3. Fix the top few flaky tests by cause: replace sleeps with web-first assertions, isolate data, wait on the right signal.
4. Restore normal timeouts and set retries to 1-2.
5. Add a guard: a nightly `--repeat-each=10` run, or a flaky-test report, so new flakiness is caught early.

If you share the config (`playwright.config.ts`), the CI workflow file, and a trace or error message from a failed run, I can point to the specific cause. Typical messages like "Timeout 30000ms exceeded waiting for locator", "page.goto timeout" or "expect(...).toBeVisible timeout" each point in a different direction.
