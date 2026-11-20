Raising timeouts to 60s and adding retries: 3 hides the problem rather than fixing it. A suite that passes only after retries is flaky, and the retries make CI slower and trust lower. Pass-after-retry is not a pass. Here is what I would do, in order.

**1. Back out the band-aids and get real data**
- Set retries back to 1 in CI (0 locally), and put the timeouts back near default (about 30s per test, 5s for expect). A 60s timeout mostly turns a fast failure into a slow one.
- Keep `trace: 'on-first-retry'` and `screenshot: 'only-on-failure'`. Upload the HTML report and traces as CI artifacts on failure.
- Use the reporter's "flaky" summary (tests that failed then passed on retry) to get a list of which tests flake. I'd bet it is a small cluster, not all 120.

**2. Find out where the timeouts are**
Open a few failing traces (`npx playwright show-trace trace.zip`) and sort each failure into one of these:
- **Locator or assertion never satisfied:** the app is slow in CI, or the step is missing a wait on a real condition.
- **Waiting on the server:** the `webServer` isn't ready, the backend is cold, or the database is slow.
- **Test-to-test interference:** shared data, a login or session collision, or leftover state.
- **Whole run slow:** CPU starvation, too many workers on a small runner.

Also check whether the failures cluster on the first tests of a run (cold start), on specific files, or on specific workers.

**3. Reproduce the failure instead of guessing**
- Run the suspect test or file with `npx playwright test path/to/file --repeat-each=20` locally.
- Run it in the same environment as CI (the official Playwright Docker image, same worker count, same CPU limit), because "passes locally, fails in CI" is often a resource difference. Try `--workers=1` versus the CI default. If the flakes vanish at lower parallelism, you are on a resource limit or shared-data collision.

**4. Common causes and their fixes**
- **Fixed sleeps or `waitForTimeout`:** replace them with `expect(locator).toBeVisible()` or `page.waitForResponse`.
- **Non-retrying checks:** `expect(await locator.textContent())` or `isVisible()` snapshots don't retry. Use `await expect(locator).toHaveText(...)`.
- **Weak selectors:** prefer role, label or text locators (`data-testid` as the fallback). Fix ambiguous matches.
- **Shared or order-dependent data:** each test should create its own uniquely named data through the API or a seed helper, and not depend on another test running first. Log in once in a `setup` project and reuse `storageState`.
- **Animations, clocks and random values:** freeze them (`page.clock`, disabled animations, masked dynamic regions).
- **Slow or unstable network dependencies:** stub third parties with `page.route`, but let your own backend answer for real.
- **A real race in the app:** if the trace shows the UI is in an odd state, this is a genuine bug. Treat it with `bug-investigation`, not with more waiting.
- **CI capacity:** reduce `workers` in CI (for example half the cores), and make sure `webServer` waits for a real health URL. Shard across machines rather than packing more workers on one.

**5. Fix, verify, then guard**
- Fix the worst offenders first and re-run each with `--repeat-each=20` until it is clean.
- Never delete or loosen a failing test to get green. If you must quarantine one, do it with a written reason, an owner and a date.
- Once the flake rate is near zero, keep retries at 1 as a safety net only, and keep watching the "flaky" report so new ones are visible.
- With 120 tests, also check the suite length. Sharding (`--shard=1/4`) in the CI matrix keeps each job short and gives each test more headroom.

**What I need from you**
Paste or attach any of these and I can be specific: the `playwright.config.ts`, the CI workflow file, the names of the tests that fail most, and one failing trace or error message (which line timed out, and on what). With those I can tell you which of the causes above applies and make the changes.
