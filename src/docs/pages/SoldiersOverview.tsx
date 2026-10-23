import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, SoldierDot, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry, type Soldier } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (CH-2 to
 * CH-10, PO-4, SES-2, ARM-2, ARM-3, ARM-6), ADR-0009, ADR-0010 and
 * docs/claude-first.md. The soldier colours are the placeholder mapping in
 * docs/PLAN.md, still open for the owner. Shadow Army 2 is not released
 * yet.
 */

const TOC: TocItem[] = [
  { id: "four-clis", title: "Four CLIs, four channels" },
  { id: "compared", title: "Side by side" },
  { id: "what-stays-the-same", title: "What every soldier shares" },
];

const CLIS: { soldier: Soldier; slug: string; name: string; who: string }[] = [
  { soldier: "claude", slug: "claude", name: "Claude", who: "Iron, Kaisel, Tank" },
  { soldier: "codex", slug: "codex", name: "Codex", who: "Igris, Bellion" },
  { soldier: "grok", slug: "grok", name: "Grok", who: "Beru" },
  { soldier: "agy", slug: "agy", name: "agy", who: "Tusk" },
];

export function SoldiersOverview({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Shadow Army 2 talks to each CLI through that CLI's own live-session interface. This page compares the four."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. The claude channel
            comes first (milestone M1), then codex, grok and agy (M2).
          </p>
        </Callout>

        <H2 id="four-clis">Four CLIs, four channels</H2>
        <p>
          No third-party adapter sits between the post office and a vendor&apos;s CLI. Each CLI has one small adapter
          in Shadow Army, and all four share one interface. Toward Claude and the mod, the post office offers one
          interface shaped like ACP.
        </p>
        <Table
          head={["CLI", "Soldiers", "Page"]}
          rows={CLIS.map(({ soldier, slug, name, who }) => [
            <span key="n" className="sd-cell-soldier">
              <SoldierDot soldier={soldier} />
              <code>{slug}</code>
            </span>,
            who,
            <Link key="l" href={hrefOf(slug)}>
              {name}
            </Link>,
          ])}
        />

        <H2 id="compared">Side by side</H2>
        <Table
          head={["", "claude", "codex", "grok", "agy"]}
          rows={[
            ["Live channel", "stream-json", "app-server", "ACP", "stream-json"],
            ["Instructions", "--append-system-prompt", "developerInstructions", "_meta.rules", "first message"],
            ["Turn end", "result", "turn/completed", "session/prompt answer", "result"],
            ["Approvals", "can_use_tool", "requestApproval", "session/request_permission", "none (soft-denies)"],
            ["Interrupt", "interrupt", "turn/interrupt", "session/cancel", "being checked"],
            ["Resume", "--resume", "thread/resume", "session/load", "--conversation"],
            ["send tool", "--mcp-config", "thread/start", "mcpServers", "none in v2.0"],
            ["Writes", "yes", "yes", "yes", "never"],
            ["Reviews", "yes", "yes", "never", "no"],
          ].map((row) => row.map((cell, i) => (i === 0 ? cell : <code key={i}>{cell}</code>)))}
        />
        <p>
          The soldier colours on these pages are a placeholder choice for now: claude orange, codex green, grok blue and
          agy pink.
        </p>

        <H2 id="what-stays-the-same">What every soldier shares</H2>
        <ul>
          <li>
            <strong>The vendor&apos;s harness, whole.</strong> No system prompt is replaced, no tool removed, no
            safeguard disabled.
          </li>
          <li>
            <strong>One live session</strong> per soldier per Claude session, in its own worktree (agy: a read-only
            snapshot).
          </li>
          <li>
            <strong>The same standing instructions</strong>, under 1,500 tokens.
          </li>
          <li>
            <strong>A meter</strong> read from the CLI&apos;s own numbers.
          </li>
          <li>
            <strong>Stops that keep the session.</strong> A CLI with no interrupt is ended and resumed by id.
          </li>
        </ul>
        <p>
          See <Link href={hrefOf("adapter-protocol")}>Adapter protocol</Link> for the interface every adapter
          implements.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
