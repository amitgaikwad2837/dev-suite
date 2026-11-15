# Landing pages

Read this when the screen is a landing page, a marketing page, a launch page or a signup page. The approach adapts ideas from the MIT-licensed `landing-page-design` skill in elayadesign/ai-design-skills; the wording is new, and its fixed visual rules (specific fonts, banned icon sets) are left out because they are taste, not method.

A homepage serves many visitors. A landing page wins one: **one offer, one audience, one primary action.** Decide those three before any markup.

## 1. Intake: ask once, in one batch

- **Purpose:** the one action you want, the exact offer, and what counts as a conversion.
- **Audience:** who they are, the problem, their top three objections, where they arrive from (ad, search, email), how much they already know.
- **Proof:** logos, testimonials, numbers, case studies, a demo, guarantee or cancellation terms.
- **Constraints:** brand voice, design direction, mobile priority.

If something is missing, write a one-line assumption and keep going. Do not stall the build on answers you can default.

## 2. Page structure

- **Above the fold:** a headline naming the outcome and the audience, a one- or two-sentence subheadline, one primary button, one proof signal, one hero visual.
- **Middle (the argument):** problem to solution, three to five benefits written as outcomes, three "how it works" steps, social proof next to the claim it supports. Put one large-type statement of the core benefit here, not right under the hero.
- **Bottom (objections):** 6 to 12 FAQ items that answer the real objections, a risk reducer (trial, refund, easy cancel), and a final button that repeats the top one.

Pick one layout and say why: classic hero with sections, long-form story, minimal conversion page, or a comparison page for "X vs Y" searches.

## 3. Conversion rules

- One primary action. No competing buttons above the fold.
- Lead with benefits, then features. Use specific numbers instead of "fast" or "many".
- Match the message of the ad or link that brought them. A visitor who clicked "cut invoicing time" should see that in the hero.
- Give every objection an answer, and put proof beside the claim, not in a block at the bottom.
- Button text is a verb plus the outcome ("Start my free audit"), not "Submit" or "Learn more".

## 4. Never invent facts

Do not make up prices, guarantees, statistics, customer counts, testimonials or logos for a real product. Use marked placeholders (`{{price}}`, `{{customer_count}}`) and list them in the hand-over so someone fills them from real data. In a fictional demo, use plausible, uneven numbers, full names and varied dates. Skip filler words ("revolutionize", "supercharge", "effortless", "world class").

## 5. Motion that helps

- Animate only transform and opacity; they are cheap and do not shift layout.
- Use an easing curve with a soft landing, around 300 ms for hover colour and opacity and about 500 ms for movement.
- Reveal sections once as they enter the view, using IntersectionObserver or the framework's in-view helper, never an unthrottled scroll listener.
- Honour `prefers-reduced-motion`: fall back to a plain fade or show the content at once.

## 6. States and ship list

Every interactive element needs hover, active, a visible focus ring, loading, empty and error states. Before calling it done:

- Footer with legal links, a styled 404, a skip link, a favicon, page title, meta description and social tags.
- Cookie consent if the audience needs it.
- Form checks in the browser, plus a calm inline error. No `alert()`.
- Alt text, semantic headings, no dead links, the current page marked in navigation.
- A 390 px wide check with no sideways scroll. Use `browser-verify`.
- Search: `noindex` for ad-only or time-limited pages; for evergreen pages, one clear title, a plain question-and-answer FAQ, and FAQ markup if it fits.

## 7. Build order

Build and review section by section: hero, benefits, how it works, proof, FAQ, final call to action. Do not regenerate the whole page for each change; it loses the parts that were already right.

## Common failures

Several buttons competing in the hero, a vague promise, a feature list with no outcomes, proof buried at the bottom, text too small on a phone, and no clear next step.
