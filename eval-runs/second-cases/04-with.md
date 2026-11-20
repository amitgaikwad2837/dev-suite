I can't run commands or open a browser in this session, so I haven't verified anything yet. Here is what I would do, in order, and what I'd expect to find. A blank page in a production build with a working dev server is a common pattern, so I have a short list of likely causes.

**1. Use a browser tool, not a fresh install**

If a browser tool is available in the session, I'd use it. Otherwise I'd ask before installing Playwright (`npm i -D @playwright/test`, then `npx playwright install chromium`, a download of a few hundred MB). Both servers are already running (dev on 5173, preview on 4173), so I wouldn't start anything.

**2. Compare the two builds before writing any test**

I'd open `http://localhost:5173/checkout` and `http://localhost:4173/checkout` and, for each one, collect:
- a screenshot at phone width (about 375px) and desktop width (about 1280px)
- console errors and warnings
- failed network requests (404s, wrong MIME types, blocked requests)
- the rendered DOM, to see whether the app root is empty or the page itself is missing

I'd report the differences between the two builds before touching any code.

**3. Likely causes, and how I'd tell them apart**

- **Uncaught runtime error in the console** (for example "Cannot read properties of undefined" or "X is not defined"). This is usually code that only works unminified, a missing import, or `process.env` / `import.meta.env` used wrongly. Env vars not prefixed `VITE_` are undefined in production. The stack trace will be minified, so I'd build with sourcemaps to map it back.
- **JS or CSS assets returning 404 or HTML.** This points to a wrong `base` path in the Vite config, or assets served from the wrong location. A MIME-type error on `/assets/...js` is the giveaway.
- **Page loads at `/` but blank at `/checkout` on a direct hit.** Client-side routing with no SPA fallback. I'd check whether the preview server rewrites unknown paths to `index.html`, and whether the router uses a `basename` that matches `base`.
- **Failed API calls.** The dev server may proxy `/api` (`server.proxy`), but `vite preview` doesn't unless `preview.proxy` is set. The checkout page may then crash on an empty or failed response.
- **Dev-only code paths.** Things behind `import.meta.env.DEV`, mocks, or a dependency that behaves differently once bundled or tree-shaken (a CommonJS module, or a side-effect import removed by `sideEffects: false`).
- **CSP or third-party scripts** (a payment SDK, for instance) blocked in the production environment.

**4. Fix the cause, then check it**

Once the console or network tab names the cause, I'd read the relevant code and make the smallest fix. Then I'd rebuild, restart the preview, and re-run the same check on port 4173 to confirm the page renders and the console is clean. I wouldn't mask the symptom with a try/catch or by turning off minification.

**5. Leave a regression check**

I'd add a small Playwright test against the preview build. It would use role and text locators (`getByRole`, `getByText`) with no fixed timeouts. It would assert that the checkout heading is visible and that no console errors were logged. If you want a full lasting suite and CI wiring, that's a separate step (the `playwright-ui-tests` skill).

**6. What I'd report back**

What I ran, at which widths, the dev-versus-production differences, the screenshots, the exact console or network error, the fix, and how to rerun (`npx playwright test`).

**What would help me now**

If you can run the checks, paste the browser console output (and any failed requests in the Network tab) from `http://localhost:4173/checkout`. That is usually enough to name the cause. Also tell me whether the blank page appears at `/` as well or only on `/checkout`. Otherwise, give me a session where I can run commands and I'll do the above directly.
