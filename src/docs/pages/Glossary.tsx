import Link from "next/link";
import type { ReactNode } from "react";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (section 2,
 * and the requirements that define the other terms), ADR-0008 to ADR-0015
 * and the v1 README. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "terms", title: "Terms" },
  { id: "names", title: "Shadow names" },
];

const terms: [string, ReactNode][] = [
  [
    "Adapter",
    <>
      The code that runs one CLI as a soldier. All adapters share one interface. See{" "}
      <Link href={hrefOf("adapter-protocol")}>Adapter protocol</Link>.
    </>,
  ],
  ["Attribution card", "A card that lists the changes to the checkout during an agy turn that no record explains, with each path and its diff. y says they are yours; n fails the turn."],
  ["Autonomy", "How freely a soldier acts: supervised, auto or full. Each level picks only the vendor's documented flags."],
  ["Brief", "A message that assigns work. Only the Monarch sends one."],
  ["Channel", "The post office's connection to one soldier, through that CLI's own live-session interface."],
  ["Checkout guard", "Fails a turn when anything outside the soldier's own workspace changed in the repository, and lists it."],
  ["Claim", "A file, directory or glob a writing soldier may change. The claim audit reverts and reports edits outside it."],
  ["Cold", "A session idle longer than its provider keeps the prompt cache, or changed in a way its CLI documents as resetting it. Always an estimate, made before a message goes."],
  ["Context size", "The input tokens, cached ones included, of the session's most recent main model request. A subagent's call never counts."],
  ["Decisions", "Everything that waits on you, in one list, oldest first. It is the pane's first tab."],
  ["Handoff line", "The context size at which a soldier hands off: 200,000 tokens by default, set per soldier with handoffAt."],
  ["Handoff summary", "What a soldier writes at the handoff line: working on, done, decided, files, open."],
  ["Hard rules", "Grok never reviews, and agy never writes. Enforced when a brief is sent and by each adapter's capabilities."],
  ["Held queue", "A queue that waits for you instead of going by itself: after a stop, and while a handoff or attribution card is open."],
  ["Kind", "The kind of work a brief asks for: build, review, research or test."],
  ["Live session", "One open conversation in a soldier's CLI. Each message adds one turn."],
  ["Meter", "The bar that shows a soldier's context size against its handoff line, with steps at 30, 50, 70 and 90%."],
  ["Mod", "Shadow Army's Claude Code plugin: a pane, an army strip, a status entry, toasts, commands and tools."],
  ["Monarch", "Your own Claude Code session, which leads the army."],
  ["Pane", "The mod's screen with one tab for each soldier, opened when asked for or when a soldier needs you."],
  ["Post office", "The local helper process that holds the soldiers' sessions and carries messages between them. It binds only the loopback address."],
  ["Queue", "The messages waiting for a soldier's next turn, first in, first out."],
  ["Read-violation", "A file an agy turn wrote in its snapshot. It is discarded and reported."],
  ["Report", "A soldier's full reply, kept on disk under .shadow/reports/."],
  ["Roles", "What a soldier may be asked to do: build, review, research or test."],
  ["Shadow Vault", "The .shadow/ folder: worktrees, reports and logs, working memory for one machine."],
  ["Snapshot", "A read-only copy of the base that every agy session runs in."],
  ["Soldier", "One configured CLI and model, with a shadow name."],
  ["Standing instructions", "What a soldier is told once per session: who it is, the team, the rules and the reply format."],
  ["Start fresh", "Closing a session and opening a new one with the standing instructions. The soldier's branch is left alone."],
  ["Stop", "Ending a soldier's running turn while its session stays open with its history."],
  ["Strip", "The army strip: one line above the prompt with every soldier's state glyph, name and meter."],
  ["Summary", "A reply of at most five lines."],
  ["Tag", "A soldier's two-letter short name, unique in the army."],
  ["Turn", "One message and the soldier's work on it. A turn ends once, and only when the work it started has stopped."],
  ["Worktree", "A soldier's own checkout and branch, where it writes. One for each soldier for each Claude session."],
];

const names: [string, string, string][] = [
  ["Bellion", "codex-astra", "Reviews and hard builds"],
  ["Igris", "codex-sol", "Builds"],
  ["Kaisel", "claude-opus", "Reviews and hard builds"],
  ["Tank", "claude-opus-build", "Not yet defined in the shipped files"],
  ["Iron", "claude-sonnet", "Builds"],
  ["Beru", "grok", "Builds; never reviews"],
  ["Tusk", "agy", "Research and tests; never writes"],
];

export function Glossary({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader page={page} description="The words Shadow Army uses, in alphabetical order." />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. These are the terms of the accepted design. A few, such as the checkout
            guard and the claims, come from v1 and carry over.
          </p>
        </Callout>

        <H2 id="terms">Terms</H2>
        <Table head={["Term", "Meaning"]} rows={terms.map(([term, meaning]) => [<strong key="t">{term}</strong>, meaning])} />

        <H2 id="names">Shadow names</H2>
        <p>
          Each soldier has a shadow name, which defaults from its roster id and can be configured. Messages are
          addressed by name, in any case.
        </p>
        <Table
          head={["Name", "Roster id", "Takes"]}
          rows={names.map(([name, id, takes]) => [name, <code key="i">{id}</code>, takes])}
        />
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
