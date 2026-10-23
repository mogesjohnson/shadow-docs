import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): rules.md, src/core/rules.ts (v1's
 * loader and size limits, which v2 carries over), docs/spec/v2.md v0.5
 * (SI-1 to SI-4, ARM-2, M4-AC3, M4-AC4) and docs/claude-first.md. Shadow
 * Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "what-it-is", title: "What it is" },
  { id: "the-rules", title: "The rules on main" },
  { id: "how-it-arrives", title: "How it reaches a soldier" },
  { id: "edits", title: "When an edit takes effect" },
  { id: "limits", title: "Size limits" },
];

const RULES = [
  "Stay in your working directory. Do not read, create, change or delete anything outside it.",
  "Change only the files your brief allows. Anything else is reverted and reported.",
  "Leave git alone. Do not commit, push, pull, fetch, merge, rebase, reset, stash, tag, switch branches or change remotes. Shadow Army records and merges your work.",
  "Change nothing on the machine. Do not install, upgrade or remove software globally, and do not touch system settings, environment variables, shell profiles, or other tools' configuration.",
  "Network only for the project's own dependencies, installed into your working directory (for example npm install). No other downloads, uploads or web requests.",
  "Never read, print, copy or send secrets: .env files, keys, tokens, passwords, SSH or cloud credentials.",
  "No destructive commands (recursive deletes, formatting, wiping) except on build output inside your working directory.",
  "Leave nothing running. Stop any server or process you start before you finish.",
  "If the task can only be done by breaking a rule, do not do it. Say so in openQuestions.",
  "Report honestly. Name the commands you ran, and list every check that failed or did not run.",
];

export function RulesMd({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="The rules every soldier follows, whatever its brief says. They go into each soldier's standing instructions once per session."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. <code>rules.md</code> carries over from v1, and its text below is the one
            on <code>main</code>.
          </p>
        </Callout>

        <H2 id="what-it-is">What it is</H2>
        <p>
          <code>rules.md</code> applies to every soldier and every task, and overrides anything a brief says. Some
          soldiers run with no approval prompts, so these rules are the line. A file in the folder you work in wins
          over the one shipped with the package. Its first <code># Title</code> line names the file and is dropped.
        </p>

        <H2 id="the-rules">The rules on main</H2>
        <ol>
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
        <p>
          Rule 9 on <code>main</code> says to name the problem in <code>openQuestions</code>, a field of v1&apos;s
          report. In v2 a soldier says it in its reply.
        </p>
        <Callout kind="warning">
          <p>
            Rules are instructions. What enforces them is Shadow Army: the claim audit reverts files outside a
            soldier&apos;s claims, and the checkout guard watches your folder. See{" "}
            <Link href={hrefOf("file-claims")}>File claims</Link> and{" "}
            <Link href={hrefOf("checkout-guard")}>The checkout guard</Link>.
          </p>
        </Callout>

        <H2 id="how-it-arrives">How it reaches a soldier</H2>
        <p>
          Each session starts with standing instructions, sent once. They hold, in order: the soldier&apos;s shadow
          name, model and roles; the whole team, with Claude as the Monarch; the hard rules, then{" "}
          <code>rules.md</code>, then the soldier&apos;s <Link href={hrefOf("agent-md")}>agent.md</Link> section; the
          five-line reply format; and the handoff instruction.
        </p>
        <p>
          They go in through each CLI&apos;s own slot for appended instructions, and never replace the vendor&apos;s
          prompt. agy has no such slot, so its instructions lead its first message, and the post office view shows
          that.
        </p>

        <H2 id="edits">When an edit takes effect</H2>
        <ul>
          <li>The instructions are fixed for a session&apos;s life. The post office keeps the exact text each session started with.</li>
          <li>
            An edit reaches a soldier with its next fresh session: after <code>/fresh</code> or an accepted handoff.
          </li>
          <li>A session resumed after a crash gets the text it started with, never one rebuilt from the files.</li>
          <li>
            Claude&apos;s transcript gets one line per edit, naming the soldiers whose open sessions keep the older
            rules.
          </li>
          <li>An edit does not make a warm soldier cold, because its session keeps its instructions.</li>
        </ul>
        <p>
          To change a rule for work already running, start the soldier fresh. See{" "}
          <Link href={hrefOf("manage-sessions")}>Manage sessions</Link>.
        </p>

        <H2 id="limits">Size limits</H2>
        <p>
          Every session carries these rules, so they stay small. v1&apos;s loader refuses a <code>rules.md</code> over
          4,000 characters. v2 keeps the whole standing instructions under 1,500 tokens; they measured about 1,000 on
          7 October 2026.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
