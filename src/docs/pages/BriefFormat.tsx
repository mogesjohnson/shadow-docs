import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-10,
 * MSG-1, MSG-2, MSG-3, ARM-2, SI-1, SI-3, PO-6, OBS-2) for v2, and
 * src/core/brief.ts and src/core/types.ts for v1's brief. Shadow Army 2 is
 * not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-a-brief-is", title: "What a brief is" },
  { id: "fields", title: "Fields" },
  { id: "checks", title: "Checks before it is sent" },
  { id: "standing-instructions", title: "Standing instructions" },
];

export function BriefFormat({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="What a brief carries, how it is checked, and what the soldier receives."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the accepted design. v2 sends a brief as one message in
            a soldier&apos;s open session, so it has no fixed layout of its own; the layout v1 used is under &ldquo;From
            v1 to v2&rdquo;.
          </p>
        </Callout>

        <H2 id="what-a-brief-is">What a brief is</H2>
        <p>
          A brief is a message that assigns work. Only the Monarch sends briefs, and it sends them through the{" "}
          <code>send</code> tool. A brief carries words, never a transcript or a file&apos;s contents: files travel
          through worktree branches. See <Link href={hrefOf("briefs-and-reports")}>Briefs and reports</Link>.
        </p>

        <H2 id="fields">Fields</H2>
        <Table
          head={["Field", "Meaning"]}
          rows={[
            [<code key="f">soldier</code>, "Who it is for, by shadow name in any case."],
            [
              <code key="f">kind</code>,
              "build, review, research or test. Required. It is recorded and checked, and never sent to the soldier.",
            ],
            [<code key="f">brief</code>, "The text. This is all the soldier receives."],
            [<code key="f">wantReply</code>, "Whether the summary wakes Claude. On by default."],
            [<code key="f">wake</code>, <>Set to <code>&quot;own&quot;</code> for a brief that must be read on its own.</>],
            [
              <code key="f">id</code>,
              "Made by the post office. Every brief is stored with its id, time, sender, recipient, kind and delivery state, and the id shows in the expanded row (ctrl+o).",
            ],
          ]}
        />
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Claude Code",
              lines: ["/send Beru --kind build Add the password-reset endpoint"],
            },
          ]}
        />

        <H2 id="checks">Checks before it is sent</H2>
        <ul>
          <li>
            A kind the hard rules forbid (a review for grok, a build for agy), or one not among the soldier&apos;s
            roles, is refused with its reason.
          </li>
          <li>An unknown soldier name suggests the closest one and sends nothing.</li>
          <li>
            A soldier that cannot take it now (mid-turn, starting or disconnected) gets it queued, and it goes by itself
            as soon as the soldier can. See <Link href={hrefOf("steer")}>Stop, queue and decide</Link>.
          </li>
        </ul>

        <H2 id="standing-instructions">Standing instructions</H2>
        <p>
          What every brief assumes is not repeated in it. It is sent once per session, when the session opens:
        </p>
        <ul>
          <li>the soldier&apos;s shadow name, model and roles;</li>
          <li>the whole team with their roles, and Claude as the Monarch;</li>
          <li>
            the hard rules, <Link href={hrefOf("rules-md")}>rules.md</Link>, and the soldier&apos;s{" "}
            <Link href={hrefOf("agent-md")}>agent.md</Link> section;
          </li>
          <li>the reply format: at most five lines (what was done, which files, what to check);</li>
          <li>the handoff instruction.</li>
        </ul>
        <p>They stay under 1,500 tokens, and are fixed for the session&apos;s life.</p>
      </div>

      <FromV1>
        <p>
          v1 sent every task as a new process, so each brief repeated everything. <code>buildPrompt</code> built it in
          this order, leaving out a section that had nothing in it:
        </p>
        <Table
          head={["Section", "Content"]}
          rows={[
            [<code key="s">Opening</code>, "One task from the Monarch, with no other context."],
            [<code key="s">ROLE</code>, "build, review, research or test."],
            [<code key="s">RULES YOU MUST FOLLOW</code>, "rules.md, overriding the task."],
            [<code key="s">RULES FOR YOU IN PARTICULAR</code>, "The soldier's section of agent.md."],
            [<code key="s">TASK</code>, "The task text."],
            [<code key="s">CONSTRAINTS</code>, "A bulleted list, such as the claimed paths."],
            [<code key="s">SHARED NOTES FROM THE VAULT</code>, "Accepted vault notes."],
            [
              <code key="s">WHAT THE TASKS BEFORE YOURS REPORTED</code>,
              "Only the reports of the tasks this one depends on.",
            ],
            [<code key="s">Write line</code>, "May modify files, or a read-only task."],
            [<code key="s">Reply format</code>, "The shadow-report block. See Report format."],
          ]}
        />
        <ul>
          <li>The whole brief was capped at 24,000 characters, because agy takes it as a command-line argument.</li>
          <li>
            v1 briefs had no kind field to send: the role was a line of the brief itself. In v2 the kind is checked and
            recorded, and the soldier receives only the brief&apos;s text.
          </li>
        </ul>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
