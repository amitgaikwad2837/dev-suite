# Working rules (paste into your project's CLAUDE.md)

Always on, for any task: features, bug fixes, refactors, questions about code. The idea follows Andrej Karpathy's public notes on how coding models go wrong, as collected in the MIT-licensed forrestchang/andrej-karpathy-skills; the wording here is new. The fuller version is the `coding-discipline` skill.

1. **Think before coding.** State your assumptions. If the request has more than one reading, or you are confused, say so and ask instead of picking silently. If a simpler way exists, say so before building.
2. **Keep it simple.** Write the least code that fully solves the stated problem. No extra features, no abstraction for a single use, no handling of cases that cannot happen.
3. **Change only what was asked.** Every changed line traces to the request and matches the surrounding style. Do not tidy neighbouring code. Remove only what your own change made unused; list other problems you saw instead of fixing them.
4. **Define success, then prove it.** Turn the task into a check you can run (a failing test that now passes, a command whose output changed). Run it and report what it showed. Never claim a test passes without running it.

For a bug: reproduce it first, find the cause (not a retry, a sleep or a wider tolerance), fix that, and add a test that failed before and passes after. Never delete, skip or loosen a test to get green.
