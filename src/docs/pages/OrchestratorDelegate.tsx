import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): orchestratorDelegate.md,
 * src/core/delegate.ts (v1's parser, which v2 carries over),
 * docs/spec/v2.md v0.5 (ARM-1, ARM-2, M1-AC6) and docs/claude-first.md.
 * Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "two-parts", title: "Two parts" },
  { id: "front-matter", title: "The front matter" },
  { id: "checks", title: "What is checked" },
  { id: "guide", title: "The guide" },
];

export function OrchestratorDelegate({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Who may do what: each soldier's roles, cost and limits, and a guide Claude reads when it picks who gets a brief."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The front matter below is an excerpt of the file shipped on{" "}
            <code>main</code>.
          </p>
        </Callout>

        <H2 id="two-parts">Two parts</H2>
        <ul>
          <li>
            <strong>The front matter</strong>, a YAML block between <code>---</code> lines at the top, is policy.
            Shadow Army enforces it in code.
          </li>
          <li>
            <strong>The body</strong> is a guide in plain Markdown: each soldier&apos;s strengths and weaknesses, an
            effort guide and tie-breaks. It is judgment for Claude, not a rule.
          </li>
        </ul>
        <p>
          A file in the folder you work in wins over the one shipped with the package. It must list the same soldiers
          as <Link href={hrefOf("shadow-config")}>shadow.config.json</Link>.
        </p>

        <H2 id="front-matter">The front matter</H2>
        <CodeBlock
          placeholder={false}
          variants={[
            {
              label: "orchestratorDelegate.md",
              lines: [
                "---",
                "soldiers:",
                "  codex-sol:",
                "    roles: [build]",
                "    cost: 2",
                "  claude-sonnet:",
                "    roles: [build]",
                "    cost: 1",
                "  grok:",
                "    roles: [build]",
                "    cost: 1",
                "    forbidden: [review]       # hard rule",
                "  agy:",
                "    roles: [research, test]",
                "    cost: 1",
                "    write: false              # hard rule: launched read-only, claim audit rejects any edit",
                "---",
              ],
            },
          ]}
        />
        <Table
          head={["Key", "Value", "Default"]}
          rows={[
            [
              <code key="k">roles</code>,
              <>
                One or more of <code>build</code>, <code>review</code>, <code>research</code> and <code>test</code>.
                See <Link href={hrefOf("roles")}>Build and review roles</Link>.
              </>,
              "Required",
            ],
            [<code key="k">cost</code>, "1 cheap, 2 medium, 3 expensive", "2"],
            [
              <code key="k">buildFor</code>,
              <>
                Build tasks of only these difficulties: <code>routine</code>, <code>hard</code>
              </>,
              "Any",
            ],
            [<code key="k">forbidden</code>, "Roles the soldier must never be given", "None"],
            [
              <code key="k">write</code>,
              <>
                <code>false</code> means the soldier is never given write access
              </>,
              <code key="d">true</code>,
            ],
          ]}
        />
        <p>
          claude-opus (Kaisel) and codex-astra (Bellion) both take reviews and hard builds, at cost 3. claude-opus
          has <code>buildFor: [hard]</code>, and codex-astra is listed after it.
        </p>

        <H2 id="checks">What is checked</H2>
        <p>
          Keys are strict, because these are safety rules: a misspelled key such as <code>forbiden</code> is an error,
          not a rule that silently does nothing. The file is also refused when:
        </p>
        <ul>
          <li>a role is both in <code>roles</code> and in <code>forbidden</code>;</li>
          <li>
            <code>write</code> is <code>false</code> and the soldier has the build role;
          </li>
          <li>
            <code>buildFor</code> is set and the soldier has no build role;
          </li>
          <li>it does not start with the front-matter block, or the block is not valid YAML.</li>
        </ul>
        <Callout kind="warning">
          <p>
            The file can only restrict a soldier, never widen it. Grok never reviews and agy never writes, whatever the
            file says: each adapter&apos;s capabilities enforce that too. See{" "}
            <Link href={hrefOf("hard-rules")}>Hard rules</Link>.
          </p>
        </Callout>

        <H2 id="guide">The guide</H2>
        <p>
          The body says, for each soldier, what it is strong at, what to avoid, and which effort suits it. It ends with
          an effort guide and three tie-breaks: respect the hard rules first, prefer the cheapest soldier that clears
          the difficulty bar, and never let the author of a change review it. See{" "}
          <Link href={hrefOf("routing-policy")}>Routing policy</Link>.
        </p>

      </div>

      <FromV1>
        <ul>
          <li>
            The file shipped on <code>main</code> is still v1&apos;s. Its <code>monarch</code> block (
            <code>default: codex-astra</code>, <code>fallback: claude-opus</code>) and its <code>orchestrate</code>{" "}
            role mean nothing in v2: Claude is the Monarch, and no brief asks for orchestration.
          </li>
          <li>
            In that file codex-astra has only the <code>orchestrate</code> role. Giving it reviews and hard builds is
            v2&apos;s, and the shipped file does not say so yet. The excerpt above leaves out both soldiers&apos;
            entries for that reason.
          </li>
          <li>
            The guide&apos;s headings still call codex-astra the primary orchestrator and claude-opus the second,
            and say the Monarch reads the file before every dispatch. In v2 Claude reads it.
          </li>
          <li>The keys, their checks and the hard rules are v1&apos;s, unchanged.</li>
        </ul>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
