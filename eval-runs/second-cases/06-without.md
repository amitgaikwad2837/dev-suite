Short answer: start with the storage bucket and the compute, then check BigQuery. Together they are most of the recoverable money, and none of it needs a risky change. A realistic saving is about $350-500 a month. That would bring you from $1.2k to roughly $750-850, close to where you were at $700.

**What I'd do first, in order**

1. **Cloud Storage, the 14 TB versioned "backups" bucket ($210).** This is the most likely cause of the jump from $700. A versioned bucket with no lifecycle rule keeps every old version forever, so the bill grows every month.
   - Check how much of the 14 TB is noncurrent versions. Look in Storage metrics, or run `gcloud storage ls --all-versions` on a sample prefix.
   - Add a lifecycle rule that deletes noncurrent versions after 30-60 days and keeps the last N versions.
   - Before you delete anything, confirm the retention you need for restores or compliance. Do a test restore from a current backup, so you know the data you're keeping is usable.
   - Nearline has a 30-day minimum storage duration and charges for retrieval. If objects get deleted or rewritten before 30 days, you pay early-deletion fees. Don't move a bucket with frequent rewrites to a colder class. Coldline or Archive is only worth it for backups you almost never read.
   - Realistic saving: $80-140 a month, depending on how much is old versions. If versions are 60% of the data, that's the top of the range.

2. **Compute Engine, three e2-standard-8 at about 8% CPU ($300).** These are heavily oversized.
   - Check memory use before you shrink them, because CPU alone doesn't tell you the whole story. Look at the Ops Agent metrics or the Recommender's right-sizing suggestions.
   - If memory is low too, move to e2-standard-2 or e2-standard-4, or to custom machine types. Do one instance at a time, in a quiet window.
   - If they are stateless workers, consider fewer instances. If they run dev, staging or batch jobs, add a schedule to stop them nights and weekends.
   - Once the size is stable, a 1-year committed use discount takes roughly 25-37% off the rest. Right-size first and commit after, or you lock in the waste.
   - Realistic saving: $150-220 a month. Dropping to e2-standard-4 halves the cost, and going to e2-standard-2 gets you about 75%.

3. **BigQuery analysis ($380).** I need more detail before I give a number.
   - Find out whether it is on-demand pricing (billed per TB scanned) and which queries and users drive it. Query `INFORMATION_SCHEMA.JOBS` grouped by user and query hash, and sort by bytes billed.
   - The usual fixes are partitioning and clustering the big tables, selecting only the columns you need instead of `SELECT *`, and avoiding scheduled queries that rescan full tables. Set a per-user or per-project maximum bytes billed, so one bad query can't cost $100.
   - At your level, on-demand with cost controls is almost always cheaper than slot reservations. Don't buy capacity.
   - Realistic saving: $50-150 a month. It's more if one dashboard or scheduled job is doing most of the scanning.

4. **Logging ($140).** This is a quick win. Look at which logs are ingested, using the Logs Explorer or the logs-based usage metrics.
   - Usually a few noisy sources account for most of it, such as load balancer request logs, debug-level app logs, or VPC flow logs.
   - Add exclusion filters on the `_Default` sink and lower the log level in the app. Keep error and audit logs. Cut the retention on the default bucket if you don't need 30 days.
   - Realistic saving: $50-90 a month.

**Why the range is wide.** I'm working from four line items, not the actual data. The big uncertainties are how much of the bucket is old versions and whether memory forces a bigger VM than 8% CPU suggests. I would put the floor at about $300 and the ceiling at about $550. Anyone promising 50% off is guessing.

**Do this before you change anything**
- Set a billing budget with alerts at 80% and 100%. Also turn on anomaly alerts, so you hear about the next jump within days instead of at month end.
- Add labels to resources (team, environment, service), so the CSV tells you who owns each cost next time.
- Export billing to BigQuery if you haven't. The CSV is fine for a first pass, but SKU-level queries will show you exactly what rose from $700 to $1.2k.
- Don't delete anything or resize anything in production on the first day. Do the lifecycle rule in a dry-run form first (list what it would match), and resize one VM before the other two.

**Sequencing.** Logging exclusions and the budget alert take about an hour. The storage lifecycle rule and the VM right-sizing take a day or two each, including checking. BigQuery takes a few days, because you have to find the offending queries first. After a month, review the bill and decide on the committed use discount.

If you can share the SKU-level lines for storage (the Standard vs Nearline vs operations breakdown) and the top ten BigQuery jobs by bytes billed, I can narrow the estimate.
