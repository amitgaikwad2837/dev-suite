Two separate problems, so two separate plans. I haven't seen your code, so the first step in each is to confirm the cause before building the fix.

## 1. Offline edits: last sync wins and data is lost

**Cause.** The server accepts whatever the last client sends and overwrites the whole record. Two technicians edit the same job offline, and the second sync silently erases the first one's changes.

**Plan**

1. **Confirm the failure.** Write a test that makes two clients edit the same job offline and sync in both orders. Today it should lose data. Later it becomes the regression test.
2. **Detect conflicts instead of overwriting.** Add a `version` number (or `updated_at` plus a revision ID) to each job. The client sends the version it based its edit on. If the server's version is newer, it returns 409 Conflict and does not overwrite.
3. **Sync field-level changes, not whole records.** Have the client send only the fields it changed, along with the base version. Two techs who edited different fields (tech A changed notes, tech B changed parts used) merge automatically. This resolves most conflicts with no user involvement.
4. **Pick a rule for the same field edited twice.** Options, in rising cost:
   - Last-writer-wins per field. This is acceptable for low-stakes fields, as long as the losing value is kept in history.
   - Append-only fields, such as notes, time entries and parts lines. Both entries are kept, so nothing is lost.
   - Ask the user. Show a "this job changed while you were offline" screen with both values for safety-critical fields like status, signatures and readings.
   - CRDTs. These are probably overkill for forms.
5. **Keep a local operation queue.** Store pending changes in a durable local database (SQLite, Room, Core Data or Realm) as an ordered list. Each operation gets a client-generated ID so the server can deduplicate retries. This also makes the sync idempotent when a connection drops halfway through.
6. **Never discard silently.** Keep a server-side change history per job. Then even a wrong merge can be recovered, and support can answer "what happened to my edit".
7. **Rollout.** Ship server support first and keep it compatible with old app versions. Old clients that don't send a version get the current behaviour, plus logging of how often they would have conflicted. Then release the new client. Measure conflict rate and 409 rate for a couple of weeks.

**Decision for you and the business.** Which fields can merge automatically, and which need a human to decide? Ask a couple of technicians and dispatchers. Don't leave that call to the engineers.

## 2. Push notifications stopped arriving on some Android phones

"Some phones" is the clue. Work through these in order of likelihood.

1. **Find who is affected.** Segment by manufacturer, Android version, app version, and whether the user installed or updated recently. Xiaomi, Oppo, Vivo, Huawei, OnePlus and Samsung are the usual suspects.
2. **Aggressive battery management.** Many OEMs kill background apps and drop FCM delivery. Check whether affected users have battery optimisation on for your app. The mitigation is an in-app prompt guiding them to exempt the app, plus a help page per OEM (dontkillmyapp.com is a good reference).
3. **Android 13+ notification permission.** The `POST_NOTIFICATIONS` runtime permission has to be requested. Users who denied it, or who upgraded, get nothing. Check that you request it at a sensible moment and handle the denied state with a settings deep link.
4. **Stale or invalid FCM tokens.** Tokens rotate on reinstall, restore, or after long inactivity. Make sure the app sends its token to your server on `onNewToken` and on every launch. Make sure the server removes tokens on `UNREGISTERED` / `NOT_FOUND` errors and does not keep sending to dead ones.
5. **Message type and priority.** Time-sensitive job alerts should be high priority. Data-only messages with normal priority get deferred in Doze. Check whether you are sending notification messages or data messages, and whether your handler runs when the app is killed.
6. **Notification channels.** On Android 8+, a channel the user has silenced or set to low importance will not alert. Check that channel IDs match and that the importance is appropriate.
7. **Server side.** Look at FCM send responses and error codes. If you are still on the legacy FCM API, migrate to HTTP v1. Check for expired credentials or a changed server key.
8. **Google Play Services.** Devices without it (some Huawei phones) can't use FCM at all. If you have such users, you need an alternative provider like HMS.

**How to verify.** Add logging for token registration, send result and on-device receipt. Test on a real affected device (not only an emulator) with the app killed, the screen off and the phone idle for a while. Track delivery rate by manufacturer afterwards.

**Don't rely on push alone for critical changes.** Because of problem 1, a push saying a job was reassigned should also be backed by a sync on app open, and ideally a periodic background sync. That way a missed push causes delay, not loss.

## Suggested order

1. This week: segment the push failures and check the token and permission handling. That's probably the cheapest win.
2. In parallel: reproduce the conflict in a test and agree on the field rules with the business.
3. Next: the server-side versioning, then the client queue and merge, then the conflict UI.

If you can share the sync endpoint code, the data model for a job, and the FCM sending code, I can turn this into specific changes. It would also help to know the stack (native, React Native, Flutter) and what the affected phones have in common.
