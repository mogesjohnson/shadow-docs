# Rules for Claude

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

Every change has an issue, a branch, and one focused pull request. Read `docs/version-control/README.md` for the full process and a worked example; the rules below are the ones that get missed.

### Issues

- Every feature or fix gets an issue with a Goal, acceptance criteria (AC1, AC2, ...), Out of scope, and the handoff block from `CONTRIBUTING.md`. `gh issue create --body-file` skips the issue template, so write all four sections yourself.

### Branches

- `claude/<issue number>-<short-purpose>`, with 1 to 4 lowercase words, for example `claude/12-password-reset`. Base `main`; for stacked work, the previous feature branch.
- Never commit to `main` directly. To catch up with `main`, merge it into the branch; never rebase a pushed branch.

### Commits

- Subject: `#<issue> <concise action>`, or `[F<n>] <concise action>` for local feature IDs (`[F0]` = repo bootstrap docs). Imperative mood, first word capitalized, no trailing period. No `feat:` / `fix:` / `docs:` prefixes.
- At most 72 characters, counting the `#<issue> ` prefix; aim for 50 to 70.
- Add a body when the subject can't say it all: a blank line, then plain sentences wrapped at 72 columns on what changes and why. Never a closing keyword (`fixes #12`) in the subject or the body.
- End every commit message with the attribution trailer the session gives (`Co-Authored-By: Claude <model> <noreply@anthropic.com>`). Use the exact line from the session's reminder.
- One logical step per commit. A PR usually has 1 to 3 commits: the change, then one per review round. More than 5 commits of new work means the PR should be split.
- Stage files by explicit path. Never `git add -A`, `git add .` or `git commit -a`: other agents leave untracked files in the working tree.
- Never force-push, rebase, amend or squash pushed commits, `filter-branch`, or otherwise rewrite pushed history unless the owner explicitly asks for it in that session.
- Enforced, not just asked: the `commit-msg` hook in `.githooks/` rejects a wrong or too-long subject and closing keywords, and the `PR format` workflow checks every PR's title, body and commits. If either rejects, fix the text. Never bypass with `--no-verify`.

### Pull requests

Follow `.github/pull_request_template.md` exactly.

- Title: `#<issue> <concise action>`, at most 72 characters.
- Body: one or two sentences on the resulting behavior and how it is implemented; a short `Validation:` line (checks run, at which commit, results, material limitations); a `Tracking:` line with the issue and, for stacked work, the base branch; then the checklist.
- `gh pr create --body` skips the template file, so paste the template's checklist into the body yourself.
- Tick a checklist box only for something actually verified. Leave the rest unchecked and say why on the line.
- Put the detailed AC-to-evidence mapping and the limitations in a PR comment, not in the body.
- Use `Tracking: #N`. Never closing keywords (`closes`, `fixes`, `resolves`): they close issues on merge before acceptance is checked.
- The `PR format` check needs: a `#N`/`[F<n>]` title of at most 72 characters, `Validation:`, `Tracking:`, `Checklist:` with all 6 boxes, no closing keyword, and commits that pass the hook's rules. Edit the PR body to re-run it.
- Open as a draft unless all required evidence and human acceptance exist. End the body with the PR attribution line the session gives.
- Stacked work: base the PR on the previous feature branch and name it in `Tracking:`.
- When it's ready for review, hand off with one comment: `For Codex: ready for review at <sha>.`

### Reviews and merging

- Codex reviews and merges. Claude does not merge, and does not close an issue by assertion.
- Codex reports findings tagged `[P1]` (blocks the merge) or `[P2]` (fix in this PR unless Codex agrees to a follow-up issue). Fix them in new commits, reply in each thread (`Fixed in <sha>. ...`), and ask for another look.
- An approval (`No actionable findings at <sha>`) counts only for that exact head. Any new push needs a new review.
- If the owner allows Claude to merge a PR, merge only when Codex and Claude both approve its current head, as `docs/version-control/06-merging.md` says. If the session's permission mode refuses the merge, give the owner the exact command instead of retrying another way.
- Close an issue only when its acceptance is actually complete, and record the exact acceptance scope. If something was not verified (a platform, a real terminal, a live service), say so in a comment on the issue.
- Comment on the issue or PR at milestones (behavior, evidence, remaining work, blockers), not once per tool call.
- Do not generate a replacement feature when an issue closes.

### Working tree

- The working tree may be shared with Codex, which checks out PR branches here. Run `git branch --show-current` and `git status` before starting work and before every commit.
- Do not commit files you did not write (for example `.review-*.md`), secrets, or local working memory.
