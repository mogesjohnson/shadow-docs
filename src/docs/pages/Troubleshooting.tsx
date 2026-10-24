import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (PO-1,
 * PO-8, CH-1, CH-8, CH-10, MSG-2 to MSG-4, MSG-9, ARM-1, ARM-2, ARM-6,
 * SES-4, SES-6, SES-8, SET-1, VIS-6, OBS-1, HOST-5). Shadow Army 2 is not
 * released yet; this page follows the accepted design.
 */

const TOC: TocItem[] = [
  { id: "soldier-states", title: "A soldier's state" },
  { id: "message-endings", title: "A message did not answer" },
  { id: "refusals", title: "Something was refused" },
  { id: "logs", title: "Where to look" },
];

export function Troubleshooting({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="What each warning state means, and what to do about it."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page follows its accepted design and will grow with real reports
            after release.
          </p>
        </Callout>

        <H2 id="soldier-states">A soldier&apos;s state</H2>
        <Table
          head={["You see", "What it means", "What to do"]}
          rows={[
            ["log in", "The soldier's CLI needs you to sign in", "Sign in to that CLI, then r in the pane"],
            [
              "down",
              "The channel crashed and was restarted three times",
              "r in the pane reconnects it; o opens its log",
            ],
            [
              "error",
              "The CLI reported an error: a rate limit (with its reset time where given), a context overflow, or another",
              "Read the CLI's own words in the pane. A rate limit passes; a context overflow calls for /fresh",
            ],
            ["waiting", "The CLI asks for your approval", "Answer it with 1 to 9, or s to stop the turn"],
            ["held, after a stop", "You stopped a turn, so the queue waits for you", "g sends it, or q to change it first"],
            [
              "held, at a handoff",
              "A handoff card is open, and the queue waits until you choose",
              "a accepts, e edits, g keeps going. The queue goes on after your choice",
            ],
            [
              "held, at an attribution card",
              "The checkout guard found changes it cannot explain, and the turn's summary and queue wait for your answer",
              "y if the changes are yours, n to fail the turn. g does not answer this card. The queue goes on once you answer",
            ],
            ["handoff", "A handoff summary is ready", "a accepts, e edits, g keeps going"],
            [
              "stopping",
              "A stop is waiting for the turn to end",
              "Wait. After 30 seconds the CLI is ended and its session resumed",
            ],
            ["❄ cold", "The cache has likely expired", "The next message re-reads the history; consider /fresh"],
          ]}
        />

        <H2 id="message-endings">A message did not answer</H2>
        <Table
          head={["Ending", "Why", "Send again?"]}
          rows={[
            [
              "not delivered",
              "It never reached the session, for example because the post office stopped first",
              "Yes: r sends it again as it is",
            ],
            [
              "interrupted",
              "It was delivered but no summary came: you stopped it, the CLI crashed or reported a failure, or you answered n to an attribution card",
              "Not by itself: r puts the text back in the field, beside the changes the turn made",
            ],
            ["cancelled", "You cancelled it while it was queued", "Send a new message"],
          ]}
        />

        <H2 id="refusals">Something was refused</H2>
        <ul>
          <li>
            <strong>A brief was refused</strong>: its kind breaks a hard rule (a review for Grok, a build for agy) or
            is not among the soldier&apos;s roles. The refusal names which.
          </li>
          <li>
            <strong>An unknown soldier name</strong> sends nothing and suggests the closest name.
          </li>
          <li>
            <strong>The army does not start</strong> when <code>shadow.config.json</code> and{" "}
            <code>orchestratorDelegate.md</code> list different soldiers, when a <code>tag</code> is used twice, or
            when <code>handoffAt</code> or <code>cacheLifetime</code> is invalid.
          </li>
          <li>
            <strong>A warning card about a CLI version</strong> means the CLI is newer than the one its adapter was
            tested with. It still connects.
          </li>
          <li>
            <strong>A read-violation</strong> fails a turn for one of two reasons, with different results:
            <ul>
              <li>
                agy wrote a file in its throwaway snapshot. That write is discarded with the snapshot and never
                reaches a branch or your folder.
              </li>
              <li>
                You answered n to an attribution card. The turn fails, but the checkout changes the card listed are
                not rolled back. Check those paths and restore them yourself if you need to.
              </li>
            </ul>
          </li>
        </ul>

        <H2 id="logs">Where to look</H2>
        <ul>
          <li>o in a soldier&apos;s pane opens its session log.</li>
          <li>
            <code>/army</code> shows the post office&apos;s own log.
          </li>
          <li>
            The logs are under <code>.shadow/v2/logs/</code>, redacted, and append-only.
          </li>
          <li>ctrl+o on a row in the transcript shows the message&apos;s id.</li>
        </ul>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
