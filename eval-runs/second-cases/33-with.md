This is engineering guidance, not legal advice or a compliance sign-off. Counsel or whoever owns data protection should confirm the decisions flagged below.

## First, the clock and the identity check

- Under GDPR you have about one month from receiving the email (Article 12(3)). It can be extended by two months only for complex or numerous requests, and you must tell the person within the first month if you do that. Note today's date as the start and set an internal deadline well before the legal one.
- Confirm the person is who they say they are before deleting anything. Reply to the address the account is registered under, or have them confirm from inside their logged-in account. Don't ask for more ID than you need.
- Log the request, the date, the identity check and every action you take. You will need this record if the person or a regulator asks.

## Data map for this request

| Store | What is there | Action |
|---|---|---|
| Postgres | Account and profile data, plus anything else keyed to the user | Delete or anonymise, including related tables, join tables, audit and event tables, and any soft-deleted rows. Check for copies in read replicas, search indexes and caches. |
| S3 uploads | Their files | Delete the objects. Check versioning and delete markers, other buckets, thumbnails and derived copies, and CDN caches. |
| Mixpanel | Events and profile keyed to the user | Use Mixpanel's GDPR deletion API or data-subject request tool to delete the profile and events. Deletion there is asynchronous, so record the request ID and confirm it completed. |
| Mailchimp | Audience member | Archiving is not enough. Permanently delete the contact. Also check campaign reports, other audiences and any tags or segments. If you want to prevent re-adding them, don't keep their address in a suppression list longer than needed (see the exceptions below). |
| Nightly backups, 30 days | Full copies containing their data | Don't try to rewrite backups. Let them expire within 30 days, and make sure a restore never brings the data back (see below). Tell the person this in your reply. |
| CloudWatch logs | Their email in log lines | See the logs section below. |

You should also check for places that are easy to forget:
- Support tools such as a helpdesk or inbox, and the original request email.
- Payment provider, CRM and the data warehouse.
- Error tracking such as Sentry, and any AI or other vendors that received their data.
- Staging or dev databases loaded from a production copy.

Send a deletion request to each vendor that holds the data as a processor. Check you have a DPA with each.

## Things to decide before you delete

Erasure isn't absolute. You may keep some data where there is a legal obligation or a legal claim to defend. Typical examples:
- Invoices and payment records that tax or accounting law requires you to keep, often for years.
- Records of the request itself and of any consent.
- A minimal suppression entry, such as a hashed email, so you don't email them again. Document the reason and keep it minimal.

Ask finance and counsel what you must keep. Whatever you keep should be restricted to that purpose, and the person should be told what was kept and why. Also check whether there is an active dispute, fraud investigation or legal hold on the account.

## The two awkward ones

**Backups.** The usual accepted position is that backups are put "beyond use" and overwritten on their normal cycle, so the data is gone in at most 30 days. To make that hold:
- Write down the 30-day expiry as a documented policy.
- Keep a deletion ledger (user IDs or hashed identifiers only, not the data) and re-apply deletions automatically if anyone restores from a backup before the old copies have aged out.
- Tell the person the data will be fully gone from backups within 30 days.

**CloudWatch logs.** Logs with emails in them are personal data and are in scope. Options, from best to worst:
1. Check the log group's retention setting. If it is short, such as 30 days, expiry may be enough, but state the actual period.
2. If retention is long or unlimited, delete matching events. CloudWatch can't delete individual events, so in practice you export, filter and recreate the log group, or delete the affected streams. This is heavy, so weigh it against the risk.
3. Fix the cause. Stop logging raw emails (log a user ID instead), mask them at the logging layer, and set a retention period on every log group. This is the real fix, because the next request will hit the same problem.

## Suggested order of work

1. Log the request and verify identity.
2. Freeze: check for legal holds and what you must retain.
3. Delete from the primary stores: Postgres and S3.
4. Send deletion to Mixpanel and Mailchimp, and any other vendors, and save the confirmations.
5. Handle the logs.
6. Record the backup expiry date and add the deletion to the restore ledger.
7. Search each store again for the email, user ID and any other identifiers, and confirm nothing is left apart from the documented exceptions.
8. Reply to the person within the deadline, saying what was deleted, what was kept and why, that backups clear by a specific date, and that they can complain to their data protection authority.

## Longer-term fixes

This request exposed gaps. Turn the manual steps into a script or a documented runbook that covers every store, because the next request will take the same effort. Keep an up-to-date data map and a vendor list. Add retention periods to the logs and the backups. Add the deletion path to your privacy policy, which should describe how people can exercise their rights.

## What I haven't checked

I haven't looked at your code, schema or vendor settings, so the table above is based only on what you listed. I'd want to read the schema and logging code to find further copies. Whether any data must be retained for legal reasons is a decision for you and counsel. None of this is a compliance sign-off.
