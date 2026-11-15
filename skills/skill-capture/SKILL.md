---
name: skill-capture
description: Spots repeated work and turns it into a reusable skill. Use when the user does the same thing again and again, asks to make this a skill, automate a workflow, save this for next time or teach Claude how we do X, or when the same procedure or correction comes up a second time. Propose it and ask before creating anything. Skip one-off tasks and anything an existing skill covers.
---

# Skill Capture

A skill is worth writing when a procedure repeats and the cost of re-explaining it each time is higher than the cost of writing it down once. This skill finds those moments, proposes the skill, and builds it with the user's approval.

## 1. Notice repetition

Look for any of these signals, in the current conversation or in what the user describes:
- the same sequence of steps done twice or more (release checklist, report build, environment setup, triage routine)
- the user giving the same correction or preference again ("always use X", "never do Y here")
- you writing the same helper script or command pipeline a second time
- a long prompt the user pastes repeatedly
- domain knowledge Claude keeps needing explained (internal tools, naming rules, conventions, file layouts)

One occurrence is an anecdote; two is a pattern. If it happened once but the user says it will recur, that counts too. Don't propose a skill for a one-off, for something an installed skill already covers (check first), or for a rule that is really a single line in CLAUDE.md.

## 2. Propose it, briefly, and ask

Say what you noticed, what the skill would do, and when it would trigger, in two or three sentences, then ask whether to create it and where it should live:
- this project (`.claude/skills/<name>/`), committed so the team shares it
- personal (`~/.claude/skills/<name>/`), for all your projects
- a shared repo or plugin, if the team publishes skills there

Don't create files until the user says yes. If they say no, drop it and don't raise it again for the same pattern.

## 3. Capture it properly

1. Collect the real procedure from the conversation or by asking: inputs, steps in order, decisions and their criteria, outputs, what "done" looks like, common mistakes. Prefer what actually worked over what sounds ideal.
2. Name it in lowercase letters, digits and hyphens, the same as its folder (`weekly-report`, not `Weekly Report Skill`).
3. Write the description first. It is the only part always loaded, and it decides whether the skill triggers. State what it does and list the phrases and situations that should trigger it, including ones where the user won't name it; add what to skip. Keep it under 1,000 characters.
4. Write the body as short imperative steps with the reason behind each. Put the decision rules and output format in; leave general knowledge Claude already has out. Stay well under 500 lines; move long reference material into a `references/` file and say when to read it.
5. Bundle repeated code as scripts in `scripts/` instead of rewriting it each time, and say how to run it.
6. Keep secrets and personal data out. No tokens, passwords, customer data, private URLs or personal details in a skill, especially one that may be shared or published. Point to where credentials live instead.

## 4. Test before you call it done

Write two or three realistic prompts a user would actually type, including one that doesn't use the skill's name. Run them (with the skill, and for a new skill also without) and compare. Check that the skill triggers, that the steps are followed, and that the output matches the format. Fix the wording that caused any miss and rerun. For a systematic evaluation or description tuning, Anthropic's `skill-creator` skill automates the loop.

## 5. Hand over

Tell the user where the files are, the trigger phrases, and how to use or edit it (`/<name>` or just describe the task). Offer to commit it if it is in a repo. If it is a plugin or shared repo, remind them it will be public or shared.

Keep skills small and single-purpose. Two focused skills trigger more reliably than one sprawling one.
