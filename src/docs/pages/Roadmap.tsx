import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, REPO_URL, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (section 1,
 * section 5, section 6: M0 to M6, section 8: Q1 to Q7), ADR-0013 and
 * ADR-0015; and the shadow-army pull requests on GitHub, checked on 23
 * October 2026 (#75, the M1 post office, open as a draft). Shadow Army 2 is
 * not released yet, and the spec sets no dates.
 */

const TOC: TocItem[] = [
  { id: "where-things-stand", title: "Where things stand" },
  { id: "milestones", title: "The milestones" },
  { id: "acceptance", title: "How a milestone is accepted" },
  { id: "held", title: "Held designs" },
  { id: "open-questions", title: "Open questions" },
];

export function Roadmap({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="The seven milestones that take Shadow Army 2 from spikes to a release, what each brings, and what is still open."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. Its spec, v0.5, names the milestones but sets no dates. Statuses on this
            page were checked on 23 October 2026.
          </p>
        </Callout>

        <H2 id="where-things-stand">Where things stand</H2>
        <Table
          head={["Milestone", "What it brings", "Status"]}
          rows={[
            ["M0", "Spikes", "Done, 7 October 2026"],
            [
              "M1",
              "The post office and the claude channel",
              <>
                In progress:{" "}
                <a href={`${REPO_URL}/pull/75`} target="_blank" rel="noreferrer">
                  PR #75
                </a>{" "}
                is a draft
              </>,
            ],
            ["M2", "The codex, grok and agy channels", "No pull request yet"],
            ["M3", "Messaging", "No pull request yet"],
            ["M4", "Sessions", "No pull request yet"],
            ["M5", "The mod's screens", "No pull request yet"],
            ["M6", "Workspaces, safety and removing old code", "No pull request yet"],
          ]}
        />
        <p>
          Every milestone is one or more pull requests under{" "}
          <a href={`${REPO_URL}/issues/63`} target="_blank" rel="noreferrer">
            issue #63
          </a>
          , and each one maps its acceptance criteria to evidence.
        </p>

        <H2 id="milestones">The milestones</H2>

        <H3 id="m0">M0: Spikes</H3>
        <p>
          Five short experiments, done on 7 October 2026. Their report is on #63, and the spec applies their findings.
        </p>
        <ul>
          <li>
            <strong>The pane</strong>: its width at 144, 110 and 80 columns, its keys and where it sits.
          </li>
          <li>
            <strong>Waking the Monarch</strong>: adding a summary to Claude&apos;s conversation and starting a turn,
            what it costs and when it is allowed.
          </li>
          <li>
            <strong>Usage and caches</strong>: each provider&apos;s context-size field and cache lifetime.
          </li>
          <li>
            <strong>The send tool</strong>: how each CLI accepts the extra MCP server that carries <code>send</code>.
          </li>
          <li>
            <strong>Approval relay</strong>: how each channel shows a permission request and takes an answer.
          </li>
        </ul>

        <H3 id="m1">M1: The post office and the claude channel</H3>
        <p>
          The post office starts with the army&apos;s first use and stops with your session, bound only to the
          loopback address and guarded by the Monarch&apos;s credential. A claude soldier runs as one live session,
          with the standing instructions appended. The roster loads from <code>shadow.config.json</code> and{" "}
          <code>orchestratorDelegate.md</code>, and CI runs on three systems with no model calls. See{" "}
          <Link href={hrefOf("how-shadow-army-works")}>How Shadow Army works</Link>.
        </p>

        <H3 id="m2">M2: The codex, grok and agy channels</H3>
        <p>
          The other three CLIs join, each through its own live channel. Approval requests from claude, codex and grok
          are shown word for word, and only you answer them. A sixth spike, S6, starts the milestone: how each CLI stops a running turn and keeps
          its session. See <Link href={hrefOf("soldiers-overview")}>Soldiers overview</Link>.
        </p>

        <H3 id="m3">M3: Messaging</H3>
        <p>
          <code>send</code> and <code>/send</code> deliver briefs by name, summaries come back as cards of at most five
          lines, soldiers can message each other, and briefs are checked against the hard rules before they go. You
          can stop a turn and see or change the queue. See <Link href={hrefOf("send")}>Send work</Link> and{" "}
          <Link href={hrefOf("steer")}>Stop, queue and decide</Link>.
        </p>

        <H3 id="m4">M4: Sessions</H3>
        <p>
          The meter, the 200k handoff, <code>/fresh</code>, the cold timer, <code>/sessions</code> and resuming after
          a crash. See <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
        </p>

        <H3 id="m5">M5: The mod&apos;s screens</H3>
        <p>
          The pane, the strip, the status-line entry and toasts, drawn to match the design canvas at 144, 110 and 80
          columns. The first tab lists the decisions, and the digest arrives after you have been away. See{" "}
          <Link href={hrefOf("pane")}>The pane and the strip</Link>.
        </p>

        <H3 id="m6">M6: Workspaces, safety and removing old code</H3>
        <p>
          Worktrees, claims, the checkout guard, link safety, and all-or-nothing apply with undo, on the v2 code paths.
          The summary card&apos;s facts come from git and the tool-call record, and <code>/diff</code> and{" "}
          <code>/apply</code> work. Code that only v1 used leaves <code>main</code>. See{" "}
          <Link href={hrefOf("apply-changes")}>Apply a soldier&apos;s changes</Link> and{" "}
          <Link href={hrefOf("worktrees")}>Soldier worktrees</Link>.
        </p>

        <H2 id="acceptance">How a milestone is accepted</H2>
        <ul>
          <li>
            Each acceptance criterion cites the requirements it proves, and every requirement a milestone implements is
            cited by one of them. A script checks this in CI and fails the build on a gap.
          </li>
          <li>A requirement&apos;s tests land in the same pull request as its code.</li>
          <li>
            CI runs every test level except live checks on ubuntu, macos and windows, and never calls a model.
          </li>
          <li>
            Live checks are the owner&apos;s. For each CLI, a live session must cost within 5% of the CLI&apos;s own
            run, and its follow-up must read no file. The budget is at most $2 of reported cost per release, and each
            check is written up on its milestone&apos;s pull request.
          </li>
        </ul>
        <p>
          See <Link href={hrefOf("spec")}>Specification</Link> for the evidence codes and traceability rules.
        </p>

        <H2 id="held">Held designs</H2>
        <p>
          Two whole-screen designs from the v2.1 exploration wait on something v2 does not have yet:
        </p>
        <ul>
          <li>
            <strong>War Table</strong>, the pane as a full-width board of soldier cards around the Monarch, until a pane
            can take the whole width.
          </li>
          <li>
            <strong>Campaign Timeline</strong>, a lane per soldier on one clock, until the post office keeps one
            ordered event log.
          </li>
        </ul>

        <H2 id="open-questions">Open questions</H2>
        <Table
          head={["", "Question"]}
          rows={[
            ["Q1", "Should the army offer an opt-in that keeps the Monarch from writing in the checkout?"],
            ["Q2", "What does waking the Monarch cost, and should it be on by default?"],
            ["Q3", "Grok's 500k window is an opt-in setting. Does Grok charge more per token for long requests?"],
            ["Q4", "Will agy gain an instructions slot, or an approval protocol in headless mode?"],
            [
              "Q5",
              "Do the official ACP adapters for Claude Code and Codex keep the vendor harness as installed? If so, they could replace Shadow Army's own.",
            ],
            ["Q6", "POSIX and macOS terminals need a live check before v2.0.0."],
            ["Q7", "codex can add to a running turn. Should v2 offer “redirect without stopping” where a CLI allows it?"],
          ]}
        />
      </div>

      <FromV1>
        <p>
          v1&apos;s roadmap was nine features, F1 to F9: the banner, the adapters, <code>sa summon</code>, the Shadow
          Vault, the router, worktrees and the claim audit, <code>sa run</code>, the live dashboard, and formations. v1
          is frozen at <code>v1.0.1</code>, and the <code>legacy/v1</code> branch keeps its code.
        </p>
        <p>
          M6 removes the parts only v1 used, the Ink chat, the live dashboard and the Monarch pipeline, once v2 covers
          what they did. <code>main</code> keeps building and passing its tests at every step.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
