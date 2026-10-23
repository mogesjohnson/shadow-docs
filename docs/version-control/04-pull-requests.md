# Pull requests

One issue, one focused PR, or several stacked PRs for a large issue. A PR holds only that change: no drive-by fixes and no unrelated files.

## When to open it

Open it as a **draft** as soon as the first commit is pushed, so CI and the PR format check start running. It stays a draft until all required evidence and any human acceptance exist.

```bash
gh pr create --draft --base main --title "#12 Let users reset a forgotten password" --body-file <file>
```

`gh pr create --body` and `--body-file` skip the template file, so the body must contain the template's text, checklist included. For stacked work use `--base <previous-branch>`.

## Title

The same rules as a commit subject, checked by the PR format workflow:

- `#<issue> <Action>` or `[F<n>] <Action>`: imperative, no trailing period.
- At most 72 characters.
- Usually the issue's title turned into an action, or the main commit's subject.

## Body

The template, `.github/pull_request_template.md`, filled in. These parts, in this order:

1. **Behavior:** one or two sentences on the resulting behavior and how it is implemented. Not a list of files, not the story of the session.
2. **`Validation:`** one line or a short paragraph: the checks run, at which commit, their results, CI status, and any material limitation. Be exact and honest.
   - `Validation: at 3f9c2ab, the build, type check and all 212 tests pass; CI passes on ubuntu, macos and windows. Real email delivery was not tested; the mailer is faked in tests.`
   - If something couldn't run (a full suite that times out under load, a platform you don't have), say which parts ran and name what is left to CI.
3. **`Tracking:`** the issue and, for stacked work, the base branch: `Tracking: #12`, or `Tracking: #14 (stacked on claude/12-password-reset, PR #13)`.
4. **`Checklist:`** all 6 boxes from the template, never removed or reworded.
   - Tick a box only for something you actually verified.
   - For an unticked box, say why on the same line: `- [ ] Works on every platform the project supports (CI passes on each). Waiting on CI for this head.`
   - Tick the last box when the PR's draft state follows the rule: a draft while evidence or human acceptance is missing, ready once it all exists.
5. **Attribution:** the last line is the PR attribution line your session gives. For Claude: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

Never put a closing keyword (`closes #12`, `fixes #12`, `resolves #12`) anywhere in the body. Detail goes in comments, not in the body: the body stays short enough to read in ten seconds.

Keep the body current. When the head changes, update `Validation:` with `gh pr edit <n> --body-file <file>`; editing the body also re-runs the PR format check.

## Evidence comment

After pushing, post one comment that maps every acceptance criterion to its evidence at a named commit, and lists the limitations. This is where the detail lives.

```markdown
**AC to evidence (#12)**, at 3f9c2ab

| AC | Evidence |
|---|---|
| AC1: a reset link expires after 30 minutes | `reset.test.ts` "rejects a link 31 minutes old" and "accepts a link 29 minutes old"; both fail on main |
| AC2: an expired link shows "This link has expired" | `reset.test.ts` "shows the expired message" |
| AC3: tests and CI | 212 tests pass locally; CI run 1234567 passes on ubuntu, macos and windows |

**Limitations**
- Real email delivery was not tested; the mailer is faked.

Not verified: the owner's check of the email's wording, which AC2 needs.
```

- Name the test, file or command behind each AC, and say whether the test fails without the change when that matters.
- Say plainly what wasn't verified, and why.
- When the head changes in a way that affects the evidence, post a **new** evidence comment for the new commit. Don't edit the old one.

## Ready for review

When the evidence is posted and the checks pass, hand off with one comment:

```
For Codex: ready for review at 3f9c2ab.
```

If the PR still needs the owner's acceptance, it stays a draft and the comment says what is waiting. Once everything required exists, mark it ready with `gh pr ready <n>`.

## The PR format check

`.github/workflows/pr-format.yml` runs on every PR event (opened, edited, synchronize, reopened, ready for review). It first runs the self-test, then `scripts/check-pr-format.mjs`, which fails when:

- the title isn't `#<issue> <Action>` or `[F<n>] <Action>`, or is longer than 72 characters;
- the body lacks `Validation:`, `Tracking:` or `Checklist:`, or has fewer than 6 checklist boxes;
- the body contains a closing keyword;
- any commit the PR adds breaks the commit rules (format, length, closing keyword).

Fix the text, then edit the PR body to re-run it. A commit message can't be fixed without rewriting history, so a bad commit that reached GitHub is a question for the owner: don't force-push on your own.

## Stacked PRs

- Base the PR on the previous feature branch and name that branch in `Tracking:`.
- Merge them in order, the base PR first. [02-branches.md](02-branches.md) says what happens to the stacked PR after that.
- Keep each stacked PR reviewable on its own: its diff against its base holds only its own work.

## Size

A reviewer should be able to read the whole diff carefully in one sitting. If a PR mixes concerns, or has more than about 5 commits of new work, split it.
