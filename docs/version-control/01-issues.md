# Issues

Every change starts with an issue. The issue says what will be true when the work is done and how anyone can check it. The PR proves it, and the issue closes only when that proof is accepted.

## One issue, one feature

- One feature or one fix per issue. Two unrelated changes are two issues.
- Large work gets a tracking issue (the design and the plan) plus one issue per milestone, each with its own acceptance criteria. The tracking issue lists them.
- The issue number is the ID used everywhere: the branch, the commits, the PR title and the `Tracking:` line.
- Work that has no GitHub issue uses a local feature ID `[F<n>]` from the project's plan in place of `#<issue>`. `[F0]` is reserved for bootstrapping the repository (README, these rules) before it is on GitHub.

## Title

An imperative sentence describing the result. No prefix: the number is the ID.

- Good: `Let users reset a forgotten password`, `Count cached input tokens`, `Show the API's own reason in its error message`
- Bad: `[Feature] password reset`, `Bug in login`, `Fixes for #12`

If the project numbers its planned features, you may prefix the local ID: `[F3] Add the settings page`.

## Body

The issue template, `.github/ISSUE_TEMPLATE/feature.md`, has four sections in this order. `gh issue create --body` and `--body-file` don't apply the template, so write all four yourself.

### Goal

What is wrong or missing, and why it matters, with evidence: the file and function, numbers, what a user sees, links to documentation. For a bug: what happens now, how to reproduce it, and what should happen instead.

### Acceptance criteria

Numbered `AC1`, `AC2`, ... Each one is a single statement someone can check, with an observable result. Write each so that a test or a command can prove it.

- Good: `AC1: A reset link expires 30 minutes after it is sent, and opening an expired link shows "This link has expired".`
- Bad: `AC1: Password reset works well.`

Rules:

- The last AC usually covers the checks: which tests exist, that the project's build and tests pass, and that CI passes on every platform the project supports.
- If an AC needs the owner's own check (a real terminal, a live service, a run that costs money, a visual check), say so in the AC. The PR stays a draft until the owner records that check.
- Keep the IDs stable once work has started, because evidence and reviews refer to them. If the scope changes, edit the issue, add new IDs instead of renumbering, and say what changed in a comment.

### Out of scope

What this issue deliberately doesn't do, so nobody adds it and no reviewer asks for it.

### Implementation and PR handoff

This block, word for word, with the branch line filled in:

```
Branch: <author>/<actual issue number>-<short-purpose>; base <specified branch>.
Push a focused PR. Map each AC ID to evidence and state any unresolved item plainly.
Leave the PR draft when required evidence or human acceptance is still missing.
Codex reviews and merges; Claude does not merge or close the issue by assertion.
```

For example `Branch: claude/12-password-reset; base main.` For stacked work the base is the previous feature branch: `Branch: claude/14-reset-emails; base claude/12-password-reset.`

## Labels

| Label | For |
|---|---|
| `feature` | New behavior. The issue template adds it. |
| `bug` | Wrong behavior. |
| `documentation` | Changes to documentation only. |
| `legacy` | Work on a retired release line (see [10-releases.md](10-releases.md)). |

## Creating an issue

Write the body to a file outside the repository (a scratch folder), then:

```bash
gh issue create --title "Let users reset a forgotten password" --label feature --body-file <file>
```

Creating the issue gives its number. If the handoff block was written before the number was known, fix it right away with `gh issue edit <n> --body-file <file>`.

## While the work is open

- Comment at milestones only: what now works, the evidence, what remains, and blockers (see [09-progress-and-handoffs.md](09-progress-and-handoffs.md)).
- Record the owner's decisions on the issue, with the date: `Owner decided on 2026-10-07: links expire after 30 minutes.`
- Closing is covered in [07-closing-issues.md](07-closing-issues.md). Never close an issue through a closing keyword in a PR or a commit.
