import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): shadow.config.json,
 * orchestratorDelegate.md, docs/spec/v2.md v0.5 (ARM-1, ARM-3, SET-1,
 * VIS-6, MSG-11, HOST-9 to HOST-11, WSP-9). Shadow Army 2 is not released
 * yet; this guide follows the accepted design.
 */

const TOC: TocItem[] = [
  { id: "the-two-files", title: "1. The two files" },
  { id: "check", title: "2. Check the army" },
  { id: "brief", title: "3. Brief one soldier" },
  { id: "read", title: "4. Read what comes back" },
  { id: "land", title: "5. Land the work" },
];

export function FirstArmy({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Set up the two roster files, send one build to one soldier, and land its work in your folder."
      />
      <div className="sd-prose">
        <Callout kind="warning">
          <p>
            <strong>Planned, not released.</strong> Shadow Army 2 has no release yet, and the steps follow its accepted
            design. Start with the <Link href={hrefOf("quickstart")}>Quickstart</Link> for loading the mod.
          </p>
        </Callout>

        <H2 id="the-two-files">1. The two files</H2>
        <p>
          The roster lives in two files at the root of your repository, and both must list the same soldiers.{" "}
          <code>shadow.config.json</code> says how each soldier runs:
        </p>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "shadow.config.json",
              lines: [
                "{",
                '  "soldiers": {',
                '    "claude-sonnet": { "cli": "claude", "model": "sonnet", "autonomy": "auto" },',
                '    "codex-sol": { "cli": "codex", "model": "gpt-6.1-sol", "autonomy": "full" },',
                '    "grok": { "cli": "grok", "model": "grok-4.7", "autonomy": "full" },',
                '    "agy": { "cli": "agy", "model": "gemini-3.1-pro-high", "autonomy": "full" }',
                "  }",
                "}",
              ],
            },
            {
              label: "orchestratorDelegate.md",
              lines: [
                "---",
                "soldiers:",
                "  codex-sol:",
                "    roles: [build]",
                "    cost: 2",
                "  claude-sonnet:",
                "    roles: [build]",
                "    cost: 1",
                "  grok:",
                "    roles: [build]",
                "    cost: 1",
                "    forbidden: [review]",
                "  agy:",
                "    roles: [research, test]",
                "    cost: 1",
                "    write: false",
                "---",
              ],
            },
          ]}
        />
        <p>
          <code>orchestratorDelegate.md</code> holds each soldier&apos;s roles, cost and limits in its front matter,
          and a guide for Claude in its body. v2 adds per-soldier settings to <code>shadow.config.json</code>:{" "}
          <code>handoffAt</code>, <code>cacheLifetime</code>, <code>tag</code> and <code>tests</code>. Their exact
          format is set at release.
        </p>

        <H2 id="check">2. Check the army</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/army"] }]} />
        <p>
          Each soldier gets its default shadow name: Iron, Igris, Beru and Tusk. The strip above the prompt shows them
          with their state glyphs.
        </p>

        <H2 id="brief">3. Brief one soldier</H2>
        <p>Ask Claude, or send it yourself:</p>
        <CodeBlock
          placeholder={false}
          variants={[{ label: "Claude Code", lines: ["/send Iron --kind build Add a /health route that returns ok"] }]}
        />
        <p>
          The row moves from queued to delivered. Open <code>/pane Iron</code> to watch the live session, if you like.
        </p>

        <H2 id="read">4. Read what comes back</H2>
        <p>
          Iron answers in at most five lines: what it did, which files, and what to check. From milestone M6 the card
          also states the changes on Iron&apos;s branch, whether a test command ran and passed, and whether the work
          is applied. The full report is under <code>.shadow/reports/</code>.
        </p>

        <H2 id="land">5. Land the work</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/diff Iron", "/apply Iron"] }]} />
        <p>
          The changes arrive in your folder all or nothing. Review and commit them yourself, or{" "}
          <code>/apply undo</code> to put the folder back. Next, try{" "}
          <Link href={hrefOf("second-reviewer")}>Review with a second soldier</Link>.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
