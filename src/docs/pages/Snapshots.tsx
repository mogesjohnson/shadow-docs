import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (ARM-6,
 * CH-5, M2-AC5), the 2.0 spec's WS-3 and SAFE-8 in
 * docs/legacy/spec/shadow-army-2.0.md, and the v1 README ("Throwaway
 * copies") and CLAUDE.md. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-a-snapshot-is", title: "What a snapshot is" },
  { id: "agy", title: "Why agy always runs in one" },
  { id: "read-violations", title: "Read-violations" },
  { id: "in-v1", title: "In v1" },
];

export function Snapshots({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="A read-only snapshot is a throwaway copy of a soldier's base. Whatever a soldier writes there is discarded and reported."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Snapshots arrive
            with the agy channel (milestone M2).
          </p>
        </Callout>

        <H2 id="what-a-snapshot-is">What a snapshot is</H2>
        <p>
          A snapshot is a copy of the soldier&apos;s base that never merges anywhere. The soldier can read it and run
          things in it, but nothing it writes reaches a branch or your folder. A snapshot is deleted link-safely, like a
          worktree.
        </p>

        <H2 id="agy">Why agy always runs in one</H2>
        <p>
          agy never writes; that is a hard rule. Its own modes do not enforce it: in spike S5 it wrote a file even
          with <code>--mode plan</code>. So Shadow Army enforces it:
        </p>
        <ul>
          <li>Every agy session runs in a read-only snapshot of its base, never in a worktree that merges.</li>
          <li>Any file it writes is discarded and reported as a read-violation.</li>
          <li>
            The checkout guard covers each agy turn, from the moment its message goes in until the turn is over. See{" "}
            <Link href={hrefOf("checkout-guard")}>The checkout guard</Link>.
          </li>
        </ul>

        <H2 id="read-violations">Read-violations</H2>
        <p>
          A read-violation means a soldier that may not write changed something. For agy in its snapshot, the write is
          thrown away and reported. If an agy turn changes your checkout and you answer n on the guard&apos;s
          attribution card, the turn fails as a read-violation too.
        </p>

        <H2 id="in-v1">In v1</H2>
        <p>
          v1 also used throwaway copies for any soldier at <code>auto</code> or <code>full</code> autonomy on a
          read-only task. v2&apos;s spec requires snapshots for agy; other soldiers work in their own worktrees.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
