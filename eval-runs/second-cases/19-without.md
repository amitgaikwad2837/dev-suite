Good news first: you haven't pushed, and git almost certainly still has everything. Nothing is lost until the reflog expires (months by default), so don't run any cleanup commands (`git gc`, `git reflog expire`, `git clean`) and don't start over with `git reset --hard` yet.

I can't run commands here, so this is what I'd do, in order, if I were at your terminal. Please run these and paste me the output.

**Step 1: Stop and look. Change nothing.**

```
git status
git log --oneline -20
git reflog -40
```

`git status` will tell you whether the rebase is still in progress ("rebase in progress; onto ..."). The reflog is the important one: it records where your branch pointed before the rebase started.

**Step 2: Make a safety net before touching anything.**

Find the reflog entry just before the rebase began. It looks like `checkout: moving from <your-branch> to <sha>` or `rebase (start)`. The entry right before it is your original 15-commit tip. Then:

```
git branch backup/pre-rebase <that-sha>
```

(If the rebase has already finished, `ORIG_HEAD` or `<your-branch>@{1}` often points at the same place. Check with `git log --oneline backup/pre-rebase` that you see all 15 of your commits.)

That branch is your original work, intact. Whatever happens next, you can't lose it.

**Step 3: Find which commit went missing.**

Compare the original against what you have now:

```
git log --oneline main..backup/pre-rebase     # the 15 originals
git log --oneline main..HEAD                  # what's on the branch now
git range-diff main backup/pre-rebase HEAD    # shows which commit dropped or changed
```

`range-diff` will show you exactly which commit is missing or was mangled. A likely cause is that a commit became empty or got skipped during conflict resolution. `git add .` followed by `--continue` can quietly commit conflict markers, drop your side of a hunk, or leave a commit empty (so git drops it).

**Step 4: Choose how to recover. I'd recommend redoing the rebase.**

Option A (cleanest): abort and redo it with a safety net.
```
git rebase --abort        # only if it's still in progress
git reset --hard backup/pre-rebase   # back to your original 15 commits, safe because the backup exists
git rebase main
```
This time, resolve each conflict deliberately. For each stop:
- `git status` and `git diff` to see the conflicted files.
- Fix the files, and search for leftover markers with `git grep -nE '^(<<<<<<<|=======|>>>>>>>)'`.
- Add only the files you resolved, by name, rather than `git add .`.
- Build and run the tests before `git rebase --continue` if you can.
- If a conflict is hopeless, `git rebase --abort` is always available and costs you nothing.

Option B: if the conflicts were enormous and you'd rather not repeat them, merge instead of rebasing: `git merge main` on the backup branch gives you one conflict resolution instead of up to 15. Since you haven't pushed, either is fine. A merge commit is a perfectly good result, and it is the safer choice when the conflicts are this big.

Option C: if only one commit is missing and the rest is fine, `git cherry-pick <sha-of-missing-commit>` onto the current branch. Then fix the build.

**Step 5: Fix the build.**

Once the commit set is right, if it still doesn't compile, the likely causes are leftover conflict markers, a side of a conflict that was dropped, or a commit that depended on something main renamed. Compare the final tree against your backup (`git diff backup/pre-rebase HEAD --stat`). The differences should be only what main changed, not things you wrote.

**A few things to avoid:**
- Don't force-push anything. You haven't pushed, so you shouldn't need to.
- Don't delete the backup branch until the build passes and `range-diff` shows all 15 commits accounted for.
- Don't run `git add .` mid-rebase again. It also stages stray files and conflict markers.

If you paste the output of `git status`, `git reflog -40` and `git log --oneline -20`, I can point to the exact SHA to back up and tell you which commit dropped.
