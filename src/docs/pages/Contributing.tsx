import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader } from "../blocks";
import { DOCS_REPO_URL, hrefOf, neighbours, REPO_URL, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): CONTRIBUTING.md, CLAUDE.md,
 * package.json (scripts, engines), .github/ISSUE_TEMPLATE/feature.md,
 * .github/workflows/ci.yml and .gitignore; and this repo's CONTRIBUTING.md
 * for the docs. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "how-work-is-done", title: "How work is done" },
  { id: "ground-rules", title: "Ground rules" },
  { id: "set-up", title: "Set up" },
  { id: "issues", title: "Write an issue" },
  { id: "after-merge", title: "After a merge" },
  { id: "shared-tree", title: "A shared working tree" },
  { id: "these-docs", title: "Contribute to these docs" },
];

export function Contributing({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Shadow Army is built one feature at a time: every change has an issue, a branch and a focused pull request."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page follows the rules on shadow-army&apos;s <code>main</code>, which
            apply to v2 work under{" "}
            <a href={`${REPO_URL}/issues/63`} target="_blank" rel="noreferrer">
              issue #63
            </a>
            .
          </p>
        </Callout>

        <H2 id="how-work-is-done">How work is done</H2>
        <ul>
          <li>
            <strong>One feature, one issue, one pull request.</strong> Keep pull requests focused. Stacked work names
            the branch it must be based on.
          </li>
          <li>
            <strong>The owner</strong> decides scope and gives human acceptance. <strong>Claude</strong> usually writes
            the issue, the branch, the commits and the pull request, and fixes review findings.{" "}
            <strong>Codex</strong> reviews and merges.
          </li>
          <li>
            Claude does not merge, and does not close an issue by saying it is done. An issue closes when its acceptance
            is checked.
          </li>
        </ul>
        <p>
          The rules for branches, commit messages and pull requests are on{" "}
          <Link href={hrefOf("commits-and-prs")}>Commits and pull requests</Link>.
        </p>

        <H2 id="ground-rules">Ground rules</H2>
        <ul>
          <li>
            <strong>Soldiers stay isolated.</strong> No adapter may read another soldier&apos;s transcript or private
            Vault directory. Only briefs and reports cross between soldiers.
          </li>
          <li>
            <strong>Keep the orchestrator thin.</strong> Shadow Army routes work, tracks who owns what, and records
            history. Behaviour that belongs to a model or a CLI stays there. Before adding orchestration logic, check
            each CLI for a flag, setting, event or output format that already does it, and pass that through.
          </li>
          <li>
            <strong>Hard rules are code.</strong> Grok never reviews and agy never writes, and the code enforces it. A
            delegate file can only restrict a soldier, never grant it more. See{" "}
            <Link href={hrefOf("hard-rules")}>Hard rules</Link>.
          </li>
          <li>
            <strong>Vendor harnesses stay whole.</strong> Autonomy only chooses each vendor&apos;s own flags, and
            Shadow Army never adds or removes a vendor safeguard by itself.
          </li>
          <li>
            <strong>Cross-platform.</strong> Windows and POSIX paths and shells both work.
          </li>
        </ul>

        <H2 id="set-up">Set up</H2>
        <p>Shadow Army needs Node 20 or later; CI uses Node 22.</p>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Terminal",
              lines: [
                "npm install           # also points git at the tracked hooks in .githooks/",
                "npm run build",
                "npx tsc --noEmit",
                "npm test              # vitest",
              ],
            },
          ]}
        />
        <p>
          <code>npm install</code> runs the <code>prepare</code> script, which turns on the <code>commit-msg</code>{" "}
          hook. CI runs the same checks on ubuntu, macos and windows.
        </p>

        <H2 id="issues">Write an issue</H2>
        <p>Every feature gets an issue, from the Feature template, with four sections:</p>
        <ol>
          <li>
            <strong>Goal</strong>: what the change is for.
          </li>
          <li>
            <strong>Acceptance criteria</strong>, numbered AC1, AC2, and so on. The pull request maps each one to
            evidence.
          </li>
          <li>
            <strong>Out of scope</strong>.
          </li>
          <li>
            <strong>Implementation and PR handoff</strong>, which ends with this block:
          </li>
        </ol>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Handoff block",
              lines: [
                "Branch: <author>/<actual issue number>-<short-purpose>; base <specified branch>.",
                "Push a focused PR. Map each AC ID to evidence and state any unresolved item plainly.",
                "Leave the PR draft when required evidence or human acceptance is still missing.",
                "Codex reviews and merges; Claude does not merge or close the issue by assertion.",
              ],
            },
          ]}
        />
        <p>
          <code>gh issue create --body-file</code> skips the template, so write all four sections yourself.
        </p>

        <H2 id="after-merge">After a merge</H2>
        <ul>
          <li>Check GitHub&apos;s merged state and the merge commit.</li>
          <li>
            Close the issue only when its acceptance is complete, and record exactly what was accepted. If something was
            not checked, such as POSIX or a real terminal, say so in a comment on the issue.
          </li>
          <li>Record progress on the issue or pull request at milestones, not once per step.</li>
          <li>Do not open a replacement feature by yourself when an issue closes.</li>
        </ul>

        <H2 id="shared-tree">A shared working tree</H2>
        <ul>
          <li>
            Codex may check out pull request branches in the same folder. Run <code>git branch --show-current</code>{" "}
            and <code>git status</code> before you start and before every commit.
          </li>
          <li>
            Stage files by explicit path, never <code>git add -A</code> or <code>git add .</code>: other agents leave
            untracked files in the tree.
          </li>
          <li>
            Do not commit files you did not write, such as <code>.review-*.md</code>. <code>.shadow/</code>, the Shadow
            Vault, is working memory and is never committed.
          </li>
        </ul>

        <H2 id="these-docs">Contribute to these docs</H2>
        <p>
          These docs live in their own repository,{" "}
          <a href={DOCS_REPO_URL} target="_blank" rel="noreferrer">
            mogesjohnson/shadow-docs
          </a>
          , and follow the same process. &ldquo;Suggest edits&rdquo; and &ldquo;Raise issue&rdquo; at the end of each
          page go there. Facts come from shadow-army&apos;s <code>main</code>, and each page names its sources in a
          comment at the top of its file.
        </p>
      </div>

      <FromV1>
        <p>
          <code>CONTRIBUTING.md</code> still describes adding a soldier the v1 way: implement the{" "}
          <code>Adapter</code> interface in <code>src/adapters/Adapter.ts</code>, declare its capabilities, and add it
          to <code>shadow.config.json</code> and <code>orchestratorDelegate.md</code>, with{" "}
          <code>sa adapter new</code> planned to scaffold it. For what v2 requires of a new CLI, see{" "}
          <Link href={hrefOf("new-adapter")}>Write a new adapter</Link>.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
