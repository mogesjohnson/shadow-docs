import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, REPO_URL, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (its header
 * table, sections 0 to 8, Appendix A and Appendix B), docs/legacy/README.md
 * and ADR-0013. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "where-it-is", title: "Where it is" },
  { id: "how-to-read-it", title: "How to read it" },
  { id: "evidence", title: "Evidence codes" },
  { id: "sections", title: "What is in it" },
  { id: "traceability", title: "Traceability" },
  { id: "how-it-changes", title: "How it changes" },
];

const SPEC_URL = `${REPO_URL}/blob/main/docs/spec/v2.md`;

export function Spec({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="The Shadow Army 2 specification: where it lives, how its requirements are written, and how each one is proved."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development, and its spec is a draft for review, at v0.5 of 13 October 2026. These docs
            follow that version.
          </p>
        </Callout>

        <H2 id="where-it-is">Where it is</H2>
        <p>
          The spec is one file,{" "}
          <a href={SPEC_URL} target="_blank" rel="noreferrer">
            <code>docs/spec/v2.md</code>
          </a>
          , in the shadow-army repository. Its header names the owner, the tracking issue (#63), the design canvas
          version it matches, and the decisions behind it, ADR-0008 to ADR-0015. See{" "}
          <Link href={hrefOf("decisions")}>Architecture decisions</Link>.
        </p>

        <H2 id="how-to-read-it">How to read it</H2>
        <ul>
          <li>
            <strong>Requirement words.</strong> MUST, MUST NOT, SHOULD and MAY mean what RFC 2119 and RFC 8174 say, and
            only when they are in capitals.
          </li>
          <li>
            <strong>Requirement IDs.</strong> Each requirement has an ID such as <code>PO-2</code>. IDs are stable and
            never reused. A dropped requirement stays in place, marked withdrawn.
          </li>
          <li>
            <strong>Milestone and evidence.</strong> Each requirement names the milestone that builds it and the kinds
            of evidence that prove it, as in &ldquo;<strong>VER-3</strong> (M1; R)&rdquo;.
          </li>
          <li>
            <strong>Carried over.</strong> A requirement that comes from an earlier design names its source.
          </li>
        </ul>

        <H2 id="evidence">Evidence codes</H2>
        <Table
          head={["Code", "Evidence", "What it means"]}
          rows={[
            ["U", "Unit test", "Pure logic, with vitest: routing and the hard rules, the meter's maths, parsers, redaction, config checks."],
            ["C", "Contract test", "A session the owner recorded once from a real CLI, replayed through its adapter."],
            ["I", "Integration test", "Fake claude, codex, grok and agy programs that speak each CLI's protocol, with the post office end to end."],
            ["X", "Security test", "Non-loopback addresses refused, wrong secrets refused, logs redacted, no approval path in the mod."],
            ["F", "Fault test", "Killed CLIs, rate limits, split JSON lines, expired logins, caches going cold, broken links and more."],
            ["S", "Screen snapshot", "The mod's screens at 144, 110 and 80 columns and 24 rows, and in ASCII, against committed snapshots."],
            ["L", "Live check", "The owner runs the two-prompt task on each CLI, with a budget of $2 of reported cost per release."],
            ["R", "Review", "The reviewer finds the requirement in the code and cites the file and line."],
          ]}
        />

        <H2 id="sections">What is in it</H2>
        <Table
          head={["Section", "Covers"]}
          rows={[
            ["0. Reading this spec", "The conventions above."],
            ["1. Goals and non-goals", "G1 to G7, from Claude as the Monarch to every requirement verified."],
            ["2. Glossary", "Monarch, soldier, post office, channel, live session, queue, stop, brief, summary and more."],
            ["3. Architecture", "How the owner, Claude, the mod, the post office and the soldier CLIs connect."],
            [
              "4. Requirements",
              "The mod (HOST), the post office (PO), channels (CH), standing instructions (SI), messaging (MSG), sessions (SES), the army (ARM), workspaces (WSP), security (SEC), visual design (VIS), settings (SET) and observability (OBS).",
            ],
            ["5. Verification", "The evidence levels, the VER rules and leaving the old code behind (LEG)."],
            [
              "6. Milestones",
              <>
                M0 to M6, each with the requirements it builds and its acceptance criteria. See{" "}
                <Link href={hrefOf("roadmap")}>Roadmap</Link>.
              </>,
            ],
            ["7. Decisions", "The ADR table."],
            ["8. Open questions", "Q1 to Q7."],
            ["Appendix A", "Which requirements carry over, and from where."],
            ["Appendix B", "The traceability rules."],
          ]}
        />

        <H2 id="traceability">Traceability</H2>
        <p>Appendix B keeps the spec checkable:</p>
        <ol>
          <li>Every requirement ID appears exactly once as a requirement.</li>
          <li>Every requirement names its milestone and at least one evidence code.</li>
          <li>Every requirement is in the Implements line of the milestone it names.</li>
          <li>
            Every acceptance criterion cites at least one requirement, and every requirement a milestone implements is
            cited by one of its criteria.
          </li>
          <li>IDs are never reused, and a withdrawn requirement keeps its ID.</li>
          <li>Every carried-over requirement appears in Appendix A.</li>
        </ol>
        <p>
          Requirement VER-7, in M1, adds <code>scripts/check-spec-trace.mjs</code>, which checks rules 1 to 4 and 6 in
          CI and fails the build on a gap.
        </p>

        <H2 id="how-it-changes">How it changes</H2>
        <p>
          Each version of the spec lands as a reviewed pull request under #63, and the header&apos;s version line says
          what it added. A change proposed in an open pull request is not part of the spec until it merges, and these
          docs do not describe it. Every version so far is on the <Link href={hrefOf("changelog")}>Changelog</Link>.
        </p>
      </div>

      <FromV1>
        <p>
          The v2 spec supersedes the Shadow Army 2.0 spec, <code>docs/legacy/spec/shadow-army-2.0.md</code>, archived
          at v0.16 on 7 October 2026 and kept unchanged for reference. Its workspace and safety rules, its terminal UI
          decisions and its review history still inform v2.
        </p>
        <p>
          Requirements v2 carries over from v1 or from 2.0, such as the worktree, guard and apply rules (WSP-1 to
          WSP-9), cite their source in Appendix A, so their history stays traceable.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
