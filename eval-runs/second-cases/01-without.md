A customer who can't pay with a keyboard is a real blocker, and the four problems you list are probably the whole reason. Fix them this week, then get a proper audit for the VPAT.

## This week: unblock keyboard and screen reader users

Fix in this order. Each one is small.

1. **Pay button.** Replace the styled div with a real `<button type="submit">` and keep your CSS. A native button is focusable, responds to Enter and Space, and is announced as a button. If you can't swap it today, add `role="button"`, `tabindex="0"` and a keydown handler for Enter and Space, but treat that as a stopgap. This is almost certainly what stops the customer from buying.
2. **Close icon.** Make it a `<button>` with `aria-label="Close"` (or visually hidden text). Mark the icon SVG `aria-hidden="true"`. Make sure it is reachable by Tab and that Esc also closes the modal.
3. **Modal semantics and focus.**
   - Use the native `<dialog>` with `showModal()` if you can. It gives you focus handling, Esc, and an inert background. Otherwise add `role="dialog"`, `aria-modal="true"` and `aria-labelledby` pointing at the title.
   - On open, move focus into the modal: the title, the first field, or the dialog itself with `tabindex="-1"`.
   - Trap Tab inside the modal while it is open. Make the rest of the page `inert`.
   - On close, return focus to the element that opened it.
4. **Errors shown in red only.**
   - Add text to each error, such as "Card number is incomplete", and an icon if you like. Colour alone fails WCAG 1.4.1.
   - Link each message to its field with `aria-describedby` and set `aria-invalid="true"` on the field.
   - Announce errors with a live region (`role="alert"` or `aria-live="polite"`) or move focus to an error summary on submit.
   - Check the red has at least 4.5:1 contrast on its background.
5. **Form basics while you are in there.** Check that every input has a real `<label>`, a visible focus ring (never `outline: none` without a replacement), and `autocomplete` attributes on the card and address fields (WCAG 1.3.5).

**Verify before shipping, about 30 minutes:**
- Unplug the mouse. Open the checkout, tab through, fill the form, trigger an error, pay, close with Esc, and confirm focus returns where it started.
- Run a screen reader pass with NVDA + Firefox or Chrome on Windows, or VoiceOver on Mac/iOS. Confirm the dialog title is announced on open, the fields have names, and errors are read out.
- Run axe or Lighthouse as a smoke test. They catch only about a third of issues, so they don't replace the manual pass.
- Check at 200% zoom and 320px width that nothing is cut off and the pay button is still reachable.

Then reply to the customer, tell them it is fixed, and ask them to confirm. Ask them to tell you what they use (browser and assistive tech), because that is useful test data.

## Later: VPAT / ACR

- **Decide the target.** A VPAT is a template, and the filled-in document is called an Accessibility Conformance Report (ACR). Customers usually expect WCAG 2.2 Level AA, and the report is normally done against the WCAG 2.1 or 2.2 edition of the VPAT. Check whether buyers need Section 508 (US public sector), EN 301 549 / the European Accessibility Act (EU), or just WCAG.
- **Scope it.** List the pages and flows that count. Checkout, sign-in, account and the main product flows are the minimum. A report covering only a fixed modal would be misleading.
- **Audit properly.** Use automated scans, a manual keyboard pass, screen reader testing (NVDA, JAWS, VoiceOver), zoom/reflow, contrast, and motion. Then rate each WCAG criterion as Supports, Partially Supports, Does Not Support or Not Applicable, with notes. Do not claim "Supports" on anything you haven't tested.
- **Be honest in the report.** Listing known gaps with a remediation date is normal and is better received than a spotless report that a customer later disproves. Legal exposure comes from false claims.
- **Who writes it.** Your team can draft it, but an independent third-party audit carries more weight with enterprise and public-sector buyers. Budget for one if those are your customers.
- **Stop the problem coming back.**
  - Use `eslint-plugin-jsx-a11y` or equivalent in CI.
  - Add axe checks to your end-to-end tests, plus one keyboard-only test for checkout.
  - Add a "native element first" rule to code review.
  - Choose an accessible component library for dialogs and menus (Radix, React Aria, Headless UI, or native `<dialog>`) instead of hand-building them from divs.
  - Add an accessibility statement and a contact route for reporting barriers.

## Suggested timeline

| When | What |
|---|---|
| Days 1-2 | Real button for Pay, labelled Close, dialog semantics and focus management |
| Day 3 | Error text and announcements, labels, focus ring, autocomplete |
| Day 4 | Keyboard and screen reader verification, fix what you find |
| Day 5 | Ship, notify the customer, add the keyboard test to CI |
| Next weeks | Scope the VPAT, audit the remaining flows, fix in priority order, publish the ACR |

If you share the modal's code (or tell me the framework), I can point to the exact lines to change and write the replacement markup.
