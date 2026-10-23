# Releases

The owner decides when to release. Get the owner's go-ahead before pushing a tag or publishing a release: both are visible to everyone with access to the repository, and neither can be quietly taken back.

## Versions

`v<major>.<minor>.<patch>`, following semantic versioning: `v1.0.0`, `v1.0.1`, `v1.1.0`, `v2.0.0`.

- **patch:** fixes only; nothing a user has to change;
- **minor:** new behavior that stays compatible;
- **major:** a breaking change, or a new line of the product.

## Tag

An annotated tag on a commit of `main`, normally a merge commit, with a one-line summary:

```bash
git fetch origin
git tag -a v1.0.1 -m "v1.0.1: the last fixes to the per-message CLI" <merge-commit-sha>
git push origin v1.0.1
```

Never move, re-point or delete a pushed tag. A mistake gets a new version.

## GitHub release

```bash
gh release create v1.0.1 --verify-tag --title "v1.0.1: <short summary>" --notes-file <notes.md>
```

The release notes, in this shape:

```markdown
<One or two sentences: what this release is, and where work continues.>

## Added

- **<Topic>:** what a user can now do (#<issue>, PR #<pr>).

## Fixed

- **<Topic>:** what was wrong, and what happens now (#<issue>, PR #<pr>).

## Documented

- <What was written down, and where> (PR #<pr>).

## Known limits

- <A limit a user will meet, with its tracking issue> (#<issue>).
```

Leave out empty sections, but always include **Known limits**, even if it says "None known."

## Retiring a line

When a major version is finished and work moves to the next one:

- create a `legacy/v<N>` branch at its final tag: `git branch legacy/v1 v1.0.1`, then `git push origin legacy/v1`;
- label its remaining issues `legacy`;
- move its design documents under `docs/legacy/` in a normal PR;
- delete merged feature branches, so the repository shows only `main` and the `legacy/*` branches.
