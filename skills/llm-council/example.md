# Worked example: login rate limiter

A real run of this council, condensed. The question was whether to build a Redis login limiter keyed on the first `X-Forwarded-For` value, counting every attempt, five per minute per IP, failing open on any Redis error. Context: three app instances behind nginx, 2,000 logins an hour, and one customer with 300 staff behind a single office IP.

## What the five advisors did

- **Solver** (never saw the proposal) designed a limiter keyed on the account, with progressive delay, a trusted-device cookie and a log-only rollout.
- **Red team** and **Prover** ran small simulations: a forged header gives a new counter every request, 275 of 300 office logins were blocked in five minutes, and a crash between `INCR` and `EXPIRE` left a key with no expiry for good.
- **Requirements auditor** traced each must-have: must-have 2 (no lockouts) was unmet.
- **Operator** added rollout, alerting and reversibility.

Stage 2 pooled eleven findings with the authors removed. The reviewers added missed ones: Redis keys built from raw header strings (unbounded growth), password reset and MFA endpoints left unlimited, and counting before the password check.

## What the verdict added beyond a single review

One strong reviewer, run alone, found all six planted flaws too. The council added:

- A flaw that only appeared when ideas were combined: the Solver's "server-side wait up to 15 minutes" would hold web workers and let a few attackers starve all three instances. The chairman caught it and chose a 429 with `Retry-After` instead.
- Nine acceptance tests, one per blocker and major finding, as the definition of done.
- Tripwires for reopening the decision, a log-only rollout and first steps, and a list of three checks nobody could run without the real stack.
- Findings marked ran, read or reasoned, and the remaining dissent named.

## Verdict (abridged)

1. Go with changes. Do not build the proposal as written; ship in log-only mode and enforce only after the open checks pass.
2. Take the client IP from the nginx-set value, never the first `X-Forwarded-For`. Count failures only. Key on (username, IP) plus a per-account failure counter that delays and steps up but never hard-locks, and a high per-IP ceiling. One Lua script sets the expiry atomically. Check the limit before hashing the password. Fall back to a per-instance limiter on a Redis error, and alert.
3. Acceptance tests include: a forged header does not change the key; 300 distinct users from one IP in five minutes get zero 429s; a killed client leaves every key with an expiry; 200 throttled requests leave worker occupancy unchanged.
4. Open checks: what nginx really does with the header, the office's real 09:00 login burst, and whether the Redis-down fallback holds.
5. Confidence: medium. The simulations are not the real stack, and the thresholds are estimates.
