# Shadow Docs

Documentation for [Shadow Army](https://github.com/mogesjohnson/shadow-army) (`sa`), the CLI that commands other AI CLIs as an army.

The site is laid out the way the Claude Code docs are (top bar, section tabs, sidebar, "On this page" rail, page footer) and uses Shadow Army's own logo and colours. It is a skeleton for now: every page has its headings and labelled placeholders, and no body copy yet. The plan is in [`docs/PLAN.md`](docs/PLAN.md).

## Two ways it runs

- **Standalone.** This repo is a Next.js app. The docs are served at `/shadow-docs`, and `/` redirects there.
- **On the portfolio.** [`mogesjohnson/Personal-Portfolio`](https://github.com/mogesjohnson/Personal-Portfolio) includes this repo as a git submodule at `website-template/builds/shadow-docs` and renders the same pages at `/shadow-docs`. The portfolio passes its own theme toggle, a "Main site" link and its footer columns through `ShadowDocsHost` (`src/docs/host.tsx`). Everything else comes from here.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000/shadow-docs
```

## Verify

```bash
npm run lint
npm run build
```

## Where things live

| Path | What it holds |
| --- | --- |
| `src/docs/nav.ts` | Tabs, sidebar groups and pages. Every page is a route under `/shadow-docs`. |
| `src/docs/DocsShell.tsx` | Top bar, tabs, sidebar and mobile drawer, search (Ctrl K / ⌘K), "On this page" scroll-spy, footer |
| `src/docs/blocks.tsx` | Page parts: placeholders, callouts, tabs, code blocks, accordions, cards, tables, feedback, pagination |
| `src/docs/Logo.tsx` | The Shadow Army banner, the ◆ mark, and the compact and stacked forms |
| `src/docs/OverviewPage.tsx` | The Overview page |
| `src/docs/PlaceholderPage.tsx` | The skeleton every other page shows until it is written |
| `src/docs/host.tsx` | `ShadowDocsHost`: what a host site adds to the shell |
| `src/docs/shadow-docs.css` | All styles, scoped under `.sd-root`, dark and light |
| `src/app/` | The standalone app's routes |

## Updating the portfolio

Changes land here first. The portfolio then moves its submodule to the new commit:

```bash
cd website-template/builds/shadow-docs
git pull origin main
cd ../../..
git add website-template/builds/shadow-docs
```

Inside the portfolio, do not run `npm install` in the submodule folder. The docs use the portfolio's React and Next.js, and a second copy of React in that folder breaks hooks.
