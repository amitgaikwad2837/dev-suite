I'd write the design brief first and then build from tokens. Nothing is built yet. I haven't seen your stack or any existing styles, so this is the plan I'd start from, plus a few questions at the end.

## Design brief

1. **Who and when:** Warehouse leads and pickers' supervisors on 10-hour shifts, on large monitors. They scan for exceptions (late waves, short picks, blocked docks) and act quickly. Eye fatigue and glare matter more than first impressions.
2. **Tone:** Calm, not sterile. Dense, not cramped. No marketing flourishes.
3. **The one memorable thing:** An exceptions-first table. The rows that need attention rise to the top with a thin status rail on the left edge, and everything healthy recedes into quiet greys. A user should be able to look up after 20 minutes and spot the one red row without hunting.
4. **Type:**
   - Display and labels: a condensed-leaning grotesque such as IBM Plex Sans Condensed, for headers and column titles.
   - Text and data: IBM Plex Sans, with tabular numerals (`font-variant-numeric: tabular-nums`) so quantity and time columns align.
   - IDs and SKUs: IBM Plex Mono.
   - Scale: 11, 12, 13, 15, 20, 28. Table body is 13px on a 28px row, which is dense but still readable at monitor distance.
5. **Colour:**
   - Base neutral: a warm-leaning slate. The dark theme is the default because of the long shifts and is not pure black (`#14171C` surface, `#1B1F26` raised). A light theme sits alongside it for bright warehouse offices.
   - Accent: one amber-orange (`#E8A33D` on dark). It is used only for selection, focus and the primary action.
   - Status: success `#4CAF7A`, warning `#E0B13A`, error `#E5574F`. Each status also has an icon or shape and a text label, never colour alone.
   - Avoiding the usual purple-blue gradient and bootstrap-blue defaults.
6. **Spacing and layout:** 4px base unit. Full-width fluid layout, with no max content width on tables, because the monitors are big. Left rail navigation at 56px collapsed and 220px expanded. A sticky filter bar over a sticky-header table. A detail panel slides in from the right and doesn't replace the table.

## What I'd build

- **Tokens first:** a single `tokens.css` of custom properties for colour (light and dark), type scale, spacing, row heights (compact 24, default 28, comfortable 36), radii (one value, 3px), and motion durations (120ms). No raw hex or pixel values inside components.
- **Density control:** a toggle in the toolbar, saved per user, because people differ in what they can read at distance.
- **Tables:**
  - Sticky header and a pinned first column.
  - Sortable columns, resizable and hideable.
  - Zebra striping is off by default; a hover row highlight and a 1px hairline divider are used instead.
  - Right-aligned numerals.
  - Keyboard navigation (arrow keys, `/` to focus filter, `Enter` to open detail).
- **Filters:**
  - A persistent bar with saved views ("Wave 14 late", "Dock 3 blocked").
  - Removable filter chips, and URL-synced state so a supervisor can paste a link to a view.
- **Screens:** an overview strip of 4 to 5 live counts (orders at risk, open waves, dock utilisation) above the main exceptions table, then inbound, outbound, inventory and tasks as table views. Real warehouse copy and sample data ("Wave 14, Dock 3, 42 lines short"), not lorem ipsum.
- **Long-shift ergonomics:** no animated attention-grabbers except a single 1.5s pulse on a newly critical row, no auto-refresh that moves rows under the cursor (new rows queue behind a "3 new" pill), and AA contrast at a minimum, with AAA for body data text where it's affordable.

## Checked against the usual defaults

Default font stack: replaced. Purple-blue gradient: none. Equal three-card row: none, since the overview strip has unequal-width tiles and the table is the dominant element. Emoji as icons: none, using a consistent line icon set. Shadows on everything: none, since depth comes from surface tone. Mixed corner radii: one radius. Centred everything: no, it is left-aligned and data-dense.

## Where tokens live and what I'd leave as defaults

Tokens go in `tokens.css`, imported once at the root. I'd leave native scrollbars and basic form controls close to default, restyled only through the tokens, because it isn't worth custom work for an internal tool.

## Next steps once built

I'd run `ui-polish` for hover, focus, empty, loading and error states, then `browser-verify` to render it at 2560x1440 and 1920x1080 and check the density modes. An accessibility pass is worth doing too, given the long shifts.

## Questions that would change the plan

- What stack are you on (React, Vue, plain server-rendered), and do you already have a component library or brand colours? If so, I'd take the brief from those and skip the palette above.
- Are the monitors in a dim warehouse office or under bright light? That decides whether dark is the default.
- Which 3 or 4 tables do people watch most? I'd design those first and make the rest follow the same pattern.
