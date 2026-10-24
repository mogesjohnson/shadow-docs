import Link from "next/link";
import { DocsShell, type TocItem } from "../DocsShell";
import { Callout, Feedback, FromV1, H2, Pagination, PageHeader } from "../blocks";
import { DOCS_REPO_URL, hrefOf, neighbours, REPO_URL, type PageEntry } from "../nav";

/*
 * Sources (shadow-army main at ab04992): README.md (its tagline and status
 * line), LICENSE, package.json (license, private, engines),
 * .github/ISSUE_TEMPLATE/feature.md, .github/workflows/ci.yml and
 * docs/spec/v2.md v0.5 (section 1 non-goals, Q6); and this repo's nav.ts
 * for where "Suggest edits" and "Raise issue" go. Shadow Army 2 is not
 * released yet.
 */

const TOC: TocItem[] = [
  { id: "status", title: "Status" },
  { id: "get-help", title: "Get help" },
  { id: "report-a-problem", title: "Report a problem" },
  { id: "platforms", title: "Platforms" },
  { id: "licence", title: "Licence" },
];

export function Support({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC} fromV1>
      <PageHeader page={page} description="Where to get help with Shadow Army, where to report a problem, and its licence." />
      <div className="sd-prose">
        <Callout kind="note">
          <p>
            Shadow Army 2 is in development, and has no release to install yet. Shadow Army is a personal project, so
            help comes through its GitHub repository, not a support service.
          </p>
        </Callout>

        <H2 id="status">Status</H2>
        <p>
          Shadow Army is a personal CLI that commands other AI coding CLIs as a disciplined army. Shadow Army 2 is
          specified and being built milestone by milestone. See <Link href={hrefOf("roadmap")}>Roadmap</Link> for
          where it stands.
        </p>

        <H2 id="get-help">Get help</H2>
        <ul>
          <li>
            Start with <Link href={hrefOf("troubleshooting")}>Troubleshooting</Link>.
          </li>
          <li>
            For how a feature is meant to behave, the <Link href={hrefOf("spec")}>specification</Link> is the source
            these docs follow.
          </li>
        </ul>

        <H2 id="report-a-problem">Report a problem</H2>
        <ul>
          <li>
            <strong>Shadow Army itself:</strong> open an issue on{" "}
            <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
              mogesjohnson/shadow-army
            </a>
            . A feature request uses the Feature template: a goal, acceptance criteria and what is out of scope. See{" "}
            <Link href={`${hrefOf("contributing")}#issues`}>Write an issue</Link>.
          </li>
          <li>
            <strong>These docs:</strong> use &ldquo;Raise issue&rdquo; or &ldquo;Suggest edits&rdquo; at the end of
            any page, or open an issue on{" "}
            <a href={`${DOCS_REPO_URL}/issues`} target="_blank" rel="noreferrer">
              mogesjohnson/shadow-docs
            </a>
            .
          </li>
        </ul>
        <p>
          Leave secrets out of any report: an issue is public.
        </p>

        <H2 id="platforms">Platforms</H2>
        <ul>
          <li>Windows and POSIX are both supported. CI runs every test on ubuntu, macos and windows.</li>
          <li>Shadow Army needs Node 20 or later.</li>
          <li>
            Everything runs on your machine. No part of the army is reachable from the network, by design.
          </li>
          <li>POSIX and macOS terminals still need a live check by the owner before v2.0.0.</li>
        </ul>

        <H2 id="licence">Licence</H2>
        <p>
          Shadow Army is released under the MIT License, copyright 2026 mogesjohnson. The full text is in{" "}
          <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            <code>LICENSE</code>
          </a>
          . The package is marked private and is not published to npm.
        </p>
      </div>

      <FromV1>
        <p>
          v1, the per-message <code>sa</code> CLI, is frozen at <code>v1.0.1</code> and gets no new features. Its code
          is on the <code>legacy/v1</code> branch, and its last releases are on the{" "}
          <Link href={`${hrefOf("changelog")}#v1`}>Changelog</Link>.
        </p>
      </FromV1>

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
