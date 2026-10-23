# Version control

How this project uses git and GitHub, in full. `CLAUDE.md` and `AGENTS.md` carry the short rules that every session loads; these pages carry the detail and the reasons. They come from the GITHUB_VERSION_CONTROL_PROMPT template, which is the process built and used on Shadow Army.

## Roles

- **Owner:** the person who owns the repository. Decides scope, gives human acceptance (a check only a person can do, such as a test in a real terminal or a run that costs money), and may merge.
- **Author:** usually Claude. Writes the issue, the branch, the commits, the PR and its evidence, and fixes review findings. Does not merge unless the owner allows it, and never closes an issue by assertion.
- **Reviewer:** usually Codex. Reviews each PR at an exact commit, reports findings, approves, merges, and records acceptance on the issue.

Agents work through the owner's GitHub account, so their comments show the owner's name. Tell them apart by content: a review starts with `Reviewed <sha>.`

## The flow

1. **Issue.** One feature or fix per issue, with a Goal, acceptance criteria `AC1`, `AC2`, ..., Out of scope, and the handoff block. See [01-issues.md](01-issues.md).
2. **Branch.** `claude/<issue>-<short-purpose>` from `main`, or from the previous branch for stacked work. See [02-branches.md](02-branches.md).
3. **Commits.** `#<issue> <Action>`, at most 72 characters, staged by explicit path, never rewritten once pushed. See [03-commits.md](03-commits.md).
4. **Draft PR.** A title like a commit subject, the template's body, opened as a draft. See [04-pull-requests.md](04-pull-requests.md).
5. **Evidence.** A PR comment maps every AC to evidence at a named commit and lists the limitations. See [04-pull-requests.md](04-pull-requests.md#evidence-comment).
6. **Review.** Codex reviews the head and posts `[P1]`/`[P2]` findings; the author fixes them in new commits and replies in each thread; Codex approves with `No actionable findings at <sha>.` See [05-reviews.md](05-reviews.md).
7. **Merge.** Codex or the owner merges with a merge commit pinned to the approved head. See [06-merging.md](06-merging.md).
8. **Acceptance.** The issue gets a comment mapping each AC to evidence and naming the exact scope, and closes only if acceptance is complete. See [07-closing-issues.md](07-closing-issues.md).

The other pages: [08-working-tree.md](08-working-tree.md) (staging, shared checkouts, what never to run), [09-progress-and-handoffs.md](09-progress-and-handoffs.md) (milestone comments, checkpoints), [10-releases.md](10-releases.md) (tags, release notes, retired lines) and [11-worked-example.md](11-worked-example.md) (one feature from issue to close, with every message written out).

## Rules at a glance

| What | Rule | Enforced by |
|---|---|---|
| Unit of work | One feature or fix = one issue = one branch = one PR. Large work: stacked PRs. | review |
| Issue | `## Goal`, `## Acceptance criteria` (AC1, AC2, ...), `## Out of scope`, `## Implementation and PR handoff` (the 4-line block) | review |
| Issue title | An imperative sentence with no prefix: `Let users reset a forgotten password` | review |
| Branch | `claude/<issue>-<short-purpose>`, 1 to 4 lowercase hyphenated words; base `main`, or the previous branch when stacked | review |
| Commit subject | `#<issue> <Action>` or `[F<n>] <Action>`; imperative; capitalized; no trailing period; no `feat:`-style prefix | hook, PR check |
| Subject length | At most 72 characters, counting the prefix; aim for 50 to 70 | hook, PR check |
| Commit body | Optional; a blank line after the subject; plain prose wrapped at 72 columns; what changes and why | review |
| Trailer | The exact `Co-Authored-By:` line the session gives | review |
| Closing keywords | Never (`closes`, `fixes`, `resolves` + `#N`) in commit messages or PR bodies | hook, PR check |
| Commits per PR | Usually 1 to 3: the change, then one per review round. More than 5 commits of new work: split the PR. | review |
| History | Never force-push, rebase, amend or squash pushed commits; catch up by merging `main` in | review |
| Staging | Explicit paths only; never `git add -A`, `git add .` or `git commit -a` | review |
| PR title | The same format and 72-character limit as a commit subject | PR check |
| PR body | Behavior (1 to 2 sentences), `Validation:`, `Tracking: #N`, `Checklist:` (6 boxes), attribution line | PR check (labels, boxes) |
| PR state | Draft until all required evidence and human acceptance exist | review |
| Evidence | A PR comment mapping every AC to evidence at a named commit, plus limitations | review |
| Review | Codex: `Reviewed <sha>.` plus inline findings, `[P1]` (blocks) or `[P2]` (fix in this PR) | review |
| Fixes | New commits; reply `Fixed in <sha>.` in each thread; ask for another look | review |
| Approval | `No actionable findings at <sha>.`, valid only for that exact head | review |
| Merge | Codex or the owner; a merge commit only; `--match-head-commit <sha>`; subject `#<issue> Merge PR #<pr>: <summary>` | review |
| Closing an issue | Only after verified acceptance; one comment maps each AC to evidence and states the exact scope | review |
| Release | Annotated tag `vX.Y.Z` on `main`; a GitHub release with Known limits; a retired line gets `legacy/vN` | review |

## What is enforced, and where

| Check | Files | Runs | Rejects |
|---|---|---|---|
| `commit-msg` hook | `.githooks/commit-msg` | every local commit and local merge, once `scripts/setup-hooks.mjs` has run in the clone | a subject that isn't `#<issue> <Action>` or `[F<n>] <Action>`; a subject over 72 characters; a closing keyword anywhere in the message |
| `PR format` workflow | `.github/workflows/pr-format.yml`, `scripts/check-pr-format.mjs`, `scripts/pr-format.mjs` | every PR when it is opened, edited, pushed to, reopened or marked ready | a bad or too-long title; a body without `Validation:`, `Tracking:` or `Checklist:`, or with fewer than 6 boxes; a closing keyword in the body; any PR commit that breaks the hook's rules |
| Self-test | `scripts/pr-format.selftest.mjs` | first step of the `PR format` workflow; locally with `node --test scripts/pr-format.selftest.mjs` | a checker or hook that no longer follows these rules |

Subjects that start with `Merge `, `fixup! `, `squash! ` or `Revert ` are exempt from the format and length rules, because git writes them. Everything else on these pages is enforced by review: a reviewer treats a broken rule as a finding.

Never bypass a check, with `--no-verify` or by editing the checker until it passes. If one rejects your text, fix the text.
