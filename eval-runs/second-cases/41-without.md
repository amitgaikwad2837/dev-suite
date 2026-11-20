Before I touch the code, I need to know whether this app has an existing design system or component library, such as MUI, Ant, Tailwind or a custom one. I would also like a screenshot or the current styles, since you didn't attach one. Without them I will assume a plain React table and match whatever conventions the repo already uses. I would start by finding the invoices table component, its styles and any shared tokens or table primitives.

A table that runs from 5 to 5,000 rows with up to 8 seconds of load time needs more than a visual restyle. This is the plan, in priority order:

1. **Loading (the 8-second case).**
   - Show skeleton rows that match the column layout, so the page doesn't jump when data arrives.
   - Keep the header and toolbar visible while loading.
   - After about 2-3 seconds, add a short "Still loading..." message.
   - After a longer wait, offer a cancel or retry.
   - Use `aria-busy` and a polite live region so screen readers know what is happening.

2. **All states, not only the full table.**
   - Empty (no invoices yet), with a clear call to action.
   - Empty-after-filter, with a "Clear filters" button.
   - Error, with a plain message and a Retry button.
   - Partial or refreshing, where the old data stays visible with a subtle progress indicator.
   - A few rows (5) should look intentional, not stranded.

3. **Scale (5,000 rows).**
   - Use virtualization (for example TanStack Virtual or react-window) or server-side pagination.
   - Keep a sticky header.
   - Use a fixed row height so scroll position stays predictable.
   - Show a visible row count and the active sort and filter.
   - Add sorting on every column, filtering by status, and search by customer or invoice number.

4. **Column design.**
   - Right-align amounts, use tabular numerals, and show the currency consistently.
   - Show status as a badge using colour plus an icon or text, never colour alone.
   - Show due dates in one format, with overdue ones emphasised and a relative hint such as "3 days overdue".
   - Truncate long customer names with an ellipsis and a tooltip.
   - Make invoice number a link to the detail view.

5. **Interaction and accessibility.**
   - Use real `<table>` semantics (or the correct ARIA grid roles), `aria-sort` on sortable headers, and a visible focus ring.
   - Make rows reachable by keyboard, and keep hit targets at least 32-44px.
   - Meet colour contrast requirements.
   - Add a hover state, and a selected state if there are bulk actions.
   - Respect `prefers-reduced-motion` for skeleton shimmer.

6. **Responsive.** On narrow screens, either scroll horizontally with a pinned first column or collapse rows into cards.

I would work in small steps and check each by running the app and looking at each state: loading, empty, error, 5 rows and 5,000 rows. I would simulate the 8-second delay in the browser to test the loading state. For the 5,000-row case I would confirm scrolling stays smooth. I would keep the diff limited to the table screen and not refactor unrelated code.

Questions that would change the plan:
- Is the data fetched all at once, or can the API paginate, sort and filter on the server? That decides between virtualization and server-side pagination.
- Is there a design system or brand guide I should follow?
- Are there row actions such as pay, send reminder or download, and is multi-select needed?
- Which browsers and devices must it support?
