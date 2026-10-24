import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-6,
 * HOST-7, HOST-9, MSG-2, ARM-1, ARM-3, VIS-2, VIS-6, OBS-1). Shadow Army 2
 * is not released yet; this page describes the accepted design.
 */

const TOC: TocItem[] = [
  { id: "army-command", title: "The /army command" },
  { id: "the-strip", title: "The army strip" },
  { id: "tags", title: "Tags" },
  { id: "where-the-roster-comes-from", title: "Where the roster comes from" },
];

export function Army({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="See every soldier in your army, its state and its tag, from the /army command or the strip above the prompt."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="army-command">The /army command</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/army"] }]} />
        <p>
          <code>/army</code> prints the army in Claude&apos;s transcript: every soldier with its two-letter tag, and
          the post office&apos;s own log.
        </p>
        <p>
          A soldier&apos;s name is matched case-insensitively wherever you type it. An unknown name suggests the
          closest one and sends nothing.
        </p>

        <H2 id="the-strip">The army strip</H2>
        <p>
          The strip is one line above Claude&apos;s prompt. It lists every soldier in roster order, each with its state
          glyph and its name in its colour, plus a five-cell meter and its token count as the width allows.
        </p>
        <Table
          head={["When the line is short", "What gives way"]}
          rows={[
            ["First", "The meters"],
            ["Then", "The token counts"],
            ["Then", "Names become tags"],
            ["Still too long", "Soldiers that need nothing fold into “+N more”, then the last ones that need you into “+N · /decisions”"],
          ]}
        />
        <p>Glyphs never drop. Only a state that needs you shows a word in the strip, and it keeps it at every width:</p>
        <ul>
          <li>
            <strong>waiting</strong>: the soldier&apos;s CLI asks for your approval;
          </li>
          <li>
            <strong>handoff</strong>: a handoff summary is ready for you;
          </li>
          <li>
            <strong>held</strong>: its queue waits for you after a stop;
          </li>
          <li>
            <strong>log in</strong>: its CLI needs you to sign in;
          </li>
          <li>
            <strong>down</strong>: its channel crashed again after three restarts, and waits for you to reconnect it (r
            in the pane);
          </li>
          <li>
            <strong>error</strong>: its CLI reported an error, kept word for word.
          </li>
        </ul>
        <p>
          A state is never shown by colour alone, and every glyph has an ASCII fallback. Claude Code&apos;s status line
          also gets one plain-text entry with the most urgent fact first; when several things need you, it gives their
          count and <code>/decisions</code>.
        </p>

        <H2 id="tags">Tags</H2>
        <p>
          Where a name does not fit, a soldier shows a two-letter tag that is unique in the army. By default it is the
          name&apos;s first letter, then the earliest later letter that no earlier soldier with that first letter has
          used. With Beru before Bellion:
        </p>
        <Table
          head={["Soldier", "Tag"]}
          rows={[
            ["Iron", "Ir"],
            ["Igris", "Ig"],
            ["Beru", "Be"],
            ["Bellion", "Bl"],
          ]}
        />
        <p>
          Set <code>tag</code> for a soldier in <code>shadow.config.json</code> to pin it. A duplicate tag is refused
          at start.
        </p>

        <H2 id="where-the-roster-comes-from">Where the roster comes from</H2>
        <ul>
          <li>
            <code>orchestratorDelegate.md</code> holds each soldier&apos;s roles, cost and limits (
            <code>forbidden</code>, <code>write</code>).
          </li>
          <li>
            <code>shadow.config.json</code> holds its <code>cli</code>, <code>model</code> and{" "}
            <code>autonomy</code>.
          </li>
          <li>Both files must list the same soldiers.</li>
        </ul>
        <p>
          The default shadow names are Iron (claude-sonnet), Igris (codex-sol), Beru (grok), Tusk (agy), Kaisel
          (claude-opus), Bellion (codex-astra). Tank (claude-opus-build) is named but not yet defined. See{" "}
          <Link href={hrefOf("soldiers")}>Soldiers</Link>.
        </p>
      </div>
      <FromV1>
        <ul>
          <li>
            <code>/army</code> takes the place of v1&apos;s <code>sa army</code>.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
