"use client";

import Link from "next/link";
import {
  BookOpen,
  Crown,
  FolderGit2,
  GitMerge,
  Gauge,
  ListChecks,
  PanelRight,
  Rocket,
  ScrollText,
  Settings,
  Shield,
  Swords,
  Terminal,
  Workflow,
} from "lucide-react";
import { DocsShell, type TocItem } from "./DocsShell";
import {
  Accordion,
  Callout,
  CardGrid,
  CodeBlock,
  Feedback,
  FromV1,
  H2,
  Pagination,
  PageHeader,
  SoldierDot,
  Table,
  Tabs,
} from "./blocks";
import { findPage, hrefOf, neighbours, type Soldier } from "./nav";

/*
 * Sources (shadow-army main at ab04992): README.md, docs/claude-first.md,
 * docs/spec/v2.md v0.5 (sections 1 and 3, HOST-1, HOST-9, ARM-2, ARM-3,
 * CH-2 to CH-5) and the v1.0.0 and v1.0.1 release notes. Shadow Army 2 is
 * not released yet; this page describes the accepted design.
 */

const TOC: TocItem[] = [
  { id: "get-started", title: "Get started" },
  { id: "what-you-can-do", title: "What you can do" },
  { id: "meet-the-soldiers", title: "Meet the soldiers" },
  { id: "next-steps", title: "Next steps" },
];

const SOLDIERS: { soldier: Soldier; name: string; cli: string; builds: string; reviews: string; best: string }[] = [
  { soldier: "claude", name: "Iron", cli: "claude", builds: "yes", reviews: "no", best: "Everyday features, refactors and tests" },
  { soldier: "codex", name: "Igris", cli: "codex", builds: "yes", reviews: "no", best: "Building features end to end" },
  { soldier: "grok", name: "Beru", cli: "grok", builds: "yes", reviews: "never", best: "Creating new features quickly" },
  { soldier: "agy", name: "Tusk", cli: "agy", builds: "never", reviews: "no", best: "Research, and running and analysing tests" },
];

