import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, H3, Pagination, PageHeader, SoldierDot, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (ARM-1 to
 * ARM-6, SI-1 to SI-4, PO-4, CH-2 to CH-6, HOST-6, VIS-6),
 * docs/claude-first.md, shadow.config.json and orchestratorDelegate.md.
 * Shadow Army 2 is not released yet; this page describes the accepted
 * design.
 */

const TOC: TocItem[] = [
  { id: "what-a-soldier-is", title: "What a soldier is" },
  { id: "default-army", title: "The default army" },
  { id: "hard-rules", title: "The hard rules" },
  { id: "standing-instructions", title: "Standing instructions" },
  { id: "names-and-states", title: "Names, tags and states" },
];

export function Soldiers({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="A soldier is one AI CLI and model with a shadow name, kept open as one live session in its own worktree."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. Commands and
            screens can still change before release.
          </p>
        </Callout>

        <H2 id="what-a-soldier-is">What a soldier is</H2>
        <ul>
          <li>
            <strong>One CLI and one model</strong>, such as claude with Sonnet, with a shadow name such as Iron.
          </li>
          <li>
            <strong>One live session.</strong> Each soldier has one open session per Claude session, and related work
            builds up in it. A message is one more turn, never a new process.
          </li>
          <li>
            <strong>The vendor&apos;s harness, whole.</strong> The CLI runs as you installed it, with its own system
            prompt, tools and safeguards. Shadow Army only appends its instructions.
          </li>
          <li>
            <strong>Its own worktree.</strong> A soldier never edits your checkout directly.
          </li>
        </ul>

        <H2 id="default-army">The default army</H2>
        <Table
          head={["Soldier", "CLI and model", "Live channel", "Roles"]}
          rows={[
            [
              <span key="n" className="sd-cell-soldier">
                <SoldierDot soldier="claude" />
                Iron
              </span>,
              "claude, Sonnet",
              "stream-json, one process",
              "build",
            ],
            [
              <span key="n" className="sd-cell-soldier">
                <SoldierDot soldier="codex" />
                Igris
              </span>,
              "codex, gpt-6.1-sol",
              "codex app-server",
              "build",
            ],
            [
              <span key="n" className="sd-cell-soldier">
                <SoldierDot soldier="grok" />
                Beru
              </span>,
              "grok, Grok Build",
              "ACP (grok agent)",
              "build; never reviews",
            ],
            [
              <span key="n" className="sd-cell-soldier">
                <SoldierDot soldier="agy" />
                Tusk
              </span>,
              "agy (Antigravity)",
              "stream-json, one process",
              "research, test; never writes",
            ],
            [
              <span key="n" className="sd-cell-soldier">
                <SoldierDot soldier="claude" />
                Kaisel
              </span>,
              "claude, Opus",
              "stream-json, one process",
              "review; build for hard work",
            ],
            [
              <span key="n" className="sd-cell-soldier">
                <SoldierDot soldier="codex" />
                Bellion
              </span>,
              "codex, gpt-6-astra",
              "codex app-server",
              "review; build for hard work",
            ],
          ]}
        />
        <p>
          These six are the soldiers the bundled <code>shadow.config.json</code> and{" "}
          <code>orchestratorDelegate.md</code> list. The design names one more default shadow name, Tank
          (claude-opus-build). Tank is named but not yet defined: no shipped file lists it.
        </p>
        <p>
          Roles, cost and the limits live in <code>orchestratorDelegate.md</code>. The CLI, model and autonomy live
          in <code>shadow.config.json</code>. Both files must list the same soldiers.
        </p>

        <H2 id="hard-rules">The hard rules</H2>
        <Callout kind="danger">
          <p>
            <strong>Grok never reviews, and agy never writes.</strong> These are checked when a brief is sent and by
            each adapter&apos;s capabilities. A delegate file can restrict a soldier, never widen it.
          </p>
        </Callout>
        <ul>
          <li>Writes need the build role, and happen only in the soldier&apos;s own worktree, under its claims.</li>
          <li>
            agy always runs in a throwaway read-only snapshot. Any file it writes is discarded and reported, because
            agy&apos;s own modes do not stop it writing.
          </li>
          <li>Only the Monarch plans and assigns work.</li>
        </ul>
        <H3 id="agy-differences">How agy differs</H3>
        <p>
          agy has no slot for appended instructions, so they lead its first message. It has no approval protocol when
          it runs headless, so it skips any tool that would need your OK and the pane shows each skip. It also has no
          per-session way to add the <code>send</code> tool, so in v2.0 it replies through summaries only.
        </p>

        <H2 id="standing-instructions">Standing instructions</H2>
        <p>Once per session, each soldier is told:</p>
        <ul>
          <li>its shadow name, model and roles;</li>
          <li>the whole team with their roles, and that Claude is the Monarch;</li>
          <li>
            the hard rules, <code>rules.md</code> and its own section of <code>agent.md</code>;
          </li>
          <li>to reply in at most five lines: what was done, which files, what to check;</li>
          <li>what to do at the 200k handoff.</li>
        </ul>
        <p>
          The text stays under 1,500 tokens (it measured about 1,000 on 7 October 2026) and is fixed for the
          session&apos;s life. An edit to <code>rules.md</code> or <code>agent.md</code> reaches a soldier with its
          next fresh session.
        </p>

        <H2 id="names-and-states">Names, tags and states</H2>
        <ul>
          <li>
            <strong>Tags.</strong> Where a name does not fit, a soldier shows a two-letter tag that is unique in the
            army, such as Ir for Iron and Ig for Igris. You can pin one with <code>tag</code> in{" "}
            <code>shadow.config.json</code>.
          </li>
          <li>
            <strong>States.</strong> The army strip above the prompt shows each soldier with a state glyph. A state
            that needs you also shows its word at every width: waiting, handoff, held, log in, down and error.
          </li>
          <li>
            <strong>Colour is never the only signal.</strong> Every state has a word or glyph, and every glyph has an
            ASCII fallback.
          </li>
        </ul>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
