<!-- Title: #<actual issue> or [F<local feature ID>], then a concise action. At most 72 characters. -->

Describe the resulting behavior and implementation method in one or two sentences.

Validation: checks run, results, and any material limitation.

Tracking: issue or local feature ID. For stacked work, name the required base branch.

Checklist:
- [ ] Focused: only this issue's change, with no unrelated files, generated output or secrets.
- [ ] Each acceptance criterion is mapped to evidence in a PR comment, and anything unverified is named.
- [ ] The project's own rules (CLAUDE.md, AGENTS.md) still hold, and any hard rule is enforced and tested.
- [ ] Works on every platform the project supports (CI passes on each).
- [ ] The project's build, type check and tests pass (the commands are under Commands in CLAUDE.md).
- [ ] Draft until required evidence or human acceptance is available.
