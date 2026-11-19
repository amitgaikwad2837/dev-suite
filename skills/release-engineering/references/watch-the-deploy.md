# Watch the deploy (canary)

Read this when a deploy is about to happen or has just happened and someone has to know whether it is healthy.

After a deploy, watch for a set time instead of assuming it is fine.

1. **Baseline** the key pages or endpoints before the deploy: errors, load time, status, and the main flow.
2. **Check on a schedule** (for example every minute) against that baseline. Alert on **changes, not absolutes**: a page with three known errors is fine while it still has three; one new error is the signal.
3. **Do not cry wolf:** a finding becomes an alert only when it shows on two checks in a row, so one network blip is ignored.
4. **Severity:** a page that fails to load is critical; a new error is high; load time above double the baseline is medium; a new broken link is low.
5. **On a confirmed critical or high alert,** tell the owner with the evidence and the choices: investigate, keep watching, or roll back.
6. **Report:** healthy, degraded or broken, per page, with the alerts, and offer to update the baseline only when the deploy is healthy.
