import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): agent.md, src/core/rules.ts and
 * src/core/roster.ts (v1's parser and checks, which v2 carries over), and
 * docs/spec/v2.md v0.5 (SI-1 to SI-4, ARM-2). Shadow Army 2 is not
 * released yet.
 */

const TOC: TocItem[] = [
  { id: "sections", title: "One section per soldier" },
  { id: "on-main", title: "The file on main" },
  { id: "checks", title: "What is checked" },
  { id: "write-well", title: "Write a good section" },
];

export function AgentMd({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Rules for one soldier at a time, added to its standing instructions after rules.md."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. <code>agent.md</code> carries over from v1, and the sections below are
            the ones on <code>main</code>.
          </p>
        </Callout>

        <H2 id="sections">One section per soldier</H2>
        <p>
          Each <code>## &lt;soldier&gt;</code> heading starts a section, named by the soldier&apos;s roster id.
          Everything under it, up to the next heading, goes into that soldier&apos;s standing instructions, after{" "}
          <Link href={hrefOf("rules-md")}>rules.md</Link>. Text before the first section is ignored. A soldier with no
          section gets only <code>rules.md</code>.
        </p>
        <p>
          A section reaches the soldier the way <code>rules.md</code> does: once per session, fixed for that
          session&apos;s life, and an edit takes effect with its next fresh session.
        </p>

        <H2 id="on-main">The file on main</H2>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "agent.md",
              lines: [
                "## codex-sol",
                "- You build features. Run the project's tests for what you changed and report the result.",
                "",
                "## claude-opus",
                "- When reviewing, judge only the work in front of you; do not fix it yourself. Name each problem with the file and line.",
                "- When building, you get the hard tasks: say plainly in your report what is risky about the change.",
                "",
                "## claude-sonnet",
                "- You build features. Keep changes as small as the task allows.",
                "",
                "## grok",
                "- You build features. Never review or approve anyone's work, including your own.",
                "",
                "## agy",
                "- You research and test. Never change source code; if something needs fixing, describe the fix in your report.",
                "- When testing, run the checks the brief names and report each one's exact result.",
              ],
            },
          ]}
        />

        <H2 id="checks">What is checked</H2>
        <ul>
          <li>A section for a soldier that is not in the roster is an error.</li>
          <li>Two sections for the same soldier are an error.</li>
          <li>v1&apos;s loader refuses a section over 2,000 characters.</li>
        </ul>
        <p>
          A file in the folder you work in wins over the one shipped with the package, as with{" "}
          <code>rules.md</code>.
        </p>

        <H2 id="write-well">Write a good section</H2>
        <ul>
          <li>
            Say what the soldier is for and how it should report. Who may do what belongs in{" "}
            <Link href={hrefOf("orchestrator-delegate")}>orchestratorDelegate.md</Link>, where it is enforced.
          </li>
          <li>
            A section cannot lift a hard rule, which Shadow Army enforces in code. Grok&apos;s and agy&apos;s lines
            above restate rules that hold anyway. See{" "}
            <Link href={hrefOf("hard-rules")}>Hard rules</Link>.
          </li>
          <li>
            Keep it short. All of a soldier&apos;s standing instructions stay under 1,500 tokens.
          </li>
        </ul>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
