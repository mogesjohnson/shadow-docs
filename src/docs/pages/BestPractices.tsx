import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/claude-first.md (sessions and
 * the idle cache), orchestratorDelegate.md (effort guide and tie-breaks),
 * README.md (autonomy and containers), CLAUDE.md (design rules), and
 * docs/spec/v2.md v0.5 (MSG-1, MSG-9, MSG-11, SES-5, SES-6, ARM-2,
 * ADR-0014). Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "sessions", title: "Keep sessions warm and focused" },
  { id: "routing", title: "Route by roles and cost" },
  { id: "briefs", title: "Write short briefs" },
  { id: "steering", title: "Steer early" },
  { id: "safety", title: "Review before you apply" },
];

export function BestPractices({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Habits that keep an army cheap and safe, drawn from the measurements and rules behind Shadow Army 2."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This advice follows its accepted design and the routing guide in{" "}
            <code>orchestratorDelegate.md</code>.
          </p>
        </Callout>

        <H2 id="sessions">Keep sessions warm and focused</H2>
        <ul>
          <li>
            <strong>Send related work to the same soldier.</strong> Its session already holds the context, and a live
            follow-up did not re-read files in the 7 October 2026 measurements.
          </li>
          <li>
            <strong>Start fresh for unrelated work.</strong> Everything a session holds is re-sent with every message.{" "}
            <code>/fresh</code> keeps the soldier&apos;s branch and its log.
          </li>
          <li>
            <strong>Mind the cold timer.</strong> After the cache lifetime, the next message likely pays full price for
            the whole history. If the soldier is cold and the next task is new, starting fresh is cheaper.
          </li>
          <li>
            <strong>Accept handoffs.</strong> A good handoff summary (working on, done, decided, files, open) carries
            the work into a small new session.
          </li>
        </ul>

        <H2 id="routing">Route by roles and cost</H2>
        <ul>
          <li>
            <strong>Hard rules first.</strong> Grok never reviews, and agy never writes. Nothing overrides them.
          </li>
          <li>
            <strong>The cheapest soldier that clears the bar.</strong> Routine features and refactors suit
            claude-sonnet, grok or codex-sol at low or medium effort. Hard or risky work suits claude-opus or codex-sol
            at high effort.
          </li>
          <li>
            <strong>Never let the author of a change review it.</strong> Reviews go to claude-opus or Bellion
            (codex-astra) at high effort.
          </li>
          <li>
            <strong>Research and test runs go to agy.</strong> It reads and runs; it does not write.
          </li>
        </ul>

        <H2 id="briefs">Write short briefs</H2>
        <ul>
          <li>
            Only words cross between models. Name the files and the goal; the soldier reads the files from its own
            worktree.
          </li>
          <li>
            Say which kind of work it is. <code>/send --kind</code> is checked against the soldier&apos;s roles before
            it is sent, so a wrong pick is caught early.
          </li>
          <li>
            Put lasting rules in <code>rules.md</code> or a soldier&apos;s <code>agent.md</code> section rather than
            in every brief. They are instructions; the checkout guard and the claim audit are what is enforced.
          </li>
        </ul>

        <H2 id="steering">Steer early</H2>
        <ul>
          <li>
            A soldier heading the wrong way keeps going until its turn ends. Stop it (s or <code>/stop</code>) instead
            of queueing a correction behind the turn.
          </li>
          <li>
            Check the queue after a change of plan. Old instructions can become harmful, so cancel or change them with
            q.
          </li>
          <li>
            Answer decisions from the &ldquo;needs you&rdquo; tab, oldest first. A soldier waiting on an approval does
            nothing in the meantime.
          </li>
        </ul>

        <H2 id="safety">Review before you apply</H2>
        <ul>
          <li>
            Read the facts on the summary card, not just the summary. &ldquo;tests: not run&rdquo; means no test
            command ran, whatever the summary says.
          </li>
          <li>
            Look at <code>/diff</code> before <code>/apply</code>. <code>/apply undo</code> puts the folder back if you
            change your mind.
          </li>
          <li>
            Unrestricted autonomy only picks each vendor&apos;s own flags. Shadow Army&apos;s guard covers your
            repository, not the rest of your machine or the network; the vendors recommend a container or VM for their
            unrestricted modes. See <Link href={hrefOf("autonomy")}>Autonomy levels</Link>.
          </li>
        </ul>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
