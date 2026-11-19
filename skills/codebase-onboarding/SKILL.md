---
name: codebase-onboarding
description: Learns an unfamiliar codebase quickly and writes a short verified CLAUDE.md. Use when the user just joined or inherited a repo, asks how a codebase works, where to start, how to run it, or to write a CLAUDE.md. Skip for changing a known codebase (coding-discipline) and designing something new (new-app-build).
---

# Codebase Onboarding

A README is often out of date, and a long tour nobody can check is worse than none. The goal is a short map that is true: commands that were run, a layout that was traced, and a list of what is still unknown. Read little, verify what you claim, and write it where the next person (or session) will find it.

## 1. Read the cheap, trusted things first

In this order, stopping when you can answer the questions below:

1. The README and any docs index, for intent only. Treat every command in it as a claim to check.
2. CI config and the build files (Makefile, package scripts, pyproject, Dockerfile). CI is the best evidence of how the project really builds and tests, because it fails when wrong.
3. Dependency manifests, config examples (`.env.example`) and the folder tree two levels deep.
4. Recent history: `git log --stat -30` and the most-changed files. They show where the work happens and who knows what.

Questions to answer: What is it for, and for whom? How do I run it, test it and lint it? Where does a request or job enter, and where does the data live? What breaks easily?

## 2. Check the commands before writing them

Run the install-free, safe ones: list tests, run lint, run the test suite, start the app if it needs nothing external. Record each as worked, failed (with the error), or not run (why). Ask before anything that writes outside the repo, installs system packages, touches a real database, calls paid services or needs secrets. When the README and CI disagree, trust CI and say which one was stale.

## 3. Trace one real journey

Pick the most important path (a signup, an order, a nightly job) and follow it from entry point to storage and back, naming the files. One traced path teaches more than a summary of every module. Note where state lives, the external services it calls and what runs in the background.

## 4. Find the conventions and the danger zones

Only record a convention you saw in several places, not one you guess (how money is stored, how errors are raised, where migrations go, how tests are named). Mark danger zones: generated files, "do not edit" comments, migrations, anything that touches payments, auth or deletes data, and files that change in nearly every commit. Never copy secrets, tokens or real customer data into the notes.

## 5. Write the CLAUDE.md

Keep it under about 60 lines and in this order: what the project is in two lines; commands (each marked verified or unverified); layout with one line per important folder; the traced journey; conventions; danger zones; open questions. Write facts, not advice that every project has ("write clean code"). If a CLAUDE.md already exists, do not overwrite it: propose a diff and keep the user's text. Keep notes about this machine (missing tools, your OS) out of the file and put them in your reply.

## 6. Hand over

Say what you verified and what you could not, the questions someone on the team has to answer (things the code cannot tell you), and two or three small, safe first tasks with the file to start in. Offer to keep the file current when the commands or layout change.
