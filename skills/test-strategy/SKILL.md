---
name: test-strategy
description: Decides what to test and writes tests that catch real bugs. Use for what should I test, write tests for this, flaky or slow tests, coverage, is this test any good, setting up testing, or code about to change with weak tests. Chooses tests by risk and checks a test would fail when the code is wrong. Skip when the only task is fixing one failing test (honest-fixes).
---

# Test Strategy

A test earns its place only if it would fail for a realistic bug and pass for correct code. The method below picks what to test, writes it at the cheapest level that still catches the bug, and verifies the test itself.

## 1. Decide what deserves a test

List the behaviors of the code or feature as plain sentences ("rejects a discount over 100%", "retries a failed upload twice, then reports it"). Rank them by risk: money, data integrity, security, public contract, complex branching, past bugs, then everything else. Spend effort in that order; do not chase a coverage number. Coverage shows what was never run, not that the code is correct.

## 2. Pick the cheapest level that catches it

| Level | Use it for | Avoid it for |
|---|---|---|
| **Unit** | Logic, calculations, parsing, state transitions, edge cases | Wiring and configuration |
| **Integration** | Code against a real database, queue, file system or framework; contracts between modules | Every permutation of business rules |
| **End-to-end** | A few critical user journeys, run on a real stack | Anything a lower level can prove |

Many small fast tests and a few broad ones. If the only way to test something is end to end, that is often a design hint: look for a seam.

## 3. Write each test well

- Name the behavior, not the function (`rejects_expired_coupon`, not `test_apply_2`).
- Arrange, act, assert, with one reason to fail. Assert on observable results (return values, stored data, emitted events), not on private calls.
- Cover boundaries: zero, one, many, maximum, just inside and outside limits, empty and null, duplicates, unicode and time zones where relevant, and each error path.
- Make it deterministic: inject clocks, random seeds and IDs; no real network; no order dependence between tests; clean up what you create.
- Mock only at the edges (network, clock, payment provider). Mocking the code under test, or its internals, proves nothing and breaks on every refactor.
- Use small builders or fixtures for test data so each test shows only what matters to it.
- Keep a test readable enough that a failure message tells you what broke.

## 4. Check the test itself

Before trusting a new test, break the code on purpose (flip a condition, remove a check, change a constant) and confirm the test fails, then restore it. If nothing fails, the test is decoration. For a bug fix, write the test first and watch it fail for the right reason.

## 5. Existing code with weak tests

Before changing behavior, pin what it does now with characterization tests at the boundary you will touch: call it with realistic inputs, record the results, and assert them. Mark any surprising behavior as "pinned, not endorsed". Then change the code with that net underneath.

## 6. Flaky and slow tests

- Flaky: reproduce by looping the test or varying order and seeds; the cause is nearly always shared state, time, ordering, randomness or an unawaited async step. Fix the cause. If you must quarantine, record an owner, a ticket and a date, and keep the test visible; deleting it hides the bug.
- Slow: find the slowest tests by measurement, move logic checks down a level, share expensive setup carefully, and parallelize only when tests are isolated.

## 7. Suite hygiene

Run the suite in CI on every change; fail the build on any failure; keep it fast enough that people run it before pushing. Do not weaken, skip or delete a test to get green; fix the code, or show why the test itself is wrong. When reporting, say which tests you added and what each protects, what you did not cover, and what you ran.
