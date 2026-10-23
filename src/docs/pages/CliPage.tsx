import type { ReactNode } from "react";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/** One soldier CLI's page: the facts the v2 spec gives for it, in a fixed order. */
export type CliFacts = {
  description: string;
  milestone: string;
  glance: [string, ReactNode][];
  channel: ReactNode;
  instructions: ReactNode;
  turns: ReactNode;
  meter: ReactNode;
  approvals: ReactNode;
  stopping: ReactNode;
  /** Anything else worth knowing about this CLI. */
  notes?: ReactNode;
  measured: { task: [string, string]; followUp: [string, string]; note?: string };
};

const TOC: TocItem[] = [
  { id: "at-a-glance", title: "At a glance" },
  { id: "live-channel", title: "The live channel" },
  { id: "instructions", title: "Standing instructions" },
  { id: "turns", title: "How a turn ends" },
  { id: "meter", title: "The meter and the cache" },
  { id: "approvals", title: "Approvals" },
  { id: "stopping", title: "Stopping and resuming" },
  { id: "measured", title: "Measured cost" },
];

export function CliPage({ page, facts }: { page: PageEntry; facts: CliFacts }) {
  const { prev, next } = neighbours(page.slug);
  const toc = facts.notes ? [...TOC.slice(0, 7), { id: "notes", title: "Also worth knowing" }, TOC[7]] : TOC;
  return (
    <DocsShell current={page} toc={toc}>
      <PageHeader page={page} description={facts.description} />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted. This channel is
            planned for milestone {facts.milestone}.
          </p>
        </Callout>

        <H2 id="at-a-glance">At a glance</H2>
        <Table head={["What", "This CLI"]} rows={facts.glance.map(([k, v]) => [<strong key="k">{k}</strong>, v])} />

        <H2 id="live-channel">The live channel</H2>
        {facts.channel}

        <H2 id="instructions">Standing instructions</H2>
        {facts.instructions}

        <H2 id="turns">How a turn ends</H2>
        {facts.turns}

        <H2 id="meter">The meter and the cache</H2>
        {facts.meter}

        <H2 id="approvals">Approvals</H2>
        {facts.approvals}

        <H2 id="stopping">Stopping and resuming</H2>
        {facts.stopping}

        {facts.notes && (
          <>
            <H2 id="notes">Also worth knowing</H2>
            {facts.notes}
          </>
        )}

        <H2 id="measured">Measured cost</H2>
        <p>
          The two-prompt task (&ldquo;read two files, say what the project is&rdquo;, then &ldquo;which file has more
          lines?&rdquo;), run on 7 October 2026 as the CLI&apos;s own headless run and through a live session:
        </p>
        <Table
          head={["Prompt", "Normal run", "Live session"]}
          rows={[
            ["Task", facts.measured.task[0], facts.measured.task[1]],
            ["Follow-up", facts.measured.followUp[0], facts.measured.followUp[1]],
          ]}
        />
        {facts.measured.note && <p>{facts.measured.note}</p>}
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
