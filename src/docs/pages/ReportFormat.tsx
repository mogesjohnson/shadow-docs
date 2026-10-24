import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (MSG-4,
 * MSG-5, MSG-11, PO-6, PO-8, CH-1, OBS-3, SES-7) for v2, and
 * src/core/brief.ts and src/core/types.ts for v1's report. Shadow Army 2 is
 * not released yet.
 */

const TOC: TocItem[] = [
  { id: "summary-and-report", title: "Summary and report" },
  { id: "card", title: "The summary card" },
  { id: "endings", title: "How a message ends" },
  { id: "records", title: "What is recorded" },
];

export function ReportFormat({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="What comes back from a soldier: a summary of at most five lines, the full report on disk, and the facts on the card."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the accepted design. The facts on the card arrive with
            the workspace milestone, the last one before release.
          </p>
        </Callout>

        <H2 id="summary-and-report">Summary and report</H2>
        <ul>
          <li>
            <strong>The summary</strong> is at most five lines: what was done, which files, what to check. A longer reply
            is cut with &hellip; It goes back to whoever sent the message.
          </li>
          <li>
            <strong>The report</strong> is the soldier&apos;s whole reply, saved under <code>.shadow/reports/</code>.
          </li>
        </ul>
        <p>
          A turn&apos;s result is its summary. When the turn completed, or the model refused, the message is answered
          with that result. A refusal is not an error: it carries the model&apos;s own words, marked as a refusal.
        </p>

        <H2 id="card">The summary card</H2>
        <p>
          For the Monarch the summary arrives as a card titled &ldquo;answered&rdquo;, with the report&apos;s path.
          Beside that it states these facts, taken from the post office&apos;s own records and never from the
          summary&apos;s text:
        </p>
        <Table
          head={["Fact", "Where it comes from", "Values"]}
          rows={[
            [
              <code key="f">changes</code>,
              "Git, on the soldier's branch",
              'The files and lines the turn changed, or "none".',
            ],
            [
              <code key="f">tests</code>,
              "The tool-call record, matched against the soldier's tests patterns",
              'Whether a test command ran and whether it passed, by its exit code where the CLI reports one, or "not run".',
            ],
            [<code key="f">applied</code>, "The apply record", '"not yet", or when the changes were applied to the folder.'],
          ]}
        />
        <p>
          The card also gives the report&apos;s path and the commands that act on the work, <code>/diff</code> and{" "}
          <code>/apply</code>. A summary that claims tests passed when none ran still shows &ldquo;not run&rdquo;. The{" "}
          <code>tests</code> patterns are set in <Link href={hrefOf("config-schema")}>the config schema</Link>.
        </p>

        <H2 id="endings">How a message ends</H2>
        <Table
          head={["Ending", "When", "What it keeps"]}
          rows={[
            [
              "answered",
              "The turn completed, or the model refused.",
              "The turn's result as the summary.",
            ],
            [
              "interrupted",
              "The turn failed, was cut short, or you stopped it; or you answered n to a guard card.",
              "The CLI's own error or reason word for word, with its kind (a rate limit, a context overflow, a login needed or another error). The changes made so far stay, and the row shows them.",
            ],
            ["not delivered", "It never reached the session.", "The reason. Nothing was sent."],
            ["cancelled", "You cancelled it while it was queued.", "Nothing."],
          ]}
        />
        <p>
          A turn ends once, and only when the work it started has stopped. See{" "}
          <Link href={hrefOf("briefs-and-reports")}>Briefs and reports</Link> for the delivery states.
        </p>

        <H2 id="records">What is recorded</H2>
        <ul>
          <li>Every summary and message is stored with its id, time, sender, recipient and delivery state.</li>
          <li>
            Each turn&apos;s usage is stored with the CLI&apos;s raw fields kept beside the normalized ones, which is
            what <code>/sessions</code> adds up.
          </li>
          <li>Logs and records are redacted on every write.</li>
        </ul>
      </div>

      <FromV1>
        <p>
          In v1 the reply format was a fenced block at the end of the soldier&apos;s reply, and a parser read the last
          one:
        </p>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "shadow-report",
              lines: [
                "```shadow-report",
                '{"summary": "what you did or found, in a few sentences", "filesTouched": [], "openQuestions": [], "notes": []}',
                "```",
              ],
            },
          ]}
        />
        <Table
          head={["Field", "Meaning"]}
          rows={[
            [<code key="f">summary</code>, "Required. What was done or found."],
            [<code key="f">filesTouched</code>, "Files the soldier says it changed. Default: none."],
            [<code key="f">openQuestions</code>, "Questions for the Monarch. Default: none."],
            [<code key="f">notes</code>, "Notes worth keeping for the whole army, proposed for the vault. Default: none."],
          ]}
        />
        <ul>
          <li>
            A missing or malformed block fell back to the raw text as the summary, and the report was marked as not
            structured.
          </li>
          <li>
            v1&apos;s report object added what the program knew: soldier, role, model, status (<code>ok</code> or{" "}
            <code>error</code>), duration, tokens, cost, the model that actually answered, the branch and what the audit
            reverted, the autonomy level it ran at, and the checkout guard&apos;s findings.
          </li>
          <li>
            The v2 specification does not say whether the <code>shadow-report</code> block stays. It asks for the
            five-line reply instead.
          </li>
        </ul>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
