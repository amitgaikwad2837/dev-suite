---
name: llm-council
description: Validates a design, plan or solution with five advisors and a chairman, then checks the build against their findings. Use when the user asks for a council, advisors or several opinions, or to stress-test an approach that is costly to undo. Skip for small or reversible tasks (one agent is cheaper) and for running a whole build as a team (dev-orchestrator).
---

# LLM Council

One reviewer has blind spots and anchors on the first idea. A council does better only if it adds independence and evidence, not just more voices. So this council works from a **findings ledger**: every claim says how it was established (ran, read or reasoned), disagreements become checks that are run instead of debated, and the chairman's verdict turns into acceptance tests the build must pass. It costs roughly ten times one review, so use it where a wrong decision is expensive to undo.

You are the **orchestrator**. Run it from the main session, because subagents cannot start other subagents. The advisors are `council-advisor` agents, the chairman is `council-chairman`, and only you talk to the user.

## 1. Decide whether to convene

Convene for hard-to-reverse designs, migrations, security-sensitive or money-handling changes, and plans the user wants stress-tested. For small, clear or easily reversed work, say so and answer directly.

Be honest about the price. In a test with six planted flaws, one strong reviewer found all six, while the council cost about eleven agent runs. It earned its cost elsewhere: it caught a problem that only appeared when ideas were combined, produced acceptance tests and settled disagreements. When the user only wants to know whether a design is sound, offer one strong reviewer first, and convene the council when the choice is contested, expensive to undo, or the single review leaves open questions.

## 2. Frame it and list the claims

Write `.dev-suite/council/<topic>/00-brief.md` in under 25 lines: the decision, the proposed solution (or "propose one"), three to five criteria and the must-haves, constraints, the paths that matter, and a numbered list of the **claims and assumptions** the proposal rests on ("handles 50 jobs a minute", "needs no migration"). Ask the user only for must-haves nobody else can supply, in one message. Pass paths, not content.

## 3. Stage 1: five advisors work blind

Spawn all five in one step, in parallel, each writing `10-<seat>.md`. They may not read each other's files.

The seats are the **solver** (designs its own solution before seeing the proposal, so there is a real alternative), the **red team** (assumes it fails and shows how), the **requirements auditor** (traces every must-have), the **operator** (runs, monitors, scales and rolls it back; swap in a domain specialist such as security, data, UX or money when the risk sits there) and the **prover** (turns the riskiest claims into tests and drafts the acceptance tests). Each seat's full job is in `council-advisor`.

Findings are written as `F<n> | severity | claim | evidence | fix`, with evidence marked ran, read or reasoned. Use different models for different seats where you can, so their mistakes differ. If all five agree at once, that is a warning: check the framing and ask the red team to try again against the strongest point.

## 4. Stage 2: anonymised dispute

Pool every finding into `20-pool.md`, remove authors, merge duplicates and label them P1, P2 and so on in shuffled order. Spawn the advisors again. Each marks every finding agree, dispute or unsure with evidence, names what everyone missed, and flags the **cruxes**: disagreements a check could settle. Anonymity stops advisors deferring to a confident voice or defending their own work. Each advisor must dispute or downgrade at least one finding, or say why every one stands. Do not accept a pass where all five simply agree.

## 5. Stage 3: settle cruxes with experiments

For each crux that would change the decision (three at most), run the named check yourself or give it to the Prover, and write the result in `25-cruxes.md`. A fact beats another round of debate. A crux that cannot be tested goes to the chairman as an open risk.

## 6. Chairman verdict

Spawn `council-chairman` on the strongest model you have, pointing at the brief, `10-*`, the stage-2 files and `25-cruxes.md`. It writes `30-verdict.md`: the verdict, the approach (including the best of the Solver's alternative), the ranked findings, the settled and unsettled disagreements, the dissent, **acceptance tests**, first steps and tripwires. Read it: it must pick the smallest design that meets the must-haves, split launch work from later work, and give every blocker a test. Before reporting, run any check it relied on that nobody ran.

## 7. Report, then build and re-check

Report in under 200 words: the verdict, the changes required, how each finding was established, the dissent, the acceptance tests and the first steps. For a hard-to-reverse choice, get the user's yes before building, and offer `dev-orchestrator` or `new-app-build` with the acceptance tests as the definition of done.

After the build, run a **sign-off pass**: the Red team and the Prover check each blocker and major finding against the build and report closed, open or untested, and the chairman signs off or reopens. Never ship on a blocker that is not closed by a passing test.

## Rules

See `example.md` for a finished brief and verdict.

- Independence in stage 1: no shared files and no talking. If a model from another vendor is available (for example through its command-line tool), give it one advisor seat: errors that differ from yours are the most valuable ones.
- Cap the work: one blind round, one dispute pass, at most three experiments, then decide or ask the user.
- Do not rank answers by polish: the most concrete plan is not always the deepest analysis.
- Stay proportionate: if the council costs more than a mistake would, answer directly.

## Related skills

- `plan-challenge`: a single-reviewer plan critique
