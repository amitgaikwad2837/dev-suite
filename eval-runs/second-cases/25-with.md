Both problems are fixable, and neither needs a rewrite. The sync fix is a design decision plus some server work. The push problem is almost certainly a device-level cause that you can find in a day or two. I have not touched your code, so everything below is the plan and what I'd check first.

## 1. Offline edits: stop "last sync wins"

Right now the whole job record is overwritten by whoever syncs last. That is the bug, and it needs three changes.

**Track changes per field, not per job.**
- Each device sends what it changed (field, new value, and the version it started from), not the whole form.
- The server keeps a version number (or a per-field timestamp) on each job.
- If two technicians edit different fields, merge both automatically. This will be the large majority of cases.

**Decide a rule for real conflicts (same field, both offline).** Pick this with the business, not just engineering:
- Safe default: keep both versions, apply one, and flag the other for review. Don't silently drop either.
- For some fields the rule is obvious. Notes and checklist items can be appended or merged. Status can follow an allowed order (for example, "completed" beats "in progress"). Numbers such as meter readings or quantities should go to a human to resolve.
- Show the technician a clear "this job changed while you were offline" screen. Don't just overwrite their data.

**Make retries safe.**
- Queue writes on the phone, and send each with an idempotency key so a retry after a dropped connection doesn't apply twice.
- Retry with backoff. Keep the queue on disk so an OS kill mid-sync doesn't lose it.
- Keep the technician's draft saved as they type, and restore it on launch.

**Old app versions.**
- Technicians don't all update quickly. Old clients still send whole-job overwrites.
- Make the new API additive: accept the old format, but treat it as "changed everything since the version I last saw" and run conflict detection on it.
- If you don't already have a minimum-supported-version check with a remotely switchable hard block, add it in this release. You'll need it to retire the overwrite behavior.

**Test it.**
- Two phones in airplane mode, edit the same job (same field and different fields), reconnect in both orders, and confirm nothing is lost.
- Also test a sync that drops halfway, and the app being killed mid-sync.

**One question for you.** How often do two people really edit the same job, and which fields matter most? That decides whether you need field-level merge everywhere or only on a few critical fields. It also shapes the review screen.

## 2. Push notifications missing on some Android phones

"Some Android phones" usually points to the device, not your server. In rough order of likelihood:

1. **Manufacturer battery management.** Xiaomi, Oppo, Vivo, Huawei, Samsung and OnePlus aggressively kill background apps and drop pushes. Check whether the affected phones share a brand. Fixes are high-priority messages, asking the user (with a one-line reason) to exclude the app from battery optimization, and a help page with brand-specific steps.
2. **Android 13+ notification permission.** The app must request `POST_NOTIFICATIONS`, and if it was denied once it never asks again. Check for it and send the user to settings with a clear message.
3. **Stale or invalid FCM tokens.** Tokens change after reinstall, restore or a long idle period. Check that you refresh and re-send the token on each launch and on the token-refresh callback, and that the server removes tokens FCM reports as unregistered.
4. **Message priority and type.** Time-sensitive job notices should be high priority. Check whether you send "notification" or "data" messages, since data-only messages are more easily dropped in the background.
5. **Notification channels.** If a channel was created with low importance or turned off, the user won't see anything. Channel settings stick once created.
6. **Missing Google Play services.** Some phones (Huawei, some other brands) have no FCM at all, so they need an alternative or a fallback such as in-app polling when the app opens.
7. **Server side.** Check your FCM error responses and delivery logs. A rising rate of unregistered-token errors confirms cause 3.

**How to narrow it down.**
- List the affected devices by brand, model, Android version and app version, and compare with the phones that work.
- Look at FCM delivery reporting versus what clients receive.
- Reproduce on a real affected phone (an emulator won't show battery-management behavior), with the app backgrounded and then killed.
- Remember a notification that opens a cold app needs to route to the right job. Test that too.

Don't rely on push alone for anything critical. Have the app fetch job changes on open and sync, so a missed push means a delay, not a missed job.

## 3. Order of work and release

1. Push diagnosis (a few days). It's quick, and it will tell you how many users it affects.
2. Version/field-level sync design and conflict rules, agreed with the business.
3. Server changes first (additive, backwards compatible), then the app update.
4. Release in stages (a percentage on Android, phased release on iOS), watching crashes and sync errors, with the ability to halt.
5. Leave at least three working days for store review, plus a fallback date. A native fix can't ship instantly, so don't promise a date that needs a Monday submission for a Tuesday launch.

**What I can't verify from here.** I haven't seen your code, devices, FCM logs or store status, so the push causes are ranked guesses until you check the data above. Real-device testing (including an old, low-memory Android phone) and store submission are on your side.

If you send me the sync endpoint's request/response shape and the FCM send code, I can turn this into specific changes.
