import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (section 3,
 * PO-1, PO-8, CH-1, CH-6 to CH-10, SI-2, SES-2, OBS-3) and ADR-0009.
 * Shadow Army 2 is not released yet; this page describes the accepted
 * design, not a published API.
 */

const TOC: TocItem[] = [
  { id: "the-interface", title: "The interface" },
  { id: "events", title: "Events" },
  { id: "turn-ends", title: "A turn ends once" },
  { id: "rules", title: "Rules every adapter keeps" },
];

export function AdapterProtocol({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Every soldier CLI has one adapter, and every adapter implements the same small interface toward the post office."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the interface its spec requires. It is not a
            published API yet.
          </p>
        </Callout>

        <H2 id="the-interface">The interface</H2>
        <Table
          head={["Operation", "What it does"]}
          rows={[
            ["Open", "Open a session in the soldier's worktree, with the standing instructions"],
            ["Send", "Send one message, as one more turn in the open session"],
            ["Interrupt", "Stop the running turn and keep the session"],
            ["Stream events", "Report everything the CLI does, as the events below"],
            ["Close", "Close the session through the CLI's own exit"],
          ]}
        />
        <p>
          Inward, each adapter speaks its CLI&apos;s own live channel. Outward, the post office offers Claude and the
          mod one interface shaped like ACP.
        </p>

        <H2 id="events">Events</H2>
        <p>Every adapter turns its CLI&apos;s output into the same events:</p>
        <ul>
          <li>text, thinking, tool call and tool result;</li>
          <li>approval request;</li>
          <li>usage, with the CLI&apos;s raw fields kept beside the normalized ones;</li>
          <li>turn end;</li>
          <li>error.</li>
        </ul>
        <H3 id="errors">Errors and refusals</H3>
        <p>
          An error says which kind it is, read from the CLI&apos;s own fields: a rate limit (with its reset time where
          the CLI gives one), a context overflow, a login needed, or another error. Each keeps the CLI&apos;s message
          word for word. A refusal is not an error: the turn ends with the model&apos;s own words, marked as a refusal.
          An error the CLI reports while it keeps running never restarts it.
        </p>

        <H2 id="turn-ends">A turn ends once</H2>
        <ul>
          <li>A turn&apos;s end event is the CLI&apos;s own. The adapter maps it to answered or interrupted.</li>
          <li>
            A turn is not over while something it started still runs: a background task the CLI reports, or a process
            that joined the CLI&apos;s process tree during the turn. Session services, such as language servers and MCP
            servers the CLI&apos;s configuration declares, do not count.
          </li>
          <li>
            If the CLI&apos;s process ends or its connection is lost first, the turn is over once the post office has
            ended the whole process tree.
          </li>
          <li>
            When a turn is over, its checkout guard and claim audit run once, before the session resumes or another
            message goes in. An end event read afterwards is recorded and changes nothing.
          </li>
        </ul>

        <H2 id="rules">Rules every adapter keeps</H2>
        <ul>
          <li>
            <strong>The harness stays whole.</strong> No adapter replaces a system prompt, removes a tool or passes a
            flag that disables a safeguard. Instructions go only through the CLI&apos;s append slot.
          </li>
          <li>
            <strong>No adapter answers an approval request.</strong> Requests are shown word for word, and the
            owner&apos;s answer goes back unchanged.
          </li>
          <li>
            <strong>Versions are recorded.</strong> Each adapter records the CLI version its fixtures were recorded
            with. A newer version connects with a warning card. A line that cannot be parsed is an error, never
            silently dropped.
          </li>
          <li>
            <strong>Crashes are supervised.</strong> A channel that crashes is restarted at most three times, and a
            message whose turn had started is never sent again by itself. Closing or restarting a channel ends the
            CLI&apos;s whole process tree.
          </li>
          <li>
            <strong>Resume where possible.</strong> After a crash, a channel reopens the session by id where the CLI
            supports it.
          </li>
        </ul>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
