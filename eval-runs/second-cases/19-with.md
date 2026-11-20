Don't worry, a rebase that hasn't been pushed is almost always recoverable. Git keeps the original commits even while the rebase is half-finished or after it's done. The first rule is to stop changing things until we've looked and made a backup.

**Please don't run any of these yet:** `git rebase --continue`, `git reset --hard`, `git clean`, `git gc`, or a force-push.

## Step 1: Look at the state (read-only)

Please run these and paste me the output, or I'll run them myself if you want me to:

```
git status
git branch -vv
git log --oneline --graph -n 20
git stash list
git reflog -n 40
```

What I'm checking:
- Whether the rebase is still in progress (`git status` will say "rebase in progress" and show a "Next command to do" list). If it is, your "gone" commit may simply not have been replayed yet, or it may have been skipped because it ended up empty after your conflict resolution.
- Where your original, pre-rebase branch tip is. The reflog records it, as an entry like `rebase (start): checkout main` with the entry just before it being your old tip, or `ORIG_HEAD` / `refs/rebase-merge/orig-head`.
- Whether you have uncommitted work in the tree that needs protecting.

## Step 2: Make a safety copy before anything else

Once I can see the reflog, I'd find the sha of your branch as it was before the rebase started (all 15 commits) and pin it:

```
git branch backup/pre-rebase <sha-of-original-tip>
```

It costs nothing, and from then on every one of your 15 original commits is safe on a named branch, whatever happens next. If the rebase is mid-flight, I'd also snapshot the current state with `git branch backup/mid-rebase HEAD`.

## Step 3: Find what went wrong

Compare the original 15 commits with what the rebase produced:

```
git log --oneline main..backup/pre-rebase       # your 15 originals
git log --oneline main..HEAD                    # what the rebase has so far
git range-diff main backup/pre-rebase HEAD      # which commit is missing or changed
```

`range-diff` will show exactly which commit disappeared or was altered. Two common causes:
- `git add .` during a conflict staged conflict markers (`<<<<<<<`) or the wrong side of a file, so the code doesn't build. Running `git add .` on conflicts without resolving them commits the markers.
- A commit became empty after you resolved its conflict by taking main's version, so git dropped it silently.

To find which files carry leftover markers, you can run `git grep -n '^<<<<<<<\|^>>>>>>>'`.

## Step 4: Choose a path (this is your call)

**Option A, recommended: abort and redo it carefully.** If the rebase is still in progress, `git rebase --abort` puts the branch back exactly as it was before you started. Since you haven't pushed, nothing is lost. If the rebase already finished, `git reset --hard backup/pre-rebase` does the same, but only after I've shown you with `git status` and `git diff` that nothing uncommitted would be lost, and you've said yes.

Then, to avoid a 6-file conflict across 15 commits, I'd suggest either:
- squashing your branch into a few logical commits first (`git rebase -i`, on your own unpushed branch, which is fine), then rebasing those onto main, so you resolve each conflict once instead of fifteen times, or
- just merging main into your branch (`git merge main`), which gives one conflict resolution rather than 15, if the repo doesn't require linear history.

During the conflicts, resolve each file by hand, then run `git add <file>` for that file only, and build or test before each `--continue`.

**Option B: repair in place.** If most of the rebase went fine, I could cherry-pick the missing commit from `backup/pre-rebase` (`git cherry-pick <sha>`) and fix the files with conflict markers in a follow-up commit. This keeps the work done so far but leaves a messier history.

## What I need from you

1. The output of the commands in Step 1 (especially `git status` and `git reflog`).
2. Whether this repo prefers linear history or merge commits.
3. A yes before I run any step that discards or rewrites anything. Backup branches and read-only commands I'll do without asking.

Because nothing is pushed, nothing here needs a force-push, and nothing is lost as long as we don't prune the reflog. Send me that output and we'll sort it out.
