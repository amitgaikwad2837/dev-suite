Two features, two different risk areas. The CSV import is about untrusted files and personal data. The webhook is about your server making requests to addresses a stranger chose. I'd normally check the repo first for your framework, auth, hosting and how secrets are handled. In this session I can't look, so I'm treating those as unknown and have kept my questions to things only you can answer.

Reply "defaults" or change any numbers. Questions marked (blocks) hold up the design.

1. (blocks) Data. Besides names and emails, what else is in a customer record (phone, address, notes, payment or health details, free-text fields)? Who is harmed if an import leaks?
   Default: ordinary EU personal data (name, email, phone, company, notes). No payment or special-category data, and the import must reject or flag columns that look like it.

2. (blocks) People and roles. Who may run an import, and who may see the imported rows? Can an import ever touch another tenant's or team's data?
   Default: only admins and managers can import. Every row belongs to the importer's own tenant. Nobody can read or overwrite another tenant's customers, even by crafting IDs in the file.

3. (blocks) Webhook destinations. Who sets the callback URL, and what does the webhook send (full customer records or just an event ID)? Are customers allowed to point it at any host?
   Default: HTTPS only, public internet hosts only. The server blocks private, loopback, link-local and cloud-metadata addresses (SSRF), re-checks the resolved IP at connect time, does not follow redirects, and enforces short timeouts and a response size cap. Payloads are signed (HMAC) with a per-customer secret, and carry minimal data.

4. Outside input in the CSV. What happens to a row that starts with `=`, `+`, `-` or `@` when someone later exports it to Excel? Is the 50 MB file parsed in memory?
   Default: streamed parsing with a row and column cap, file-type and encoding checks, no macros or formulas executed, spreadsheet formula injection neutralised on export, all values stored as data and never concatenated into queries or HTML, uploads kept outside the web root and deleted after processing.

5. Exposure and abuse. Is the app on the public internet, and can a logged-in user trigger imports or webhook calls repeatedly?
   Default: public, login required. Rate limits per user and tenant, one import running at a time per tenant, a size cap enforced at the edge (not just in the UI), and webhook retries with backoff and a ceiling.

6. (blocks) EU rules. Which law and obligations apply beyond "GDPR"? Where may data be stored? What are your retention and deletion rules, and who is the controller versus the processor (are your customers uploading their own contacts)?
   Default: GDPR applies. Data stays in the EU region, imports and webhook deliveries are logged without personal data in the logs, raw upload files are deleted within a short window, a deletion or "forget this person" request also removes imported rows and any stored webhook payloads, and a data processing agreement is in place for your customers' uploads. Check the lawful basis and DPA wording with your privacy or legal contact, since I can't decide that for you.

7. Secrets and failure. Where do the webhook signing secrets and storage credentials live today, and how would you find out if an import dumped or corrupted data, or if the webhook was used to probe your internal network?
   Default: secrets in a secrets manager or environment, never in the repo or logs. An audit log records who imported what, when and how many rows, and who changed a webhook URL. Alerts fire on unusual import volume, blocked-address webhook attempts and repeated failures. Imports can be previewed and rolled back.

What I'll do once you answer: write a one-page SECURITY.md with ranked assets, a small role table, the entry points (upload endpoint, parser, webhook configuration, webhook sender) and testable requirements such as:
- "a webhook URL resolving to 169.254.169.254 or 10.x is rejected at save time and at send time";
- "a 51 MB upload is refused before it is fully read";
- "a CSV cell containing `=HYPERLINK(...)` is exported as text";
- "a user cannot read or overwrite another tenant's customer by changing an ID in the file or URL";
- "no personal data appears in application logs".

Then I'd pass the testable lines to test-strategy and run security-review before this ships.

If there is a repo I should read first, point me at it and I'll fold in what it shows, which should shorten these questions.
