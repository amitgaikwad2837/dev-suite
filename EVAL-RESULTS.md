# Second eval case results

Each of the 43 second cases not run earlier was answered once with the skill and once without (sonnet subagents that could not run commands). A separate grader agent then marked the five checks for two unlabelled replies (A and B, order randomised), so it did not know which used the skill. The checks were written by the author with the cases, so some follow the skill's own method and a gap overstates the real difference. Single runs.

| # | Skill | Case | With | Without | Notes |
|---|---|---|---|---|---|
| 01 | accessibility-review | checkout-modal-keyboard-blocker | 4/5 | 3/5 | check 2 failed in both |
| 02 | api-design | orders-endpoint-before-partners | 3/5 | 5/5 | check 3 failed only with the skill; check 5 failed only with the skill |
| 03 | app-replica | competitor-lookalike-by-copying | 5/5 | 4/5 |  |
| 04 | browser-verify | blank-page-in-production-build | 5/5 | 2/5 |  |
| 05 | bug-investigation | one-in-two-hundred-500s-after-cache | 5/5 | 2/5 |  |
| 06 | cloud-cost | startup-bill-from-csv | 5/5 | 5/5 |  |
| 07 | codebase-onboarding | monorepo-two-days | 5/5 | 3/5 |  |
| 08 | coding-discipline | noticed-extra-problems | 5/5 | 4/5 |  |
| 09 | data-engineering | late-arriving-mobile-events | 4/5 | 4/5 | check 5 failed only with the skill |
| 10 | data-ml-work | ab-test-trending-win | 5/5 | 5/5 |  |
| 11 | dependency-audit | add-obscure-package | 5/5 | 3/5 |  |
| 12 | design-decision | build-or-buy-auth | 5/5 | 1/5 |  |
| 13 | design-reference | screenshot-not-attached-copy-all | 5/5 | 2/5 |  |
| 14 | dev-lifecycle | inherited-club-website | 4/5 | 2/5 | check 5 failed in both |
| 15 | devex-review | public-rest-api-plan | 5/5 | 4/5 |  |
| 16 | documentation | adrs-and-runbook-for-payments | 5/5 | 3/5 |  |
| 17 | estimation | multi-currency-unknowns | 5/5 | 3/5 |  |
| 18 | frontend-design | dense-ops-dashboard | 4/5 | 2/5 | check 4 failed in both |
| 19 | git-hygiene | rebase-gone-wrong | 4/5 | 5/5 | check 4 failed only with the skill |
| 20 | incident-response | payments-degraded-vendor-status | 5/5 | 4/5 |  |
| 21 | infrastructure-as-code | adopt-handmade-aws-into-terraform | 4/5 | 3/5 | check 3 failed only with the skill |
| 22 | launch-gate | first-pilot-customer | 3/5 | 2/5 | check 1 failed only with the skill; check 4 failed in both |
| 23 | library-cli-work | cli-breaking-changes-in-minor | 5/5 | 5/5 |  |
| 24 | llm-app-work | rag-invents-parameters | 5/5 | 4/5 |  |
| 25 | mobile-app-work | offline-sync-and-push | 3/5 | 2/5 | check 2 failed in both; check 5 failed in both |
| 26 | mobile-ci | expo-builds-flaky-and-costly | 4/5 | 3/5 | check 4 failed only with the skill |
| 27 | observability | alert-fatigue | 5/5 | 5/5 |  |
| 28 | payments-integration | refunds-and-chargebacks | 5/5 | 4/5 |  |
| 29 | performance-work | n-plus-one-reports | 5/5 | 5/5 |  |
| 30 | plain-writing | release-note-keep-numbers | 5/5 | 3/5 |  |
| 31 | plan-challenge | rewrite-in-rust | 5/5 | 2/5 |  |
| 32 | playwright-ui-tests | flaky-in-ci-retries-and-timeouts | 5/5 | 3/5 |  |
| 33 | privacy-compliance | gdpr-erasure-request-today | 4/5 | 3/5 | check 4 failed in both |
| 34 | retro | quiet-week-from-given-numbers | 5/5 | 3/5 |  |
| 35 | risky-shortcuts | kill-the-postgres-process | 5/5 | 2/5 |  |
| 36 | schema-changes | rename-column-live | 5/5 | 3/5 |  |
| 37 | security-hardening | kubernetes-defaults-before-pentest | 5/5 | 4/5 |  |
| 38 | security-prompter | csv-import-and-webhook | 5/5 | 3/5 |  |
| 39 | security-review | jwt-role-and-file-upload | 5/5 | 3/5 |  |
| 40 | session-handoff | restore-after-repo-moved | 5/5 | 5/5 |  |
| 41 | ui-polish | invoice-table-states | 5/5 | 1/5 |  |
| 42 | ux-research | churn-interviews-not-survey | 5/5 | 4/5 |  |
| 43 | web-quality | lighthouse-94-but-slow-in-the-field | 5/5 | 5/5 |  |

**Total: 201/215 with the skill, 143/215 without.**
