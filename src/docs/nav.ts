/**
 * Shadow Docs information architecture: tabs, sidebar groups and pages.
 * Every page is a route under /shadow-docs; "overview" is the index.
 */

export type Soldier = "claude" | "codex" | "grok" | "agy";

export type DocPage = {
  slug: string;
  title: string;
  /** Shorter label for the sidebar, when the title is long. */
  nav?: string;
  soldier?: Soldier;
};

export type DocGroup = { title: string; pages: DocPage[] };

export type DocTab = { id: string; title: string; groups: DocGroup[] };

export const BASE = "/shadow-docs";

export const REPO_URL = "https://github.com/mogesjohnson/shadow-army";

/** Where these docs live. "Suggest edits" and "Raise issue" point here. */
export const DOCS_REPO_URL = "https://github.com/mogesjohnson/shadow-docs";

export const tabs: DocTab[] = [
  {
    id: "getting-started",
    title: "Getting started",
    groups: [
      {
        title: "Getting started",
        pages: [
          { slug: "overview", title: "Overview" },
          { slug: "quickstart", title: "Quickstart" },
          { slug: "changelog", title: "Changelog" },
        ],
      },
      {
        title: "Core concepts",
        pages: [
          { slug: "how-shadow-army-works", title: "How Shadow Army works" },
          { slug: "the-monarch", title: "The Monarch" },
          { slug: "soldiers", title: "Soldiers" },
          { slug: "briefs-and-reports", title: "Briefs and reports" },
          { slug: "shadow-vault", title: "The Shadow Vault", nav: "The Shadow Vault (.shadow/)" },
        ],
      },
      {
        title: "Use Shadow Army",
        pages: [
          { slug: "army", title: "See your army", nav: "/army" },
          { slug: "send", title: "Send work", nav: "/send" },
          { slug: "pane", title: "The pane and the strip" },
          { slug: "steer", title: "Stop, queue and decide" },
          { slug: "manage-sessions", title: "Manage sessions" },
          { slug: "apply-changes", title: "Apply a soldier's changes", nav: "/diff and /apply" },
          { slug: "best-practices", title: "Best practices" },
        ],
      },
    ],
  },
  {
    id: "build",
    title: "Build with Shadow Army",
    groups: [
      {
        title: "Parallel work",
        pages: [
          { slug: "worktrees", title: "Soldier worktrees" },
          { slug: "file-claims", title: "File claims" },
          { slug: "roles", title: "Build and review roles" },
        ],
      },
      {
        title: "Safety and autonomy",
        pages: [
          { slug: "autonomy", title: "Autonomy levels" },
          { slug: "snapshots", title: "Read-only snapshots" },
          { slug: "checkout-guard", title: "The checkout guard" },
          { slug: "hard-rules", title: "Hard rules" },
        ],
      },
      {
        title: "Guides",
        pages: [
          { slug: "first-army", title: "Your first army" },
          { slug: "second-reviewer", title: "Review with a second soldier" },
          { slug: "troubleshooting", title: "Troubleshooting" },
        ],
      },
    ],
  },
  {
    id: "soldiers",
    title: "Soldiers",
    groups: [
      {
        title: "Soldiers",
        pages: [
          { slug: "soldiers-overview", title: "Soldiers overview" },
          { slug: "claude", title: "Claude", soldier: "claude" },
          { slug: "codex", title: "Codex", soldier: "codex" },
          { slug: "grok", title: "Grok", soldier: "grok" },
          { slug: "agy", title: "agy", soldier: "agy" },
        ],
      },
      {
        title: "Adapters",
        pages: [
          { slug: "adapter-protocol", title: "Adapter protocol" },
          { slug: "capabilities", title: "Capabilities" },
          { slug: "new-adapter", title: "Write a new adapter" },
        ],
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    groups: [
      {
        title: "Settings",
        pages: [
          { slug: "shadow-config", title: "shadow.config.json" },
          { slug: "orchestrator-delegate", title: "orchestratorDelegate.md" },
          { slug: "routing-policy", title: "Routing policy" },
        ],
      },
      {
        title: "Instructions",
        pages: [
          { slug: "rules-md", title: "rules.md" },
          { slug: "agent-md", title: "agent.md" },
        ],
      },
      {
        title: "Models and cost",
        pages: [
          { slug: "models", title: "Choose models" },
          { slug: "cost", title: "Cost and tokens" },
        ],
      },
    ],
  },
  {
    id: "reference",
    title: "Reference",
    groups: [
      {
        title: "Reference",
        pages: [
          { slug: "cli-reference", title: "CLI reference" },
          { slug: "config-schema", title: "Config schema" },
          { slug: "brief-format", title: "Brief format" },
          { slug: "report-format", title: "Report format" },
        ],
      },
      {
        title: "Glossary",
        pages: [{ slug: "glossary", title: "Glossary" }],
      },
    ],
  },
  {
    id: "whats-new",
    title: "What's New",
    groups: [
      {
        title: "What's New",
        pages: [
          { slug: "whats-new", title: "What's new" },
          { slug: "roadmap", title: "Roadmap: Shadow Army 2.0", nav: "Roadmap" },
        ],
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    groups: [
      {
        title: "Contributing",
        pages: [
          { slug: "contributing", title: "Contributing" },
          { slug: "commits-and-prs", title: "Commits and pull requests" },
        ],
      },
      {
        title: "Project records",
        pages: [
          { slug: "decisions", title: "Architecture decisions" },
          { slug: "spec", title: "Specification" },
          { slug: "support", title: "Support" },
        ],
      },
    ],
  },
];

export type PageEntry = DocPage & { tab: DocTab; group: DocGroup };

/** Every page in reading order, for previous/next links. */
export const pages: PageEntry[] = tabs.flatMap((tab) =>
  tab.groups.flatMap((group) => group.pages.map((page) => ({ ...page, tab, group }))),
);

export function hrefOf(slug: string): string {
  return slug === "overview" ? BASE : `${BASE}/${slug}`;
}

export function findPage(slug: string): PageEntry | undefined {
  return pages.find((page) => page.slug === slug);
}

export function neighbours(slug: string): { prev?: PageEntry; next?: PageEntry } {
  const i = pages.findIndex((page) => page.slug === slug);
  return { prev: pages[i - 1], next: pages[i + 1] };
}
