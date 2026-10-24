"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, GitBranch, History, Menu, Search, X } from "lucide-react";
import { FROM_V1_ID, PhInline, SoldierDot } from "./blocks";
import { useDocsHost, type FooterColumn } from "./host";
import { LogoBar, LogoCompact, LogoStacked } from "./Logo";
import { DOCS_REPO_URL, REPO_URL, hrefOf, pages, tabs, type PageEntry } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

export type TocItem = { id: string; title: string };

/* ------------------------------------------------------------------ */
/* Brand                                                                */
/* ------------------------------------------------------------------ */

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href={hrefOf("overview")} className="sd-wordmark" aria-label="Shadow Army Docs home">
      {compact ? <LogoCompact /> : <LogoBar />}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Keyboard hint: Ctrl on Windows/Linux, ⌘ on Apple                      */
/* ------------------------------------------------------------------ */

const subscribeNothing = () => () => {};

function useModKey(): string {
  return useSyncExternalStore(
    subscribeNothing,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */

function SidebarGroups({ current, onNavigate }: { current: PageEntry; onNavigate?: () => void }) {
  return (
    <>
      {current.tab.groups.map((group) => (
        <div key={group.title} className="sd-side-group">
          <p className="sd-side-title">{group.title}</p>
          <ul className="sd-side-list">
            {group.pages.map((page) => {
              const active = page.slug === current.slug;
              return (
                <li key={page.slug}>
                  <Link
                    href={hrefOf(page.slug)}
                    className="sd-side-link"
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                  >
                    {page.soldier && <SoldierDot soldier={page.soldier} />}
                    {page.nav ?? page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* On this page                                                         */
/* ------------------------------------------------------------------ */

function useActiveHeading(toc: TocItem[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(toc[0]?.id);
  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);
  return active;
}

function OnThisPage({ toc }: { toc: TocItem[] }) {
  const active = useActiveHeading(toc);
  if (toc.length === 0) return null;
  return (
    <nav className="sd-toc" aria-label="On this page">
      <p className="sd-toc-title">On this page</p>
      <ul>
        {toc.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="sd-toc-link" aria-current={item.id === active ? "location" : undefined}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The rail's link to the page's "From v1 to v2" section. */
function FromV1Link() {
  return (
    <a href={`#${FROM_V1_ID}`} className="sd-rail-history">
      <History size={14} aria-hidden="true" />
      <span>
        <span className="sd-rail-history-title">From v1 to v2</span>
        <span className="sd-rail-history-text">How this page changed since v1</span>
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Search and Ask the Monarch                                           */
/* ------------------------------------------------------------------ */

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hits = q
      ? pages.filter((p) => `${p.title} ${p.nav ?? ""} ${p.group.title} ${p.tab.title}`.toLowerCase().includes(q))
      : pages;
    return hits.slice(0, 9);
  }, [query]);

  return (
    <div className="sd-overlay" onMouseDown={onClose}>
      <div
        className="sd-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search Shadow Docs"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sd-dialog-input">
          <Search size={16} aria-hidden="true" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search"
          />
          <kbd className="sd-kbd">Esc</kbd>
        </div>
        <ul className="sd-results">
          {results.map((p) => (
            <li key={p.slug}>
              <Link href={hrefOf(p.slug)} className="sd-result" onClick={onClose}>
                <span className="sd-result-path">
                  {p.tab.title} › {p.group.title}
                </span>
                <span className="sd-result-title">{p.title}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && <li className="sd-results-empty">No pages match.</li>}
        </ul>
        <p className="sd-dialog-foot">
          <PhInline label="full-text search over page content" />
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Shadow Docs",
    links: [
      { label: "Overview", href: hrefOf("overview") },
      { label: "Quickstart", href: hrefOf("quickstart") },
      { label: "CLI reference", href: hrefOf("cli-reference") },
      { label: "Docs source", href: DOCS_REPO_URL, external: true },
    ],
  },
  {
    title: "Shadow Army",
    links: [
      { label: "GitHub repository", href: REPO_URL, external: true },
      { label: "Issues", href: `${REPO_URL}/issues`, external: true },
      { label: "Contributing", href: hrefOf("contributing") },
      { label: "Roadmap", href: hrefOf("roadmap") },
    ],
  },
];

function Footer() {
  const columns = [...FOOTER_COLUMNS, ...(useDocsHost().footerColumns ?? [])];
  return (
    <footer className="sd-footer">
      <div className="sd-footer-inner">
        <div className="sd-footer-brand">
          <Link href={hrefOf("overview")} className="sd-wordmark" aria-label="Shadow Army Docs home">
            <LogoStacked />
          </Link>
          <a href={REPO_URL} className="sd-icon-btn" target="_blank" rel="noopener noreferrer" aria-label="Shadow Army on GitHub">
            <GitBranch size={16} />
          </a>
        </div>
        <div className="sd-footer-cols">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="sd-footer-title">{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="sd-footer-legal">
        <PhInline label="license and copyright line" />
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                                */
/* ------------------------------------------------------------------ */

export function DocsShell({
  current,
  toc,
  fromV1 = false,
  children,
}: {
  current: PageEntry;
  toc: TocItem[];
  /** The page ends with a FromV1 section, so the rail links to it. */
  fromV1?: boolean;
  children: ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const mod = useModKey();
  const host = useDocsHost();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setSearch((open) => !open);
      } else if (k === "escape") {
        setSearch(false);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="sd-root">
      <a href="#sd-content" className="sd-skip">
        Skip to content
      </a>
      <header className="sd-top">
        <div className="sd-top-row">
          <div className="sd-top-left">
            <button type="button" className="sd-icon-btn sd-menu-btn" aria-label="Open navigation" onClick={() => setDrawer(true)}>
              <Menu size={18} />
            </button>
            <Wordmark />
          </div>
          <button type="button" className="sd-search" onClick={() => setSearch(true)}>
            <Search size={15} aria-hidden="true" />
            <span className="sd-search-label">Search...</span>
            <kbd className="sd-kbd">{mod} K</kbd>
          </button>
          <div className="sd-top-right">
            <a href={REPO_URL} className="sd-top-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {host.homeLink && (
              <Link href={host.homeLink.href} className="sd-top-link">
                {host.homeLink.label}
              </Link>
            )}
            {host.themeToggle ?? <ThemeToggle />}
            <Link href={hrefOf("quickstart")} className="sd-cta">
              Get started <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <nav className="sd-tabbar" aria-label="Sections">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={hrefOf(tab.groups[0].pages[0].slug)}
              className="sd-tabbar-link"
              aria-current={tab.id === current.tab.id ? "true" : undefined}
            >
              {tab.title}
            </Link>
          ))}
        </nav>
      </header>

      <div className="sd-body">
        <nav className="sd-side" aria-label="Pages">
          <SidebarGroups current={current} />
        </nav>

        <div className="sd-main">
          <article id="sd-content" className="sd-article">
            {children}
          </article>
          <aside className="sd-rail">
            <div className="sd-rail-inner">
              <OnThisPage toc={toc} />
              {fromV1 && <FromV1Link />}
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      {drawer && (
        <div className="sd-overlay sd-overlay-left" onMouseDown={() => setDrawer(false)}>
          <nav className="sd-drawer" aria-label="Navigation" onMouseDown={(e) => e.stopPropagation()}>
            <div className="sd-drawer-head">
              <Wordmark compact />
              <button type="button" className="sd-icon-btn" aria-label="Close navigation" onClick={() => setDrawer(false)}>
                <X size={18} />
              </button>
            </div>
            <ul className="sd-drawer-tabs">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <Link
                    href={hrefOf(tab.groups[0].pages[0].slug)}
                    className="sd-drawer-tab"
                    aria-current={tab.id === current.tab.id ? "true" : undefined}
                    onClick={() => setDrawer(false)}
                  >
                    {tab.title}
                  </Link>
                </li>
              ))}
            </ul>
            <SidebarGroups current={current} onNavigate={() => setDrawer(false)} />
          </nav>
        </div>
      )}
      {search && <SearchDialog onClose={() => setSearch(false)} />}
    </div>
  );
}
