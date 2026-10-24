import { DocsShell, type TocItem } from "./DocsShell";
import { Callout, CodeBlock, Feedback, H2, H3, Pagination, PageHeader, Ph } from "./blocks";
import { neighbours, type PageEntry } from "./nav";

const TOC: TocItem[] = [
  { id: "section-1", title: "Section heading" },
  { id: "section-2", title: "Section heading" },
  { id: "section-3", title: "Section heading" },
];

/** The skeleton every page shows until its own outline is written. */
export function PlaceholderPage({ page }: { page: PageEntry }) {
  const { prev, next } = neighbours(page.slug);
  return (
    <DocsShell current={page} toc={TOC}>
      <PageHeader page={page} />
      <Ph label="intro paragraph" lines={3} />

      <H2 id="section-1">Section heading</H2>
      <Ph label="section body" lines={4} />
      <Callout kind="note" label="something easy to miss" />

      <H2 id="section-2">Section heading</H2>
      <Ph label="section body" lines={3} />
      <CodeBlock variants={[{ label: "Terminal", lines: ["example command"] }]} />
      <H3 id="section-2-sub">Subsection heading</H3>
      <Ph label="subsection body" lines={2} />

      <H2 id="section-3">Section heading</H2>
      <Ph label="section body" lines={3} />

      <Feedback />
      <Pagination prev={prev} next={next} />
    </DocsShell>
  );
}
