A Lighthouse score of 94 and slow real-world performance can both be true. Lighthouse runs one simulated load, and your users are on cheap Android phones with weak CPUs and patchy networks. I'd fix things in this order.

**First, check what real users see.** Look at field data (CrUX, PageSpeed Insights "field" tab, or RUM via the web-vitals library) for LCP, INP and CLS at the 75th percentile, segmented by device and country. If you can, test with Lighthouse or WebPageTest using a Moto G-class profile, 4x CPU throttling and slow 4G, ideally from an Indian location. That becomes your baseline and your target, for example LCP under 2.5s and INP under 200ms on that profile.

**Fixes, biggest win first:**

1. **Hero image (1.8 MB PNG).** This is probably your LCP element and the easiest win.
   - Convert it to AVIF or WebP, with a JPEG fallback if needed. Expect roughly 100-200 KB.
   - Serve responsive sizes with `srcset` and `sizes`. A phone does not need a 2000px image.
   - Don't lazy-load it. Add `fetchpriority="high"`, set explicit `width` and `height`, and preload it if it's referenced from CSS.
   - Apply the same treatment to other product images: modern formats, correct sizes, `loading="lazy"` below the fold, and a CDN with long cache headers.

2. **Chat widget on every page.** Load it on demand.
   - Show a lightweight placeholder button and load the real widget on click or hover, or after idle or first interaction.
   - Or load it only on the pages where it matters, such as support or checkout.
   - Third-party scripts are often the main cause of main-thread blocking on slow phones, so this likely helps INP as well as bytes.
   - Audit other third parties (analytics, tag manager, ads) the same way.

3. **JavaScript (1.2 MB).** On a low-end phone, parse and execute time matters more than download size.
   - Run a bundle analysis (webpack-bundle-analyzer, source-map-explorer) to see what is in it.
   - Code-split by route so product pages only get what they need, and lazy-load below-the-fold or interactive-on-demand components.
   - Remove or replace heavy libraries (moment, lodash full build, big UI kits), drop unneeded polyfills, and don't ship modern code transpiled for old browsers.
   - Defer non-critical scripts. Consider server rendering, or islands/partial hydration, if the page is mostly static content.
   - Profile in Chrome DevTools with CPU throttling to find long tasks over 50 ms.

4. **Network and delivery.**
   - Enable Brotli compression and HTTP/2 or HTTP/3, and put the site behind a CDN with edge nodes in India.
   - Set long-lived immutable caching on hashed assets.
   - Preconnect only to origins you actually need early.
   - Subset fonts, use `font-display: swap`, and limit weights.

5. **Layout stability.** Reserve space for images, embeds and the chat button so CLS stays low.

**Then lock it in.**
- Set a performance budget, for example total page weight under about 1 MB on mobile and JS under about 300 KB compressed, and enforce it in CI with Lighthouse CI or bundlesize.
- Keep monitoring field data after each change and compare against the baseline.

**Expected result:** the page drops from about 4 MB to about 1.5 MB or less, and main-thread work falls sharply. Do the image and chat-widget changes first, since they are quick. The JavaScript work takes longer but will matter most for the slowest phones.

If you share a bundle report or a trace from a throttled run, I can help prioritize what to cut from the JavaScript.
