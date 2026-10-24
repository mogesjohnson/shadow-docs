import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (ARM-2,
 * ARM-4, ARM-5, ARM-6, CH-6, CH-7, HOST-12, HOST-13, MSG-1, MSG-6, PO-2 to
 * PO-4, WSP-8, section 1 non-goals), ADR-0010 and CLAUDE.md. Shadow Army 2
 * is not released yet.
 */

const TOC: TocItem[] = [
  { id: "the-two-rules", title: "The two hard rules" },
  { id: "the-army", title: "Rules of the army" },
  { id: "vendors", title: "Rules about vendors" },
  { id: "your-machine", title: "Rules about your machine" },
];

export function HardRules({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="The rules Shadow Army enforces in code, whatever a config file, a brief or a model says."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. These rules are in its accepted design.
          </p>
        </Callout>

        <H2 id="the-two-rules">The two hard rules</H2>
        <Callout kind="danger">
          <p>
            <strong>Grok never reviews, and agy never writes.</strong>
          </p>
        </Callout>
        <Table
          head={["Rule", "Where it is enforced"]}
          rows={[
            ["Grok never reviews", "A review brief for Grok is refused before it is sent, and by the grok adapter's capabilities"],
            [
              "agy never writes",
              "A build brief for agy is refused; agy always runs in a read-only snapshot, and its writes are discarded",
            ],
          ]}
        />
        <p>A delegate file can restrict a soldier further. It can never lift either rule.</p>

        <H2 id="the-army">Rules of the army</H2>
        <ul>
          <li>
            <strong>Only the Monarch assigns work.</strong> Soldiers answer, ask and report. A soldier can message
            another, but never brief it.
          </li>
          <li>
            <strong>Writes need the build role</strong>, and happen only in the soldier&apos;s own worktree, under its
            claims.
          </li>
          <li>
            <strong>Only briefs and summaries cross between models.</strong> A message never carries a transcript or a
            file&apos;s contents. A soldier&apos;s words reach another model only as its quoted words, never as your
            instructions or the Monarch&apos;s.
          </li>
        </ul>

        <H2 id="vendors">Rules about vendors</H2>
        <ul>
          <li>
            <strong>Harnesses stay whole.</strong> No adapter replaces a system prompt, removes a tool or passes a flag
            that disables a safeguard. Shadow Army&apos;s instructions are only appended.
          </li>
          <li>
            <strong>Nothing approves for you.</strong> The mod may observe or deny a tool call or permission, never
            approve one. Every approval request reaches you word for word, and a stop cancels open requests without
            approving them.
          </li>
          <li>
            <strong>Autonomy only picks the vendor&apos;s own flags.</strong>
          </li>
        </ul>

        <H2 id="your-machine">Rules about your machine</H2>
        <ul>
          <li>
            <strong>Local only.</strong> The post office and every port a channel opens bind to 127.0.0.1 or ::1. Any
            other address is refused at start.
          </li>
          <li>
            <strong>Secrets stay off disk.</strong> The Monarch&apos;s secret is new at every start and travels only on
            the post office&apos;s standard input. Each soldier&apos;s credential can only send messages.
          </li>
          <li>
            <strong>Logs are redacted.</strong> <code>redact()</code> runs on every write to logs, records and briefs.
          </li>
          <li>
            <strong>Your permissions stay yours.</strong> The mod does not change what Claude may do in your checkout.
          </li>
        </ul>
      </div>
      <FromV1>
        <ul>
          <li>
            Most of these rules carry over from v1, among them the two hard rules and the roster files they
            apply to (ADR-0013).
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
