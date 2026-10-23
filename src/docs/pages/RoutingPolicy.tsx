import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): src/core/router.ts and
 * src/core/assign.ts (v1's router and hard rules, which v2 carries over),
 * orchestratorDelegate.md (effort guide and tie-breaks), docs/spec/v2.md
 * v0.5 (ARM-1, ARM-2, ARM-4, HOST-10, LEG-1) and docs/claude-first.md.
 * Shadow Army 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "who-decides", title: "Who decides" },
  { id: "refused", title: "What is refused" },
  { id: "ranking", title: "How soldiers are ranked" },
  { id: "effort", title: "Suggested effort" },
];

export function RoutingPolicy({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader
        page={page}
        description="Claude chooses who gets each brief. The policy decides who may take it, and in what order the eligible soldiers are preferred."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. Routing carries over from v1: the rules on this page are v1&apos;s router,
            which stays on <code>main</code> until v1-only code leaves it in milestone M6.
          </p>
        </Callout>

        <H2 id="who-decides">Who decides</H2>
        <p>
          Only the Monarch plans and assigns work. Claude picks the soldier, guided by the body of{" "}
          <Link href={hrefOf("orchestrator-delegate")}>orchestratorDelegate.md</Link>. Every brief names its kind of
          work: build, review, research or test. The policy is pure rules with no model involved: it removes the
          soldiers who may not take a task and ranks the rest.
        </p>

        <H2 id="refused">What is refused</H2>
        <p>
          A brief that a hard rule forbids, or whose kind is not among the soldier&apos;s roles, is refused before it
          is sent, and the refusal says why. When ranking, a soldier is left out, with its reason, when:
        </p>
        <ul>
          <li>its CLI has no adapter, or the CLI is not installed;</li>
          <li>
            <code>forbidden</code> lists the role, or its adapter cannot take it (Grok never reviews);
          </li>
          <li>its roles do not include the kind of work;</li>
          <li>
            the task writes and the soldier is read-only (agy, or <code>write: false</code>), or the role is not build:
            writes are granted only for builds;
          </li>
          <li>it is a review and the soldier wrote the change, since nobody reviews their own work;</li>
          <li>
            it is a build whose difficulty is not in the soldier&apos;s <code>buildFor</code>.
          </li>
        </ul>

        <H2 id="ranking">How soldiers are ranked</H2>
        <Table
          head={["Task", "Preferred first", "Then"]}
          rows={[
            ["Routine build", "The cheapest soldier", "Roster order"],
            [
              "Hard build",
              <>
                Soldiers with <code>buildFor: [hard]</code>, then the most expensive
              </>,
              "Roster order",
            ],
            ["Review, research, test", "The most expensive, as the most capable", "Roster order"],
          ]}
        />
        <p>
          Ties break by roster order: the order soldiers appear in the files. That is why codex-astra (Bellion) is
          listed after claude-opus (Kaisel). Both take reviews and hard builds in v2, and the router still ranks Kaisel
          first for both. See <Link href={hrefOf("roles")}>Build and review roles</Link>.
        </p>

        <H2 id="effort">Suggested effort</H2>
        <p>Each candidate comes with a suggested reasoning effort:</p>
        <Table
          head={["Task", "Effort"]}
          rows={[
            ["Review", "high"],
            ["Hard build", "high"],
            ["Routine build", "medium"],
            ["Research or test", "medium"],
          ]}
        />
        <p>
          The guide in the delegate file goes further: low or medium for routine features on claude-sonnet, grok or
          codex-sol; high for hard work on claude-opus or codex-sol; and high or max for claude-opus on reviews and
          hard builds. See <Link href={hrefOf("models")}>Choose models</Link>.
        </p>
      </div>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
