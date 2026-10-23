# Branches

## Names

`<author>/<issue>-<short-purpose>`

- `<author>`: who works on it: `claude`, `codex`, or the owner's own short name.
- `<issue>`: the issue number, without `#`.
- `<short-purpose>`: 1 to 4 lowercase words joined by hyphens, ASCII only. Name the change, not the activity.

| Good | Bad |
|---|---|
| `claude/12-password-reset` | `claude/password-reset` (no issue number) |
| `claude/62-cached-tokens` | `claude/12-Fix_Password_Reset_Flow_For_Users` (case, underscores, too long) |
| `codex/30-review-chat` | `feature/12` (no author, no purpose) |
| `claude/63-v2-spec` | `claude/12-wip` (names the activity, not the change) |

Several PRs for one issue each get their own branch with a different purpose, for example `claude/63-claude-first-docs` and `claude/63-v2-spec`.

The long-lived branches:

- `main`: the default branch, always the merged and reviewed state.
- `legacy/v<N>`: the final state of a retired major version (see [10-releases.md](10-releases.md)).

## Base

- The base is `main`, unless the work is stacked.
- **Stacked work** builds on a branch that hasn't merged yet. Its base is that previous feature branch, and both the issue's handoff block and the PR's `Tracking:` line name it.
- If the base changes, say so on the PR.

## Creating a branch

Start from the latest remote state, not from whatever the checkout happens to hold:

```bash
git fetch origin
git switch -c claude/12-password-reset origin/main
# stacked on a branch that hasn't merged yet:
git switch -c claude/14-reset-emails origin/claude/12-password-reset
```

Push it with the first commit: `git push -u origin claude/12-password-reset`.

If the main checkout is busy (another agent has another branch checked out there), work in a separate worktree instead of switching its branch:

```bash
git worktree add ../<repo>-12 -b claude/12-password-reset origin/main
```

## Never commit to main

Every change reaches `main` through a reviewed PR. The one exception is a `[F0]` bootstrap commit in a repository that has no GitHub remote yet, where no PR is possible.

## Keeping a branch up to date

Once a branch is pushed, merge `main` into it; never rebase it. Rebasing rewrites the commits that reviews and evidence refer to.

```bash
git fetch origin
git merge origin/main -m "#12 Merge main into the password reset branch"
```

Git's default message (`Merge remote-tracking branch 'origin/main' into ...`) is accepted too. Resolve any conflicts in that merge commit, run the checks, then push.

Merge `main` in when the PR conflicts with it, or when the branch needs something that merged since. Don't do it on every push: each merge adds noise to the history.

## When a stacked base merges

- If the base branch was deleted when it merged, GitHub moves the stacked PR to the base's own base (usually `main`) by itself.
- Otherwise retarget it with `gh pr edit <n> --base main`, then merge `origin/main` into the stacked branch and push.
- Update the PR's `Tracking:` line to the new base.

## After the merge

Whoever merged deletes the branch once no open PR uses it as a base: `git push origin --delete claude/12-password-reset`, or GitHub's "Delete branch" button. Locally, `git branch -d claude/12-password-reset` (lower-case `-d` refuses a branch that hasn't merged). Never delete someone else's branch while it holds unmerged work.
