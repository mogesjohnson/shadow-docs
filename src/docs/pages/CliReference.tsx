import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, H3, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-5,
 * HOST-6, HOST-9, HOST-10, MSG-8, WSP-9) for the commands, keys and tool;
 * src/cli.ts, src/vault/cli.ts, src/workspace/cli.ts, src/monarch/cli.ts
 * and src/chat/commands.ts for v1's `sa` commands; ADR-0013 for v1's
 * frozen release and branch. Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "commands", title: "Commands" },
  { id: "send-tool", title: "The send tool" },
  { id: "pane-keys", title: "Keys in the pane" },
  { id: "strip-words", title: "Words in the strip" },
];

export function CliReference({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Every command, key and tool field of Shadow Army 2, with v1's sa commands kept at the end for reference."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. Its commands are slash commands in Claude Code, added by the mod. Their
            names, argument hints and descriptions are as on the design canvas, and can still change before release.
          </p>
        </Callout>

        <H2 id="commands">Commands</H2>
        <p>
          Type them in Claude Code&apos;s prompt. A soldier is named by its shadow name, in any case. An unknown name
          suggests the closest one and sends nothing.
        </p>
        <Table
          head={["Command", "What it does"]}
          rows={[
            [
              <code key="c">/army</code>,
              <>
                Lists the army, with every soldier&apos;s tag, and gives the post office&apos;s own log. See{" "}
                <Link href={hrefOf("army")}>See your army</Link>.
              </>,
            ],
            [
              <code key="c">/send &lt;soldier&gt; [--kind &lt;kind&gt;] &lt;message&gt;</code>,
              <>
                Sends a message as you. <code>--kind</code> is build, review, research or test, and is checked against
                the hard rules and the soldier&apos;s roles. Without it the message is yours and has no kind to check.
                See <Link href={hrefOf("send")}>Send work</Link>.
              </>,
            ],
            [
              <code key="c">/pane [soldier]</code>,
              <>
                Opens the pane, at any width, on that soldier&apos;s tab if you name one. See{" "}
                <Link href={hrefOf("pane")}>The pane and the strip</Link>.
              </>,
            ],
            [<code key="c">/stop &lt;soldier&gt;</code>, "Stops the soldier's running turn. Its session stays open."],
            [<code key="c">/queue [soldier]</code>, "Prints the queues in the transcript: each message's sender, age and first line."],
            [
              <code key="c">/decisions</code>,
              "Prints everything that waits on you, oldest first: approvals, guard cards, handoffs, held queues, logins, channels down and messages not delivered.",
            ],
            [
              <code key="c">/fresh &lt;soldier&gt;</code>,
              "Closes the soldier's session, keeps its log, and starts a new one with the standing instructions. Its work stays on its branch.",
            ],
            [
              <code key="c">/handoff &lt;soldier&gt;</code>,
              <>
                Starts a handoff for the soldier. The spec names the command and leaves its wording to the design
                canvas. See <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
              </>,
            ],
            [
              <code key="c">/sessions</code>,
              <>
                Usage today for each soldier: sessions, messages, input, cached share, output and cost where the CLI
                reports one, then a total. See <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
              </>,
            ],
            [
              <code key="c">/mode [ask|auto|plan|terminal|dark|light]</code>,
              "Sets the mode or the look.",
            ],
            [
              <code key="c">/diff &lt;soldier&gt;</code>,
              "Shows the soldier's changes on its branch since its base.",
            ],
            [
              <code key="c">/apply &lt;soldier&gt;</code>,
              <>
                Applies those changes to your folder, all or nothing. <code>/apply undo</code> undoes the last apply.
                See <Link href={hrefOf("apply-changes")}>Apply a soldier&apos;s changes</Link>.
              </>,
            ],
          ]}
        />
        <p>
          <code>/diff</code> and <code>/apply</code> arrive with the workspace milestone, the last one before release.
        </p>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Claude Code",
              lines: [
                "/send Igris --kind build add a password-reset endpoint",
                "/stop Igris",
                "/queue",
                "/apply Igris",
              ],
            },
          ]}
        />

        <H2 id="send-tool">The send tool</H2>
        <p>
          Claude sends briefs through the <code>send</code> tool the mod gives it. See{" "}
          <Link href={hrefOf("the-monarch")}>The Monarch</Link> for how it is used.
        </p>
        <Table
          head={["Field", "Meaning"]}
          rows={[
            [<code key="f">soldier</code>, "The soldier's shadow name."],
            [
              <code key="f">kind</code>,
              <>
                Required: <code>build</code>, <code>review</code>, <code>research</code> or <code>test</code>. The brief
                is checked against it before it is sent. The kind is recorded, never sent to the soldier.
              </>,
            ],
            [<code key="f">brief</code>, "The text of the brief. The soldier receives only this."],
            [<code key="f">wantReply</code>, "Whether Claude is woken when the summary arrives. On by default."],
            [
              <code key="f">wake</code>,
              <>
                Briefs sent in one turn wake Claude once, after the last has answered or ended.{" "}
                <code>wake: &quot;own&quot;</code> makes a brief that must be read on its own wake Claude by itself.
              </>,
            ],
          ]}
        />
        <p>
          It returns at once, with the brief&apos;s id and its state: delivered, or queued and what it waits for. The
          summary arrives later as a card. A soldier has its own <code>send(to, text)</code> tool for messaging other
          soldiers, which cannot assign work. agy has none in v2.0.
        </p>

        <H2 id="pane-keys">Keys in the pane</H2>
        <p>
          Claude Code&apos;s ctrl+x tab moves the keyboard into the pane. Tab and the arrow keys walk its buttons, and
          the wheel scrolls.
        </p>
        <Table
          head={["Key", "Action"]}
          rows={[
            [<code key="k">j</code>, "Previous soldier's tab"],
            [<code key="k">l</code>, "Next soldier's tab"],
            [<code key="k">i</code>, "Scroll the session up"],
            [<code key="k">k</code>, "Scroll the session down"],
            [<code key="k">Enter</code>, "Go into the message field; in the field, send"],
            [<code key="k">Esc</code>, "Leave the field; again, close the pane"],
            [<code key="k">o</code>, "Open the soldier's log"],
            [
              <code key="k">r</code>,
              "Reconnect or start the soldier, and send again a message that was not delivered. On an interrupted message it puts the text back in the field and sends nothing",
            ],
            [<code key="k">f</code>, "Start fresh"],
            [<code key="k">s</code>, "Stop the running turn, or the background work a finished turn left running"],
            [
              <code key="k">q</code>,
              <>
                Open the queue: <code>1</code> to <code>9</code> pick a message, <code>x</code> cancels it and{" "}
                <code>c</code> changes it
              </>,
            ],
            [
              <code key="k">g</code>,
              "Go on: at the handoff card keep going (asks again after 20k more tokens); after a stop, send the held queue",
            ],
            [<code key="k">a</code>, "Handoff card: accept, and start a fresh session with the summary"],
            [<code key="k">e</code>, "Handoff card: edit the summary first"],
            [<code key="k">y</code>, "Attribution card: the changes are yours, and exactly the hashes shown are trusted"],
            [<code key="k">n</code>, "Attribution card: fail the turn as a read-violation"],
            [<code key="k">d</code>, "Show the soldier's changes"],
            [
              <>
                <code>1</code> to <code>9</code>
              </>,
              "Answer a vendor's approval request",
            ],
          ]}
        />
        <Callout kind="tip">
          <p>
            An approval option that allows more than the one request, such as &ldquo;allow for this session&rdquo;,
            takes its key twice. The first press marks it and says that the CLI decides what it covers, and the second
            sends it. Esc, another option&apos;s key, or the request closing in between sends nothing.
          </p>
        </Callout>
        <p>
          <code>j</code>, <code>l</code>, <code>i</code> and <code>k</code> are reserved for moving in the pane, and no
          key is bound twice on one screen.
        </p>

        <H2 id="strip-words">Words in the strip</H2>
        <p>
          The army strip shows a word only for a state that needs you, and keeps it at every width:{" "}
          <code>waiting</code>, <code>handoff</code>, <code>held</code>, <code>log in</code>, <code>down</code> and{" "}
          <code>error</code>. Every other state shows by its glyph alone. See{" "}
          <Link href={hrefOf("pane")}>The pane and the strip</Link>.
        </p>
      </div>

      <FromV1>
        <p>
          v1 is a separate <code>sa</code> program, frozen at its <code>v1.0.1</code> release on the{" "}
          <code>legacy/v1</code> branch. It starts a new process for every message, and v2 does not use it. Its commands:
        </p>
        <H3 id="v1-commands">v1 commands</H3>
        <Table
          head={["Command", "What it does"]}
          rows={[
            [<code key="c">sa</code>, "Opens the chat in a terminal, and prints the banner otherwise. --plain always prints the banner."],
            [<code key="c">sa army [--json]</code>, "Detects each soldier's CLI, shows its version, and checks its model. Exits 1 if a CLI is missing or a model is not listed."],
            [<code key="c">sa summon &lt;soldier&gt; &lt;task...&gt;</code>, "Sends one brief to one soldier and prints its report."],
            [<code key="c">sa route --role &lt;role&gt;</code>, "Previews who may take a task, ranked, with reasons. Runs no soldier."],
            [<code key="c">sa run &lt;goal...&gt;</code>, "The Monarch plans the goal, soldiers carry it out in parallel, and the work lands on one branch, applied to your folder as uncommitted edits."],
            [<code key="c">sa vault</code>, "Shows the Shadow Vault. Subcommands: notes [--status], accept <ids...>, reject <ids...>, add <text...>, runs [--limit], show <runId>."],
            [<code key="c">sa locks</code>, "Shows which soldier holds which files. sa locks release <soldier> frees a soldier's leases."],
            [<code key="c">sa worktrees</code>, "Lists the soldiers' worktrees and branches. sa worktrees remove <name> deletes one; --delete-branch also deletes its branch."],
          ]}
        />
        <H3 id="v1-options">v1 options</H3>
        <Table
          head={["Command", "Options"]}
          rows={[
            [
              <code key="c">sa summon</code>,
              <>
                <code>--role</code> (build, review, research or test), <code>--cwd</code>, <code>--write</code> (build
                role only), <code>--claim</code> (repeatable, required with --write), <code>--wait</code>,{" "}
                <code>--effort</code> (low, medium, high or max), <code>--timeout</code> (600 s), <code>--no-vault</code>
                , <code>--no-apply</code>, <code>--json</code>
              </>,
            ],
            [
              <code key="c">sa route</code>,
              <>
                <code>--role</code> (required; also orchestrate), <code>--hard</code>, <code>--write</code>,{" "}
                <code>--author</code>, <code>--json</code>
              </>,
            ],
            [
              <code key="c">sa run</code>,
              <>
                <code>--cwd</code>, <code>-y</code>/<code>--yes</code>, <code>--plan-only</code>, <code>--parallel</code>{" "}
                (2), <code>--max-tasks</code>, <code>--monarch</code>, <code>--timeout</code> (900 s per task),{" "}
                <code>--wait</code> (120 s), <code>--accept-notes</code>, <code>--keep-worktrees</code>,{" "}
                <code>--no-vault</code>, <code>--no-apply</code>, <code>--json</code>
              </>,
            ],
          ]}
        />
        <ul>
          <li>
            A bad config or delegate file stops the command with <code>error:</code> and exit code 2. A refused summon
            exits 2, and a failed one exits 1.
          </li>
          <li>
            v1&apos;s chat had <code>/help</code>, <code>/plan</code>, <code>/mode</code>, <code>/army</code>,{" "}
            <code>/summon</code>, <code>/route</code>, <code>/vault</code>, <code>/locks</code>,{" "}
            <code>/worktrees</code>, <code>/diff</code>, <code>/clear</code> and <code>/exit</code>. Of these v2 keeps{" "}
            <code>/army</code>, <code>/mode</code> and <code>/diff</code>.
          </li>
        </ul>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
