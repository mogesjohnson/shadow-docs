import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, SoldierDot, Table } from "../blocks";
import { neighbours, type PageEntry, type Soldier } from "../nav";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (HOST-10,
 * ARM-1 to ARM-5), orchestratorDelegate.md (roles, cost, effort guide and
 * tie-breaks) and CLAUDE.md (design rules). Shadow Army 2 is not released
 * yet.
 */

const TOC: TocItem[] = [
  { id: "roles", title: "Roles and kinds of work" },
  { id: "who-does-what", title: "Who does what" },
  { id: "cost", title: "Cost and effort" },
  { id: "restrict-never-widen", title: "Restrict, never widen" },
];

const ROSTER: { soldier: Soldier; name: string; id: string; roles: string; cost: string }[] = [
  { soldier: "claude", name: "Iron", id: "claude-sonnet", roles: "build", cost: "1" },
  { soldier: "codex", name: "Igris", id: "codex-sol", roles: "build", cost: "2" },
  { soldier: "grok", name: "Beru", id: "grok", roles: "build (never review)", cost: "1" },
  { soldier: "agy", name: "Tusk", id: "agy", roles: "research, test (never writes)", cost: "1" },
  { soldier: "claude", name: "Kaisel", id: "claude-opus", roles: "review, build (hard)", cost: "3" },
  { soldier: "codex", name: "Bellion", id: "codex-astra", roles: "review, build (hard)", cost: "3" },
];

export function Roles({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Every brief names its kind of work, and a soldier takes only the kinds its roles allow."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. This page describes the design the owner has accepted.
          </p>
        </Callout>

        <H2 id="roles">Roles and kinds of work</H2>
        <p>
          A brief carries one kind of work: <strong>build</strong>, <strong>review</strong>, <strong>research</strong>{" "}
          or <strong>test</strong>. A brief whose kind is not among the soldier&apos;s roles, or that a hard rule
          forbids, is refused before it is sent, and the refusal says why.
        </p>
        <ul>
          <li>Writes need the build role, and happen only in the soldier&apos;s own worktree, under its claims.</li>
          <li>Only the Monarch plans and assigns work. Soldiers answer, ask and report.</li>
          <li>Claude is the Monarch, so no brief asks for orchestration.</li>
        </ul>

        <H2 id="who-does-what">Who does what</H2>
        <Table
          head={["Soldier", "Roster id", "Roles", "Cost"]}
          rows={ROSTER.map(({ soldier, name, id, roles, cost }) => [
            <span key="n" className="sd-cell-soldier">
              <SoldierDot soldier={soldier} />
              {name}
            </span>,
            <code key="i">{id}</code>,
            roles,
            cost,
          ])}
        />
        <p>
          Bellion takes review and hard builds, as Kaisel does, and is listed after Kaisel. Tank (claude-opus-build)
          is named but not yet defined.
        </p>

        <H2 id="cost">Cost and effort</H2>
        <p>
          Cost runs from 1 (cheap) to 3 (expensive). The routing guide in <code>orchestratorDelegate.md</code> breaks
          ties this way:
        </p>
        <ol>
          <li>Respect the hard rules first; never override them.</li>
          <li>Prefer the cheapest soldier that clears the difficulty bar.</li>
          <li>Never let the author of a change review it.</li>
        </ol>
        <Table
          head={["Task", "Prefer"]}
          rows={[
            ["Routine feature or refactor", "claude-sonnet, grok or codex-sol at low or medium effort"],
            ["Hard or risky feature", "claude-opus (high) or codex-sol (high)"],
            ["Review", "claude-opus (high); never grok"],
            ["Research or test runs", "agy"],
          ]}
        />

        <H2 id="restrict-never-widen">Restrict, never widen</H2>
        <p>
          Roles, cost and the limits <code>forbidden</code> and <code>write</code> live in the front matter of{" "}
          <code>orchestratorDelegate.md</code>. Its keys are strict: a typo is an error. A delegate entry can take a
          role away from a soldier, but can never give Grok the review role or let agy write.
        </p>
      </div>
      <FromV1>
        <ul>
          <li>Roles carry over from v1.</li>
          <li>
            v1&apos;s <code>orchestrate</code> role and <code>monarch</code> block mean nothing in v2.
          </li>
          <li>
            The delegate file on <code>main</code> still lists v1&apos;s <code>orchestrate</code> role for codex-astra.
          </li>
          <li>
            Bellion is listed after Kaisel because v1&apos;s router breaks ties by roster order. Until v1&apos;s code
            leaves <code>main</code>, it still ranks Kaisel first for reviews and hard builds.
          </li>
        </ul>
      </FromV1>
      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
