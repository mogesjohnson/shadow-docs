import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-1,
 * HOST-2, HOST-5, HOST-9, HOST-10, ARM-1, ARM-3, MSG-9, MSG-10, PO-7,
 * WSP-9 and the milestones M1 to M6) and shadow.config.json. Nothing here
 * has shipped: the owner asked for the page to be written from the spec
 * and marked as planned.
 */

const TOC: TocItem[] = [
  { id: "before-you-start", title: "Before you start" },
  { id: "load-the-mod", title: "1. Load the mod" },
  { id: "see-your-army", title: "2. See your army" },
  { id: "send-work", title: "3. Send work" },
  { id: "watch-and-steer", title: "4. Watch and steer" },
  { id: "review-and-apply", title: "5. Review and apply" },
];

export function Quickstart({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="How a first session with Shadow Army 2 is planned to go: load the mod in Claude Code, check your army and send it one piece of work."
      />
      <div className="sd-prose">
        <Callout kind="warning">
          <p>
            <strong>Planned, not released.</strong> Shadow Army 2 has no install command or release yet. Every step
            below comes from the accepted design and can change before release.
          </p>
        </Callout>

        <H2 id="before-you-start">Before you start</H2>
        <ul>
          <li>Claude Code. Your own session becomes the Monarch.</li>
          <li>
            At least one soldier CLI, installed and signed in: <code>claude</code>, <code>codex</code>,{" "}
            <code>grok</code> or <code>agy</code>. Each soldier uses your own account with that vendor.
          </li>
          <li>A git repository to work in. Soldiers build in their own worktrees of it.</li>
        </ul>

        <H2 id="load-the-mod">1. Load the mod</H2>
        <p>
          Shadow Army ships as a Claude Code plugin in its own repository. You load it with{" "}
          <code>--plugin-dir</code> or install it from that repository. It does not come from a marketplace.
        </p>
        <CodeBlock placeholder={false} variants={[{ label: "Terminal", lines: ["claude --plugin-dir <path to the Shadow Army mod>"] }]} />
        <Callout kind="note">
          <p>
            The mod&apos;s folder and the exact install steps are set when its screens ship. You do not start the post
            office yourself: the mod starts it the first time you use the army in a session, and stops it when the
            session ends.
          </p>
        </Callout>

        <H2 id="see-your-army">2. See your army</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/army"] }]} />
        <p>
          <code>/army</code> lists every soldier with its two-letter tag, and shows the post office&apos;s own log. The
          bundled army has six soldiers: Iron, Igris, Beru, Tusk, Kaisel and Bellion. The army strip above the prompt
          shows the same soldiers on one line.
        </p>

        <H2 id="send-work">3. Send work</H2>
        <p>
          Ask Claude for something in plain words, as you already do. Claude picks a soldier and sends it a brief with
          its <code>send</code> tool. You can also send one yourself:
        </p>
        <CodeBlock
          placeholder={false}
          variants={[{ label: "Claude Code", lines: ["/send Iron --kind build Add a health check route"] }]}
        />
        <p>
          The brief&apos;s row in the transcript moves through queued, delivered and answered. When Iron is done, a
          summary card of at most five lines arrives, with the path of the full report.
        </p>

        <H2 id="watch-and-steer">4. Watch and steer</H2>
        <CodeBlock placeholder={false} variants={[{ label: "Claude Code", lines: ["/pane Iron", "/stop Iron", "/queue Iron"] }]} />
        <ul>
          <li>
            <code>/pane Iron</code> opens Iron&apos;s live session beside the transcript, with its meter and a message
            field.
          </li>
          <li>
            <code>/stop Iron</code>, or s in the pane, stops the running turn. The session and the work so far stay,
            and Iron&apos;s queue is held until you send it on.
          </li>
          <li>
            <code>/queue Iron</code>, or q in the pane, shows the messages waiting for Iron. You can change or cancel
            any of them before they go.
          </li>
        </ul>
        <p>
          Anything that needs your answer, such as an approval request from a soldier&apos;s CLI, joins one list of
          decisions. <code>/decisions</code> prints it.
        </p>

        <H2 id="review-and-apply">5. Review and apply</H2>
        <CodeBlock
          placeholder={false}
          variants={[{ label: "Claude Code", lines: ["/diff Iron", "/apply Iron", "/apply undo"] }]}
        />
        <p>
          <code>/diff</code> shows Iron&apos;s changes on its branch. <code>/apply</code> copies them into your folder
          all or nothing, and <code>/apply undo</code> puts the folder back. These two commands arrive with the last
          milestone before release.
        </p>
        <p>
          When you end the Claude session, the post office closes every soldier session. Worktrees and branches stay.
          Next, read <Link href={hrefOf("how-shadow-army-works")}>How Shadow Army works</Link>.
        </p>
      </div>
      <FromV1>
        <ul>
          <li>
            The old <code>sa</code> CLI is v1. It is frozen at <code>v1.0.1</code> and is not covered in these
            docs.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
