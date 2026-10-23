# Contributing

This project is built one change at a time. Every change has an issue, a branch, and a focused pull request. This page is the short version; the full process, with a worked example, is in [docs/version-control/](docs/version-control/README.md).

## Roles

- **Owner:** decides scope, gives human acceptance (a check only a person can do), and may merge.
- **Author** (usually Claude): writes the issue, the branch, the commits and the PR, and fixes review findings.
- **Reviewer** (usually Codex): reviews each PR at an exact commit, reports findings, merges approved PRs, and records acceptance on the issue.

## Ground rules

- **One feature, one issue, one PR.** Keep PRs focused. Stacked work names its required base branch.
- **Acceptance is checked, not asserted.** Every issue has acceptance criteria (AC1, AC2, ...). The PR maps each one to evidence, and the issue closes only when acceptance is complete.
- **History is never rewritten.** No force-pushes; no rebasing, amending or squashing pushed commits. A branch catches up by merging `main`.
- **The text rules are enforced.** A commit-msg hook and the `PR format` check reject a malformed or too-long subject, a PR body that doesn't follow the template, and closing keywords. Fix the text; never bypass them.

## Setup, once per clone

```bash
node scripts/setup-hooks.mjs
```

It points git at `.githooks/`, and sets `core.commentChar` to `;` so subjects that start with `#` survive when a message is written in an editor. Node projects run it from `npm install`. Without Node: `git config core.hooksPath .githooks` and `git config core.commentChar ";"`.

## Branches

`<agent-or-author>/<issue-number>-<short-purpose>`, for example `claude/12-password-reset`. State the base branch in the issue and PR. For stacked work the base is the previous feature branch.

## Commits

`#<issue> <Action>` or `[F<n>] <Action>`: imperative, at most 72 characters, no trailing period, no `feat:`-style prefix. An optional body, wrapped at 72 columns, says what changes and why. Usually 1 to 3 commits per PR. Details: [03-commits.md](docs/version-control/03-commits.md).

## Pull requests

Title: `#<issue> <concise action>` or `[F<n>] <concise action>`, at most 72 characters.

The PR template (`.github/pull_request_template.md`) asks for:

1. **Behavior:** one or two sentences on the resulting behavior and how it is implemented.
2. **Validation:** checks run, results, and any material limitation.
3. **Tracking:** the issue or local feature ID. For stacked work, the required base branch.
4. **Checklist:** the template's 6 boxes, each ticked only when verified.

Leave the PR as a **draft** while required evidence or human acceptance is missing. Map each AC to evidence in a PR comment. Details: [04-pull-requests.md](docs/version-control/04-pull-requests.md).

## Issue handoff block

Every implementation issue ends with:

```
Branch: <author>/<actual issue number>-<short-purpose>; base <specified branch>.
Push a focused PR. Map each AC ID to evidence and state any unresolved item plainly.
Leave the PR draft when required evidence or human acceptance is still missing.
Codex reviews and merges; Claude does not merge or close the issue by assertion.
```

## Tracking progress

- Record progress on the issue or PR at **milestones**: implemented behavior, evidence, remaining work, blockers. Do not post one update per tool call.
- A long-session checkpoint keeps: issue URL, branch/head, changed files, decisions, tests and results, blockers, and the next concrete action.

## After merge

- Verify GitHub's merged state and commit.
- Update or close the issue only when its acceptance is actually complete. Record the exact acceptance scope; for example, "minimum basic playability" is not "all future scenarios passed".
- Keep any inventory or proposal status consistent.
- Do not automatically generate a replacement feature when an issue closes.
