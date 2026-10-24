"use client";

import {
  Activity,
  BookOpen,
  Crown,
  FolderGit2,
  GitMerge,
  Lock,
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
  H2,
  Pagination,
  PageHeader,
  Ph,
  PhInline,
  SoldierDot,
  Table,
  Tabs,
} from "./blocks";
import { findPage, neighbours, type Soldier } from "./nav";

const TOC: TocItem[] = [
  { id: "get-started", title: "Get started" },
  { id: "what-you-can-do", title: "What you can do" },
  { id: "meet-the-soldiers", title: "Meet the soldiers" },
  { id: "next-steps", title: "Next steps" },
];

const SOLDIERS: { soldier: Soldier; name: string }[] = [
  { soldier: "claude", name: "Claude" },
  { soldier: "codex", name: "Codex" },
  { soldier: "grok", name: "Grok" },
  { soldier: "agy", name: "agy" },
];

export function OverviewPage() {
  const page = findPage("overview")!;
  const { prev, next } = neighbours("overview");

  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader page={page} />

      <Ph label="intro: what Shadow Army is and who it is for" lines={3} />

      <H2 id="get-started">Get started</H2>
      <Ph label="how to choose an install path" lines={2} />
      <Tabs
        items={[
          {
            label: "npm",
            content: (
              <>
                <Ph label="npm install path" lines={2} />
                <CodeBlock
                  variants={[
                    { label: "macOS, Linux", lines: ["install command", "verify command"] },
                    { label: "Windows PowerShell", lines: ["install command", "verify command"] },
                  ]}
                />
                <Callout kind="note" label="prerequisites (Node version, vendor CLIs)" />
              </>
            ),
          },
          {
            label: "From source",
            content: (
              <>
                <Ph label="build from the repository" lines={2} />
                <CodeBlock variants={[{ label: "Terminal", lines: ["clone", "install", "build", "link"] }]} />
                <Callout kind="tip" label="running the built CLI without linking" />
              </>
            ),
          },
          {
            label: "First run",
            content: (
              <>
                <Ph label="what the first command shows" lines={2} />
                <CodeBlock variants={[{ label: "Terminal", lines: ["first command"] }]} />
              </>
            ),
          },
        ]}
      />
      <Callout kind="warning" label="vendor accounts each soldier needs" />

      <H2 id="what-you-can-do">What you can do</H2>
      <Ph label="lead-in to the list of capabilities" lines={1} />
      <div className="sd-accordions">
        <Accordion icon={Crown} title="Plan the work with the Monarch" />
        <Accordion icon={Swords} title="Command several AI CLIs as one army" />
        <Accordion icon={ScrollText} title="Keep soldiers isolated with briefs and reports" />
        <Accordion icon={FolderGit2} title="Build in each soldier's own worktree" />
        <Accordion icon={Lock} title="Claim files so parallel work never collides" />
        <Accordion icon={Shield} title="Choose how much autonomy each soldier gets" />
        <Accordion icon={Activity} title="Watch a run on the live dashboard" />
        <Accordion icon={GitMerge} title="Apply a run's changes to your checkout" />
      </div>

      <H2 id="meet-the-soldiers">Meet the soldiers</H2>
      <Ph label="how soldiers differ and how the Monarch routes work to them" lines={2} />
      <Table
        head={["Soldier", "CLI", "Builds", "Reviews", "Best for"]}
        rows={SOLDIERS.map(({ soldier, name }) => [
          <span key="n" className="sd-cell-soldier">
            <SoldierDot soldier={soldier} />
            {name}
          </span>,
          <PhInline key="c" label="command" />,
          <PhInline key="b" label="yes / no" />,
          <PhInline key="r" label="yes / no" />,
          <PhInline key="f" label="one line" />,
        ])}
      />
      <Callout kind="danger" label="the hard rules no delegate file can lift" />

      <H2 id="next-steps">Next steps</H2>
      <Ph label="where to go from here" lines={1} />
      <CardGrid
        cards={[
          { title: "Quickstart", slug: "quickstart", icon: Rocket },
          { title: "How Shadow Army works", slug: "how-shadow-army-works", icon: Workflow },
          { title: "Your first army", slug: "first-army", icon: Swords },
          { title: "Configure soldiers", slug: "shadow-config", icon: Settings },
          { title: "CLI reference", slug: "cli-reference", icon: Terminal },
          { title: "Glossary", slug: "glossary", icon: BookOpen },
        ]}
      />

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
