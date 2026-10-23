import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (CH-2,
 * CH-5, CH-6, CH-7, HOST-12, HOST-13, ARM-1, ARM-6), shadow.config.json,
 * CLAUDE.md (design rules) and the v1 README ("Autonomy and rules"), whose
 * flag table is v1's. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-autonomy-is", title: "What autonomy is" },
  { id: "levels", title: "The levels" },
  { id: "in-v2", title: "What v2 adds" },
  { id: "containers", title: "Outside your repository" },
];

export function Autonomy({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="A soldier's autonomy picks which of its vendor's own permission modes it runs in. Shadow Army never adds or removes a vendor safeguard."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. Autonomy carries over from v1; the flag table below is v1&apos;s mapping,
            which can change as each v2 channel ships.
          </p>
        </Callout>

        <H2 id="what-autonomy-is">What autonomy is</H2>
        <p>
          Each soldier&apos;s <code>autonomy</code> in <code>shadow.config.json</code> says how freely it acts. It only
          chooses among each vendor&apos;s documented flags. What a soldier may actually run is decided by the
          vendor&apos;s own controls at that level.
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
                '    "grok": { "cli": "grok", "model": "grok-4.7", "autonomy": "full" }',
                "  }",
                "}",
              ],
            },
          ]}
        />

        <H2 id="levels">The levels</H2>
        <Table
          head={["Level", "claude", "codex", "grok", "agy"]}
          rows={[
            [
              <code key="l">supervised</code>,
              "plan / acceptEdits",
              "read-only / workspace-write sandbox",
              "plan / acceptEdits",
              "plan",
            ],
            [<code key="l">auto</code>, "its classifier (auto)", "automatic review", "auto", "plan (no classifier mode)"],
            [
              <code key="l">full</code>,
              "bypassPermissions",
              "full access, never asks",
              "--always-approve",
              "--dangerously-skip-permissions",
            ],
          ]}
        />
        <p>
          <code>supervised</code> is the default. The shipped config runs codex-sol, grok and agy at <code>full</code>,
          and claude-opus and claude-sonnet at <code>auto</code>.
        </p>

        <H2 id="in-v2">What v2 adds</H2>
        <ul>
          <li>
            <strong>Approvals come to you.</strong> When claude, codex or grok asks for permission, the request is shown
            to you word for word, with the CLI&apos;s own options. No adapter and no part of the mod answers one for
            you. A claude soldier runs with <code>--permission-prompts host</code> so that its requests reach you
            instead of being denied.
          </li>
          <li>
            <strong>agy is held by Shadow Army, not by its modes.</strong> In testing, agy wrote a file even in plan
            mode, so it always runs in a read-only snapshot and its writes are discarded.
          </li>
          <li>
            <strong>The Monarch keeps your permissions.</strong> Claude&apos;s own Claude Code permissions are yours;
            the mod neither widens nor narrows them.
          </li>
        </ul>

        <H2 id="containers">Outside your repository</H2>
        <Callout kind="danger">
          <p>
            The checkout guard and the claim audit cover your repository. Actions outside it, in other folders or on
            the network, are contained only by running the army in a container or VM, which is what the vendors
            recommend for their unrestricted modes.
          </p>
        </Callout>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
