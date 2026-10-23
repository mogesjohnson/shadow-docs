import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, H3, Pagination, PageHeader } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (MSG-3,
 * MSG-4, MSG-9, MSG-10, HOST-5, HOST-14, CH-6, CH-10, PO-8) and ADR-0014.
 * Shadow Army 2 is not released yet; this page describes the accepted
 * design.
 */

const TOC: TocItem[] = [
  { id: "stop", title: "Stop a turn" },
  { id: "queue", title: "See and change the queue" },
  { id: "decisions", title: "One list of decisions" },
  { id: "send-again", title: "Sending again" },
];

export function Steer({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Correct a soldier while it works: stop its turn, change what waits in its queue, and answer everything that needs you from one list."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="stop">Stop a turn</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/stop Igris"] }]} />
        <p>
          <code>/stop</code>, or s in the pane, stops the soldier&apos;s running turn through its CLI&apos;s own
          interrupt.
        </p>
        <ul>
          <li>
            <strong>The session stays open</strong> with its history, and the work so far stays in the soldier&apos;s
            worktree. This is not starting fresh.
          </li>
          <li>
            <strong>Until the turn has ended</strong>, the soldier is &ldquo;stopping&rdquo; and the pane shows{" "}
            <code>■ stopping the turn…</code>. This normally lasts a second or two. A CLI that has not ended the turn
            after 30 seconds is ended and its session resumed, and the pane says so.
          </li>
          <li>
            <strong>Open approval requests are cancelled</strong>, never approved. The tool does not run.
          </li>
          <li>
            <strong>Background work too.</strong> If the turn has ended but something it started is still running, s
            stops that work instead. A session service, such as a plugin&apos;s language server, keeps running.
          </li>
          <li>
            <strong>The message ends as interrupted</strong>, with the changes made so far, and Claude&apos;s
            transcript gets one line saying the turn was stopped.
          </li>
          <li>
            <strong>The queue is held</strong>, so older instructions do not run by themselves. g sends the held
            queue; a new message from you goes first.
          </li>
        </ul>

        <H2 id="queue">See and change the queue</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/queue", "/queue Igris"] }]} />
        <p>
          The pane&apos;s header shows how many messages wait for the soldier. q opens the queue: each message&apos;s
          sender, age and first line. Pick one with 1 to 9, then x cancels it or c changes its text before it is
          delivered. <code>/queue</code> prints the queues in the transcript.
        </p>
        <p>
          When the message was Claude&apos;s brief, Claude&apos;s transcript gets one line saying it was cancelled or
          changed. Nothing in a queue is dropped silently.
        </p>
        <H3 id="held">When a queue is held</H3>
        <p>A held queue waits for you instead of sending by itself:</p>
        <ul>
          <li>after a stop;</li>
          <li>while a handoff card is open;</li>
          <li>while the checkout guard&apos;s attribution card is open.</li>
        </ul>

        <H2 id="decisions">One list of decisions</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/decisions"] }]} />
        <p>
          Everything that waits on you, across all soldiers, is in one list, oldest first: approval requests, the
          guard&apos;s attribution cards, handoffs ready, queues held after a stop, logins needed, channels down and
          messages not delivered.
        </p>
        <ul>
          <li>
            The list is the pane&apos;s first tab, &ldquo;needs you&rdquo;, with the count. Below it the tab lists the
            rest of the army: working, then cold and idle, then not started.
          </li>
          <li>Choosing a row opens its card under the list, and you answer there with the card&apos;s own keys.</li>
          <li>
            A new decision never replaces the card you are reading. It joins the list, and one line names it, as in{" "}
            <code>↑ new: Iron · queue held · Tab</code>.
          </li>
          <li>A row leaves the list once its decision is made, wherever you made it.</li>
        </ul>
        <Callout kind="warning">
          <p>
            Approval requests come from each soldier&apos;s own CLI and are shown word for word, with the CLI&apos;s
            own options. Your answer goes back unchanged. Shadow Army never answers one for you. agy has no approval
            protocol when it runs headless: it skips any tool that would need your OK, and the pane shows each skip.
          </p>
        </Callout>

        <H2 id="send-again">Sending again</H2>
        <ul>
          <li>
            <strong>Not delivered:</strong> the message never reached the session, so r sends it again as it is.
          </li>
          <li>
            <strong>Interrupted:</strong> the turn may already have changed files, so it is never sent again by itself
            or by one key. r puts its text back in the field, above the changes its turn made. Enter sends it as a new
            message, whose row says which message it repeats.
          </li>
          <li>
            <strong>Cancelled:</strong> you cancelled it while it was queued.
          </li>
        </ul>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
