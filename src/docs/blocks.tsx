"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  TriangleAlert,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Info,
  Lightbulb,
  Link2,
  OctagonAlert,
  ThumbsDown,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import { DOCS_REPO_URL, hrefOf, type PageEntry, type Soldier } from "./nav";

/* ------------------------------------------------------------------ */
/* Placeholders                                                         */
/* ------------------------------------------------------------------ */

const LINE_WIDTHS = [100, 94, 97, 88, 92, 70];

/** A block that stands in for copy still to be written. */
export function Ph({ label, lines = 3 }: { label: string; lines?: number }) {
  return (
    <div className="sd-ph" role="note" aria-label={`Placeholder: ${label}`}>
      <span className="sd-ph-label">Placeholder · {label}</span>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="sd-ph-line"
          style={{ width: `${i === lines - 1 && lines > 1 ? 62 : LINE_WIDTHS[i % LINE_WIDTHS.length]}%` }}
        />
      ))}
    </div>
  );
}

/** An inline chip for a word or value still to be written. */
export function PhInline({ label }: { label: string }) {
  return (
    <span className="sd-ph-inline" aria-label={`Placeholder: ${label}`}>
      {label}
    </span>
  );
}

export function SoldierDot({ soldier }: { soldier: Soldier }) {
  return <span className={`sd-dot sd-dot-${soldier}`} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Page header                                                          */
/* ------------------------------------------------------------------ */

export function PageHeader({ page, description }: { page: PageEntry; description?: string }) {
  return (
    <header className="sd-page-header">
      <div className="sd-page-header-row">
        <p className="sd-eyebrow">{page.group.title}</p>
        <CopyPage />
      </div>
      <h1 className="sd-h1">
        {page.soldier && <SoldierDot soldier={page.soldier} />}
        {page.title}
      </h1>
      <div className="sd-description">
        {description ? <p>{description}</p> : <Ph label="page description, one sentence" lines={2} />}
      </div>
    </header>
  );
}

function CopyPage() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuId = useId();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="sd-copy">
      <button type="button" className="sd-copy-main" onClick={copyLink}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span>{copied ? "Copied" : "Copy page"}</span>
      </button>
      <button
        type="button"
        className="sd-copy-more"
        aria-label="More page actions"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown size={14} />
      </button>
      {open && (
        <div id={menuId} className="sd-menu" role="menu">
          {[
            { icon: Copy, label: "Copy page as Markdown" },
            { icon: FileText, label: "View as Markdown" },
            { icon: Link2, label: "Open in Claude" },
            { icon: Link2, label: "Open in Codex" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} type="button" role="menuitem" className="sd-menu-item" disabled>
              <Icon size={14} />
              <span>{label}</span>
              <span className="sd-soon">soon</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Headings                                                             */
/* ------------------------------------------------------------------ */

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="sd-h2">
      <a href={`#${id}`} className="sd-anchor" aria-label="Link to this section">
        #
      </a>
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="sd-h3">
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/* Callouts                                                             */
/* ------------------------------------------------------------------ */

type CalloutKind = "note" | "tip" | "warning" | "danger";

const CALLOUT_ICON: Record<CalloutKind, LucideIcon> = {
  note: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  danger: OctagonAlert,
};

/** Pass children for real copy; `label` alone draws a placeholder. */
export function Callout({
  kind = "note",
  label,
  children,
}: {
  kind?: CalloutKind;
  label?: string;
  children?: ReactNode;
}) {
  const Icon = CALLOUT_ICON[kind];
  return (
    <div className={`sd-callout sd-callout-${kind}`}>
      <Icon size={16} className="sd-callout-icon" aria-hidden="true" />
      <div className="sd-callout-body">
        {children ?? <Ph label={`${kind}: ${label ?? "callout"}`} lines={2} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs and code                                                        */
/* ------------------------------------------------------------------ */

export function Tabs({ items }: { items: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  return (
    <div className="sd-tabs">
      <div className="sd-tabs-list" role="tablist">
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            className="sd-tab"
            onClick={() => setActive(i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          hidden={i !== active}
          className="sd-tab-panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

/** A code group. Each variant shows placeholder comment lines until real commands land. */
/** `placeholder` (the default) marks each line as copy still to be written. */
export function CodeBlock({
  variants,
  placeholder = true,
}: {
  variants: { label: string; lines: string[] }[];
  placeholder?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = variants[active];
  return (
    <div className="sd-code">
      <div className="sd-code-bar">
        <div className="sd-code-tabs" role="tablist">
          {variants.map((v, i) => (
            <button
              key={v.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              className="sd-code-tab"
              onClick={() => setActive(i)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button type="button" className="sd-icon-btn" aria-label="Copy code" disabled>
          <Copy size={14} />
        </button>
      </div>
      <pre className="sd-pre">
        <code>
          {current.lines.map((line, i) => (
            <span key={i} className="sd-code-line">
              {placeholder ? <span className="sd-code-comment"># placeholder: {line}</span> : line}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accordions, cards, tables                                            */
/* ------------------------------------------------------------------ */

export function Accordion({ title, icon: Icon }: { title: string; icon?: LucideIcon }) {
  return (
    <details className="sd-accordion">
      <summary className="sd-accordion-summary">
        <ChevronRight size={16} className="sd-accordion-caret" aria-hidden="true" />
        {Icon && <Icon size={16} className="sd-accordion-icon" aria-hidden="true" />}
        <span>{title}</span>
      </summary>
      <div className="sd-accordion-body">
        <Ph label={`${title}: what it does and an example prompt`} lines={3} />
      </div>
    </details>
  );
}

export function CardGrid({ cards }: { cards: { title: string; slug: string; icon: LucideIcon }[] }) {
  return (
    <div className="sd-cards">
      {cards.map(({ title, slug, icon: Icon }) => (
        <Link key={slug} href={hrefOf(slug)} className="sd-card">
          <Icon size={20} className="sd-card-icon" aria-hidden="true" />
          <span className="sd-card-title">{title}</span>
          <span className="sd-ph-line sd-card-line" />
          <span className="sd-ph-line sd-card-line sd-card-line-short" />
        </Link>
      ))}
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="sd-table-wrap">
      <table className="sd-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page end                                                             */
/* ------------------------------------------------------------------ */

export function Feedback() {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  return (
    <div className="sd-feedback">
      <div className="sd-feedback-ask">
        <span>Was this page helpful?</span>
        <button
          type="button"
          className="sd-pill"
          aria-pressed={vote === "yes"}
          onClick={() => setVote("yes")}
        >
          <ThumbsUp size={14} /> Yes
        </button>
        <button
          type="button"
          className="sd-pill"
          aria-pressed={vote === "no"}
          onClick={() => setVote("no")}
        >
          <ThumbsDown size={14} /> No
        </button>
        {vote && <span className="sd-feedback-thanks">Thanks.</span>}
      </div>
      <div className="sd-feedback-links">
        <a href={DOCS_REPO_URL} target="_blank" rel="noopener noreferrer">
          Suggest edits
        </a>
        <a href={`${DOCS_REPO_URL}/issues/new`} target="_blank" rel="noopener noreferrer">
          Raise issue
        </a>
      </div>
    </div>
  );
}

export function Pagination({ prev, next }: { prev?: PageEntry; next?: PageEntry }) {
  return (
    <nav className="sd-pagination" aria-label="Pagination">
      {prev ? (
        <Link href={hrefOf(prev.slug)} className="sd-pager sd-pager-prev">
          <ArrowLeft size={14} aria-hidden="true" />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={hrefOf(next.slug)} className="sd-pager sd-pager-next">
          <span>{next.title}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
