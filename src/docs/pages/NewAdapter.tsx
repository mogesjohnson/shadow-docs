import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (CH-1,
 * CH-6 to CH-10, PO-1, PO-2, PO-4, PO-8, SI-2, SI-4, SES-2, SES-6,
 * section 5: contract, integration and fault tests, VER-4, VER-5, VER-9),
 * ADR-0009, ADR-0010, CONTRIBUTING.md and the v1 README (F9). Shadow
 * Army 2 is not released yet, and has no adapter scaffold.
 */

const TOC: TocItem[] = [
  { id: "before-you-start", title: "Before you start" },
  { id: "what-to-build", title: "What to build" },
  { id: "how-to-test", title: "How to test it" },
  { id: "landing", title: "Landing it" },
];

export function NewAdapter({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="What a fifth CLI needs before it can join the army, as the v2 spec requires of the four that exist."
      />
      <div className="sd-prose">
        <Callout kind="warning">
          <p>
            <strong>No scaffold yet.</strong> Shadow Army 2 has no command that starts an adapter for you. This page
            lists what its spec requires of every adapter, so a new one can be planned against it.
          </p>
        </Callout>

        <H2 id="before-you-start">Before you start</H2>
        <ul>
          <li>
            The CLI needs a <strong>live-session interface</strong>: a way to keep one conversation open and send it
            one message at a time. A CLI that only runs one prompt per process cannot be a v2 soldier.
          </li>
          <li>
            Find its <strong>append slot</strong> for instructions. If it has none, the instructions lead the first
            message, as agy&apos;s do.
          </li>
          <li>
            Shadow Army does not put a third-party adapter between the post office and a vendor&apos;s CLI. The adapter
            speaks the CLI&apos;s own channel.
          </li>
        </ul>

        <H2 id="what-to-build">What to build</H2>
        <ol>
          <li>
            The shared interface: open, send, interrupt, stream events, close. See{" "}
            <Link href={hrefOf("adapter-protocol")}>Adapter protocol</Link>.
          </li>
          <li>Instructions through the append slot, never in place of the vendor&apos;s prompt.</li>
          <li>
            Turn ends: map the CLI&apos;s own end event to answered or interrupted, and its errors to their kinds.
          </li>
          <li>The context size for the meter, from the CLI&apos;s own events, leaving auxiliary calls out.</li>
          <li>
            The approval relay, shown word for word with the CLI&apos;s options, and closed the protocol&apos;s way on
            a stop. Or declare that there is none.
          </li>
          <li>The CLI&apos;s interrupt, or declare that there is none.</li>
          <li>Resume by session id, where the CLI supports it.</li>
          <li>
            The <code>send</code> tool, added through the CLI&apos;s own MCP configuration, adding to it and never
            replacing it.
          </li>
          <li>
            The cache-rules table and the session-services table, each naming the CLI version it was read from.
          </li>
          <li>Any port the channel opens binds to the loopback address only.</li>
        </ol>

        <H2 id="how-to-test">How to test it</H2>
        <ul>
          <li>
            <strong>Contract tests.</strong> Record real sessions once: the two-prompt task, an approval request (or a
            tool the CLI soft-denies), an error, and a session that goes cold. Redact them, note the date, CLI version
            and model, and replay them through the adapter.
          </li>
          <li>
            <strong>A fake CLI</strong> in <code>test/fakes/</code> that speaks the wire protocol with scripted turns,
            chosen through configuration, for integration and fault tests: a crash mid-tool-call, a stop, a malformed
            JSON line, a child process left running.
          </li>
          <li>
            <strong>A live parity check</strong>, run by the owner: the two-prompt task through the live session must
            use within 5% of the CLI&apos;s own headless run, and its follow-up must read no file.
          </li>
        </ul>
        <p>CI never calls a live model.</p>

        <H2 id="landing">Landing it</H2>
        <p>
          Like every change to Shadow Army, a new adapter gets an issue with acceptance criteria, its own branch and one
          focused pull request, with its tests in the same PR as its code.
        </p>
      </div>

      <FromV1>
        <ul>
          <li>
            v1 planned an <code>sa adapter new</code> command to scaffold an adapter. v2 has none.
          </li>
          <li>
            A v1 adapter started the CLI once per message. A v2 adapter keeps one live session open, which is why the
            CLI needs a live-session interface.
          </li>
        </ul>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
