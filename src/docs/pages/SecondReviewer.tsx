import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, Pagination, PageHeader } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): orchestratorDelegate.md (effort
 * guide and tie-breaks), docs/spec/v2.md v0.5 (ARM-1 to ARM-3, HOST-9,
 * HOST-10, MSG-1, MSG-11, WSP-6, WSP-9). Shadow Army 2 is not released
 * yet; this guide follows the accepted design.
 */

const TOC: TocItem[] = [
  { id: "why", title: "Why a second soldier" },
  { id: "pick-a-reviewer", title: "1. Pick a reviewer" },
  { id: "build", title: "2. Build" },
  { id: "review", title: "3. Review" },
  { id: "act", title: "4. Act on the review" },
];

export function SecondReviewer({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Have one soldier build and a different one review, so no change is reviewed by its author."
      />
      <div className="sd-prose">
        <Callout kind="warning">
          <p>
            <strong>Planned, not released.</strong> Shadow Army 2 has no release yet, and the steps follow its accepted
            design.
          </p>
        </Callout>

        <H2 id="why">Why a second soldier</H2>
        <p>
          The routing guide&apos;s third tie-break is &ldquo;never let the author of a change review it&rdquo;. Grok
          never reviews, so reviews go to claude-opus (Kaisel) or codex-astra (Bellion), at high effort.
        </p>

        <H2 id="pick-a-reviewer">1. Pick a reviewer</H2>
        <p>
          The bundled army already has both reviewers. <code>/army</code> lists Kaisel and Bellion; this guide uses
          Kaisel. Nothing needs adding.
        </p>
        <p>
          If you started from the four-soldier army in{" "}
          <Link href={hrefOf("first-army")}>Your first army</Link>, which leaves both reviewers out, add Kaisel back
          to both files:
        </p>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "shadow.config.json",
              lines: ['    "claude-opus": { "cli": "claude", "model": "opus", "autonomy": "auto" }'],
            },
            {
              label: "orchestratorDelegate.md",
              lines: ["  claude-opus:", "    roles: [review, build]", "    cost: 3", "    buildFor: [hard]"],
            },
          ]}
        />
        <p>It joins the army as Kaisel.</p>

        <H2 id="build">2. Build</H2>
        <CodeBlock
          placeholder={false}
          variants={[{ label: "Claude Code", lines: ["/send Igris --kind build Add rate limiting to the login route"] }]}
        />
        <p>
          When Igris answers, look at its changes with <code>/diff Igris</code> and apply them with{" "}
          <code>/apply Igris</code>. Work starts from your folder as it is, so the reviewer&apos;s next brief sees
          what you applied.
        </p>

        <H2 id="review">3. Review</H2>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "Claude Code",
              lines: ["/send Kaisel --kind review Review the rate limiting just applied to the login route"],
            },
          ]}
        />
        <p>
          Only words cross between soldiers. Kaisel reads the files itself; Igris&apos;s transcript never reaches it.
          Name the files or the feature in the brief. A review brief for Beru (Grok) would be refused before it was
          sent.
        </p>

        <H2 id="act">4. Act on the review</H2>
        <ul>
          <li>If the review is clean, commit the applied changes yourself.</li>
          <li>
            If it finds problems, brief Igris again with the findings. Igris&apos;s session still holds the work, so
            it does not start over.
          </li>
          <li>
            To back the change out, <code>/apply undo</code> puts your folder back.
          </li>
        </ul>
        <p>
          In practice you can ask Claude to do all of this in plain words: &ldquo;have Igris build it and Kaisel review
          it&rdquo;. See <Link href={hrefOf("roles")}>Build and review roles</Link>.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
