import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (SES-1 to
 * SES-8, SI-4, CH-9, SET-1) and ADR-0011. Shadow Army 2 is not released
 * yet; this page describes the accepted design.
 */

const TOC: TocItem[] = [
  { id: "one-session", title: "One session per soldier" },
  { id: "the-meter", title: "The meter" },
  { id: "handoff", title: "The handoff" },
  { id: "fresh", title: "Start fresh" },
  { id: "cold", title: "Cold caches" },
  { id: "usage", title: "Usage today" },
];

export function ManageSessions({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Each soldier keeps one open session. Watch its size on the meter, hand off at 200k, start fresh when the work changes, and see what the day cost."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="one-session">One session per soldier</H2>
        <p>
          Each soldier has one open session per Claude session, and related work builds up in it. After a crash, the
          channel reopens the same session by id where the CLI supports it. A session&apos;s standing instructions are
          fixed for its life: an edit to <code>rules.md</code> or <code>agent.md</code> reaches a soldier with its next
          fresh session, and Claude&apos;s transcript gets one line naming the soldiers still on the older text.
        </p>

        <H2 id="the-meter">The meter</H2>
        <p>
          The meter shows the soldier&apos;s context size, from its CLI&apos;s own events, as a bar up to its handoff
          line. It changes colour at 30, 50, 70 and 90%. Its text names both measures:
        </p>
        <CodeBlock placeholder={false} variants={[{ label: "Pane", lines: ["142k / 200k handoff · 55% window"] }]} />
        <p>
          The bar measures the first. The share of the window shows only where the CLI reports its window. Usage from
          an auxiliary call, such as a claude subagent, is recorded but never moves the meter.
        </p>

        <H2 id="handoff">The handoff</H2>
        <ul>
          <li>
            At 90% of the line (180k by default) the soldier shows &ldquo;near handoff&rdquo;.
          </li>
          <li>
            At the line it is asked for a handoff summary: working on, done, decided, files, open. While it writes, it
            is &ldquo;preparing handoff&rdquo;; once the card is ready, &ldquo;handoff ready&rdquo; joins your
            decisions.
          </li>
          <li>Messages to that soldier are held until you choose.</li>
        </ul>
        <Table
          head={["Key", "Choice"]}
          rows={[
            [<code key="k">a</code>, "Accept: a fresh session starts with the standing instructions and the summary"],
            [<code key="k">e</code>, "Edit the summary first"],
            [<code key="k">g</code>, "Keep going, and ask again after 20k more"],
          ]}
        />
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/handoff Iron"] }]} />
        <p>
          The mod also has a <code>/handoff &lt;soldier&gt;</code> command. The spec names it and leaves its details to
          the design canvas&apos;s Commands page. The line is set per soldier with <code>handoffAt</code> in <code>shadow.config.json</code>. Where the CLI
          reports its window, the line must stay below it.
        </p>

        <H2 id="fresh">Start fresh</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/fresh Iron"] }]} />
        <p>
          <code>/fresh</code>, or f in the pane, closes the session, keeps its log and starts a new one with the
          standing instructions. The soldier&apos;s work stays on its branch, and nothing is reverted. A handoff first
          is optional. Stopping a turn is different: it keeps the session.
        </p>

        <H2 id="cold">Cold caches</H2>
        <p>
          An open session re-sends its whole history with every message. That is cheap while the provider&apos;s
          prompt cache is warm. Once the soldier has been idle longer than the cache lasts, the next message likely
          pays full price for all of it.
        </p>
        <ul>
          <li>
            <strong>The timer.</strong> While the soldier is warm and its cache lifetime is known, the right end of the
            meter line counts down: <code>cold in 12m</code>, then <code>cold in &lt;1m</code>, then{" "}
            <code>❄ cold since 13:53</code>.
          </li>
          <li>
            <strong>The quick message.</strong> When a soldier turns cold, and while you are in its message field, the
            pane says <code>the next message likely re-reads the full 142k context</code>, with its own size.
          </li>
          <li>
            <strong>Changes that reset the cache</strong>, such as another model, make a soldier cold at once, and the
            meter says why: <code>❄ cold · model changed</code>. A change the adapter cannot place shows{" "}
            <code>cache unknown</code> and what changed.
          </li>
        </ul>
        <H3 id="cache-lifetime">Where the lifetime comes from</H3>
        <ol>
          <li>
            Your <code>cacheLifetime</code> for that soldier in <code>shadow.config.json</code>.
          </li>
          <li>What the CLI reports: claude marks each cache write as lasting 5 minutes or 1 hour.</li>
          <li>The provider&apos;s documentation for that model.</li>
        </ol>
        <p>With none of these, there is no timer, and the soldier is shown as cold only after a change that resets it.</p>
        <Callout kind="tip">
          <p>Send related work to the same soldier while it is warm. Start fresh for unrelated work.</p>
        </Callout>

        <H2 id="usage">Usage today</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/sessions"] }]} />
        <p>
          <code>/sessions</code> lists, for each soldier: sessions, messages, input (cached included), the cached
          share, output, and cost where the CLI reports one (&ldquo;—&rdquo; otherwise), then a total row.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
