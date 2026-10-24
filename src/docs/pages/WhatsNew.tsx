import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, H3, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.1 to v0.5 (the
 * version line of each commit), section 6 (M0), ADR-0008 to ADR-0015 and
 * docs/claude-first.md; and the shadow-army pull requests on GitHub, checked
 * on 23 October 2026 (#75 opened as a draft on 13 October 2026). Shadow
 * Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "week-of-12-october", title: "12 to 18 October 2026" },
  { id: "week-of-5-october", title: "5 to 11 October 2026" },
];

export function WhatsNew({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="What changed in Shadow Army 2's design each week, newest first, and where these docs cover it."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development, so every change here is to its spec and design, not to a release. For
            each spec version in order, see the <Link href={hrefOf("changelog")}>Changelog</Link>. Last checked on 23
            October 2026: nothing has reached shadow-army&apos;s <code>main</code> since 13 October.
          </p>
        </Callout>

        <H2 id="week-of-12-october">12 to 18 October 2026</H2>

        <H3 id="quiet-by-default">Quiet by default</H3>
        <p>
          You work in Claude&apos;s transcript, and the army adds its rows there, each marked in its soldier&apos;s
          colour. The pane opens only when you ask for it or when a soldier needs you. Read{" "}
          <Link href={`${hrefOf("pane")}#the-quiet-default`}>The quiet default</Link>.
        </p>

        <H3 id="decisions-first">Decisions first</H3>
        <p>
          The pane&apos;s first tab lists everything that waits on you, oldest first, then the rest of the army. A
          decision that arrives while you read a card joins the list, and the card stays open. Read{" "}
          <Link href={`${hrefOf("steer")}#decisions`}>One list of decisions</Link>.
        </p>

        <H3 id="while-you-were-away">While you were away</H3>
        <p>
          After 10 minutes without input, once the army has settled, one digest says what changed: answers with their
          facts, what waits on you, what went cold, and the cost reported. Read{" "}
          <Link href={`${hrefOf("pane")}#while-you-were-away`}>While you were away</Link>.
        </p>

        <H3 id="kinds-of-work">Each brief names its kind of work</H3>
        <p>
          A brief is a build, a review, research or a test. It is refused before it is sent, with its reason, when its
          kind breaks a hard rule or is not among the soldier&apos;s roles. Read{" "}
          <Link href={`${hrefOf("send")}#kinds`}>Kinds of work</Link> and{" "}
          <Link href={hrefOf("roles")}>Build and review roles</Link>.
        </p>

        <H3 id="bellion">Bellion takes reviews and hard builds</H3>
        <p>
          Bellion (codex-astra) joins the soldiers who review and take hard builds, listed after claude-opus. Read{" "}
          <Link href={`${hrefOf("roles")}#who-does-what`}>Who does what</Link>.
        </p>

        <H3 id="broad-allow">A broad allow takes two presses</H3>
        <p>
          An approval option that allows more than one request, such as &ldquo;allow for this session&rdquo;, is sent
          only when you press its key a second time, because the CLI decides what it covers. Read{" "}
          <Link href={`${hrefOf("pane")}#keys`}>Keys in the pane</Link>.
        </p>

        <H3 id="m1-started">Work on M1 began</H3>
        <p>
          The first milestone that builds code, the post office and the claude channel, opened as a draft pull request
          on 13 October. It is not merged. Read <Link href={hrefOf("roadmap")}>Roadmap</Link>.
        </p>

        <H2 id="week-of-5-october">5 to 11 October 2026</H2>

        <H3 id="claude-first">Claude is the Monarch</H3>
        <p>
          The owner chose the Claude-first design on 6 and 7 October. Your own Claude Code session plans, sends briefs
          by name and reads five-line summaries. No other process plans for the army. Read{" "}
          <Link href={hrefOf("the-monarch")}>The Monarch</Link>.
        </p>

        <H3 id="live-sessions">Every soldier is a live session</H3>
        <p>
          Each soldier is one long-lived session of its own CLI, in its own worktree, with the vendor&apos;s harness
          exactly as installed. A message is one more turn in that session. Measured on 7 October, a live session costs
          what the CLI&apos;s own run costs, within about 5%, and its follow-ups read no file again. Read{" "}
          <Link href={hrefOf("how-shadow-army-works")}>How Shadow Army works</Link> and{" "}
          <Link href={hrefOf("cost")}>Cost and tokens</Link>.
        </p>

        <H3 id="post-office">A local-only post office</H3>
        <p>
          A small helper holds the sessions. It binds only the loopback address, and the Monarch and each soldier have
          separate credentials. Read <Link href={`${hrefOf("how-shadow-army-works")}#safety`}>Safety</Link>.
        </p>

        <H3 id="meter-and-handoff">The meter and the 200k handoff</H3>
        <p>
          Each soldier shows its context size from its CLI&apos;s own numbers. At 200,000 tokens it writes a handoff
          summary, and you choose whether a fresh session starts with it. A cold timer counts down to when a
          soldier&apos;s cache likely expires. Read <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
        </p>

        <H3 id="you-steer">You steer</H3>
        <p>
          Stop a turn and keep its session, see and change the queue, and read facts on each summary card: the changes
          on the branch, whether tests ran, and whether the work is applied. A stop cancels the turn&apos;s open
          approval requests and approves nothing. Read <Link href={hrefOf("steer")}>Stop, queue and decide</Link> and{" "}
          <Link href={`${hrefOf("apply-changes")}#the-card`}>The facts on the card</Link>.
        </p>

        <H3 id="spikes-done">The M0 spikes are done</H3>
        <p>
          Five spikes on 7 October tested the pane, waking the Monarch, usage and caches, the <code>send</code> tool
          and approvals, and the spec now applies their findings. Read{" "}
          <Link href={`${hrefOf("roadmap")}#m0`}>M0: Spikes</Link>.
        </p>
      </div>

      <FromV1>
        <p>
          v1 shipped as <code>v1.0.0</code> and <code>v1.0.1</code> on 7 October 2026, the same week the Claude-first
          design was chosen, and is frozen on the <code>legacy/v1</code> branch. Its releases are listed in the{" "}
          <Link href={`${hrefOf("changelog")}#v1`}>Changelog</Link>.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
