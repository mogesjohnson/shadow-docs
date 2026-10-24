import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-9,
 * HOST-10, HOST-11, MSG-1 to MSG-8, ARM-2, ARM-4, PO-4). Shadow Army 2 is
 * not released yet; this page describes the accepted design.
 */

const TOC: TocItem[] = [
  { id: "two-ways", title: "Two ways to send" },
  { id: "kinds", title: "Kinds of work" },
  { id: "what-happens", title: "What happens to a message" },
  { id: "replies", title: "Replies" },
];

export function Send({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Work reaches a soldier as a brief, sent by name: by Claude with its send tool, or by you with /send."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="two-ways">Two ways to send</H2>
        <H3 id="claude-sends">Claude sends a brief</H3>
        <p>
          Ask Claude for something in plain words. Claude picks a soldier and calls the mod&apos;s <code>send</code>{" "}
          tool with the soldier&apos;s name, the kind of work and the brief. The tool returns at once with the
          brief&apos;s id and whether it was delivered or queued. See{" "}
          <Link href={hrefOf("the-monarch")}>The Monarch</Link> for the tool&apos;s fields.
        </p>
        <H3 id="you-send">You send a message</H3>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Claude Code",
              lines: [
                "/send <soldier> <message>",
                "/send <soldier> --kind <kind> <message>",
                "",
                "/send Igris --kind build Add pagination to the users list",
                "/send Tusk why does the auth test time out?",
              ],
            },
          ]}
        />
        <p>
          You can also type into a soldier through the field in its pane. Either way the message comes from
          &ldquo;you&rdquo;, and Claude&apos;s transcript gets one line saying that soldier&apos;s context changed.
        </p>

        <H2 id="kinds">Kinds of work</H2>
        <Table
          head={["Kind", "Refused for"]}
          rows={[
            ["build", "agy, which never writes, and any soldier without the build role"],
            ["review", "Grok, which never reviews, and any soldier without the review role"],
            ["research", "any soldier without the research role"],
            ["test", "any soldier without the test role"],
          ]}
        />
        <p>
          Claude&apos;s <code>send</code> always names a kind. A <code>/send</code> with <code>--kind</code> is
          checked the same way; one without it is your own message and is not checked for a kind. A refused brief is
          not sent, and the refusal says why. The kind is checked and recorded, never sent: the soldier receives only
          the text.
        </p>

        <H2 id="what-happens">What happens to a message</H2>
        <ul>
          <li>
            <strong>One turn.</strong> A message is one more turn in the soldier&apos;s open session. No new process or
            window starts.
          </li>
          <li>
            <strong>The queue.</strong> A soldier that is mid-turn, starting, reconnecting or disconnected cannot take a
            message yet, so it waits in that soldier&apos;s queue, first in, first out. It goes by itself as soon as
            the soldier can take it, and its row says what it waits for, such as &ldquo;sends when Bellion is
            back&rdquo;.
          </li>
          <li>
            <strong>Only words.</strong> A message never carries a transcript or a file&apos;s contents. Files travel
            through worktree branches.
          </li>
          <li>
            <strong>Its row.</strong> Each brief has a row in Claude&apos;s transcript that moves through queued,
            delivered and answered. See <Link href={hrefOf("briefs-and-reports")}>Briefs and reports</Link> for every
            state.
          </li>
        </ul>

        <H2 id="replies">Replies</H2>
        <p>
          The soldier answers in at most five lines: what it did, which files, and what to check. A longer reply is cut
          with &hellip;, and the whole of it is saved as the report. The summary goes back to whoever sent the message:
          for Claude, as a summary card with the report&apos;s path.
        </p>
        <Callout kind="tip">
          <p>
            A soldier can message another soldier through its own <code>send</code> tool, but it can never assign
            work. Only the Monarch briefs.
          </p>
        </Callout>
      </div>
      <FromV1>
        <ul>
          <li>
            v1&apos;s <code>sa summon</code> and <code>sa run</code> are gone in v2: Claude plans, and briefs go by
            name.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
