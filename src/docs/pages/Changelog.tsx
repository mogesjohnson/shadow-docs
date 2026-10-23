import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, H3, Pagination, PageHeader } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): the version line of each
 * docs/spec/v2.md commit (947d38c, da028f3, e614d58, 13812a6, 8639f92),
 * ADR-0008 to ADR-0015, docs/claude-first.md, and the v1.0.0 and v1.0.1
 * release notes on GitHub.
 */

const TOC: TocItem[] = [
  { id: "v2-in-development", title: "Shadow Army 2, in development" },
  { id: "v1", title: "v1 (legacy)" },
];

export function Changelog({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Releases of Shadow Army, and each version of the Shadow Army 2 specification, newest first."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 has no release yet. Until it does, this page lists the versions of its spec, which these docs
            follow.
          </p>
        </Callout>

        <H2 id="v2-in-development">Shadow Army 2, in development</H2>

        <H3 id="spec-0-5">Spec v0.5 · 13 October 2026</H3>
        <ul>
          <li>
            <strong>The quiet default</strong> (ADR-0015). You work in Claude&apos;s transcript, and the mod adds its
            rows there. The pane opens only when you ask for it or a soldier needs you.
          </li>
          <li>
            <strong>Decisions at the head of the army.</strong> The pane&apos;s first tab lists everything that waits
            on you, oldest first, then the rest of the army.
          </li>
          <li>
            <strong>While you were away.</strong> After 10 minutes without input, once the army settles, one digest
            says what changed.
          </li>
          <li>
            <strong>A brief carries its kind of work</strong>: build, review, research or test. It is checked against
            the hard rules and the soldier&apos;s roles before it is sent.
          </li>
          <li>Bellion (codex-astra) takes reviews and hard builds.</li>
          <li>An approval option that allows more than one request takes two presses.</li>
        </ul>

        <H3 id="spec-0-4">Spec v0.4 · 8 October 2026</H3>
        <ul>
          <li>Failure modes: how a turn ends once, and only when the work it started has stopped.</li>
          <li>The cold timer, which counts down to when a soldier&apos;s cache likely expires.</li>
          <li>A stop cancels the turn&apos;s open approval requests and approves nothing.</li>
          <li>An interrupted message is never sent again by itself.</li>
        </ul>

        <H3 id="spec-0-3">Spec v0.3 · 8 October 2026</H3>
        <ul>
          <li>
            <strong>The owner steers</strong> (ADR-0014): stop a turn, see and change the queue, facts on the summary
            card, and one list of decisions.
          </li>
          <li>One meaning for each message state. &ldquo;Failed&rdquo; is no longer a state.</li>
        </ul>

        <H3 id="spec-0-2">Spec v0.2 · 8 October 2026</H3>
        <ul>
          <li>The findings of the M0 spikes: the pane, waking the Monarch, usage and caches, the send tool, approvals.</li>
        </ul>

        <H3 id="spec-0-1">Spec v0.1 · 7 October 2026</H3>
        <ul>
          <li>
            The first v2 spec, with its verification plan, and ADR-0008 to ADR-0013: Claude is the Monarch, live
            sessions through each CLI, harnesses stay whole, the meter and the 200k handoff, a local-only post office,
            and v1 as legacy.
          </li>
          <li>The owner chose the Claude-first direction on 6 and 7 October 2026.</li>
        </ul>

        <H2 id="v1">v1 (legacy)</H2>
        <p>
          v1 is the per-message <code>sa</code> CLI. It is frozen, and the <code>legacy/v1</code> branch keeps its
          code.
        </p>

        <H3 id="v1-0-1">v1.0.1 · 7 October 2026</H3>
        <ul>
          <li>
            <strong>Link safety:</strong> a soldier that swapped a tracked link for a junction could leak files from
            outside its worktree. The audit now unlinks the swap first.
          </li>
          <li>
            <strong>Token counts:</strong> Grok&apos;s and agy&apos;s input tokens now include cached input, as
            Claude&apos;s already did.
          </li>
        </ul>

        <H3 id="v1-0-0">v1.0.0 · 7 October 2026</H3>
        <ul>
          <li>
            <code>sa</code> in a terminal opens a chat, and <code>sa run</code> plans, dispatches, merges and reports
            with a live dashboard.
          </li>
          <li>
            <code>sa summon</code>, <code>sa army</code> and <code>sa route</code>. The hard rules hold.
          </li>
          <li>
            Worktrees, file leases and the claim audit; autonomy levels, <code>rules.md</code>, <code>agent.md</code>{" "}
            and the checkout guard; the Shadow Vault.
          </li>
          <li>
            Known limit: every message starts a new CLI process, so a simple goal costs about 125k tokens. That is why
            v2 exists.
          </li>
        </ul>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
