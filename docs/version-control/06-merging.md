# Merging

## Who merges

- **Codex** (the reviewer) merges by default.
- **The owner** may merge at any time.
- **Claude** (the author) does not merge, unless the owner allows it for that PR or project. Even then, only when Codex and Claude both approve the current head.
- If a session's permission mode refuses the merge, don't retry another way. Give the owner the exact command to run, prefixed with `!` so it runs in their session: `! gh pr merge ...`.

## Before merging, all of these hold

- [ ] The reviewer approved the **current head**: `No actionable findings at <sha>`, and that sha is the PR's head now.
- [ ] CI and the PR format check pass **at that head**.
- [ ] The PR is not a draft: all required evidence and human acceptance exist.
- [ ] No `[P0]`, `[P1]` or `[P2]` finding is open, unless a `[P2]` moved to a follow-up issue with the reviewer's written agreement.
- [ ] For stacked work, the base PR has merged and this PR now targets `main`.
- [ ] It doesn't conflict with `main`. When two open PRs conflict with each other, decide which goes first and note what the second must keep.

Check the head, draft state and checks with `gh pr view <n> --json headRefOid,isDraft,mergeable,statusCheckRollup`.

## How to merge

Always a **merge commit**. Never squash, never rebase: a merge keeps every reviewed commit and its sha, which the reviews and evidence refer to.

```bash
gh pr merge 13 --merge --match-head-commit 7d1e4a0c5b2f8e9d1a3c4b5d6e7f8a9b0c1d2e3f \
  --subject "#12 Merge PR #13: let users reset a forgotten password" \
  --body "Users can reset a forgotten password with an emailed link that expires after 30 minutes and works once. Reviewed at 7d1e4a0; CI passes on ubuntu, macos and windows."
```

- `--match-head-commit` makes GitHub refuse the merge if anything was pushed after the review.
- **Subject:** `#<issue> Merge PR #<pr>: <summary>`, where the summary is the PR title's action starting in lower case. Keep it to 72 characters when you can by shortening the summary, for example `#58 Merge PR #59: unlink substituted tracked links safely`.
- **Body:** one or two sentences: what the merge brings, and what review and validation came before it. If the owner told you to merge, say so: `Merged on the owner's instruction after their real-terminal test passed.`
- No closing keywords in the subject or the body.

## After merging

1. Verify: `gh pr view 13 --json state,mergedAt,mergeCommit` shows `MERGED` and the merge commit, and after `git fetch origin`, `git log -1 origin/main` shows it.
2. Delete the branch once no open PR is based on it: `git push origin --delete claude/12-password-reset`. Retarget any stacked PR first if GitHub hasn't (see [02-branches.md](02-branches.md)).
3. Record acceptance on the issue, and close it only if acceptance is complete (see [07-closing-issues.md](07-closing-issues.md)).
4. If the project keeps a feature list, roadmap or proposal status, update it so it matches.
5. Don't start a replacement feature on your own because an issue closed.
