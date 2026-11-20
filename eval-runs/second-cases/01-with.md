This is a blocker, not a polish item. A keyboard-only user cannot complete checkout, and that is a failure of your core journey. The plan below is a fix this week, then a proper audit, then the VPAT.

## Scope (I'm assuming these; correct me if wrong)
- Journey: open checkout modal, fill the form, fix errors, pay, close. Web, latest Chrome/Edge/Firefox/Safari.
- Standard: WCAG 2.2 AA. Is there a legal driver (ADA demand, EAA, a customer contract)? That decides the VPAT format.
- Context: this started as a customer complaint, so keep a dated record of the report, the fixes and the retests.

## What's wrong, ranked by who is blocked

**Blockers (fix this week)**

1. **The pay button is a styled div with a click handler.** Keyboard users can't focus or activate it. A screen reader user hears no button at all. (WCAG 2.1.1 Keyboard, 4.1.2 Name, Role, Value.) This is almost certainly the customer's problem.
   Fix: use a real `<button type="submit">`. Enter and Space then work for free, and you keep the styling by reusing the same classes.
2. **Focus doesn't move into the modal.** Keyboard and screen reader users keep tabbing through the page behind it and may never find the form. (2.4.3 Focus Order, 4.1.2.)
   Fix: use a native `<dialog>` opened with `showModal()`, which gives you the focus move, a focus trap, Escape to close, and an inert background. If you must keep divs, add `role="dialog"`, `aria-modal="true"` and `aria-labelledby` pointing at the title. Then move focus to the heading or first field on open, trap Tab and Shift+Tab inside, close on Escape, and return focus to the button that opened it.
3. **The close X is an icon only.** It probably isn't focusable and has no name. A screen reader user hears nothing or "clickable". (4.1.2, 2.1.1, 1.1.1.)
   Fix: `<button type="button" aria-label="Close checkout">` with the icon marked `aria-hidden="true"`. The visible target should be at least 24 px (44 is better).

**Serious (also this week, small changes)**

4. **Errors are red only.** Colour-blind and low-vision users, and anyone using a screen reader, can't tell what failed. (1.4.1 Use of Color, 3.3.1 Error Identification, 3.3.3 Error Suggestion, 4.1.3 Status Messages.)
   Fix:
   - Add text next to each bad field, plus an icon or other non-colour cue.
   - Link it with `aria-describedby` and set `aria-invalid="true"` on the field.
   - On a failed submit, move focus to a summary of errors or to the first bad field. If you show a banner instead, use `role="alert"`.
   - Check that the error text has 4.5:1 contrast.

**Check while you're in there (not yet confirmed, because I haven't seen the code)**
- Every input has a real `<label>`, not just placeholder text. (1.3.1, 3.3.2.)
- Visible focus ring on every control, at 3:1 contrast. (2.4.7, 2.4.11.)
- Payment or card fields allow autofill with `autocomplete` values. (1.3.5.)
- A processing or success state is announced through a live region. (4.1.3.)
- No timeout without a warning. (2.2.1.)

## This week: the quick fix
1. Do items 1 to 4 above. It is mostly swapping elements and adding attributes, so a day or two of work in small commits.
2. Retest each fix the same way it was found. Tab through the whole flow with no mouse and confirm the focus ring is always visible. Complete a purchase with the keyboard only. Run NVDA with Firefox or Chrome, or VoiceOver with Safari, and listen for the dialog title, button names and errors. Zoom to 200 percent and 400 percent.
3. Run axe-core as a first sweep, but don't call it done on a green run. Tools catch only about a third of issues, and none of them would have found a div that looks like a button but behaves like nothing, or caught that focus never moved.
4. Reply to the customer once the fix is live, and offer to confirm with them. Asking them to verify is the best test you'll get.
5. Add a guard so it doesn't come back: an axe check and a keyboard-flow test for checkout in your Playwright suite or CI, plus an accessibility line in your definition of done.

## Later: the proper review and the VPAT
- After the quick fix, audit the full set of key journeys (sign-up, login, cart, checkout, account), sampling page templates rather than every page. Test keyboard, screen reader, zoom, colour and motion.
- Group repeated issues by template and rank them by who is blocked.
- Draft the VPAT from those findings, at WCAG 2.2 AA, with each criterion marked supports, partially supports or does not support, and remarks. Don't write "WCAG compliant" anywhere. State which criteria were checked, at what level, on which pages, with which tools and versions. List what you didn't test.
- Have the owner or legal sign off on the VPAT. I can draft it, but the sign-off is theirs. Publish an accessibility statement with a contact route for feedback.

## What I need from you
- The modal's HTML and JS (or the component), so I can give exact code instead of patterns.
- The framework (React, Vue, plain JS?) and whether a `<dialog>` or a headless library is acceptable.
- Whether there's a legal deadline or a contract driving the VPAT.

I haven't run anything yet, so none of the above is a confirmed finding beyond what you described. Send the component and I'll turn this into a concrete patch and a retest checklist.
