---
tags: [llm-council]
max_turns: 40
timeout_seconds: 1800
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, Agent]
---

use a council of advisors to validate this design before we build it, and tell me what to do.

# Brief: brute-force protection for the login endpoint

Decision: validate this design before we implement it. Say whether to build it as is, change it, or drop it.

## Context
- Flask app, 3 instances behind an nginx load balancer, one Redis instance.
- About 2,000 logins an hour. One enterprise customer has 300 staff who all reach us from a single office IP (NAT).
- Must-haves: (1) stop online password guessing against our accounts; (2) legitimate users must not be locked out; (3) must keep working through ordinary failures.

## Proposed design
- Client identity = the client IP, taken from the first value of the `X-Forwarded-For` header.
- On every login attempt (successful or not) run `INCR login:<ip>`. If the returned value is 1, run `EXPIRE login:<ip> 60`.
- If the count is above 5, return HTTP 429.
- If Redis errors or times out, allow the request, so an outage never blocks users.
- No other limits. The limit is 5 attempts per minute per IP.

## Claims and assumptions the proposal rests on
1. INCR followed by EXPIRE is a safe way to build a one-minute counter.
2. The X-Forwarded-For header identifies the client.
3. Failing open on a Redis error is acceptable.
4. 5 attempts a minute per IP is a sensible limit for all our users.
5. Limiting by IP alone is enough to stop password guessing.

(No source code exists yet; judge the design as described.)
