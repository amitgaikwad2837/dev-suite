---
name: new-app-build
description: Builds a new application or large feature from scratch in gated phases. Use for build me an app, start a new project, or greenfield work. Interview, short spec, plan, walking skeleton with CI, tested vertical slices, then hardening. Skip small additions to an existing app.
---

# New App Build

Most failed builds fail at the start: unclear requirements, or a big-bang implementation nobody can verify. Go in gated phases and show each result before the next:
1. Interview before code (the `requirements-interview` skill does this in depth). Ask only the questions that change the design (users and key flows, scale, data sensitivity, hosting, must-use stack, deadline, what "done" means). Where the user has no preference, pick a boring default and state it.
2. Spec. One page: goals, non-goals, main user flows, data model, external integrations, acceptance criteria. Get a yes on this.
3. Plan. Stack and architecture with the reason for each choice, plus the riskiest unknowns. Spike or prototype those first rather than last.
4. Walking skeleton. The thinnest end-to-end path (UI/API to storage and back) with build, lint, tests and a CI workflow that runs them on every push. *Done when* CI is green on the skeleton, before any feature slice starts; list this in the plan as its own step, not as part of hardening.
5. Vertical slices. Build one user-visible feature at a time, each with tests written alongside (test first for logic-heavy code), each ending in a working, demoable state. Commit per slice.
6. Harden. Auth and authorization, input validation, secrets out of code, error handling, logging, a README with run/test/deploy steps, then `security-review` on the finished app.
Use `design-decision` for choices that are expensive to reverse (data model, auth approach, framework).

Bring in the other skills at the right moments:
- Before the spec on a risky or large build: `plan-challenge`. Before building anything that holds personal data, logins or payments: `security-prompter`, and `privacy-compliance` or `payments-integration` where they apply. For a high-stakes choice, `llm-council`.
- While building: `coding-discipline` and `test-strategy`; `frontend-design` for a UI; `llm-app-work` for an AI feature; `data-engineering` for pipelines.
- Hardening and release: `observability`, `documentation`, then `launch-gate` before the first public release and `release-engineering` to ship.
- Keep a short progress note so a stopped build can resume (`session-handoff`).

Finish with a report: what exists, what runs, what is tested, what is left, and what the user must decide.
