import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-9,
 * HOST-10, HOST-12, HOST-13, MSG-8, ARM-2, ARM-4, Q1) and ADR-0008.
 * Shadow Army 2 is not released yet; this page describes the accepted
 * design, not shipped behaviour.
 */

const TOC: TocItem[] = [
  { id: "what-it-does", title: "What the Monarch does" },
  { id: "sending-work", title: "Sending work" },
  { id: "summaries", title: "When summaries come back" },
  { id: "permissions", title: "Permissions" },
  { id: "from-v1", title: "What changed from v1" },
];

export function TheMonarch({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="The Monarch is your own Claude Code session. It plans the work, sends briefs to soldiers by name and reads their summaries."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="what-it-does">What the Monarch does</H2>
        <p>
          You already work in a Claude Code session that knows your repository. In Shadow Army 2 that session leads
          the army. No other process plans for it.
        </p>
        <ul>
          <li>
            <strong>Plans.</strong> Claude decides what needs doing and which soldier should do each part.
          </li>
          <li>
            <strong>Assigns.</strong> Only the Monarch&apos;s briefs assign work. Soldiers answer, ask and report, and
            a soldier can never assign work to another.
          </li>
          <li>
            <strong>Reads.</strong> Each soldier answers with a summary of at most five lines. The full report stays
            on disk.
          </li>
        </ul>

        <H2 id="sending-work">Sending work</H2>
        <p>
          The Shadow Army mod gives Claude a <code>send</code> tool. Claude calls it with the soldier&apos;s name,
          the kind of work and the brief itself.
        </p>
        <Table
          head={["Field", "What it holds"]}
          rows={[
            [<code key="f">soldier</code>, "The soldier's shadow name, such as Iron. Case does not matter."],
            [
              <code key="f">kind</code>,
              "Required: build, review, research or test. It is checked and recorded, never sent to the soldier.",
            ],
            [<code key="f">brief</code>, "The words of the brief. This is all the soldier receives."],
            [<code key="f">wantReply</code>, "Whether the summary should wake Claude. On by default."],
            [<code key="f">wake</code>, 'Set to "own" for a brief whose summary must be read on its own.'],
          ]}
        />
        <p>
          The tool returns at once with the brief&apos;s id and its state: delivered, or queued and what it waits
          for. The summary arrives later, as a card in Claude&apos;s conversation.
        </p>
        <Callout kind="warning">
          <p>
            A brief is refused before it is sent when its kind breaks a hard rule (a review for Grok, a build for agy)
            or is not one of the soldier&apos;s roles. The refusal says why. See{" "}
            <Link href={hrefOf("soldiers")}>Soldiers</Link>.
          </p>
        </Callout>
        <H3 id="sending-yourself">Sending a message yourself</H3>
        <p>You can also brief a soldier directly, with the same check when you name a kind:</p>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Claude Code",
              lines: ["/send Iron --kind build Add a health check route", "/send Beru what does src/core/router.ts do?"],
            },
          ]}
        />
        <p>
          A message without <code>--kind</code> is your own and is not checked for a kind. Claude&apos;s transcript
          gets one line saying that soldier&apos;s context changed.
        </p>

        <H2 id="summaries">When summaries come back</H2>
        <ul>
          <li>If Claude is idle and the brief asked for a reply, the summary starts a new turn.</li>
          <li>If the brief did not ask for one, the card waits for Claude&apos;s next turn.</li>
          <li>If Claude is mid-turn, the card joins the running turn. No new turn starts.</li>
          <li>
            Briefs Claude sends in one turn wake it once, when the last of them has answered or ended. Summaries that
            arrive within a few seconds of each other share one wake.
          </li>
        </ul>
        <p>
          A summary reaches Claude as the soldier&apos;s quoted words. It is never presented as your instructions or
          the Monarch&apos;s.
        </p>

        <H2 id="permissions">Permissions</H2>
        <ul>
          <li>
            <strong>Claude&apos;s permissions stay yours.</strong> The mod neither widens nor narrows what Claude may
            do in your checkout.
          </li>
          <li>
            <strong>The mod never approves anything.</strong> It may only observe a tool call or a permission request,
            or deny it. When a soldier&apos;s CLI asks for approval, the request comes to you word for word.
          </li>
          <li>
            <strong>Soldiers write only in their own worktrees.</strong> Their work reaches your folder when you apply
            it.
          </li>
        </ul>
        <Callout kind="note">
          <p>
            Still open: whether to offer an opt-in that keeps the Monarch from writing in your checkout. Today the
            design leaves that to your own Claude Code permissions.
          </p>
        </Callout>

        <H2 id="from-v1">What changed from v1</H2>
        <p>
          v1 ran a separate Monarch CLI. It planned every goal in a fresh session, then made a second call to write
          the report. Measured on 6 October 2026, those two calls cost about 62k tokens for a simple goal, before any
          soldier worked. With Claude as the Monarch, those calls and the repeated reading of the repository go away.
          v1&apos;s <code>monarch</code> block and <code>orchestrate</code> role mean nothing in v2.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
