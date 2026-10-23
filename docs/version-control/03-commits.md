# Commits

## The message

```
#12 Send a reset link that expires after 30 minutes

The reset form now emails a one-time link. The token is stored
hashed with its expiry time, and an expired or used link shows
"This link has expired" instead of the form.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

Three parts: the subject (line 1), an optional body after a blank line, and the trailer as the last line.

### Subject

- Format: `#<issue> <Action>`, or `[F<n>] <Action>` for a local feature ID. One space after the ID.
- **At most 72 characters, counting the `#<issue> ` prefix.** Aim for 50 to 70. (Shadow Army's subjects average 57.)
- Imperative mood, as if completing "This commit will ...": `Add`, `Fix`, `Count`, `Keep`, `Show`, `Rename`, `Document`, `Remove`.
- Capitalize the first word after the ID. No period at the end.
- Say what changes in behavior, not which files changed: `#12 Send a reset link that expires after 30 minutes`, not `#12 Update auth.ts and mailer.ts`.
- No conventional-commit prefixes: no `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` or `test:`. The issue number does that job.
- No closing keyword (see below).

| Subject | Verdict |
|---|---|
| `#12 Send a reset link that expires after 30 minutes` | Good |
| `#12 Show the API's own reason in the error message` | Good |
| `[F0] Add the README and contributing guide` | Good |
| `feat: password reset (#12)` | Rejected: a prefix, and the ID must come first |
| `Add password reset` | Rejected: no ID |
| `#12` | Rejected: no action |
| `#12Add reset` | Rejected: no space after the ID |
| `#12 Send a reset link that expires after thirty minutes and log each attempt` | Rejected: 79 characters |
| `#12 updated stuff.` | Passes the hook, fails review: not imperative, vague, ends with a period |

Exempt from the format and length rules, because git writes them: `Merge ...`, `Revert "..."`, `fixup! ...` and `squash! ...`.

### Body

- Optional. Add one when the subject can't carry the reason or the behavior: what the change does, why, and any limit or edge case a reviewer should know. About 40% of Shadow Army's commits have one.
- One blank line after the subject. Plain sentences in short paragraphs, wrapped at 72 columns.
- Describe the resulting behavior and the reasoning. Don't list files, and don't narrate the session ("I then tried ...").
- Mention related issues by number without a closing keyword: `See #11.` is fine, `Fixes #11` is not.

### Trailer

- The last line, after one blank line: the attribution trailer your session gives, exactly. For Claude it looks like `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Copy it from the session's instructions rather than typing a model name from memory.
- Codex: `Co-Authored-By: Codex <noreply@openai.com>`.
- A commit the owner writes alone has no trailer.

### Closing keywords are banned

`close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves` and `resolved`, followed by an issue reference (`#12` or `owner/repo#12`), with or without a colon. GitHub closes the issue as soon as such a commit or PR reaches `main`, before anyone checks acceptance. The hook and the PR check reject them in commit messages, and the PR check also rejects them in PR bodies. Write `Tracking: #12` in a PR, and just `#12` in a commit.

## How many commits

- **One commit per logical step.** Each step leaves the project building with its tests passing, so every commit on `main` is a working state.
- **A PR usually has 1 to 3 commits:** the change itself, then one commit per review round. Shadow Army's 22 merged PRs average 2.5 commits (the fewest 1, the most 7).
- **More than 5 commits of new work means the PR is too big.** Split it into stacked PRs, each with its own issue or its own part of the issue.
- **Review fixes are new commits** on top, never amendments: the reviewer's `Reviewed <sha>` and the evidence comment name commits that must keep existing.
- **Never squash, amend, rebase or reorder pushed commits** to make the count look tidy. Merging keeps every commit (see [06-merging.md](06-merging.md)).
- Before a commit is pushed you may still change it, but a new commit is better than `--amend`.

## Staging

- Look first: `git branch --show-current` and `git status --short`.
- Stage by explicit path: `git add -- src/auth/reset.ts src/auth/reset.test.ts`. Never `git add -A`, `git add .` or `git commit -a`: other agents leave untracked files in the working tree.
- Check what is staged before committing: `git diff --cached --stat`.
- Never stage files you didn't write (for example a reviewer's `.review-*.md`), secrets (`.env`, keys, tokens), local working memory or scratch notes, or build output the project doesn't track.
- A new script that must be executable: `git add --chmod=+x -- path/to/script`.

## Writing the commit

Write the message to a file outside the repository and commit with `-F`. It works the same in every shell and keeps the line breaks:

```bash
git commit -F <message-file>
```

In bash a heredoc works too:

```bash
git commit -F - <<'EOF'
#12 Send a reset link that expires after 30 minutes

The reset form now emails a one-time link. ...

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

**Subjects start with `#`, which git's editor treats as a comment.** `-m` and `-F` keep the line, but a message typed in an editor loses it unless the clone uses another comment character. `scripts/setup-hooks.mjs` sets `core.commentChar` to `;` for that reason. In a clone where it hasn't run: `git config core.commentChar ";"`.

## When the hook rejects a commit

The commit didn't happen. Read what the hook printed, fix the message, and commit again. Never use `--no-verify`, and never edit the hook or the checker to let your text through.

## Undoing a commit

- **Not pushed yet:** `git reset --soft HEAD~1` undoes the commit and keeps its changes staged, so you can commit again. Only on your own branch and for your own commit.
- **Pushed:** add a new commit that undoes it, or run `git revert <sha>`. The `Revert "..."` subject is exempt from the format rule; say why in the body.
