import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, REPO_URL, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/adr/0008 to 0015,
 * docs/legacy/README.md, the titles of docs/legacy/adr/0001 to 0007, and
 * docs/spec/v2.md v0.5 (section 7). Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-an-adr-is", title: "What an ADR is" },
  { id: "v2-decisions", title: "Shadow Army 2's decisions" },
  { id: "older-records", title: "Older records" },
];

const ADR_URL = `${REPO_URL}/blob/main/docs/adr`;

function Adr({ file, n }: { file: string; n: string }) {
  return (
    <a href={`${ADR_URL}/${file}.md`} target="_blank" rel="noreferrer">
      {n}
    </a>
  );
}

export function Decisions({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="The architecture decision records behind Shadow Army 2: what was decided, when, and what it changes."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. Its spec lists eight decisions, ADR-0008 to ADR-0015, and all of them
            are accepted.
          </p>
        </Callout>

        <H2 id="what-an-adr-is">What an ADR is</H2>
        <p>
          An architecture decision record is a short file in <code>docs/adr/</code> that keeps one decision and its
          reason. Each one has four parts:
        </p>
        <ul>
          <li>
            <strong>Status</strong>: who accepted it and when, often with the owner&apos;s own words.
          </li>
          <li>
            <strong>Context</strong>: the problem, and any measurements behind it.
          </li>
          <li>
            <strong>Decision</strong>: what Shadow Army does.
          </li>
          <li>
            <strong>Consequences</strong>: what follows, with the spec requirements that carry it out.
          </li>
        </ul>
        <p>
          When a later change touches a record, its status says so: ADR-0014&apos;s notes that spec v0.4 amended it,
          and that ADR-0015 moved its list of decisions into the pane&apos;s first tab.
        </p>

        <H2 id="v2-decisions">Shadow Army 2&apos;s decisions</H2>
        <Table
          head={["ADR", "Decision", "Accepted"]}
          rows={[
            [
              <Adr key="adr" file="0008-claude-is-the-monarch" n="0008" />,
              <>
                <strong>Claude is the Monarch.</strong> Your own Claude Code session plans, sends briefs by name and
                reads five-line summaries. See <Link href={hrefOf("the-monarch")}>The Monarch</Link>.
              </>,
              "6 and 7 October 2026",
            ],
            [
              <Adr key="adr" file="0009-live-sessions-through-each-cli" n="0009" />,
              <>
                <strong>Live sessions through each CLI&apos;s own channel.</strong> One live session per soldier,
                through stream-json, app-server or ACP. Toward Claude and the mod, the post office offers one
                interface shaped like ACP. See <Link href={hrefOf("adapter-protocol")}>Adapter protocol</Link>.
              </>,
              "7 October 2026",
            ],
            [
              <Adr key="adr" file="0010-vendor-harnesses-stay-whole" n="0010" />,
              <>
                <strong>Vendor harnesses stay whole.</strong> No vendor prompt is replaced, no built-in tool removed and
                no safeguard turned off. Instructions are only appended. See{" "}
                <Link href={hrefOf("hard-rules")}>Hard rules</Link>.
              </>,
              "7 October 2026",
            ],
            [
              <Adr key="adr" file="0011-sessions-meter-and-200k-handoff" n="0011" />,
              <>
                <strong>The meter, the cold warning and the 200k handoff.</strong> Each soldier shows its context size,
                warns before a message to a cold session, and hands off at its line. See{" "}
                <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
              </>,
              "7 October 2026",
            ],
            [
              <Adr key="adr" file="0012-local-only-post-office" n="0012" />,
              <>
                <strong>A local-only post office.</strong> It binds only the loopback address. The Monarch&apos;s
                credential is new at each start, and each soldier&apos;s works only for <code>send</code>. See{" "}
                <Link href={`${hrefOf("how-shadow-army-works")}#safety`}>Safety</Link>.
              </>,
              "7 October 2026",
            ],
            [
              <Adr key="adr" file="0013-v1-legacy-and-carry-overs" n="0013" />,
              <>
                <strong>What carries over.</strong> Worktrees, claims, the guard, link safety, apply and undo, the
                roster files, the hard rules and shadow names carry into v2. See{" "}
                <Link href={hrefOf("worktrees")}>Soldier worktrees</Link>.
              </>,
              "7 October 2026",
            ],
            [
              <Adr key="adr" file="0014-the-owner-steers" n="0014" />,
              <>
                <strong>The owner steers.</strong> Stop a turn, see and change the queue, read facts on the summary
                card, and answer one list of decisions. See <Link href={hrefOf("steer")}>Stop, queue and decide</Link>.
              </>,
              "8 October 2026, with spec v0.3",
            ],
            [
              <Adr key="adr" file="0015-the-quiet-default" n="0015" />,
              <>
                <strong>The quiet default.</strong> You work in Claude&apos;s transcript, the pane opens when needed,
                and its first tab puts the decisions at the head of the army. See{" "}
                <Link href={`${hrefOf("pane")}#the-quiet-default`}>The quiet default</Link>.
              </>,
              "13 October 2026",
            ],
          ]}
        />

        <H2 id="older-records">Older records</H2>
        <p>
          ADRs 0001 to 0007 were written for an earlier design and are kept, unchanged, in{" "}
          <code>docs/legacy/adr/</code>. They are no longer updated, but their workspace and safety rules still inform
          v2. v2&apos;s records continue the numbering from 0008.
        </p>
      </div>

      <FromV1>
        <p>
          ADRs 0001 to 0007 belong to the Shadow Army 2.0 spec (v0.16), which designed an Ink chat shell with
          per-wake soldiers. The Claude-first design superseded it on 7 October 2026:
        </p>
        <Table
          head={["ADR", "Decision"]}
          rows={[
            ["0001", "Build on the official Claude Code CLI only, never the leaked source."],
            ["0002", "Run the Monarch on the claude CLI under the owner's subscription, not the Agent SDK."],
            ["0003", "The Monarch may write code, but only through its own worktree, with no shell."],
            ["0004", "The army's memory lives in .shadow/memory/, written only through remember."],
            ["0005", "Keep the army's control plane outside the repository."],
            ["0006", "Soldiers start from the owner's working state, recorded under refs/shadow-army/."],
            ["0007", "Resume a soldier's session only when that is cheaper than starting fresh."],
          ]}
        />
        <p>ADR-0008 replaces 0002 in part, and ADR-0009 replaces 0007 in part.</p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
