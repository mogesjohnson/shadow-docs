# Rules for Codex

These rules are for Codex. Claude follows `CLAUDE.md`.

Shadow Docs is the documentation site for Shadow Army (`sa`), a Next.js app that runs standalone and is included in the portfolio (`mogesjohnson/Personal-Portfolio`) as a git submodule rendered at `/shadow-docs`. The docs code is in `src/docs/`; `docs/PLAN.md` holds the plan and the owner's choices.

## Commands

```bash
npm install
npm run build          # next build: compiles and type-checks
npx tsc --noEmit
npm run lint
npm run dev            # http://localhost:3000/shadow-docs
```

There are no unit tests yet. `node --test scripts/pr-format.selftest.mjs` tests the commit and PR format rules.

## Version control

Every change has an issue, a branch, and one focused pull request. Claude usually writes the code and opens the PR; you review it, merge it, and record acceptance on the issue. Read `docs/version-control/README.md` for the full process and a worked example; `05-reviews.md` and `06-merging.md` describe your part.

### Reviewing

- Review one exact commit, in your own worktree rather than the shared checkout. Start the review body with `Reviewed <full sha>.`, then say what works, what doesn't, what you ran to validate (commands, results, platforms), and what you did not do (merges, pushes, real external calls).
- Post each finding as an inline comment on its line. First line: a tag and an imperative summary, for example `[P1] Reject a reset link that is already being used`. Then the reproduction (exact steps, input, what happened) and what a fix must achieve.
- Tags: `[P0]` and `[P1]` block the merge (wrong behavior, data loss, security, an acceptance criterion not met); `[P2]` should be fixed in this PR unless you agree in writing to a follow-up issue; `[P3]` is a nit and doesn't block.
- A broken process rule is a finding too: a PR body that doesn't follow the template, a closing keyword, a ticked box that wasn't verified, an AC missing from the evidence comment.
- Report; don't fix. The author fixes findings on their own branch. You may fix a trivial nit yourself only if you say so in a PR comment. If you do push a real fix, say exactly what you changed. Never force-push.
- Approve with a review body that starts `No actionable findings at <sha>.`, followed by your validation. It counts only for that head: any new push needs a new review.
- When open PRs conflict with each other, say which should merge first and what the second must keep.

### Merging

- Merge only when: you approved the current head; CI and the `PR format` check pass at that head; the PR is not a draft; no `[P0]` to `[P2]` finding is open; for stacked work, the base has merged and the PR now targets `main`.
- Always a merge commit, pinned to the reviewed head:
  `gh pr merge <n> --merge --match-head-commit <sha> --subject "#<issue> Merge PR #<n>: <summary>" --body "<what it brings>. <review and validation>."`
  The summary is the PR title's action, starting in lower case. Keep the subject to 72 characters when you can. No closing keywords.
- Then verify the merged state and the merge commit, delete the branch if no open PR is based on it, and post the acceptance comment on the issue: the merged PR, the merge commit and the reviewed head; one line of evidence per AC; the exact acceptance scope; what was not verified. Close the issue only when acceptance is complete.
- Do not generate a replacement feature when an issue closes.

### Committing (when you do)

- Subject `#<issue> <Action>`: imperative, at most 72 characters, no trailing period, no `feat:`-style prefix, no closing keyword. Body wrapped at 72 columns. Trailer: `Co-Authored-By: Codex <noreply@openai.com>`. Branches: `codex/<issue>-<short-purpose>`.
- Stage explicit paths only; never `git add -A` or `git add .`. Never force-push or rewrite pushed history. Never bypass the hook with `--no-verify`.

### Working tree

- The checkout may be shared with Claude. Run `git branch --show-current` and `git status` before you start and before every commit. Review in your own worktree (`git worktree add ../<repo>-review <branch>`) so the shared checkout's branch doesn't change under Claude.
- Do not commit files you did not write, secrets, or local working memory. Keep review notes (`.review-*.md`) out of commits.
