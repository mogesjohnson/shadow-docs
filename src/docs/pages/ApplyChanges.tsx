import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (WSP-1,
 * WSP-5, WSP-6, WSP-9, MSG-11, PO-7, milestone M6) and docs/claude-first.md.
 * Shadow Army 2 is not released yet; this page describes the accepted
 * design.
 */

const TOC: TocItem[] = [
  { id: "where-work-lives", title: "Where a soldier's work lives" },
  { id: "diff", title: "See the changes" },
  { id: "apply", title: "Apply them" },
  { id: "undo", title: "Undo an apply" },
  { id: "the-card", title: "The facts on the card" },
];

export function ApplyChanges({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="A soldier's work stays on its own branch until you look at it with /diff and copy it into your folder with /apply."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. <code>/diff</code> and <code>/apply</code> arrive with its last milestone
            before release (M6).
          </p>
        </Callout>

        <H2 id="where-work-lives">Where a soldier&apos;s work lives</H2>
        <p>
          Each soldier works in its own git worktree, one per Claude session, and never edits your checkout directly.
          Files travel only through its branch. When the Claude session ends, the worktrees and branches stay.
        </p>
        <p>
          New work starts from your folder as it is, so a follow-up brief sees changes you applied earlier.
        </p>

        <H2 id="diff">See the changes</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/diff Igris"] }]} />
        <p>
          <code>/diff &lt;soldier&gt;</code>, or d in the soldier&apos;s pane, shows its changes on its branch since
          its base.
        </p>

        <H2 id="apply">Apply them</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/apply Igris"] }]} />
        <p>
          <code>/apply &lt;soldier&gt;</code> copies the soldier&apos;s changes into your folder,{" "}
          <strong>all or nothing</strong>:
        </p>
        <ul>
          <li>Before writing, the apply copies the bytes of every file it will touch, and the git index.</li>
          <li>
            On any failure, even one after its check has passed, it restores them exactly and removes the files it
            created.
          </li>
          <li>If the restore itself fails, the report names every file still changed.</li>
        </ul>
        <Callout kind="warning">
          <p>
            Shadow Army does not assume <code>git apply</code> is atomic. It checks and restores the files itself, so
            a failed apply never leaves the folder partly changed.
          </p>
        </Callout>

        <H2 id="undo">Undo an apply</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/apply undo"] }]} />
        <p>
          <code>/apply undo</code> undoes the last apply, with the same all-or-nothing rule. Nothing is deleted or
          reverted through a link.
        </p>

        <H2 id="the-card">The facts on the card</H2>
        <p>
          From the same milestone, a soldier&apos;s summary card states facts from the post office&apos;s own records,
          never from the summary&apos;s text:
        </p>
        <Table
          head={["Fact", "What it says"]}
          rows={[
            ["changes", "The files and lines the turn changed on the soldier's branch, or “none”"],
            [
              "tests",
              "Whether a test command ran in the turn and whether it passed, or “not run”. Test commands match the soldier's tests patterns: by default npm test, npx vitest, pytest, cargo test and go test",
            ],
            ["applied", "“not yet”, or when the changes were applied to your folder"],
          ]}
        />
        <p>
          The card also gives the report&apos;s path and the commands that act on the work. A summary that claims
          tests passed when none ran still shows &ldquo;not run&rdquo;.
        </p>
      </div>
      <FromV1>
        <ul>
          <li>
            <code>/diff</code> and <code>/apply</code> carry over v1&apos;s <code>sa apply</code>: applying a
            soldier&apos;s work is still all-or-nothing, and it can still be undone.
          </li>
          <li>
            v1 assumed <code>git apply</code> is atomic, so a failed apply could leave the folder partly changed. v2
            does not make that assumption.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
