A Lighthouse 94 on a fast desktop profile tells you little about a cheap Android phone on a patchy Indian mobile connection. Your page numbers explain the complaints: 4 MB of transfer plus 1.2 MB of JavaScript that a slow CPU must download, parse and run. I'd measure properly first, then fix in this order.

**Step 0: measure the right thing**
- Re-run Lighthouse on the throttled mobile profile (slow 4G, 4x CPU slowdown), or better, WebPageTest on a real Moto G-class device from a Mumbai or Bangalore location.
- Check field data (CrUX or your own RUM) for India, mobile only. Look at LCP, INP, CLS and total JS. Your 94 probably comes from a fast-machine run, so a field number is the one to trust.
- Write down the baseline for a few key product pages. You'll need it to show the fixes worked.

**Fix order, biggest payoff first**

| # | Finding | Effect on a user | Fix |
|---|---|---|---|
| 1 | 1.8 MB PNG hero | Probably the LCP element. On slow 4G it takes many seconds to arrive, so the page looks blank or half-loaded. | Convert to AVIF or WebP, serve responsive sizes with `srcset` and `sizes` (about 400 to 800 px wide for phones), and compress. Expect 1.8 MB to drop to roughly 60 to 150 KB. Set `width` and `height`, add `fetchpriority="high"` to the hero, and don't lazy-load it. |
| 2 | Chat widget loading on every page | Third-party JS competes with your content for bandwidth and the main thread, and hurts INP. | Load it on user intent: a click on a chat button, or first scroll or idle time, and only on pages where it matters. Show a lightweight facade button until then. Check how much of the 1.2 MB it accounts for. |
| 3 | 1.2 MB JavaScript | Download, parse and execution on a low-end CPU can take seconds, and the page may look ready but ignore taps. | Open a bundle analyzer and look for what ships that product pages don't need. Split by route, lazy-load below-the-fold and interactive-on-demand components, remove unused libraries, and defer non-critical scripts. Aim for a few hundred KB on a product page. |
| 4 | 4 MB page weight overall | Costs data, and loads slowly in a region where data is metered. | After the hero and JS, check the remaining images (lazy-load below the fold, modern formats), fonts (self-host, subset, `font-display: swap`), and enable Brotli and caching with long-lived headers for static files. |
| 5 | Layout shift and delayed responses | Late-loading content and the widget moving the layout, and taps that lag. | Reserve space for images and the widget, and keep long main-thread tasks short. |

**What I'd do first**
1. Do the hero image and the chat widget deferral. They're quick, and likely the largest gains.
2. Then the JS audit and code-splitting.
3. Re-measure on the same throttled and real-device setup. Aim for LCP under 2.5 s, INP under 200 ms and CLS under 0.1 in the field for those users, and keep total transfer well under 1 MB if you can.
4. Add a performance budget in CI (for example on image and JS size, or Lighthouse CI on the throttled profile) so it doesn't creep back.

If you can share the bundle analysis, a WebPageTest link or the page URL, I can rank the specific JS to cut. I haven't measured your site, so the figures above are estimates until we re-test, and I'd report the before and after numbers once we have them.
