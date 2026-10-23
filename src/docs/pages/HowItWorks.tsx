import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, H3, Pagination, PageHeader, SoldierDot, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/claude-first.md and ADRs
 * 0008 to 0015. Shadow Army 2 is not released yet; this page describes
 * the accepted design, not shipped behaviour.
 */

const TOC: TocItem[] = [
  { id: "the-pieces", title: "The pieces" },
  { id: "one-piece-of-work", title: "One piece of work, end to end" },
  { id: "sessions-and-cost", title: "Sessions and cost" },
  { id: "safety", title: "Safety" },
  { id: "what-changed", title: "What changed from v1" },
];

export function HowItWorks({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Your own Claude Code session leads, and each soldier is one live session of its own CLI, held open by a small local helper called the post office."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="the-pieces">The pieces</H2>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Overview",
              lines: [
                " you",
                "   │",
                "   ├── Claude Code session = the Monarch     side panes: one tab per soldier,",
                "   │        │                                a meter and a message field",
                "   │        ▼",
                "   └── post office (local helper, 127.0.0.1 + secret)",
                "            ├── Iron    claude-sonnet   worktree",
                "            ├── Igris   codex           worktree",
                "            ├── Beru    grok            worktree",
                "            └── Tusk    agy             worktree",
              ],
            },
          ]}
        />
        <ul>
          <li>
            <strong>The Monarch is your Claude Code session.</strong> It plans, sends briefs to soldiers by name and
            reads their summaries. No other process plans for the army.
          </li>
          <li>
            <strong>Each soldier is one live session of its own CLI</strong>, open in its own git worktree, with the
            vendor&apos;s harness exactly as you installed it.
          </li>
          <li>
            <strong>The post office</strong> is a small local helper that holds those sessions open. It talks to each
            CLI through that CLI&apos;s own live channel, and offers Claude one interface shaped like ACP (the Agent
            Client Protocol).
          </li>
          <li>
            <strong>A Claude Code mod</strong> adds the soldiers&apos; rows to Claude&apos;s transcript, each with a
            bar in its soldier&apos;s colour, and opens a side pane when you ask for it or when a soldier needs you.
          </li>
        </ul>

        <H2 id="one-piece-of-work">One piece of work, end to end</H2>
        <ol>
          <li>You ask Claude for something, the same way you already work with Claude Code.</li>
          <li>Claude decides who should do it and sends a brief by name, for example to Igris.</li>
          <li>
            The post office delivers the brief as one more turn in Igris&apos;s open session. No new process or window
            starts.
          </li>
          <li>Igris works in its own worktree, so it never edits your checkout directly.</li>
          <li>
            Igris replies with a summary of at most five lines. The full report stays on disk, where it costs no
            tokens.
          </li>
          <li>
            The summary card also shows the facts: what changed on the branch, whether tests ran and passed, and
            whether the work is applied. These come from git and the record of tool calls, never from the
            summary&apos;s text.
          </li>
        </ol>
        <p>
          Everything that waits on you, such as an approval or a handoff, goes into one list of decisions, oldest
          first. You can stop a soldier&apos;s turn at any time, and see, change or cancel any message still in its
          queue.
        </p>

        <H2 id="sessions-and-cost">Sessions and cost</H2>
        <p>
          v1 started a new CLI process for every message, and most of each request was the CLI&apos;s own setup sent
          again. Measured on 7 October 2026, a session held open cost the same as the CLI&apos;s normal run, within
          about 5%, and no follow-up re-read a file. Keeping sessions open is where the savings come from.
        </p>
        <H3 id="the-meter">The meter and the 200k handoff</H3>
        <ul>
          <li>Each soldier shows its context size, from its CLI&apos;s own numbers, as a bar up to 200,000 tokens.</li>
          <li>At 90% of that line the soldier shows &ldquo;near handoff&rdquo;.</li>
          <li>
            At the line it writes a handoff summary: working on, done, decided, files, open. You accept it (a fresh
            session starts with the summary), edit it, or keep going.
          </li>
          <li>You can start any soldier fresh at any time.</li>
        </ul>
        <Callout kind="tip">
          <p>
            An open session re-sends its whole history with every message. That is cheap while the provider&apos;s
            cache is warm, but after a few idle minutes it goes cold and the next message pays full price. Shadow Army
            warns you before a message goes to a cold session. Send related work to the same soldier, and start fresh
            for unrelated work.
          </p>
        </Callout>

        <H2 id="safety">Safety</H2>
        <ul>
          <li>
            <strong>Nothing listens on the network.</strong> The post office and every port it opens bind only to
            127.0.0.1, and each start uses a new secret that is never written to disk.
          </li>
          <li>
            <strong>Soldiers cannot act as the Monarch.</strong> Each soldier has its own credential, which can only
            send messages. It cannot read the event stream or another soldier&apos;s work.
          </li>
          <li>
            <strong>Vendor harnesses stay whole.</strong> Shadow Army never replaces a vendor&apos;s system prompt,
            removes a built-in tool or disables a safeguard. Its instructions only go in through each CLI&apos;s append
            slot.
          </li>
          <li>
            <strong>The hard rules hold.</strong> Grok never reviews, and agy never writes.
          </li>
          <li>
            <strong>v1&apos;s workspace safety carries over</strong>: worktrees, file claims and the claim audit, the
            checkout guard, all-or-nothing apply, and undo.
          </li>
        </ul>

        <H2 id="what-changed">What changed from v1</H2>
        <Table
          head={["Carries over", "Leaves with v1"]}
          rows={[
            ["Shadow names, roles and the hard rules", "The Ink chat (sa in a terminal)"],
            ["orchestratorDelegate.md routing and shadow.config.json", "The live dashboard of sa run"],
            ["Worktrees, claims and the claim audit", "sa run's separate Monarch and its plan and report calls"],
            ["The checkout guard, link safety, apply and undo", "A new CLI process for every brief"],
            ["The Shadow Vault", "The one-shot report parsers"],
          ]}
        />
        <p>
          Default soldiers:{" "}
          <span>
            <SoldierDot soldier="claude" /> Iron, <SoldierDot soldier="codex" /> Igris,{" "}
            <SoldierDot soldier="grok" /> Beru and <SoldierDot soldier="agy" /> Tusk.
          </span>
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
