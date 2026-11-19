---
name: git-hygiene
description: Keeps git history clean and recovers from git mistakes without losing work. Use for squashing or rewriting commits, rebase versus merge, undoing a commit or push, lost changes, a pushed secret or large file, force pushes and branching rules. Skip for deploy pipelines (release-engineering) and reviewing a change (change-review).
---

# Git Hygiene

History is shared state. Most git trouble comes from rewriting it without checking who else has it, and most lost work is recoverable if you stop and look first.

## 1. Look before you touch

Run read-only commands first and say what you see: `git status`, `git branch -vv`, `git log --oneline --graph -n 20`, `git stash list`, `git remote -v`. Find out:
- Which branch, and whether it is shared (pushed, has a PR, others build on it) or only local.
- What is uncommitted, and what is unpushed.
- Whether the work you're about to change exists anywhere else.

Before any command that rewrites or discards (rebase, reset, amend, filter-repo, clean, checkout of files), make a safety copy: `git branch backup/<name>` or a tag. It costs nothing, and `git reflog` is the second net. Don't run `git clean`, `reset --hard` or `checkout .` on uncommitted work without showing what would be lost (`git clean -n`, `git diff`) and getting a yes.

## 2. Pick the least destructive tool

| Situation | Use | Not |
|---|---|---|
| Undo a commit already pushed or shared | `git revert` | reset and force-push |
| Undo a local, unpushed commit | `git reset --soft HEAD~1` (keeps changes) | `--hard` |
| Fix the last unpushed commit message or content | `git commit --amend` | a new "fix typo" commit pile |
| Tidy several unpushed commits | `git rebase -i` on your own branch | rebasing a shared branch |
| Take one commit from another branch | `git cherry-pick` | copying files |
| Find which commit broke something | `git bisect` with a test command | reading the log by eye |
| Park work for later | `git stash -u` with a message, or a WIP branch | leaving it in the working tree |
| Lost a commit or branch | `git reflog`, then a branch at the sha | assuming it's gone |

Force-push only your own branch, only with `--force-with-lease`, and only after saying which branch and what will be replaced. Never force-push `main` or any branch others use unless the user names it and agrees.

## 3. A secret was committed

This is a rotation problem first, a history problem second.
1. **Revoke or rotate the secret now.** Treat it as public the moment it was pushed, even if the repo is private, since clones, forks and CI logs keep copies. Check provider logs for use.
2. Remove it from the tip in a normal commit, and move it to config or a secret manager. Add the file to `.gitignore`.
3. Only then, if the user wants it gone from history, use `git filter-repo` (not `filter-branch`) on a fresh clone with a backup, list every branch and tag affected, and warn that all collaborators must re-clone and open PRs will break. Get a yes on the exact force-push.
4. Add a pre-commit or CI secret scanner (`gitleaks`, `trufflehog`) so it doesn't recur. The same steps apply to a large file committed by mistake, minus the rotation.

## 4. Keep history useful

- **Commits:** one logical change each, that builds and passes tests. Subject in the imperative, about 50 characters, then a blank line and a body saying why, not what. Reference the issue. Don't mix a refactor with a behaviour change or reformatting.
- **Branches:** short-lived, named for the work (`fix/login-timeout`), based on an up-to-date main. Pick the team's existing flow (trunk-based, or a release branch model) and follow it; don't invent a new one.
- **Merge, squash or rebase:** match the repo's current practice. Squash-merge for noisy branches, merge commits to keep a feature's story, rebase to keep it linear. Rebase only what is yours and unpushed.
- **Pull requests:** small, one purpose, with a description of what, why, how it was tested and what to look at first (`plain-writing`). Keep generated files and drive-by edits out.
- **Repo health:** a `.gitignore` for build output and local files, no large binaries (use LFS or storage), protected `main` with required checks, signed or verified commits if the team requires it.

## 5. Report

Say what state you found, the backup made, each command run and why, what changed, and anything the team now needs to do (re-clone, rotate, close PRs). If you stopped before a destructive step, say what is waiting on a yes.

## Related skills

- `release-engineering`: tags, versions and deploys
- `change-review`: reviewing what a change contains
