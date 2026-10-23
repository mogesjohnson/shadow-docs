# Shadow Docs — plan

A documentation site for Shadow Army (`sa`), laid out the way the Claude Code docs (code.claude.com/docs/en/overview) are laid out, in Shadow Army's logo and colours. It runs standalone from this repo and on the portfolio at `/shadow-docs`. This first pass is a skeleton: headings, navigation and placeholders, no body copy.

## Owner choices

- **Layout copied from the Claude Code docs, by request.** Taken: the layout pattern (top bar, tab row, left sidebar, right "On this page" rail, page header with "Copy page", content components, feedback row, pagination, footer). Not taken: markup, copy, fonts, icons, logos or other Anthropic assets. Everything is rebuilt in our own code. On the portfolio this overrides its factory rule R3.
- **Copy, one tab at a time.** The skeleton had no copy. Pages listed in `src/docs/content.tsx` now have it; every other paragraph is still a visible placeholder block.
- **Its own repo** (2026-10-23): `mogesjohnson/shadow-docs`, included in the portfolio as a submodule.
- **No "Ask the Monarch"** (2026-10-23): the assistant button, its Ctrl I shortcut and its panel were removed.
- **The real logo** (2026-10-23): from the "Shadow Army Terminal UI" design canvas, not a drawn mark.
- **v2 only, no version badge** (2026-10-23): the docs describe Shadow Army 2 and say plainly that it is in development. Copy comes from shadow-army `main` (spec v0.5, ADRs 0008 to 0015, `docs/claude-first.md`), not from the open spec review.
- **Tabs approved** (2026-10-23): the seven tabs in `nav.ts` stay.
- **Linked from the portfolio header** (2026-10-23).
- **Quickstart written now** (2026-10-23): from the spec, marked as planned, until v2 has an install command.
- **"Use Shadow Army" renamed for v2** (2026-10-23): `sa summon`, `sa run` and the live dashboard are v1 features that v2 removes. The group now covers `/army`, `/send`, the pane and the strip, stopping and the queue, sessions, and `/diff` and `/apply`.

## What was measured on the reference page (2026-10-23)

| Region | Reference | Shadow Docs |
| --- | --- | --- |
| Top bar | wordmark, search (Ctrl K), assistant (Ctrl I), product link, CTA | banner logo + "Docs", search (Ctrl K), GitHub, host's home link, theme, "Get started" |
| Tab row | 9 tabs | 7 tabs (`nav.ts`) |
| Sidebar | groups with small headings, per tab | same, per tab |
| Page header | eyebrow (group), H1, description, "Copy page" split button | same |
| Content | callouts, tabs, code groups, accordions, card grid | same, all placeholders |
| Right rail | "On this page", H2 list, scroll-spy | same |
| Page end | "Was this page helpful?", next/previous | same; "Suggest edits" and "Raise issue" go to this repo |
| Footer | wordmark, social, link columns | stacked logo, GitHub, link columns (the host adds its own) |

## Logo

The "Shadow Army Terminal UI" canvas (boards "Banner, prompt and status line" and "Glyphs and motion") defines it:

- The banner is v1's own art (shadow-army `src/ui/art.ts`): SHADOW ARMY in block letters, one gradient token per art row (g0–g5), bold.
- 92 columns and up: SHADOW and ARMY side by side. 54 to 91: SHADOW in block letters with `◆  A R M Y` under its right edge. Under 54: `◆ SHADOW ARMY`.
- ◆ (U+25C6) is the brand mark, in the accent colour.

On the site: the side-by-side banner in the top bar, `◆ SHADOW ARMY` on phones and in the drawer, the stacked form in the footer. The art is drawn as SVG cells so it stays crisp at any size.

## Palette

From the CLI banner (shadow-army `src/ui/Banner.tsx`) and the design canvases.

| Token | Dark | Light |
| --- | --- | --- |
| bg | `#0c0c0c` | `#faf9fc` |
| surface | `#17141d` | `#f2eff7` |
| surface-2 | `#221d2b` | `#e9e4f1` |
| edge | `#2a2631` | `#ddd6e8` |
| text | `#e6e3ec` | `#17141d` |
| muted | `#8f899b` | `#5f5870` |
| accent | `#b388ff` | `#6f3fd1` |
| brand | `#8650f0` | `#5b32b0` |
| g0–g5 | `#c4a1ff #b388ff #9d6bff #8650f0 #6f3fd1 #5b32b0` | `#9d6bff #8650f0 #7a45e6 #6f3fd1 #5b32b0 #4a2891` |
| ok / warn / danger / info | `#5ad08a` `#f0c050` `#ff6b6b` `#5cc8e6` | darker variants |

The light accent and g0–g5 come from the canvas's light tokens; the other light values were derived. Soldier dots use the canvas soldier slots: Claude `#ff9e64`, Codex `#6fd67a`, Grok `#4cc9f0`, agy `#ff8fc8`. That mapping is a placeholder choice for the owner to confirm.

## Information architecture

Tabs and their sidebar groups (`src/docs/nav.ts` is the source):

1. **Getting started**: Getting started · Core concepts · Use Shadow Army
2. **Build with Shadow Army**: Parallel work · Safety and autonomy · Guides
3. **Soldiers**: Soldiers · Adapters
4. **Configuration**: Settings · Instructions · Models and cost
5. **Reference**: Reference · Glossary
6. **What's New**: What's New
7. **Resources**: Contributing · Project records

Every sidebar entry is a real route (`/shadow-docs/<slug>`) that renders the generic placeholder page, so the whole nav can be clicked through. `/shadow-docs` is the Overview.

## Steps

1. Skeleton: shell, nav, Overview, placeholder pages, logo, palette, light and dark.
2. Owner review of layout, tabs and nav names.
3. Copy: Overview and Quickstart first, from the shadow-army repo (README, CONTRIBUTING, CLAUDE.md), facts only.
4. Remaining pages, one tab at a time; per-page H2s replace the generic ones.
5. Search over real page text; "Copy page" copies Markdown once pages have it.
6. Link Shadow Docs from the portfolio's menus, once the owner picks where.

## Open questions for the owner

- Tab names and the soldier colour mapping above.
- Link Shadow Docs from the site header, the mobile menu only, or the Shadow Army pages only?
- Version badge in the top bar (v1 vs v2 docs switcher)?
- Licence for this repo (the footer has a placeholder line for it).
