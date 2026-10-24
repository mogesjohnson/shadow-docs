import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader, Table } from "../blocks";
import { hrefOf, neighbours, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): src/core/config.ts and
 * src/core/delegate.ts (v1's loaders, which v2 carries over),
 * shadow.config.json, orchestratorDelegate.md and docs/spec/v2.md v0.5
 * (ARM-1, SES-8, SET-1, VIS-6, MSG-11, milestones M4 to M6). Shadow Army
 * 2 is not released yet.
 */

const TOC: TocItem[] = [
  { id: "shadow-config", title: "shadow.config.json" },
  { id: "delegate", title: "orchestratorDelegate.md" },
  { id: "v2-keys", title: "Keys v2 adds" },
  { id: "checks", title: "Checks and errors" },
];

export function ConfigSchema({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader
        page={page}
        description="Every key of shadow.config.json and of the orchestratorDelegate.md front matter, with its type, its default and what is checked."
      />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development. The keys on this page are the ones the files on <code>main</code> take,
            plus four that v2 adds. The exact format of those four is set at release.
          </p>
        </Callout>

        <H2 id="shadow-config">shadow.config.json</H2>
        <p>
          A JSON object with one key, <code>soldiers</code>, which maps each soldier&apos;s roster id to its settings.
          See <Link href={hrefOf("shadow-config")}>shadow.config.json</Link> for the file as shipped.
        </p>
        <Table
          head={["Key", "Type", "Default", "Notes"]}
          rows={[
            [<code key="k">soldiers</code>, "object", "Required", "Roster id to soldier settings."],
            [<code key="k">soldiers.&lt;id&gt;.cli</code>, "non-empty string", "Required", "claude, codex, grok or agy."],
            [<code key="k">soldiers.&lt;id&gt;.model</code>, "non-empty string", "Required", "Passed to that CLI."],
            [
              <code key="k">soldiers.&lt;id&gt;.autonomy</code>,
              <>
                <code>supervised</code> | <code>auto</code> | <code>full</code>
              </>,
              <code key="d">supervised</code>,
              <>
                See <Link href={hrefOf("autonomy")}>Autonomy levels</Link>.
              </>,
            ],
          ]}
        />
        <p>
          A <code>shadow.config.json</code> in the folder you work in wins over the one shipped with the package.
        </p>

        <H2 id="delegate">orchestratorDelegate.md</H2>
        <p>
          A YAML front matter block between <code>---</code> lines, then a Markdown guide that the schema does not
          check. See <Link href={hrefOf("orchestrator-delegate")}>orchestratorDelegate.md</Link>.
        </p>
        <Table
          head={["Key", "Type", "Default", "Notes"]}
          rows={[
            [<code key="k">soldiers</code>, "object", "Required", "Roster id to soldier policy."],
            [
              <code key="k">soldiers.&lt;id&gt;.roles</code>,
              "list of roles, at least one",
              "Required",
              <>
                <code>build</code>, <code>review</code>, <code>research</code> or <code>test</code>. See{" "}
                <Link href={hrefOf("roles")}>Build and review roles</Link>.
              </>,
            ],
            [<code key="k">soldiers.&lt;id&gt;.cost</code>, "1 | 2 | 3", <code key="d">2</code>, "1 cheap, 2 medium, 3 expensive."],
            [
              <code key="k">soldiers.&lt;id&gt;.buildFor</code>,
              <>
                list of <code>routine</code> | <code>hard</code>
              </>,
              "Any",
              "Only with the build role.",
            ],
            [<code key="k">soldiers.&lt;id&gt;.forbidden</code>, "list of roles", "None", "A role here cannot also be in roles."],
            [
              <code key="k">soldiers.&lt;id&gt;.write</code>,
              "true | false",
              <code key="d">true</code>,
              "false means never given write access, so no build role.",
            ],
          ]}
        />
        <p>
          A file in the folder you work in wins over the one shipped with the package. A rule in it can only restrict a
          soldier, never grant it more: see <Link href={hrefOf("hard-rules")}>Hard rules</Link>.
        </p>

        <H2 id="v2-keys">Keys v2 adds</H2>
        <p>
          All four are set per soldier in <code>shadow.config.json</code>, next to <code>cli</code> and{" "}
          <code>model</code>. <code>handoffAt</code> and <code>cacheLifetime</code> arrive with milestone M4,{" "}
          <code>tag</code> with M5 and <code>tests</code> with M6. Their exact format is set at release.
        </p>
        <Table
          head={["Key", "What it sets", "Default"]}
          rows={[
            [
              <code key="k">handoffAt</code>,
              "The context size at which the soldier hands off. Where the CLI reports its window, it must stay below it.",
              "200,000 tokens",
            ],
            [
              <code key="k">cacheLifetime</code>,
              "How long the provider keeps the soldier's prompt cache. It overrides what the CLI reports.",
              "Not set: from the CLI's usage, then the provider's documentation",
            ],
            [<code key="k">tag</code>, "The soldier's two-letter tag. A duplicate is refused at start.", "From the name"],
            [
              <code key="k">tests</code>,
              "The commands that count as running tests, for the summary card's tests line.",
              <>
                <code key="d">npm test</code>, <code>npx vitest</code>, <code>pytest</code>, <code>cargo test</code>,{" "}
                <code>go test</code>
              </>,
            ],
          ]}
        />
        <p>
          A tag defaults to the name&apos;s first letter, then the earliest later letter that no earlier soldier in
          roster order has used with that first letter: Iron Ir, Igris Ig, Beru Be, Bellion Bl.
        </p>

        <H2 id="checks">Checks and errors</H2>
        <ul>
          <li>
            Both files must list the same soldiers. One missing from the delegate file would run without its rules, and
            one missing from the config has no CLI or model.
          </li>
          <li>
            Invalid JSON, or a value of the wrong kind, stops the start with a message naming each bad path, such as{" "}
            <code>soldiers.grok.autonomy</code>.
          </li>
          <li>
            The delegate file&apos;s keys are strict: a misspelled key is an error, not a rule that does nothing. It is
            also refused when a role is both granted and forbidden, when <code>write</code> is <code>false</code> on a
            soldier with the build role, when <code>buildFor</code> is set without the build role, or when it has no
            valid front matter.
          </li>
          <li>
            <code>handoffAt</code> and <code>cacheLifetime</code> are validated at start.
          </li>
        </ul>
        <p>
          <Link href={hrefOf("rules-md")}>rules.md</Link> and <Link href={hrefOf("agent-md")}>agent.md</Link> are plain
          Markdown with no schema.
        </p>
      </div>

      <FromV1>
        <ul>
          <li>
            v1&apos;s delegate file also had a <code>monarch</code> block (<code>default</code> and an optional{" "}
            <code>fallback</code>, both strict) and an <code>orchestrate</code> role. v2 ignores both: Claude is the
            Monarch, and no brief asks for orchestration.
          </li>
          <li>
            The config keys <code>cli</code>, <code>model</code> and <code>autonomy</code>, the delegate keys and every
            check above are v1&apos;s, unchanged.
          </li>
        </ul>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