export function OverviewPage() {
  const page = findPage("overview")!;
  const { prev, next } = neighbours("overview");

  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Shadow Army lets your Claude Code session lead the other AI coding CLIs you already use, as one army, without sharing their conversations."
      />
      <div className="sd-prose">
        <p>
          You keep working in Claude Code. Claude becomes the Monarch: it plans, sends short briefs to soldiers by name
          and reads their short summaries. Each soldier is one live session of claude, codex, grok or agy, open in its
          own git worktree, with the vendor&apos;s harness exactly as you installed it. Only briefs and summaries cross
          between models, so no soldier pays for another&apos;s history.
        </p>
        <Callout kind="note">
          <p>
            <strong>Shadow Army 2 is in development.</strong> These docs describe the design the owner has accepted
            (spec v0.5). There is no release yet.
          </p>
        </Callout>

        <H2 id="get-started">Get started</H2>
        <p>Shadow Army 2 is a Claude Code plugin. Nothing is installed globally, and nothing listens on the network.</p>
        <Tabs
          items={[
            {
              label: "Load the mod",
              content: (
                <>
                  <p>
                    The mod ships in the Shadow Army repository. You load it with <code>--plugin-dir</code> or install
                    it from that repository; it never comes from a marketplace.
                  </p>
                  <CodeBlock
                    placeholder={false}
                    variants={[{ label: "Terminal", lines: ["claude --plugin-dir <path to the Shadow Army mod>"] }]}
                  />
                  <Callout kind="note">
                    <p>The mod&apos;s folder and the exact steps are set when its screens ship.</p>
                  </Callout>
                </>
              ),
            },
            {
              label: "First run",
              content: (
                <>
                  <p>
                    The mod starts its local helper, the post office, the first time you use the army in a session.
                    Check who is ready:
                  </p>
                  <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/army"] }]} />
                  <p>Then ask Claude for work in plain words, or brief a soldier yourself:</p>
                  <CodeBlock
                    placeholder={false}
                    variants={[{ label: "Claude Code", lines: ["/send Iron --kind build Add a health check route"] }]}
                  />
                </>
              ),
            },
          ]}
        />
        <Callout kind="warning">
          <p>
            Each soldier runs on your own account with its vendor. Install and sign in to each CLI you want in the army
            before you start: <code>claude</code>, <code>codex</code>, <code>grok</code> or <code>agy</code>.
          </p>
        </Callout>

        <H2 id="what-you-can-do">What you can do</H2>
        <p>Everything below is in the accepted design. Each item links to the page that covers it.</p>
        <div className="sd-accordions">
          <Accordion icon={Crown} title="Lead the army from your own Claude session">
            <p>
              No separate Monarch CLI plans for you. Claude decides who does what and briefs soldiers with its{" "}
              <code>send</code> tool. See <Link href={hrefOf("the-monarch")}>The Monarch</Link>.
            </p>
          </Accordion>
          <Accordion icon={Swords} title="Keep each soldier's session open">
            <p>
              A message is one more turn in a soldier&apos;s open session, never a new process. Measured on 7 October
              2026, a live session costs within about 5% of the CLI&apos;s own run, and follow-ups do not re-read
              files. See <Link href={hrefOf("how-shadow-army-works")}>How Shadow Army works</Link>.
            </p>
          </Accordion>
          <Accordion icon={ScrollText} title="Send briefs, get five-line summaries">
            <p>
              A soldier answers in at most five lines, and the full report stays on disk. See{" "}
              <Link href={hrefOf("briefs-and-reports")}>Briefs and reports</Link>.
            </p>
          </Accordion>
          <Accordion icon={PanelRight} title="Watch any soldier as it works">
            <p>
              The army strip shows every soldier on one line above the prompt. The pane shows one soldier&apos;s live
              session, its meter and a field to type into. See{" "}
              <Link href={hrefOf("pane")}>The pane and the strip</Link>.
            </p>
          </Accordion>
          <Accordion icon={ListChecks} title="Stop a turn, edit the queue, answer decisions">
            <p>
              Stop a soldier mid-turn and keep its session. See, change or cancel what waits in its queue. Everything
              that needs you is in one list. See <Link href={hrefOf("steer")}>Stop, queue and decide</Link>.
            </p>
          </Accordion>
          <Accordion icon={Gauge} title="See what each session costs">
            <p>
              Each soldier has a meter up to its 200k handoff, a warning before a message goes to a cold cache, and{" "}
              <code>/sessions</code> for the day&apos;s usage. See{" "}
              <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
            </p>
          </Accordion>
          <Accordion icon={FolderGit2} title="Build in worktrees, under claims">
            <p>
              Soldiers never edit your checkout. Each writes in its own worktree, only inside the files it claimed. See{" "}
              <Link href={hrefOf("worktrees")}>Soldier worktrees</Link>.
            </p>
          </Accordion>
          <Accordion icon={GitMerge} title="Review and apply a soldier's changes">
            <p>
              <code>/diff</code> shows a soldier&apos;s changes, <code>/apply</code> copies them into your folder all
              or nothing, and <code>/apply undo</code> puts it back. See{" "}
              <Link href={hrefOf("apply-changes")}>Apply a soldier&apos;s changes</Link>.
            </p>
          </Accordion>
          <Accordion icon={Shield} title="Keep every vendor safeguard">
            <p>
              Shadow Army never replaces a system prompt, removes a tool or disables a safeguard, and never answers an
              approval request for you. See <Link href={hrefOf("hard-rules")}>Hard rules</Link>.
            </p>
          </Accordion>
        </div>

        <H2 id="meet-the-soldiers">Meet the soldiers</H2>
        <p>
          The default army has four soldiers, one per CLI. Claude routes work by each soldier&apos;s roles and cost,
          from <code>orchestratorDelegate.md</code>. None of the four reviews: add Kaisel (claude-opus) or Bellion
          (codex-astra) for reviews and hard builds.
        </p>
        <Table
          head={["Soldier", "CLI", "Builds", "Reviews", "Best for"]}
          rows={SOLDIERS.map(({ soldier, name, cli, builds, reviews, best }) => [
            <span key="n" className="sd-cell-soldier">
              <SoldierDot soldier={soldier} />
              {name}
            </span>,
            <code key="c">{cli}</code>,
            builds,
            reviews,
            best,
          ])}
        />
        <Callout kind="danger">
          <p>
            <strong>Grok never reviews, and agy never writes.</strong> A brief that breaks either rule is refused
            before it is sent. A delegate file can restrict a soldier further, never lift these.
          </p>
        </Callout>

        <H2 id="next-steps">Next steps</H2>
        <CardGrid
          cards={[
            { title: "Quickstart", slug: "quickstart", icon: Rocket, text: "A first session, step by step, as planned." },
            {
              title: "How Shadow Army works",
              slug: "how-shadow-army-works",
              icon: Workflow,
              text: "The Monarch, the post office and live sessions.",
            },
            { title: "Your first army", slug: "first-army", icon: Swords, text: "Send a build and read what comes back." },
            {
              title: "Configure soldiers",
              slug: "shadow-config",
              icon: Settings,
              text: "shadow.config.json: CLIs, models and autonomy.",
            },
            { title: "CLI reference", slug: "cli-reference", icon: Terminal, text: "Every command the mod adds." },
            { title: "Glossary", slug: "glossary", icon: BookOpen, text: "Monarch, soldier, brief, handoff, cold." },
          ]}
        />
      </div>
      <FromV1>
        <ul>
          <li>
            The old per-message <code>sa</code> CLI is v1. It is frozen at <code>v1.0.1</code>, and these docs do not
            cover it.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
