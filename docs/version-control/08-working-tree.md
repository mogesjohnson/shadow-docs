# Working tree

## The checkout may be shared

Claude and Codex may work in the same folder: Codex checks out PR branches there to review them. So:

- Run `git branch --show-current` and `git status --short` before starting work **and before every commit**. If the branch isn't the one you expect, stop and find out why; don't commit onto someone else's branch.
- Don't switch the shared checkout's branch while someone else may be using it. For parallel work, use a worktree: `git worktree add ../<repo>-<issue> -b claude/<issue>-<purpose> origin/main`. Reviewers review in their own worktree too.
- Files you didn't create (untracked notes, `.review-*.md`, another agent's edits, something already staged) are not yours. Don't stage, commit, move, stash or delete them. Mention them in your report if they're in the way.

## Staging and committing

- Stage explicit paths only. Never `git add -A`, `git add .` or `git commit -a`.
- Check `git diff --cached --stat` before committing: it must list only your files.
- Never commit secrets (`.env`, keys, tokens, credentials), local working memory (agent notes folders, scratch files), or build output the project doesn't track. Keep them in `.gitignore`.

## History is never rewritten

Unless the owner explicitly asks for it in that session, never run anything that rewrites shared history or discards someone else's work:

- `git push --force` or `--force-with-lease`, or pushing a rewritten branch;
- `git rebase`, `git commit --amend` or `git reset` on pushed commits;
- `git filter-branch` or `git filter-repo`;
- deleting a branch that holds unmerged work, or moving or deleting a pushed tag;
- `git reset --hard`, `git checkout -- .`, `git restore .`, `git clean -fd` or `git stash` in a shared checkout: they destroy uncommitted work that may not be yours.

To catch up with `main`, merge it in ([02-branches.md](02-branches.md)). To undo a pushed commit, add a commit or use `git revert` ([03-commits.md](03-commits.md)).

## Never bypass the checks

No `--no-verify`, and no edits to `.githooks/commit-msg` or `scripts/pr-format.mjs` to let a message through. A rule changes only as its own reviewed change, when the owner asks for it.

## Line endings and the hook

`.gitattributes` keeps `.githooks/*` and `*.sh` at LF line endings: a CRLF in the hook's first line makes it fail on Windows checkouts. The hook must also be executable in git (`git add --chmod=+x -- .githooks/commit-msg`) so it runs on macOS and Linux clones.

## Every clone runs the setup once

The hook works only after `core.hooksPath` points at `.githooks`. `npm install` does it in Node projects (the `prepare` script); elsewhere, run `node scripts/setup-hooks.mjs` once per clone. Worktrees share their repository's config, so a new worktree needs nothing.
