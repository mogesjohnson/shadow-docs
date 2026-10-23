# Reviews

Every PR is reviewed by someone who didn't write it: Codex reviews Claude's PRs, and Claude may review Codex's. The owner's own check (human acceptance) is separate, and the ACs say when it is needed.

## The reviewer reports, the author fixes

- The reviewer finds problems and reports them; the author fixes them on their own branch. This keeps the reviewer independent and keeps two agents from pushing to one branch.
- The reviewer may fix a trivial nit itself (a typo, a comment) only if it says so in a PR comment. If the reviewer does push a real fix, for example after already reproducing a defect, its review says exactly what it changed, and the author checks that commit.
- Nobody force-pushes, so everyone's commits stay safe.

## A review

A review covers one exact commit. Its body starts with that commit's full sha, then says:

- what works,
- what doesn't (each finding is also an inline comment),
- what the reviewer ran to validate (commands, results, platforms),
- what the reviewer didn't do (for example: no merges, no pushes, no real external calls),
- the merge order, if it conflicts with another open PR.

```
Reviewed 3f9c2ab8e1d04c6b9a7f5e2d1c0b9a8f7e6d5c4b.

The expiry works: a 31-minute-old link is rejected and the message matches AC2. One P1 remains: a link can be used twice if both requests arrive before the first finishes. The inline finding has the reproduction. This is not an approval.

Validation at this head: the build, type check and all 212 tests pass; CI is green on ubuntu, macos and windows. I reran the reset flow against a local test server. No merges or pushes.
```

## Findings

Each finding is an inline comment on the line it concerns:

```
[P1] Reject a reset link that is already being used

Two requests with the same token both pass the "unused" check, because the token is marked used only after the password is saved. Reproduction: send two POST /reset requests with one token at the same time; both return 200 and the password changes twice. Mark the token used in the same transaction as the check, and add a test that sends two requests at once.
```

- First line: the priority tag and an imperative summary.
- Then the reproduction: exact steps, input, and what happened.
- Then what a fix must achieve (not necessarily how).

| Tag | Meaning | Blocks the merge |
|---|---|---|
| `[P0]` | Drop everything: data loss, a security hole, a broken `main`. Rare. | Yes |
| `[P1]` | Wrong behavior, an AC not met, a regression, a safety gap. | Yes |
| `[P2]` | A real defect or gap that should be fixed in this PR. | Yes, unless the reviewer agrees in writing to a follow-up issue |
| `[P3]` | A nit or a suggestion. | No |

A broken rule from these pages is a finding too: a PR body that doesn't follow the template, a closing keyword, a ticked box that wasn't verified, an AC missing from the evidence comment.

## Answering findings (the author)

1. Fix each finding in a new commit on the branch; one commit per review round is normal. Add a test that fails without the fix.
2. Push, then reply **in each finding's thread**:

   ```
   Fixed in 7d1e4a0. The token is now marked used in the same transaction as the check, so a second request finds it used and gets "This link has expired". New test: "rejects the second of two simultaneous requests" (fails on 3f9c2ab, passes now). CI run 1234890 passes on all three platforms. Could you take another look?
   ```

3. If you disagree, reply with the evidence instead of silently skipping the finding. The reviewer decides whether it still blocks; the owner breaks a tie.
4. Post a new evidence comment if the evidence changed, and update `Validation:` in the body.

## Approval

The reviewer approves with a review whose body says so for the exact head:

```
Reviewed 7d1e4a0c5b2f8e9d1a3c4b5d6e7f8a9b0c1d2e3f. No actionable findings at 7d1e4a0.

Validation: the build, type check and 214 tests pass; CI is green on ubuntu, macos and windows.
```

- **An approval counts only for that exact commit.** Any new push, even a one-line change, needs a new review of the new head.
- Agents work through the owner's GitHub account, and GitHub doesn't let an account formally approve its own PR. So reviews arrive as `COMMENTED`, and the approval is the text `No actionable findings at <sha>`.

## Following a review (for agents)

- Reviews and their summaries: `gh api repos/{owner}/{repo}/pulls/<n>/reviews`
- Inline findings and replies: `gh api repos/{owner}/{repo}/pulls/<n>/comments`
- The PR's conversation: `gh api repos/{owner}/{repo}/issues/<n>/comments`
- To catch new activity, poll with `?since=<ISO time>`. After you push or comment yourself, move `since` past your own activity so you don't mistake it for the reviewer's.
- Your own thread replies also show up as `COMMENTED` reviews with empty bodies. Read the text before treating one as a new review.
- Everyone posts as the owner's account, so tell the reviewer apart by content (`Reviewed <sha>.`, `[P1]` tags), not by author.
