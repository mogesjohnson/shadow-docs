import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): shadow.config.json,
 * src/core/config.ts and src/core/roster.ts (v1's loader, which v2 carries
 * over), docs/spec/v2.md v0.5 (ARM-1, ARM-3, SES-6, SES-8, SET-1, SET-2,
 * VIS-6 and the tests line of the summary card) and docs/claude-first.md.
 * Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-it-holds", title: "What it holds" },
  { id: "where-it-is-read", title: "Where it is read from" },
  { id: "keys", title: "Keys for each soldier" },
  { id: "v2-keys", title: "Keys v2 adds" },
  { id: "plugins", title: "Plugins and connectors" },
];

export function ShadowConfig({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="How each soldier runs: which CLI, which model, how freely it acts, and from v2 its handoff line, cache lifetime, tag and test commands."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The file carries over from v1; the keys v2 adds arrive with milestone M4
            and their exact format is set at release.
          </p>
        </Callout>

        <H2 id="what-it-holds">What it holds</H2>
        <p>
          <code>shadow.config.json</code> says how each soldier runs. Who may do what lives in{" "}
          <Link href={hrefOf("orchestrator-delegate")}>orchestratorDelegate.md</Link>. Both files must list the same
          soldiers: one with no policy would run without its rules, and one with no CLI or model cannot run at all.
          The file shipped on <code>main</code>:
        </p>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "shadow.config.json",
              lines: [
                "{",
                '  "soldiers": {',
                '    "codex-astra": { "cli": "codex", "model": "gpt-6-astra" },',
                '    "codex-sol": { "cli": "codex", "model": "gpt-6.1-sol", "autonomy": "full" },',
                '    "claude-opus": { "cli": "claude", "model": "opus", "autonomy": "auto" },',
                '    "claude-sonnet": { "cli": "claude", "model": "sonnet", "autonomy": "auto" },',
                '    "grok": { "cli": "grok", "model": "grok-4.7", "autonomy": "full" },',
                '    "agy": { "cli": "agy", "model": "gemini-3.1-pro-high", "autonomy": "full" }',
                "  }",
                "}",
              ],
            },
          ]}
        />
        <p>
          Each key under <code>soldiers</code> is the soldier&apos;s roster id. Its shadow name defaults from that id:
          Bellion codex-astra, Igris codex-sol, Kaisel claude-opus, Tank claude-opus-build (a soldier the file on{" "}
          <code>main</code> does not list), Iron claude-sonnet, Beru grok and Tusk agy. Names can be configured.
        </p>

        <H2 id="where-it-is-read">Where it is read from</H2>
        <p>
          A <code>shadow.config.json</code> in the folder you work in wins. Without one, Shadow Army uses the file
          shipped with the package. Invalid JSON, or a value of the wrong kind, stops the start with a message naming
          each bad path, such as <code>soldiers.grok.autonomy</code>.
        </p>

        <H2 id="keys">Keys for each soldier</H2>
        <Table
          head={["Key", "Value", "Default"]}
          rows={[
            [
              <code key="k">cli</code>,
              <>
                The CLI that runs the soldier: <code>claude</code>, <code>codex</code>, <code>grok</code> or{" "}
                <code>agy</code>
              </>,
              "Required",
            ],
            [
              <code key="k">model</code>,
              <>
                The model id, passed to that CLI. See <Link href={hrefOf("models")}>Choose models</Link>.
              </>,
              "Required",
            ],
            [
              <code key="k">autonomy</code>,
              <>
                <code>supervised</code>, <code>auto</code> (the vendor&apos;s classifier) or <code>full</code> (the
                vendor&apos;s unrestricted mode). See <Link href={hrefOf("autonomy")}>Autonomy levels</Link>.
              </>,
              <code key="d">supervised</code>,
            ],
          ]}
        />

        <H2 id="v2-keys">Keys v2 adds</H2>
        <Table
          head={["Key", "What it does"]}
          rows={[
            [
              <code key="k">handoffAt</code>,
              <>
                The context size at which the soldier hands off, 200,000 tokens by default. Where the CLI reports its
                window, the line must stay below it. See <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
              </>,
            ],
            [
              <code key="k">cacheLifetime</code>,
              "Optional. How long the provider keeps this soldier's prompt cache. It overrides what the CLI reports and the provider's documentation, and sets when the soldier is estimated cold.",
            ],
            [
              <code key="k">tag</code>,
              <>
                Pins the soldier&apos;s two-letter tag. A duplicate is refused at start. See{" "}
                <Link href={hrefOf("army")}>See your army</Link>.
              </>,
            ],
            [
              <code key="k">tests</code>,
              <>
                The commands that count as running the tests, for the summary card&apos;s tests line. By default{" "}
                <code>npm test</code>, <code>npx vitest</code>, <code>pytest</code>, <code>cargo test</code> and{" "}
                <code>go test</code>.
              </>,
            ],
          ]}
        />
        <p>
          <code>handoffAt</code> and <code>cacheLifetime</code> are validated at start, so a bad value stops the army
          before any soldier opens a session.
        </p>

        <H2 id="plugins">Plugins and connectors</H2>
        <p>
          Soldiers start without your personal plugins and connectors, where the CLI can leave them out without
          touching a vendor tool. You can attach one to a soldier: live where its CLI allows, otherwise by a restart
          that resumes the same session.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
