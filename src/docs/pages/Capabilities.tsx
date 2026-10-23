import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): v1's src/adapters/Adapter.ts and
 * the four adapters' capabilities, CLAUDE.md (design rules), and
 * docs/spec/v2.md v0.5 (ARM-2, CH-6, CH-8 to CH-10, PO-4, PO-8, SES-6).
 * Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "write-and-review", title: "Write and review" },
  { id: "what-else", title: "What else an adapter declares" },
  { id: "restrict", title: "Capabilities only restrict" },
];

export function Capabilities({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Each adapter declares what its CLI can do at all. The roster can only narrow that, never widen it."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The write and review capabilities are v1&apos;s, and carry over; the rest
            is what v2&apos;s spec asks each adapter to declare.
          </p>
        </Callout>

        <H2 id="write-and-review">Write and review</H2>
        <Table
          head={["CLI", "write", "review"]}
          rows={[
            [<code key="c">claude</code>, "true", "true"],
            [<code key="c">codex</code>, "true", "true"],
            [<code key="c">grok</code>, "true", "false"],
            [<code key="c">agy</code>, "false", "false"],
          ]}
        />
        <p>
          These are where the hard rules live in code, beside the check made when a brief is sent: Grok never reviews,
          and agy never writes.
        </p>

        <H2 id="what-else">What else an adapter declares</H2>
        <ul>
          <li>
            <strong>Whether it has an approval relay.</strong> agy&apos;s adapter declares that it has none.
          </li>
          <li>
            <strong>Whether it has an interrupt.</strong> A CLI without one is stopped by ending its process tree and
            resuming the session by id.
          </li>
          <li>
            <strong>Whether it can resume</strong> a session by id after a crash.
          </li>
          <li>
            <strong>Whether it can add the <code>send</code> tool</strong> per session. agy cannot, so agy soldiers
            reply through summaries only.
          </li>
          <li>
            <strong>Its cache rules:</strong> a table of which changes to model, effort or tools keep the cache and
            which reset it, with the CLI version it was read from.
          </li>
          <li>
            <strong>Its session services:</strong> where its CLI declares language servers and MCP servers, and their
            helpers, with the CLI version it was read from.
          </li>
          <li>
            <strong>The CLI version</strong> its contract fixtures were recorded with.
          </li>
        </ul>

        <H2 id="restrict">Capabilities only restrict</H2>
        <p>
          A soldier&apos;s roles in <code>orchestratorDelegate.md</code> can take a capability away, for example a
          codex soldier with only the build role. No roster entry can give a soldier a capability its adapter lacks.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
