import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/claude-first.md (the
 * 2026-10-07 measurements), ADR-0010, ADR-0011, docs/spec/v2.md v0.5 (G3,
 * G5, the non-goals, SI-3, SES-2 to SES-7, OBS-3) and
 * orchestratorDelegate.md (cost). Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "where-tokens-go", title: "Where the tokens go" },
  { id: "live-sessions", title: "What live sessions save" },
  { id: "what-you-see", title: "What you see" },
  { id: "keep-it-low", title: "Keep cost low" },
];

export function Cost({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Token use is visible and in your hands: a meter for each soldier, a cold-cache warning, the 200k handoff and a usage table."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The numbers on this page were measured on the owner&apos;s machine on 7
            October 2026. Shadow Army shows only the cost each CLI reports, and computes none of its own.
          </p>
        </Callout>

        <H2 id="where-tokens-go">Where the tokens go</H2>
        <p>
          Most of each model request is the CLI&apos;s own setup: its system prompt, tools, skills and MCP servers,
          sent again on every request. Shadow Army&apos;s own part is small: each soldier&apos;s standing instructions
          stay under 1,500 tokens and are sent once per session.
        </p>
        <p>
          Shadow Army never trims a vendor&apos;s harness to save tokens: the harness carries the vendor&apos;s
          safeguards.
        </p>

        <H2 id="live-sessions">What live sessions save</H2>
        <p>
          The same task, &ldquo;read two files, say what the project is&rdquo;, then &ldquo;which file has more
          lines?&rdquo;, sent to each CLI the normal way and through a live session:
        </p>
        <Table
          head={["CLI (model)", "Normal: task", "Live: task", "Normal: follow-up", "Live: follow-up"]}
          rows={[
            ["grok (grok-4.7-build)", "46.3k", "47.2k", "23.6k", "24.2k"],
            ["claude (sonnet)", "66.7k", "62.6k", "35.9k", "36.1k"],
            ["codex (gpt-6.1-sol)", "40.7k", "42.8k", "41.2k", "27.0k"],
            ["agy (gemini-3.1-pro-high)", "28.6k", "29.5k", "16.1k", "16.8k"],
          ]}
        />
        <ul>
          <li>A live session costs the same as the CLI&apos;s own run, within about 5%.</li>
          <li>Every live follow-up was answered without re-reading the files.</li>
          <li>
            The savings come from keeping each session open, with no process started per message, and from Claude
            planning as the Monarch in its own session.
          </li>
          <li>
            Only briefs and short summaries cross between models. Full reports stay on disk, where they cost no
            tokens.
          </li>
        </ul>

        <H2 id="what-you-see">What you see</H2>
        <ul>
          <li>
            <strong>The meter.</strong> Each soldier&apos;s context size, from its CLI&apos;s own numbers, up to its
            handoff line. A subagent&apos;s or other auxiliary call is recorded but never moves it.
          </li>
          <li>
            <strong>Near handoff</strong> at 90% of the line, and a handoff summary at the line.
          </li>
          <li>
            <strong>The cold warning.</strong> A warm cache costs about a tenth of full price. Once it has gone cold,
            the next message likely re-sends the whole history at full price, and the pane says how many tokens.
          </li>
          <li>
            <strong>Usage today</strong>, from <code>/sessions</code>.
          </li>
        </ul>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/sessions"] }]} />
        <p>
          For each soldier: sessions, messages, input (cached included), the cached share, output, and cost where the
          CLI reports one (&ldquo;—&rdquo; otherwise), then a total row. Each turn&apos;s usage is recorded with the
          CLI&apos;s raw fields beside the normalized ones. See{" "}
          <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
        </p>

        <H2 id="keep-it-low">Keep cost low</H2>
        <ul>
          <li>
            Route routine work to the cheapest soldier that qualifies: cost 1 is cheap, 3 expensive. See{" "}
            <Link href={hrefOf("routing-policy")}>Routing policy</Link>.
          </li>
          <li>Send related work to the same soldier while it is warm.</li>
          <li>Start fresh for unrelated work, or accept the handoff, rather than growing one long session.</li>
          <li>
            Set <code>cacheLifetime</code> when you know your provider&apos;s, so the timer is right. See{" "}
            <Link href={hrefOf("shadow-config")}>shadow.config.json</Link>.
          </li>
          <li>
            Keep <Link href={hrefOf("rules-md")}>rules.md</Link> and{" "}
            <Link href={hrefOf("agent-md")}>agent.md</Link> short. Every session carries them.
          </li>
        </ul>
      </div>

      <FromV1>
        <p>
          v1 started a new CLI process for every message, and a separate Monarch CLI planned each goal. A simple
          one-task goal cost about 125k tokens: two Monarch calls (about 62k) and one soldier task (about 65k).
          Shadow Army&apos;s own text was about 2k of that; the rest was each CLI&apos;s own setup, sent on every
          request:
        </p>
        <Table
          head={["CLI, as v1 launched it", "Tokens per request"]}
          rows={[
            ["claude", "31.5k"],
            ["codex", "20.1k"],
            ["grok", "about 23k"],
          ]}
        />
        <p>
          v2 keeps one live session per soldier and has Claude plan as the Monarch, so the separate Monarch calls and
          the process per message are gone. The meter, the cold warning, the 200k handoff and{" "}
          <code>/sessions</code> are new in v2.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
