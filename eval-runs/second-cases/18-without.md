Here is how I would build it. I can't run commands or write files in this session, so this is the plan I'd carry out, not finished code.

**First, what I'd check or ask**
- Stack: is there an existing frontend (React, Vue, plain server-rendered)? If not, I'd default to Vite + React + TypeScript with plain CSS variables, plus TanStack Table and TanStack Virtual for the tables. That avoids the Bootstrap look by not using a component kit's default theme.
- Data: which screens matter most (inventory, inbound/outbound orders, pick/pack queues, dock schedule, exceptions)? Until I know, I'd build against mock data in a typed module so a real API can replace it later.
- Monitors: what resolution (for example 2560x1440 or 4K), and is the floor lighting bright or dim? That decides the default theme.

If you'd rather I just start, I'll assume the stack above, inventory, orders and exceptions screens, 2560 px wide, and a dim warehouse office.

**Design direction (so it looks designed and works for 10-hour shifts)**
- Dark-neutral default with a light option. Use a slightly warm or cool grey (not pure black), with text around 90% white to avoid glare. Colour carries meaning only: one accent for interaction, and status colours (late, blocked, ok, on hold) that are also distinguishable by icon or label, not by hue alone.
- Typography: a compact grotesque for the UI (Inter or IBM Plex Sans) and a tabular-figure monospace for SKUs, locations and quantities, so numbers line up. Body is 13 px with a 4 px spacing grid, and I'd scale up on large monitors instead of leaving small text in a sea of space.
- Layout: a persistent left rail with a narrow icon strip, a top bar with the shift, site and a global search (press `/`), and a full-width content area. No max-width container, since big monitors are the point. A summary strip (open orders, late, picks per hour, dock doors in use) sits above the table, and a right-hand detail drawer opens on row click so people don't lose their place in the list.
- Tables: 32 px rows by default with a density toggle (compact 28, comfortable 40), sticky header and first column, zebra striping that is barely visible, and a row hover and selected state. Columns are resizable, reorderable and hideable, and the layout persists per user. Virtualised rows keep 10k+ rows smooth. Numbers are right-aligned, and status uses a small chip.
- Filters: a filter bar with saved views ("my zone, late only"), quick chips for common statuses, and column-header filters. Filters live in the URL so a view can be shared on a team chat. A clear "N of M shown, reset" indicator is always visible.
- Keyboard first: j/k to move through rows, Enter to open, `/` to search, `f` for filters, Esc to close. Large click targets for the touch-screen stations.
- Fatigue and safety details: no animation beyond 120 ms fades, no auto-refresh that moves rows under the cursor (new data shows a "12 updates, click to apply" banner), visible focus rings, a contrast ratio of at least 4.5:1, and a clear "last updated" timestamp so people know the data is live.

**Build steps**
1. Set up the project and define design tokens (colour, type, spacing, radii, density) as CSS variables in one file, so nothing is styled ad hoc.
2. Build the shell: rail, top bar, summary strip, drawer.
3. Build one reference screen (outbound orders) end to end with the table, filters, saved views and drawer, and review it.
4. Reuse those pieces for inventory, inbound and exceptions.
5. Check it in a browser at 1920, 2560 and 3840 widths, in both themes, with keyboard-only use, and fix what looks off.

**What you'd get**
A running app with mock data, a `README` on how to point it at your API, and a short tokens file you can tweak to match your brand colours.

Tell me your stack and the top two or three screens and I'll start there.
