// The commit and PR text rules from docs/version-control/, as checks.
// Used by the "PR format" workflow (scripts/check-pr-format.mjs). The commit-msg hook
// (.githooks/commit-msg) applies the same commit rules to every local commit.

/** `#<issue> <Action>` or `[F<n>] <Action>`. */
export const SUBJECT = /^(#[0-9]+|\[F[0-9]+\]) \S/;

/** The longest commit subject or PR title, counting the `#<issue> ` prefix. */
export const MAX_SUBJECT = 72;

/** Subjects git writes for plumbing commits; the format and length rules do not apply. */
const EXEMPT = /^(Merge |fixup! |squash! |Revert )/;

/** Keywords that make GitHub close an issue on merge, before acceptance has been checked. */
const CLOSING = /\b(close[sd]?|fix(e[sd])?|resolve[sd]?):?\s+([\w.-]+\/[\w.-]+)?#[0-9]+/i;

export function checkSubject(subject) {
  if (EXEMPT.test(subject)) return undefined;
  if (!SUBJECT.test(subject)) {
    return `commit subject must look like "#<issue> <Action>" or "[F<n>] <Action>", got: ${subject}`;
  }
  if (subject.length > MAX_SUBJECT) {
    return `commit subject is ${subject.length} characters, over the ${MAX_SUBJECT} limit: ${subject}`;
  }
  return undefined;
}

/** A whole commit message: its subject, and no closing keyword anywhere in it. */
export function checkMessage(message) {
  const problems = [];
  const text = (message ?? "").replace(/\r/g, "");
  const subject = text.split("\n")[0];
  const s = checkSubject(subject);
  if (s) problems.push(s);
  const closing = text.match(CLOSING);
  if (closing) {
    problems.push(`commit "${subject}" contains the closing keyword "${closing[0]}"; refer to the issue without it`);
  }
  return problems;
}

export function checkTitle(title) {
  if (!SUBJECT.test(title)) {
    return `PR title must look like "#<issue> <Action>" or "[F<n>] <Action>", got: ${title}`;
  }
  if (title.length > MAX_SUBJECT) {
    return `PR title is ${title.length} characters, over the ${MAX_SUBJECT} limit: ${title}`;
  }
  return undefined;
}

export function checkBody(body) {
  const problems = [];
  const text = body ?? "";
  for (const label of ["Validation:", "Tracking:", "Checklist:"]) {
    if (!text.includes(label)) problems.push(`PR body is missing "${label}" (see .github/pull_request_template.md)`);
  }
  const boxes = (text.match(/^- \[[ xX]\] /gm) ?? []).length;
  if (boxes < 6) problems.push(`PR body has ${boxes} checklist boxes; the template has 6`);
  const closing = text.match(CLOSING);
  if (closing) {
    problems.push(`PR body contains the closing keyword "${closing[0]}"; write "Tracking: #N" instead`);
  }
  return problems;
}

/** All problems for one PR: its title, its body, and the full messages of its own commits. */
export function checkAll({ title, body, messages }) {
  const problems = [];
  const t = checkTitle(title ?? "");
  if (t) problems.push(t);
  problems.push(...checkBody(body));
  for (const m of messages ?? []) problems.push(...checkMessage(m));
  return problems;
}
