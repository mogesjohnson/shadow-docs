import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): CLAUDE.md, CONTRIBUTING.md,
 * .github/pull_request_template.md, .github/workflows/ci.yml and
 * pr-format.yml, .githooks/commit-msg, scripts/pr-format.mjs and
 * scripts/setup-hooks.mjs. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "branches", title: "Branches" },
  { id: "commits", title: "Commits" },
  { id: "pull-requests", title: "Pull requests" },
  { id: "checks", title: "What the checks reject" },
  { id: "review-and-merge", title: "Review and merge" },
];

const TEMPLATE = [
  "<!-- Title: #<actual issue> or [F<local feature ID>], then a concise action. -->",
  "",
  "Describe the resulting behavior and implementation method in one or two sentences.",
  "",
  "Validation: checks run, results, and any material limitation.",
  "",
  "Tracking: issue or local feature ID. For stacked work, name the required base branch.",
  "",
  "Checklist:",
  "- [ ] Adapters stay isolated: only briefs and reports cross between soldiers.",
  "- [ ] Hard routing rules (Grok never reviews, `agy` never writes) are enforced and tested.",
  "- [ ] Dashboard and `--plain` output both work (for UI changes).",
  "- [ ] Paths and shell calls work on Windows and POSIX (the CI job passes on ubuntu, macos and windows).",
  "- [ ] `npm run build`, `npx tsc --noEmit`, and `npm test` pass.",
  "- [ ] Draft until required evidence or human acceptance is available.",
];

export function CommitsAndPrs({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="How Shadow Army names branches, writes commit messages and pull requests, and which of those rules a hook and a CI check enforce."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. These rules are the ones on shadow-army&apos;s <code>main</code>, and
            every v2 pull request follows them.
          </p>
        </Callout>

        <H2 id="branches">Branches</H2>
        <p>
          <code>&lt;agent-or-author&gt;/&lt;issue-number&gt;-&lt;short-purpose&gt;</code>, for example{" "}
          <code>claude/12-vault-locks</code>. State the base branch in the issue and the pull request. For stacked
          work, the base is the previous feature branch.
        </p>

        <H2 id="commits">Commits</H2>
        <ul>
          <li>
            Subject: <code>#&lt;issue&gt; &lt;concise action&gt;</code>, or <code>[F&lt;n&gt;] &lt;concise
            action&gt;</code> for a local feature ID (<code>[F0]</code> is the repo&apos;s bootstrap docs). Imperative
            mood, and no <code>feat:</code>, <code>fix:</code> or <code>docs:</code> prefix.
          </li>
          <li>
            End every commit message with the attribution trailer the session gives, such as{" "}
            <code>Co-Authored-By: Claude &lt;model&gt; &lt;noreply@anthropic.com&gt;</code>.
          </li>
          <li>
            Stage files by explicit path. Never <code>git add -A</code> or <code>git add .</code>.
          </li>
          <li>
            Never force-push, <code>filter-branch</code> or otherwise rewrite pushed history unless the owner asks for
            it in that session.
          </li>
        </ul>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Commit message",
              lines: [
                "#12 Add the vault lock registry",
                "",
                "Co-Authored-By: Claude <model> <noreply@anthropic.com>",
              ],
            },
          ]}
        />

        <H2 id="pull-requests">Pull requests</H2>
        <ul>
          <li>
            Title: <code>#&lt;issue&gt; &lt;concise action&gt;</code>.
          </li>
          <li>
            Body: one or two sentences on the resulting behaviour and how it is implemented; a short{" "}
            <code>Validation:</code> line with the checks run, their results and any material limitation; a{" "}
            <code>Tracking:</code> line with the issue and, for stacked work, the base branch; then the checklist.
          </li>
          <li>
            <code>gh pr create --body</code> skips the template file, so paste the checklist into the body yourself.
          </li>
          <li>Tick a box only for something actually verified. Leave the rest unticked and say why on the line.</li>
          <li>Put the detailed mapping from each acceptance criterion to its evidence in a comment, not the body.</li>
          <li>
            Write <code>Tracking: #N</code>, never a closing keyword such as <code>closes</code>, <code>fixes</code> or{" "}
            <code>resolves</code>: those close the issue on merge, before acceptance is checked.
          </li>
          <li>
            Open as a draft unless all required evidence and human acceptance exist, and end the body with the
            session&apos;s attribution line.
          </li>
        </ul>
        <p>The template, as shipped:</p>
        <CodeBlock placeholder={false} variants={[{ label: ".github/pull_request_template.md", lines: TEMPLATE }]} />

        <H2 id="checks">What the checks reject</H2>
        <p>
          Two checks enforce the text rules. If either rejects, fix the text; never bypass the hook with{" "}
          <code>--no-verify</code>.
        </p>
        <ul>
          <li>
            <strong>The <code>commit-msg</code> hook</strong>, turned on by <code>npm install</code>, rejects a subject
            that does not start with <code>#&lt;issue&gt; </code> or <code>[F&lt;n&gt;] </code> followed by text.
            Subjects that start with <code>Merge</code>, <code>fixup!</code>, <code>squash!</code> or{" "}
            <code>Revert</code> are exempt.
          </li>
          <li>
            <strong>The <code>PR format</code> workflow</strong> runs on every pull request and rejects:
            <ul>
              <li>a title that does not follow the subject format;</li>
              <li>
                a body without <code>Validation:</code>, <code>Tracking:</code> or <code>Checklist:</code>;
              </li>
              <li>a body with fewer than six checklist boxes;</li>
              <li>
                a body with a closing keyword before an issue number, such as <code>fixes #12</code>;
              </li>
              <li>a commit in the pull request whose subject fails the hook&apos;s rule.</li>
            </ul>
            Edit the pull request&apos;s body to run it again.
          </li>
          <li>
            <strong>CI</strong> runs <code>npx tsc --noEmit</code>, <code>npm run build</code> and{" "}
            <code>npm test</code> on ubuntu, macos and windows, and checks the hook under a real <code>sh</code>.
          </li>
        </ul>

        <H2 id="review-and-merge">Review and merge</H2>
        <ul>
          <li>Codex reviews and merges. Claude does not merge.</li>
          <li>Map each acceptance criterion to evidence, and state anything unresolved plainly.</li>
          <li>
            Close an issue only when its acceptance is complete, and record exactly what was accepted. See{" "}
            <Link href={`${hrefOf("contributing")}#after-merge`}>After a merge</Link>.
          </li>
        </ul>
      </div>

      <FromV1>
        <p>
          The checklist&apos;s third box, &ldquo;Dashboard and <code>--plain</code> output both work&rdquo;, names
          v1&apos;s live dashboard and its plain output. v2 has neither: its screens are the mod&apos;s pane, strip and
          status entry, checked against committed snapshots. The template on <code>main</code> still has the box, and
          this page quotes it as shipped.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
