import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (PO-3 to
 * PO-6, WSP-1, WSP-8, SEC-4), docs/claude-first.md (the vault carries
 * over), CLAUDE.md and .gitignore. v2's spec does not yet define army
 * memory; the 2.0 MEM design is legacy. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "whats-inside", title: "What's inside" },
  { id: "rules", title: "The rules it keeps" },
  { id: "memory", title: "Army memory" },
];

export function ShadowVault({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="The .shadow/ folder in your repository holds the army's working files: worktrees, reports and logs. It is never committed."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="whats-inside">What&apos;s inside</H2>
        <Table
          head={["Path", "What it holds"]}
          rows={[
            [
              <code key="p">.shadow/worktrees/</code>,
              "One worktree per soldier per Claude session, as in v1. Soldiers write here, never in your checkout.",
            ],
            [<code key="p">.shadow/reports/</code>, "Each soldier's full reply. Only a five-line summary is sent on."],
            [
              <code key="p">.shadow/v2/logs/</code>,
              "An append-only log for the post office, and one for each soldier's session.",
            ],
          ]}
        />
        <p>
          The vault is working memory for one machine. Shadow Army&apos;s own repository lists <code>.shadow/</code>{" "}
          in <code>.gitignore</code>, and you should do the same in yours.
        </p>

        <H2 id="rules">The rules it keeps</H2>
        <ul>
          <li>
            <strong>Redacted on every write.</strong> <code>redact()</code> runs on every write to logs, records and
            briefs, so they hold no secret, token or credential.
          </li>
          <li>
            <strong>No secrets on disk.</strong> The Monarch&apos;s secret travels only on the post office&apos;s
            standard input. It is never written to a file, a command line or an environment variable.
          </li>
          <li>
            <strong>Soldiers cannot read it through the army.</strong> A soldier&apos;s credential can only send
            messages. It cannot read any session, log or record, its own or another soldier&apos;s.
          </li>
          <li>
            <strong>Work stays when sessions end.</strong> When the Claude session ends, the post office closes every
            soldier session and leaves the worktrees and branches in place.
          </li>
        </ul>
        <Callout kind="warning">
          <p>
            Soldiers run as your user, so a CLI that ignores the army can still open files you can open. The vault
            keeps secrets out of its files instead of relying on file permissions.
          </p>
        </Callout>

        <H2 id="memory">Army memory</H2>
        <p>
          In v1 the vault also held shared notes curated by the Monarch, plus a private folder for each soldier.
          Soldiers never saw each other&apos;s transcripts. The vault carries over into v2, but v2&apos;s
          specification does not yet say how army memory works. This section will be written when it does.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
