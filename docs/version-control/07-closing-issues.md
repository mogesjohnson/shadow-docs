# Closing issues

An issue closes when its acceptance is **verified**: not when a PR merges, and not because someone says it's done.

## Never

- Never close an issue through a closing keyword in a PR body or a commit message (`closes #12`, `fixes #12`, `resolves #12`). GitHub would close it on merge, before anyone checks acceptance. The checks reject these keywords.
- Never close an issue by assertion ("done", "should be fixed now"). Close it with the evidence.

## The acceptance comment

After the merge, post one comment on the issue, then close it:

```
Accepted after Codex review and merged PR #13 at 9b8c7d6 (reviewed head 7d1e4a0).

AC1: a reset link expires after 30 minutes: "rejects a link 31 minutes old" and "accepts a link 29 minutes old" pass.
AC2: an expired link shows "This link has expired": the test "shows the expired message" passes, and the owner checked the email's wording on 2026-10-08.
AC3: 214 tests pass; CI passes on ubuntu, macos and windows at 7d1e4a0, and main's tree matches the tested tree.

Acceptance covers the reset flow with the test mailer. Not verified: delivery through the production email provider.
```

- Name the merged PR, the merge commit and the reviewed head.
- One line per AC, with its evidence.
- **Record the exact acceptance scope:** what was proven and what wasn't. "Minimum basic playability" is not "all future scenarios passed".
- Say what wasn't verified (a platform, a real terminal, a live service), even when it doesn't block.

```bash
gh issue comment 12 --body-file <file>
gh issue close 12 --reason completed
```

## When acceptance isn't complete

- Leave the issue open, and comment what is verified, what is missing, and what would complete it.
- If part is done and the owner agrees the rest isn't needed now, close it with the scope recorded and say what was left out.
- If the issue won't be done: `gh issue close 12 --reason "not planned"`, with a comment saying why.

## Who closes

The reviewer or the owner, usually right after merging. Claude may close an issue only when its acceptance is actually complete and recorded in a comment like the one above.

## After closing

Don't open a replacement or follow-up feature on your own because an issue closed. Follow-ups come from the owner, or from a review finding that was explicitly deferred to one.
