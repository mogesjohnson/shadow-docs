# Worked example

One feature, from issue to close, with every message written out. The project is a web app; the feature is a password reset. Numbers, shas and run IDs are made up.

## 1. The issue (#12)

Title: `Let users reset a forgotten password`. Label: `feature`.

```markdown
## Goal

Users who forget their password have no way back in: the login page has no reset link, and support resets passwords by hand (31 requests in September). Add a reset flow that emails a one-time link.

## Acceptance criteria

- AC1: "Forgot password?" on the login page emails a reset link that expires 30 minutes after it is sent and works only once.
- AC2: Opening an expired or used link shows "This link has expired" and a button to send a new one. The owner checks the email's wording.
- AC3: Tests cover expiry, single use and the expired page. The build, type check and tests pass, and CI passes on ubuntu, macos and windows.

## Out of scope

- Changing a password while logged in.
- Rate limiting reset requests (#15).

## Implementation and PR handoff

Branch: claude/12-password-reset; base main.
Push a focused PR. Map each AC ID to evidence and state any unresolved item plainly.
Leave the PR draft when required evidence or human acceptance is still missing.
Codex reviews and merges; Claude does not merge or close the issue by assertion.
```

## 2. The branch

```bash
git fetch origin
git switch -c claude/12-password-reset origin/main
```

## 3. The first commit

```bash
git status --short
git add -- src/auth/reset.ts src/auth/reset.test.ts src/pages/login.tsx src/mail/templates/reset.html
git diff --cached --stat
git commit -F <message-file>
git push -u origin claude/12-password-reset
```

The message file:

```
#12 Send a reset link that expires after 30 minutes

"Forgot password?" on the login page now emails a one-time link. The
token is stored hashed with its expiry time, and an expired or used
link shows "This link has expired" with a button to send a new one.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

## 4. The draft PR (#13)

```bash
gh pr create --draft --base main --title "#12 Let users reset a forgotten password" --body-file <body-file>
```

The body file, as it is when the PR opens. CI hasn't run yet and the evidence comment doesn't exist, so those two boxes stay unticked, each with its reason:

```markdown
Users can reset a forgotten password from the login page: they get an emailed one-time link that expires after 30 minutes. The token is stored hashed with its expiry, and expired or used links show a page that offers a new link.

Validation: at 3f9c2ab, the build, type check and all 212 tests pass locally; CI is running. Real email delivery was not tested; the mailer is faked in tests.

Tracking: #12

Checklist:
- [x] Focused: only this issue's change, with no unrelated files, generated output or secrets.
- [ ] Each acceptance criterion is mapped to evidence in a PR comment, and anything unverified is named. Posted once CI passes.
- [x] The project's own rules (CLAUDE.md, AGENTS.md) still hold, and any hard rule is enforced and tested.
- [ ] Works on every platform the project supports (CI passes on each). Waiting on CI for this head.
- [x] The project's build, type check and tests pass (the commands are under Commands in CLAUDE.md).
- [x] Draft until required evidence or human acceptance is available. The owner's check of the email wording (AC2) is still missing.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## 5. The evidence comment

When CI passes, post the evidence comment, then update the body: `Validation:` now says CI passes on ubuntu, macos and windows, and the second and fourth boxes are ticked (`gh pr edit 13 --body-file <body-file>`, which also re-runs the PR format check).

```markdown
**AC to evidence (#12)**, at 3f9c2ab

| AC | Evidence |
|---|---|
| AC1: emailed link, expires after 30 minutes, works once | `reset.test.ts` "rejects a link 31 minutes old", "accepts a link 29 minutes old" and "rejects a used link"; all three fail on main |
| AC2: expired or used link shows "This link has expired" | `reset.test.ts` "shows the expired page with a new-link button" |
| AC3: tests and CI | 212 tests pass locally; CI run 1234567 passes on ubuntu, macos and windows |

**Limitations**
- Real email delivery was not tested; the mailer is faked.

Not verified: the owner's check of the email's wording, which AC2 needs.
```

