import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (WSP-1,
 * WSP-3, WSP-6, WSP-7, ARM-5, ARM-6, PO-7, PO-8, section 3),
 * docs/claude-first.md, and the 2.0 spec's SAFE-8, SAFE-9 and SAFE-11 in
 * docs/legacy/spec/shadow-army-2.0.md, which v2 carries over. Shadow
 * Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "one-worktree", title: "One worktree per soldier" },
  { id: "where-work-starts", title: "Where work starts" },
  { id: "link-safety", title: "Link safety" },
  { id: "harness-git", title: "No soldier code during harness git" },
];

export function Worktrees({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Each soldier writes in its own git worktree, so parallel work never collides on disk and your checkout stays yours."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. Worktrees arrive in v2&apos;s last milestone before release (M6). This
            page describes the accepted design.
          </p>
        </Callout>

        <H2 id="one-worktree">One worktree per soldier</H2>
        <ul>
          <li>
            Each soldier has one worktree per Claude session, under <code>.shadow/worktrees/</code>, and its live
            session runs there.
          </li>
          <li>
            A soldier writes only in its own worktree, only with the build role, and only inside its claims. See{" "}
            <Link href={hrefOf("file-claims")}>File claims</Link>.
          </li>
          <li>
            Files travel only through the soldier&apos;s branch. Messages carry words, never file contents, so nothing
            a soldier writes reaches another model or your folder by any other route.
          </li>
          <li>
            When the Claude session ends, the post office closes every soldier session and leaves the worktrees and
            branches in place.
          </li>
        </ul>
        <p>
          agy is the exception: it never gets a worktree that merges. Every agy session runs in a throwaway read-only
          snapshot. See <Link href={hrefOf("snapshots")}>Read-only snapshots</Link>.
        </p>

        <H2 id="where-work-starts">Where work starts</H2>
        <p>
          Work starts from your folder as it is, not from your last commit. A follow-up brief sees changes you applied
          earlier, even before you commit them.
        </p>

        <H2 id="link-safety">Link safety</H2>
        <p>
          A soldier can leave symlinks or Windows junctions in its worktree. Nothing Shadow Army deletes or reverts
          ever goes through one:
        </p>
        <ul>
          <li>
            To delete a worktree or snapshot, it first unlinks every symlink and junction inside without following
            it, then deletes the folder.
          </li>
          <li>Before it runs git in a worktree, it unlinks the links a soldier left, except tracked links it can trust.</li>
          <li>A write, delete or revert by path refuses any path that passes through a link.</li>
          <li>It never runs <code>git worktree prune</code>, which would also drop the records of your own worktrees.</li>
        </ul>

        <H2 id="harness-git">No soldier code during harness git</H2>
        <p>
          While Shadow Army runs git in a soldier&apos;s worktree, none of that soldier&apos;s code runs. Background
          work a turn left running counts as the soldier&apos;s code, so harness git waits until it has ended or been
          stopped. A session service, such as a plugin&apos;s language server, does not count, and harness git never
          waits for one.
        </p>
      </div>
      <FromV1>
        <ul>
          <li>Worktrees carry over from v1 (ADR-0013).</li>
          <li>
            v1 started every run from the last commit, so a follow-up goal could not build on uncommitted results. v2
            starts work from your folder as it is.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
