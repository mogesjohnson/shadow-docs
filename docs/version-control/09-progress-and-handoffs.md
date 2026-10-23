# Progress and handoffs

## Comment at milestones, not per step

Post on the issue or the PR when something a reader needs to know has changed:

- a behavior now works (with its evidence);
- the PR is ready for review, or a review round is answered;
- a blocker appears or is cleared;
- the plan or the scope changes, or the owner decides something.

Each milestone comment says what works now, the evidence, what remains, and any blockers. Not one comment per command, and not "starting work now".

```
Milestone: reset links are sent and expire after 30 minutes (3f9c2ab). Tests: 212 pass, CI green. Remaining: the single-use rule in AC1. No blockers.
```

## Decisions

Record the owner's decisions where the work is tracked, with the date: `Owner decided on 2026-10-07: links expire after 30 minutes, not 60.` Write dates as YYYY-MM-DD, never "today" or "yesterday".

## Handing off to the reviewer

One comment when the PR is ready: `For Codex: ready for review at 3f9c2ab.` If something is still waiting on the owner, add what it is.

## Long-session checkpoint

When a session runs long, or before handing work to another session, write a checkpoint (on the PR, on the issue, or in the hand-off message) with:

- the issue URL;
- the branch and its head commit;
- the changed files;
- the decisions made, and why;
- the tests run and their results;
- blockers;
- the next concrete action.

```
Checkpoint for #12
- Issue: https://github.com/<owner>/<repo>/issues/12
- Branch: claude/12-password-reset at 7d1e4a0 (pushed); PR #13, draft
- Changed: src/auth/reset.ts, src/auth/reset.test.ts, src/mail/templates/reset.html
- Decisions: tokens stored hashed (owner, 2026-10-07); links expire after 30 minutes
- Tests: 214 pass locally; CI run 1234890 is green on ubuntu, macos and windows
- Blockers: AC2 needs the owner to check the email's wording
- Next: post the evidence comment at 7d1e4a0 and hand off to Codex
```
