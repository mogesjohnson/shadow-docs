import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (ARM-1,
 * ARM-2, ARM-4, ARM-5, HOST-10, MSG-2, M3-AC5, LEG-1),
 * orchestratorDelegate.md (effort guide and tie-breaks), and, for the
 * From v1 to v2 section, src/core/router.ts and src/core/assign.ts (v1's
 * router). Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "who-decides", title: "Who decides" },
  { id: "checked", title: "What is checked before sending" },
  { id: "tie-breaks", title: "How Claude chooses" },
  { id: "effort", title: "Suggested effort" },
];

export function RoutingPolicy({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Claude chooses who gets each brief. Shadow Army checks the brief against the hard rules and the soldier's roles before it is sent."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The checks made before a brief is sent arrive with milestone M3.
          </p>
        </Callout>

        <H2 id="who-decides">Who decides</H2>
        <p>
          Only the Monarch plans and assigns work, and Claude is the Monarch. It picks the soldier itself, guided by
          the body of <Link href={hrefOf("orchestrator-delegate")}>orchestratorDelegate.md</Link>, and sends the brief
          with the <code>send</code> tool, naming the soldier and the kind of work: build, review, research or test.
          The kind is required.
        </p>
        <p>
          A soldier&apos;s name that matches no one is not sent: Shadow Army suggests the closest name instead. See{" "}
          <Link href={hrefOf("send")}>Send work</Link>.
        </p>

        <H2 id="checked">What is checked before sending</H2>
        <p>A brief is refused before it is sent, and the refusal says why, when its kind:</p>
        <ul>
          <li>breaks a hard rule: a review for grok, or a build for agy;</li>
          <li>
            is not among the soldier&apos;s <code>roles</code> in the delegate file.
          </li>
        </ul>
        <p>
          <code>/send</code> with a kind is checked the same way. A <code>/send</code> without one is not checked for a
          kind. Writes need the build role.
        </p>
        <Callout kind="warning">
          <p>
            The delegate file can only restrict a soldier, never widen it. The hard rules are enforced when a brief is
            sent and by each adapter&apos;s capabilities. See <Link href={hrefOf("hard-rules")}>Hard rules</Link> and{" "}
            <Link href={hrefOf("capabilities")}>Capabilities</Link>.
          </p>
        </Callout>

        <H2 id="tie-breaks">How Claude chooses</H2>
        <p>
          The guide in the delegate file says what each soldier is strong at and what to avoid (see{" "}
          <Link href={hrefOf("models")}>Choose models</Link>), and ends with three tie-breaks:
        </p>
        <ol>
          <li>Respect hard rules first; never override them.</li>
          <li>Prefer the cheapest soldier that clears the difficulty bar.</li>
          <li>Never let the author of a change review it.</li>
        </ol>
        <p>
          Cost is each soldier&apos;s <code>cost</code> in the delegate file: 1 cheap, 2 medium, 3 expensive.
        </p>

        <H2 id="effort">Suggested effort</H2>
        <p>The guide&apos;s effort table:</p>
        <Table
          head={["Task", "Prefer"]}
          rows={[
            ["Routine feature or refactor", "claude-sonnet, grok or codex-sol at low or medium effort"],
            ["Hard or risky feature", "claude-opus (high) or codex-sol (high)"],
            ["Review", "claude-opus (high); never grok"],
            ["Research or test runs", "agy"],
          ]}
        />
        <p>For claude-opus it adds: high or max for reviews and hard builds.</p>
      </div>

      <FromV1>
        <p>
          v1 ranked soldiers in code. Its router left a soldier out, with the reason, when its CLI had no adapter or
          was not installed, the role was forbidden or not among its roles, the task wrote and the soldier was
          read-only, the soldier had written the change under review, or a build&apos;s difficulty was not in its{" "}
          <code>buildFor</code>. It then ranked the rest:
        </p>
        <ul>
          <li>routine build: the cheapest soldier first;</li>
          <li>
            hard build: soldiers with <code>buildFor: [hard]</code> first, then the most expensive;
          </li>
          <li>review, research and test: the most expensive first, as the most capable;</li>
          <li>ties by roster order, so claude-opus still comes before codex-astra for reviews and hard builds.</li>
        </ul>
        <p>
          Each candidate carried a suggested effort: high for reviews and hard builds, medium for routine builds,
          research and tests. v2&apos;s spec sets no ranking: Claude picks. v1&apos;s router stays on{" "}
          <code>main</code> until v1-only code leaves it in milestone M6.
        </p>
        <p>
          The guide&apos;s effort table on <code>main</code> also has a v1 row, &ldquo;Plan and delegate: codex-astra;
          fallback claude-opus&rdquo;. In v2 Claude plans.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