Then the hand-off comment: `For Codex: ready for review at 3f9c2ab. The owner's check of the email wording (AC2) is still open, so the PR stays a draft.`

## 6. Codex's review

The review body:

```
Reviewed 3f9c2ab8e1d04c6b9a7f5e2d1c0b9a8f7e6d5c4b.

The expiry works: a 31-minute-old link is rejected and the expired page matches AC2. One P1 remains: a link can be used twice if both requests arrive before the first finishes. The inline finding has the reproduction. This is not an approval.

Validation at this head: the build, type check and all 212 tests pass; CI is green on ubuntu, macos and windows. I reran the reset flow against a local test server. No merges or pushes.
```

The inline finding on `src/auth/reset.ts`:

```
[P1] Reject a reset link that is already being used

Two requests with the same token both pass the "unused" check, because the token is marked used only after the password is saved. Reproduction: send two POST /reset requests with one token at the same time; both return 200 and the password changes twice. Mark the token used in the same transaction as the check, and add a test that sends two requests at once.
```

## 7. The fix

A new commit, never an amendment:

```
#12 Mark a reset token used in the same transaction as the check

Two simultaneous requests with one token could both pass the unused
check. The check and the update are now one transaction, so the second
request finds the token used and gets the expired page.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

The reply in the finding's thread:

```
Fixed in 7d1e4a0. The token is now marked used in the same transaction as the check, so a second request finds it used and gets "This link has expired". New test: "rejects the second of two simultaneous requests" (fails on 3f9c2ab, passes now). CI run 1234890 passes on all three platforms. Could you take another look?
```

Then a new evidence comment at 7d1e4a0, and `Validation:` in the PR body updated to 7d1e4a0 and 214 tests.

## 8. The owner's check, and the approval

The owner reads the email and comments: `Email wording checked on 2026-10-08; it's fine.` All required evidence and human acceptance now exist, so the author drops "still missing" from the last box's line in the body, notes the owner's check in a short evidence update, and marks the PR ready with `gh pr ready 13`.

Codex's approving review:

```
Reviewed 7d1e4a0c5b2f8e9d1a3c4b5d6e7f8a9b0c1d2e3f. No actionable findings at 7d1e4a0.

The P1 is fixed: simultaneous requests are now rejected after the first, and the new test fails before the fix. Validation: the build, type check and 214 tests pass; CI is green on ubuntu, macos and windows.
```

## 9. The merge

```bash
gh pr view 13 --json headRefOid,isDraft,mergeable,statusCheckRollup
gh pr merge 13 --merge --match-head-commit 7d1e4a0c5b2f8e9d1a3c4b5d6e7f8a9b0c1d2e3f \
  --subject "#12 Merge PR #13: let users reset a forgotten password" \
  --body "Users can reset a forgotten password with an emailed link that expires after 30 minutes and works once. Reviewed at 7d1e4a0; CI passes on ubuntu, macos and windows; the owner checked the email wording."
gh pr view 13 --json state,mergedAt,mergeCommit
git push origin --delete claude/12-password-reset
```

`main` now has a merge commit `#12 Merge PR #13: let users reset a forgotten password` with both PR commits under it. The PR had 2 commits: the change and one review round.

## 10. Acceptance and close

```
Accepted after Codex review and merged PR #13 at 9b8c7d6 (reviewed head 7d1e4a0).

AC1: emailed link, 30-minute expiry, single use: "rejects a link 31 minutes old", "accepts a link 29 minutes old", "rejects a used link" and "rejects the second of two simultaneous requests" pass.
AC2: the expired page passes its test, and the owner checked the email's wording on 2026-10-08.
AC3: 214 tests pass; CI passes on ubuntu, macos and windows at 7d1e4a0, and main's tree matches the tested tree.

Acceptance covers the reset flow with the test mailer. Not verified: delivery through the production email provider.
```

```bash
gh issue comment 12 --body-file <file>
gh issue close 12 --reason completed
```

No follow-up issue is opened unless the owner asks for one.
