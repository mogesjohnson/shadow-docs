import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (WSP-2,
 * ARM-5, PO-8, M6-AC2), docs/claude-first.md (what carries over), the v1
 * README ("How the army avoids stepping on itself"), and v1's
 * src/workspace/claims.ts and src/workspace/locks.ts. Shadow Army 2 is
 * not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-a-claim-is", title: "What a claim is" },
  { id: "leases", title: "Leases" },
  { id: "the-audit", title: "The claim audit" },
];

export function FileClaims({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="A writing soldier claims the paths it may change. Two soldiers never hold overlapping claims, and an audit checks every writing turn against them."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. Claims, leases and the claim audit carry over from v1 and arrive in
            v2&apos;s last milestone before release (M6). Details below are v1&apos;s, unless v2&apos;s spec changes
            them.
          </p>
        </Callout>

        <H2 id="what-a-claim-is">What a claim is</H2>
        <p>A claim is a path or glob relative to the repository root:</p>
        <Table
          head={["Claim", "Covers"]}
          rows={[
            [<code key="c">src/auth/**</code>, "Everything under src/auth"],
            [<code key="c">src/auth</code>, "The same: a literal path also covers everything under it"],
            [<code key="c">docs/</code>, "The whole docs folder"],
            [<code key="c">README.md</code>, "One file"],
          ]}
        />
        <p>
          On Windows and macOS, where file systems ignore case by default, a claim matches either spelling. Two claims
          overlap when one&apos;s fixed prefix is a prefix of the other&apos;s. The check is deliberately cautious: it
          may report an overlap that does not exist, but never misses a real one.
        </p>

        <H2 id="leases">Leases</H2>
        <ul>
          <li>Only writers take leases. Reading is never blocked.</li>
          <li>A lease is granted only if its claims overlap no other live lease.</li>
          <li>
            A lease lasts 90 seconds unless it is renewed, so a crashed soldier cannot hold files forever. A conflict
            names the soldier that holds the files and until when.
          </li>
        </ul>

        <H2 id="the-audit">The claim audit</H2>
        <p>
          When a writing turn is over, the files the soldier changed are compared with its claims. The list comes from
          git, not from the soldier&apos;s own account. Edits outside the claims are undone and reported.
        </p>
        <ul>
          <li>The audit runs once per turn, before the soldier&apos;s next message.</li>
          <li>It waits for any background work the turn left running.</li>
          <li>
            It also runs for a turn that was cut short or that its CLI reported as failed. The changes stay in the
            soldier&apos;s worktree.
          </li>
          <li>It never writes or deletes through a link.</li>
        </ul>
        <Callout kind="warning">
          <p>
            Rules in a brief, <code>rules.md</code> and <code>agent.md</code> are instructions. The claim audit and the
            checkout guard are what is enforced.
          </p>
        </Callout>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
