I'd push back on this plan as stated. Nothing in it is ruled out, but the reasons given don't match the problem you described.

**Mismatch between the reason and the pain**

- "Faster": p95 is 300ms and customers are happy. Nobody is complaining about speed, so a rewrite buys little you need. If a few endpoints are slow, profile them. The cost is usually the database, I/O, or a handful of hot paths, not the Python interpreter. A Rust rewrite rarely moves those numbers much.
- "Safer": this is vague. Safer against what? Memory-safety bugs are rare in Python. If you mean type and correctness errors, typing, tests and static analysis in Python get you a good share of that.
- The actual pain is "deploys are scary." A rewrite doesn't directly fix that. A new Rust system will have scary deploys too unless you also fix tests, release process, observability and rollback. Those are the real levers, and they're far cheaper than 9 months of rewriting.

**Why the plan itself is risky**

- 9 months with 4 developers for an 8-year-old monolith is very optimistic. Eight years of behavior includes undocumented edge cases, quirks that customers depend on, and integrations. Rewrites like this commonly run 2 to 3 times over.
- The old system doesn't freeze. Either features stop for 9 months or you maintain two codebases, and both are costly.
- Your team has to learn Rust while delivering. The learning curve and hiring pool are real costs.
- A big-bang cutover is the scariest deploy of all. You'd be replacing a system customers are happy with.
- The downside is lopsided. The best case is the same product that is a bit faster. The worst case is a missed deadline, regressions, and unhappy customers.

**What I'd ask before going further**

1. What exactly makes deploys scary? Missing tests, no staging parity, no quick rollback, large batch releases, coupling across the monolith? Name the last two or three incidents.
2. Who is pushing for Rust, and what do they expect to gain? Is "faster and safer" the real motivation or a proxy for something else, such as hiring, morale or tech debt?
3. What would you accept as proof the rewrite worked? Define numbers: deploy frequency, change failure rate, latency, cost.
4. What happens to roadmap and customer commitments during the 9 months?
5. Does anyone on the team already ship Rust in production?

**Cheaper alternatives, in order**

1. Fix deploy fear first (weeks): characterization tests around critical paths, CI, feature flags, canary or blue-green deploys, one-command rollback, smaller and more frequent releases, better monitoring. Measure again after that.
2. Profile and fix any real hot spots in Python, with caching, query fixes or async where it pays.
3. If you still want Rust, do it incrementally with the strangler pattern. Carve out one bounded, performance- or safety-critical component behind a stable interface, ship it, and measure the gain. Python extensions via PyO3 work well for this. Each step is reversible, and you get evidence before committing more.
4. Only consider a full rewrite if the incremental approach shows a clear payoff and the monolith truly can't be evolved. Even then, run old and new in parallel and compare outputs before cutting over.

**Suggested next step**

Spend about two weeks on a small spike. Write down the deploy failure causes, profile the p95 path, and pick the one change with the best ratio of risk reduced to effort. Then decide. My recommendation is not to approve the 9-month rewrite as proposed. Fix the deploy process first, and treat Rust as an incremental experiment.

If you share the incident history and a rough architecture overview, I can help build the deploy-hardening checklist or sketch the first Rust candidate component.
