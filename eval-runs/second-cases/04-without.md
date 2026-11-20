I can't run anything in this session, so I haven't looked at either server yet. This is the check I'd run, and what I'd expect to find.

**What I'd do**

1. Load `http://localhost:5173/checkout` (dev) and `http://localhost:4173/checkout` (production preview) in a real browser. Playwright (Chromium) would do. I'd attach listeners for `console`, `pageerror`, `requestfailed` and `response` (status 400 and above) before navigating, so nothing is missed.
2. On each page I'd take a full-page screenshot and record `document.getElementById('root').innerHTML.length`, the page title, and whether the checkout form is in the DOM. That shows whether the production page is truly blank or just not rendering.
3. I'd compare the two runs side by side. The first uncaught exception or failed request on 4173 that doesn't appear on 5173 is the lead.
4. I'd check the preview is serving a fresh build. If `dist/` is stale, I'd run `npm run build` and restart `vite preview`.

**Likely causes**

- **Wrong asset base path.** If `base` in `vite.config` is something like `/app/` or `./`, `index.html` requests JS and CSS from paths that return 404 or HTML. The console would show "Failed to load module script: MIME type text/html". Dev ignores this.
- **Runtime error that only occurs after minification.** Examples are a TDZ or circular import, or code that depends on `function.name` or class names. The console would show an uncaught `ReferenceError` or `TypeError` that points into the bundle. I'd build with `build.sourcemap: true` to find the source line.
- **Environment variables.** `import.meta.env.VITE_*` or `process.env.X` is undefined in the production build, because `.env.production` is missing or the variable has no `VITE_` prefix. Code that does `new URL(undefined)` or reads `.length` of undefined throws at render time. This is the most common cause of a page that works in dev and renders nothing in production.
- **Dev-only code paths.** Examples are `import.meta.env.DEV` mocks (MSW or a fake payment SDK) that production lacks, or a dev proxy in `server.proxy` that isn't set up for `preview`, so `/api/*` calls return `index.html` and the JSON parse fails.
- **Routing.** A client-side route such as `/checkout` returns 404 from a static server without an SPA fallback. In that case the first request would show 404, or an empty page with a console error.
- **Third-party script blocked.** A CSP or ad blocker stops the payment provider script, and the app crashes on the missing global (for example `window.Stripe`) with no error boundary.
- **Missing error boundary.** In every case above, an uncaught error during first render unmounts the whole tree in React, which is why you see white instead of a partial page.

**What I'd report back**

- The exact first error message with its URL and line (mapped through a sourcemap), the failing request if there is one, and screenshots of both pages.
- The one-line cause, and the smallest fix: for example a `base` change, a missing `VITE_` variable, a preview proxy entry, or a guard around the undefined value.
- After the fix, a rerun against 4173 showing the form renders and the console is clean. I'd also add a short smoke check (load `/checkout`, expect the form and no console errors) so this fails in CI next time.

If you'd rather save time before I run it, paste the browser console output from 4173 (F12 > Console and Network tabs). The first red line usually settles which of these it is.
