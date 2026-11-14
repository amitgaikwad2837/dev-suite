---
name: design-decision
description: Chooses between designs that are hard to reverse, such as API shape, data model, auth approach, framework or migration strategy. Use when the user asks which approach to take or wants options compared. Sets criteria and must-haves, sketches three different options, stress-tests them, and records the decision. Skip easy-to-reverse choices.
---

# Design Decision

Some choices are expensive to undo once users, data or other teams depend on them: an API shape, a data model, an auth approach, a framework, a migration strategy. For these, one idea written quickly tends to win by default. Slow down in proportion to the cost of being wrong.
1. **Classify the decision.** If it is cheap to reverse (a refactor behind an interface, an internal helper), choose quickly and move on. Only continue below for decisions that are hard to reverse.
2. **Set the bar before looking at options.** List 3 to 5 criteria, mark any as must-haves that eliminate an option outright (for example "must not lose events", "must run on our current hosting"), and note which criteria matter most.
3. **Sketch three genuinely different options**, each in about ten lines: the idea, what it makes easy, what it makes hard. Make them differ in principle (for example centralized vs local state, build vs buy, synchronous vs queued), not in minor details. Use subagents for independent sketches if available.
4. **Stress each option with the same scenarios**: a failure in the middle of an operation, ten times the load, and one realistic change request next quarter. Where possible run something real (a spike, a query plan, a prototype of the risky part) instead of arguing from memory.
5. **Decide and record it.** Eliminate options that fail a must-have, pick the best of the rest, and borrow a specific safeguard or idea from a rejected option when it fits. Write a short decision record: what was chosen, why, what was rejected and why, and the evidence that would make you revisit it.
