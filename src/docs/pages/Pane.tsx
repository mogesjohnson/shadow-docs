import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-3 to
 * HOST-8, HOST-11, HOST-14, HOST-15, VIS-1 to VIS-4, OBS-1, OBS-2) and
 * ADR-0015. Shadow Army 2 is not released yet; this page describes the
 * accepted design.
 */

const TOC: TocItem[] = [
  { id: "the-quiet-default", title: "The quiet default" },
  { id: "the-pane", title: "The pane" },
  { id: "keys", title: "Keys in the pane" },
  { id: "toasts", title: "Toasts" },
  { id: "while-you-were-away", title: "While you were away" },
];

const KEYS: [string, string][] = [
  ["j / l", "Switch tabs"],
  ["i / k", "Scroll the session"],
  ["Enter", "Go into the message field; Enter again sends"],
  ["Esc", "Leave the field; Esc again closes the pane"],
  ["s", "Stop the running turn"],
  ["q", "Open the queue (1 to 9 pick, x cancels, c changes)"],
  ["g", "Go on: keep going at a handoff card, or send a held queue"],
  ["a / e", "Accept or edit a handoff summary"],
  ["y / n", "Answer the checkout guard's attribution card"],
  ["1 to 9", "Answer a CLI's approval request"],
  ["d", "Show the soldier's changes"],
  ["f", "Start the soldier fresh"],
  ["r", "Reconnect or start the soldier, or send again a message that was not delivered"],
  ["o", "Open the soldier's log"],
];

export function Pane({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Watch any soldier as it works, in a pane beside Claude's transcript, while the strip keeps the whole army on one line."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="the-quiet-default">The quiet default</H2>
        <p>You keep working in Claude&apos;s transcript. The mod adds to it, and stays out of the way otherwise:</p>
        <ul>
          <li>
            <strong>Rows in the transcript:</strong> one per brief with its delivery state, a summary card of at most
            five lines, and one line for each soldier-to-soldier message and each message you typed yourself. Each row
            starts with a bar, ▌ (ASCII <code>|</code>), in its soldier&apos;s colour. ctrl+o expands a row and shows
            its id.
          </li>
          <li>
            <strong>The army strip</strong>, one line above the prompt.
          </li>
          <li>
            <strong>A status-line entry</strong> with the most urgent fact first.
          </li>
          <li>
            <strong>Toasts</strong>, only while the pane is closed.
          </li>
        </ul>
        <p>The pane opens only when you ask for it or when a soldier needs you.</p>

        <H2 id="the-pane">The pane</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/pane", "/pane Igris"] }]} />
        <ul>
          <li>
            In Claude Code&apos;s full-screen layout it docks beside the transcript from 110 columns wide, at 56
            columns unless you drag it. On the main screen it sits inline above the prompt, at most 72 columns wide.
          </li>
          <li>
            It opens by itself when a soldier needs you: from 144 columns, or from 110 once you have opened it before.
            Otherwise ask for it with <code>/pane</code>, or ctrl+x tab after a toast.
          </li>
        </ul>
        <H3 id="whats-in-it">What&apos;s in it, top to bottom</H3>
        <ol>
          <li>Tabs, one per soldier. While anything waits on you, the first tab is &ldquo;needs you&rdquo;.</li>
          <li>A header: name · id · model, the state with its word, and how many messages are queued.</li>
          <li>The meter, up to the soldier&apos;s handoff line.</li>
          <li>The live session: thinking, tool calls and replies.</li>
          <li>The message field.</li>
          <li>The keys row, which wraps to a second row before any key is dropped.</li>
        </ol>
        <p>
          Only the working spinner moves, and with reduced motion it stays on ◐. Every surface is drawn for 144, 110
          and 80 columns and 24 rows; a card that asks for a decision keeps its question and keys in view.
        </p>

        <H2 id="keys">Keys in the pane</H2>
        <p>
          ctrl+x tab moves the keyboard into the pane. Tab, the arrow keys and the mouse wheel work too, as in any
          Claude Code pane.
        </p>
        <Table head={["Key", "What it does"]} rows={KEYS.map(([k, v]) => [<code key="k">{k}</code>, v])} />
        <Callout kind="warning">
          <p>
            An approval option that allows more than the one request, such as &ldquo;allow for this session&rdquo;,
            takes its key twice. The first press marks it and says that the CLI decides what it covers; the second
            sends it. Esc or another option&apos;s key clears the mark.
          </p>
        </Callout>

        <H2 id="toasts">Toasts</H2>
        <p>While the pane is closed, a toast appears only for:</p>
        <ul>
          <li>a soldier waiting on you;</li>
          <li>a handoff ready;</li>
          <li>a disconnection;</li>
          <li>a CLI that needs a login;</li>
          <li>a message that was not delivered.</li>
        </ul>
        <p>
          When a second decision opens while one is still open, one toast gives the count and points at{" "}
          <code>/decisions</code>. After that, new decisions get no toast until the list is empty.
        </p>

        <H2 id="while-you-were-away">While you were away</H2>
        <p>
          After 10 minutes with no input from you, once no soldier is working, stopping, starting or preparing a
          handoff, the mod adds one digest to the transcript:
        </p>
        <ul>
          <li>the time span;</li>
          <li>
            one row per soldier whose state changed: answered, interrupted with its reason, waiting on you, handoff
            ready, cold, down, log in needed or error;
          </li>
          <li>the cost the CLIs reported in that time, where they report one.</li>
        </ul>
        <p>It comes once per absence, and it is not added to Claude&apos;s conversation, so it wakes nobody.</p>
      </div>
      <FromV1>
        <ul>
          <li>
            The pane replaces v1&apos;s live dashboard of <code>sa run</code>.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
