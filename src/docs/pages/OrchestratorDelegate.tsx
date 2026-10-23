import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, CodeBlock, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
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
  { id: "v1-keys", title: "What v2 ignores" },
];

export function OrchestratorDelegate({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Who may do what: each soldier's roles, cost and limits, and a guide Claude reads when it picks who gets a brief."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The file and its routing carry over from v1. The file on{" "}
            <code>main</code> is still v1&apos;s, so it has the <code>monarch</code> block and the{" "}
            <code>orchestrate</code> role that v2 ignores.
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
                "  claude-opus:",
                "    roles: [review, build]",
                "    cost: 3",
                "    buildFor: [hard]",
                "  claude-sonnet:",
                "    roles: [build]",
                "    cost: 1",
                "  grok:",
                "    roles: [build]",
                "    cost: 1",
                "    forbidden: [review]",
                "  agy:",
                "    roles: [research, test]",
                "    cost: 1",
                "    write: false",
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

        <H2 id="v1-keys">What v2 ignores</H2>
        <ul>
          <li>
            The <code>monarch</code> block (<code>default</code> and <code>fallback</code>). Claude is the Monarch.
          </li>
          <li>
            The <code>orchestrate</code> role. No brief asks for orchestration, so no soldier takes it.
          </li>
        </ul>
        <p>
          v2 gives codex-astra (Bellion) review and hard builds, as claude-opus has, and lists it after claude-opus.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
