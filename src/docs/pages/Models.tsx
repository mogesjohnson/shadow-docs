import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, SoldierDot, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry, type Soldier } from "../nav";

/*
 * Sources (shadow-army main at ab04992): shadow.config.json,
 * orchestratorDelegate.md (strengths, weaknesses and the effort guide),
 * docs/spec/v2.md v0.5 (SES-6, SES-8, Q3), ADR-0011 and
 * docs/claude-first.md (windows and the 2026-10-07 runs). Shadow Army 2 is
 * not released yet.
 */

const TOC: TocItem[] = [
  { id: "where-models-are-set", title: "Where models are set" },
  { id: "strengths", title: "What each soldier is for" },
  { id: "effort", title: "Match effort to the task" },
  { id: "windows", title: "Context windows" },
  { id: "changing", title: "Changing a model or effort" },
];

const GUIDE: { soldier: Soldier; id: string; model: string; strong: string; avoid: string }[] = [
  {
    soldier: "claude",
    id: "claude-opus",
    model: "opus",
    strong: "Code review, subtle bugs, architecture, high-effort work on hard problems",
    avoid: "Routine edits: it is expensive and slower",
  },
  {
    soldier: "claude",
    id: "claude-sonnet",
    model: "sonnet",
    strong: "Everyday feature work, refactors, tests; a good balance of cost and speed",
    avoid: "Final review of critical changes",
  },
  {
    soldier: "codex",
    id: "codex-sol",
    model: "gpt-6.1-sol",
    strong: "Building features end to end, sustained implementation",
    avoid: "Final review of its own work",
  },
  {
    soldier: "codex",
    id: "codex-astra",
    model: "gpt-6-astra",
    strong: "Review and hard builds, as claude-opus",
    avoid: "Routine work: its cost is 3",
  },
  {
    soldier: "grok",
    id: "grok",
    model: "grok-4.7",
    strong: "Creating new features quickly",
    avoid: "Reviews, ever: a hard rule",
  },
  {
    soldier: "agy",
    id: "agy",
    model: "gemini-3.1-pro-high",
    strong: "Research, investigating, running and analyzing tests",
    avoid: "Any coding: it never writes",
  },
];

export function Models({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Each soldier is one CLI and one model. Pick the model for the work, and the effort for the difficulty."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The models below are the ones in the files on <code>main</code>.
          </p>
        </Callout>

        <H2 id="where-models-are-set">Where models are set</H2>
        <p>
          A soldier&apos;s <code>model</code> lives in <Link href={hrefOf("shadow-config")}>shadow.config.json</Link>,
          next to its <code>cli</code>. Shadow Army passes it to that CLI as it is. Model ids are config values and may
          need adjusting to what each CLI actually lists. To run two models of one CLI, add two soldiers.
        </p>

        <H2 id="strengths">What each soldier is for</H2>
        <p>
          From the guide in <Link href={hrefOf("orchestrator-delegate")}>orchestratorDelegate.md</Link>, which Claude
          reads when it picks who gets a brief:
        </p>
        <Table
          head={["Soldier", "Model", "Strong at", "Avoid"]}
          rows={GUIDE.map(({ soldier, id, model, strong, avoid }) => [
            <span key="s" className="sd-cell-soldier">
              <SoldierDot soldier={soldier} />
              <code>{id}</code>
            </span>,
            <code key="m">{model}</code>,
            strong,
            avoid,
          ])}
        />

        <H2 id="effort">Match effort to the task</H2>
        <Table
          head={["Task", "Prefer"]}
          rows={[
            ["Routine feature or refactor", "claude-sonnet, grok or codex-sol at low or medium effort"],
            ["Hard or risky feature", "claude-opus (high) or codex-sol (high)"],
            ["Review", "claude-opus (high or max); never grok"],
            ["Research or test runs", "agy"],
          ]}
        />
        <p>
          Prefer the cheapest soldier that clears the difficulty bar. See{" "}
          <Link href={hrefOf("routing-policy")}>Routing policy</Link>.
        </p>

        <H2 id="windows">Context windows</H2>
        <p>
          Each soldier hands off at its <code>handoffAt</code> line, 200,000 tokens by default. Where the CLI reports
          its window, the line must stay below it.
        </p>
        <ul>
          <li>codex reports a window of 258,400 tokens.</li>
          <li>
            grok runs a 256k window by default; 500k is an option set in its own config. Whether grok charges more
            per token for long requests is still an open question.
          </li>
        </ul>

        <H2 id="changing">Changing a model or effort</H2>
        <p>
          A change to a soldier&apos;s model, effort or tools moves its cold estimate only as its CLI&apos;s
          documentation says the change affects the cache. For claude:
        </p>
        <ul>
          <li>
            <strong>Resets the cache:</strong> another model; effort, on a model or sign-in where each effort level
            has its own cache. The soldier turns cold at once: <code>❄ cold · model changed</code>.
          </li>
          <li>
            <strong>Keeps the cache:</strong> effort on Opus 5.5, Sonnet 5.5, Haiku 5.5 and Fable 5.1, with an API key
            or a Claude subscription.
          </li>
        </ul>
        <p>
          Anything the adapter cannot place shows <code>cache unknown</code> until the next model request. See{" "}
          <Link href={hrefOf("cost")}>Cost and tokens</Link>.
        </p>
      </div>

      <FromV1>
        <ul>
          <li>
            In v1 codex-astra was the Monarch, planning each goal, with claude-opus as its fallback. The guide on{" "}
            <code>main</code> still calls codex-astra the primary orchestrator and claude-opus the second. In v2
            Claude is the Monarch, and codex-astra takes reviews and hard builds.
          </li>
          <li>
            The models and the effort guide are the files&apos; own, unchanged. The <code>handoffAt</code> line and
            the cold estimate are new in v2.
          </li>
        </ul>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
