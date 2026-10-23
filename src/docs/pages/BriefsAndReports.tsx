import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (MSG-1 to
 * MSG-11, HOST-10, HOST-11, PO-6, ARM-2) and ADR-0014. Shadow Army 2 is
 * not released yet; this page describes the accepted design.
 */

const TOC: TocItem[] = [
  { id: "only-words", title: "Only words cross" },
  { id: "briefs", title: "Briefs" },
  { id: "summaries-and-reports", title: "Summaries and reports" },
  { id: "message-states", title: "Message states" },
  { id: "soldier-to-soldier", title: "Soldier to soldier" },
];

export function BriefsAndReports({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Work goes out as a brief, and comes back as a summary of at most five lines. The full report stays on disk."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="only-words">Only words cross</H2>
        <p>
          A message between models carries words. It never carries a transcript or a file&apos;s contents. Files
          travel only through each soldier&apos;s worktree branch.
        </p>
        <p>
          What a soldier wrote reaches another model only as that soldier&apos;s quoted words, named as such. A
          summary, a soldier-to-soldier message or an error is never presented as your instructions or the
          Monarch&apos;s.
        </p>

        <H2 id="briefs">Briefs</H2>
        <p>
          A brief is a message that assigns work. Only the Monarch sends briefs. Each one carries its kind of work:
          build, review, research or test.
        </p>
        <ul>
          <li>The kind is checked against the hard rules and the soldier&apos;s roles before anything is sent.</li>
          <li>The kind is recorded but never sent. The soldier receives only the brief&apos;s text.</li>
          <li>Every brief, summary and message is stored with its id, time, sender, recipient and delivery state.</li>
        </ul>
        <p>
          In Claude&apos;s transcript each brief gets one row with its delivery state, starting with a bar in the
          soldier&apos;s colour. See <Link href={hrefOf("the-monarch")}>The Monarch</Link> for the{" "}
          <code>send</code> tool&apos;s fields.
        </p>

        <H2 id="summaries-and-reports">Summaries and reports</H2>
        <ul>
          <li>
            <strong>A summary</strong> has at most five lines: what was done, which files, what to check. A longer
            reply is cut with &hellip;
          </li>
          <li>
            <strong>The report</strong> is the soldier&apos;s whole reply. It is saved under{" "}
            <code>.shadow/reports/</code>, where it costs no tokens.
          </li>
          <li>The summary goes back to whoever sent the message.</li>
        </ul>
        <H3 id="the-card">The summary card</H3>
        <p>
          For the Monarch, a summary arrives as a card titled &ldquo;answered&rdquo;, with the report&apos;s path.
          Beside that, the card states facts taken from git and the record of tool calls, never from the
          summary&apos;s text:
        </p>
        <Table
          head={["Fact", "What it says"]}
          rows={[
            ["changes", 'The files and lines the turn changed on the soldier\'s branch, or "none".'],
            [
              "tests",
              'Whether a test command ran in the turn and whether it passed, or "not run". A summary that claims tests passed when none ran still shows "not run".',
            ],
            ["applied", '"not yet", or when the changes were applied to your folder.'],
          ]}
        />
        <p>
          The card also names the commands that act on the work, <code>/diff</code> and <code>/apply</code>. These
          facts arrive with the workspace milestone, the last one before release.
        </p>

        <H2 id="message-states">Message states</H2>
        <p>
          A message moves through <strong>queued</strong>, <strong>delivered</strong> and{" "}
          <strong>answered</strong>. The state updates in place, always as a glyph and a word. Otherwise it ends in
          one of three ways:
        </p>
        <Table
          head={["Ending", "What happened", "Sending again"]}
          rows={[
            [
              "interrupted",
              "It was delivered, but no summary came back: you stopped the turn, the CLI crashed or reported the turn as failed, or you refused a guard card. The turn may already have changed files.",
              "Never automatically. r puts the text back in the field for you to edit and send as a new message.",
            ],
            [
              "not delivered",
              "It never reached the session, for example because the post office stopped first.",
              "Safe: r sends it again as it is.",
            ],
            ["cancelled", "You cancelled it while it was queued.", "Not applicable."],
          ]}
        />
        <Callout kind="tip">
          <p>
            &ldquo;Failed&rdquo; is not a state. Each ending says which of these happened, and why. A message to a busy
            or disconnected soldier waits in its queue and goes by itself once it can. You can see, change or cancel
            it there first.
          </p>
        </Callout>

        <H2 id="soldier-to-soldier">Soldier to soldier</H2>
        <p>
          Soldiers can message each other by name through their own <code>send</code> tool. Both panes show the
          message in full, and Claude&apos;s transcript gets one line. A soldier can ask or tell another soldier
          something, but it cannot assign work. agy has no <code>send</code> tool in v2.0.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
