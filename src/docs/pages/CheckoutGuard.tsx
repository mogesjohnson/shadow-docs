import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (WSP-4,
 * ARM-6, PO-8, MSG-3, MSG-4, HOST-5, HOST-14), the 2.0 spec's GUARD-1 to
 * GUARD-4 in docs/legacy/spec/shadow-army-2.0.md, which WSP-4 carries
 * over, and the v1 README. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-it-watches", title: "What it watches" },
  { id: "when-it-runs", title: "When it runs" },
  { id: "trusted-changes", title: "Trusted changes" },
  { id: "the-card", title: "The attribution card" },
];

export function CheckoutGuard({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="The checkout guard notices anything that changes your repository outside the soldiers' worktrees during a turn, and asks you whose change it was."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. It covers agy from milestone M2 and every
            soldier from M6.
          </p>
        </Callout>

        <H2 id="what-it-watches">What it watches</H2>
        <p>
          Everything in your repository outside a soldier&apos;s own worktree: your files, and git&apos;s refs. Some
          files are hashed even when git ignores them, because a change to them could run code or change the rules:
        </p>
        <ul>
          <li>
            git&apos;s config, hooks, <code>info/</code> and worktree records;
          </li>
          <li>
            <code>.githooks/</code>, <code>.claude/</code>, <code>.mcp.json</code> and <code>.env*</code>;
          </li>
          <li>
            <code>AGENTS.md</code>, <code>CLAUDE.md</code> and the policy files;
          </li>
          <li>
            <code>.github/workflows/</code>;
          </li>
          <li>global git config and the vendors&apos; home configs.</li>
        </ul>

        <H2 id="when-it-runs">When it runs</H2>
        <ul>
          <li>
            A turn&apos;s guard opens when its message goes in, and closes once the turn is over: after its end event
            and any background work it started, or once its process tree has been ended.
          </li>
          <li>It closes once per turn, before the session resumes or the next message goes in.</li>
          <li>
            A change made after the turn is over belongs to no turn, so your own edits between turns are never
            flagged.
          </li>
        </ul>

        <H2 id="trusted-changes">Trusted changes</H2>
        <p>During a turn, a change to your checkout is trusted only when records explain it:</p>
        <ul>
          <li>Shadow Army&apos;s own journaled applies and undos;</li>
          <li>
            the Monarch&apos;s edits through Claude Code&apos;s file tools, which the mod records from Claude
            Code&apos;s tool hooks with each file&apos;s hash before and after.
          </li>
        </ul>
        <p>
          A path is trusted only if these records explain every change to it during the turn. Your own edits and the
          Monarch&apos;s shell commands leave no such record, so their changes go to you on a card.
        </p>

        <H2 id="the-card">The attribution card</H2>
        <p>
          Every other change goes on an attribution card, with each path and its diff. The card joins your decisions,
          and the soldier&apos;s queue is held until you answer.
        </p>
        <Table
          head={["Key", "Answer"]}
          rows={[
            [<code key="k">y</code>, "The changes are yours. Exactly the hashes shown are trusted."],
            [
              <code key="k">n</code>,
              "Fail the turn. Its message ends as interrupted; for agy it is a read-violation.",
            ],
          ]}
        />
        <p>The turn&apos;s summary waits for your answer.</p>
      </div>
      <FromV1>
        <ul>
          <li>The checkout guard carries over from v1 (ADR-0013).</li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
