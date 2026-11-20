This is a GDPR Article 17 erasure request. You have one month from receipt to respond (extendable by up to two more months for complex requests, but you must tell the person within the first month). Here is what I would do, in order.

## 1. Today

- Log the date you received the email. The one-month clock starts then.
- Verify identity. Reply to the address the request came from, or ask for something proportionate that you can match against your records. Don't ask for a passport scan. If the email came from the address on the account, that is usually enough. Verification must not become an excuse to delay.
- Check the request really is "delete everything" and not a narrower one, such as unsubscribe from marketing. Don't over-ask, because the stated request is erasure.
- Tell the person you have received it and when to expect a reply.
- Involve whoever owns privacy, such as your DPO or legal contact. Keep a record of the request and of every step you take.

## 2. Find all the data

Search every system by email address and by internal user ID. List each system, what it holds and how you will remove it.

| System | Action |
|---|---|
| Postgres | Delete the user's rows. Walk the foreign keys and related tables: profiles, orders, comments, sessions, audit tables, analytics tables, and any copies in read replicas or warehouse exports. Prefer a hard delete. If you must keep rows for integrity or a legal duty, anonymise them (remove name, email and other identifiers, and null the user_id link) so they can no longer be tied to the person. Run it in a transaction and take the counts before and after. |
| S3 uploads | List and delete every object the user uploaded. Check the prefixes by user ID. Also check versioned buckets (delete all versions and delete markers), lifecycle rules, replicas in other regions, and CDN caches (invalidate them). |
| Mixpanel | Use Mixpanel's GDPR deletion API or the "Data Deletion" request in the project settings, keyed on the distinct_id. Check that email aliases and identity merges are covered. Deletion there is asynchronous, so record the task ID and confirm it completes. |
| Mailchimp | Archiving or unsubscribing is not enough, because the record stays. Permanently delete the contact. Be aware that this stops you re-adding them by accident, but it also means you can no longer prove their earlier consent or unsubscribe status. If you want to prevent future emails, keep only a minimal suppression entry (a hashed email) and say so in your reply. |
| Nightly backups (30 days) | You don't need to rewrite the backups. The usual accepted approach is "beyond use". Delete from live systems now. The backups roll off within 30 days. Until then, don't restore from them without re-applying the deletion (keep a deletion ledger of erased user IDs and replay it after any restore). Tell the requester that backup copies are deleted on the normal 30-day cycle. This fits inside the one-month deadline. Document the decision. |
| CloudWatch logs | Logs with an email in them are personal data. Search with Logs Insights for the email and the user ID. You can't edit individual log events, so either let them expire under the retention period (set a retention policy if there isn't one, since "never expire" is a problem on its own) or delete the affected streams if they are narrow enough. If the retention is long, shorten it. Also fix the cause: stop logging raw emails (mask or hash them, or log the user ID). |

Also look for places people forget:

- Third-party tools that receive the data: error tracking such as Sentry, support desk, CRM, payment processor, data warehouse, email provider logs, customer-support inboxes, Slack exports.
- Your own mailbox. The request email contains personal data.
- Developer laptops, test and staging databases, and database dumps.
- Processors you share data with. Article 19 requires you to tell each recipient of the erasure so they delete it too, unless that is impossible or disproportionate.

## 3. What you may keep

Erasure isn't absolute. You may keep data where you have a legal duty or a legitimate need, for example invoices and payment records for tax law (often 6 to 10 years depending on the country), data needed to establish or defend a legal claim, and fraud or security records where justified. If you keep anything:

- Keep only what the obligation requires.
- Restrict access to it and don't use it for anything else.
- Tell the requester what you kept, why, and for how long.

## 4. Do it, then verify

- Run the deletions in the order above. Write down who did what and when.
- Take a verification pass afterwards. Search again by email and user ID in each system and confirm nothing remains, except what is on the exception list and the backups and logs that are rolling off.
- Put a reminder on the calendar for 30 days out to confirm the backups and logs have aged out.

## 5. Reply to the person

Within the month, send a plain message confirming:

- Their data has been deleted from your live systems and from the processors you use.
- What, if anything, you kept and the legal reason.
- That backups and logs will be fully purged within 30 days, and that nothing in them will be used or restored in the meantime.
- That they can complain to their data protection authority if they are unhappy.

Don't include any of their personal data in the reply beyond what is needed to identify the request.

## 6. Keep a record and fix the process

- Keep a record of the request: date, verification, systems touched, outcome. Don't keep the erased data itself in that record.
- Make it repeatable. A short runbook or script that takes a user ID and deletes it from every system will save you time on the next request, and there will be one.
- Stop putting emails in logs.
- Check that your privacy notice lists these processors and your retention periods, including the 30-day backups.

If you want, tell me the stack details (the Postgres schema, bucket layout, how Mixpanel is identified) and I can draft the deletion script and the reply email.
