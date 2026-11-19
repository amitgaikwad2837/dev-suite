---
name: security-review
description: Reviews code for security weaknesses before shipping. Use for a security audit, a vulnerability check, or before we ship. Traces untrusted input to risky sinks, checks authorization and secrets, and reports each finding with location, exploit and fix. Defensive only. Skip general code review, which belongs to change-review.
---

# Security Review

0. Write a short model of the application: what it does, who the actors are, where the sensitive data lives and where the trust boundaries are. Review against that model, not against a generic checklist.
1. Map entry points (routes, CLI args, queues, uploads, webhooks) and trust boundaries.
2. Trace untrusted data to sinks: SQL, shell, file paths, templates, deserialization (`yaml.load`, pickle), outbound requests (SSRF), redirects, logs, HTML.
3. Check authn/authz on every route (ownership checks, client-controlled roles or cookies), secrets, crypto, session/CSRF/CORS, races, dependencies, defaults, permissions.
4. Report one entry per finding: `file:line` (or route/function if only snippets exist), severity, exploit in a sentence or two, concrete fix. Mark anything you couldn't trace as **suspected** and list what you couldn't check. Quote the line behind each finding. Before reporting, try to refute it (is the input really reachable, is there validation upstream, does the framework already prevent it?) and drop or downgrade what you refute. End with an explicit coverage statement: what you examined (files, routes, components) and what you did not, so silence is never read as safe.
5. Fix at the root (parameterized queries, central authz, allowlists), not per call site.
6. Stay defensive: demonstrate against the user's own code or tests, never build weaponized exploits or hit third-party systems.

## Classes worth checking

- **Access control:** every object lookup checks ownership (not only that the user is logged in); roles and flags come from the server, not the client; mass assignment cannot set fields like `is_admin`.
- **Authentication:** token validation (algorithm, expiry, audience), session fixation, password-reset and invite tokens (single use, short life, not guessable), rate limits on login and reset.
- **Injection:** SQL, shell, template, path traversal, header and log injection, unsafe deserialization and XML entities.
- **Files and requests:** upload type, size and storage location; server-side requests built from user input (SSRF); open redirects.
- **Browser:** XSS output encoding, CSRF protection, a strict CORS policy, cookie flags.
- **Secrets and data:** keys in code, config or logs; sensitive fields in error messages; data returned that the caller should not see.

## Severity

- **Critical:** exploitable without logging in, or gives full data access or code execution.
- **High:** a logged-in user can reach another user's data or actions.
- **Medium:** needs unusual conditions or limited impact. **Low:** hardening gaps.

## Related skills

- `security-hardening`: configuration, accounts, pipelines and deployed systems
- `security-prompter`: security requirements before something is built
- `dependency-audit`: vulnerable or risky packages
- `privacy-compliance`: personal data and the rules around it
