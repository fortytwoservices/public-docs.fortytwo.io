# Fortytwo public documentation

Source for [docs.fortytwo.io](https://docs.fortytwo.io). Every Fortytwo employee can update it.

The site is built with [Astro](https://astro.build) from the Markdown files in `docs/`, styled with the
AI Universe designsystem tokens, and searched with [Pagefind](https://pagefind.app). No MkDocs, no Python.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321, reloads as you edit
npm run build      # the full site in dist/, with the search index
npm run preview    # serve dist/ (search only works here)
```

## Write a page

Add a Markdown file under the product's folder in `docs/`. The file path is the URL:
`docs/ai-universe/apps/agents.md` is `/ai-universe/apps/agents/`.

The first `# Heading` is the page title. Optional frontmatter:

```yaml
---
description: One sentence shown under the title, in search results and in link previews.
icon: bot            # any icon name from lucide.dev
sidebarTitle: Agents # shorter name for the sidebar
order: 2             # position in its folder, when there is no .pages file
hidden: true         # build the page, leave it out of the sidebar
---
```

### Sidebar order

A folder is a sidebar section. Order it with a `.pages` file, the same format MkDocs used:

```yaml
title: Get started
icon: rocket
arrange:
  - before-you-install.md
  - install.md
  - ...          # everything not listed, alphabetically
```

### Building blocks

Plain Markdown works everywhere, including tables, code blocks and Mermaid diagrams. On top of that:

```markdown
:::tip[Optional title]
Callouts: note, info, tip, success, warning, danger.
:::

::::cards{cols=3}
:::card{title="Create an app" icon="layout-grid" href="/ai-universe/apps/create-an-app/"}
A short line about where this goes.
:::
::::

::::steps
### First step
Each `###` heading is a numbered step.
### Second step
...
::::

::::tabs
:::tab[macOS]
...
:::
:::tab[Windows]
...
:::
::::

![Alt text for the screenshot](/screenshots/ai-universe/home.png "Optional caption")

::::screens
:::screen{src="media/step-1.webp" title="Verify your identity"}
A gallery of phone screenshots, numbered, with a caption under each.
:::
::::

::::screen{src="media/step-1.webp" side}
Text on the left, a small phone screenshot on the right.
::::
```

A container holding other containers needs one more colon than its children. An image on its own
line is drawn in a browser frame. Every image and Mermaid diagram opens full size on click.

Images get their display size at build time: a screenshot 1000 px or wider is treated as a retina
capture and shown at half size, nothing is taller than 640 px, and an image under 480 px wide
(a button or logo) gets no frame.

The MkDocs syntax in older pages (`!!! note`, `??? tip`, `=== "Tab"`) still works, so nothing has
to be rewritten.

Screenshots go in `public/screenshots/<product>/`. Images that belong to one page can sit next to it
and be linked relatively, as before.

## Add a product

Add an entry to `src/config/products.ts`. `featured: true` puts it in the header; every product is
on the home page.

### Docs that live in another repository

A product's docs can stay in its own repository, next to its code. Give the product a `source`:

```ts
{
  id: 'identity-universe',
  name: 'Identity Universe',
  description: '...',
  icon: 'fingerprint',
  source: { repo: 'fortytwoservices/identity-universe', ref: 'main', path: 'docs' },
},
```

`npm run build` (and `npm run dev`) fetch that folder with a shallow sparse checkout into `.sources/`
and build it exactly like a local folder, with "Edit this page" pointing at the source repository.
CI reads private repositories with the `DOCS_SOURCES_TOKEN` secret, rebuilds nightly, and rebuilds
straight away when a source repository sends a `docs-source-updated` repository dispatch:

```yaml
- run: gh api repos/fortytwoservices/public-docs.fortytwo.io/dispatches -f event_type=docs-source-updated
  env:
    GH_TOKEN: ${{ secrets.DOCS_DISPATCH_TOKEN }}
```

## Where things are

| Path | What |
|-|-|
| `docs/` | All content, one folder per product |
| `src/config/products.ts` | Products, header tabs, remote sources, redirects |
| `src/lib/content.ts` | Reads `docs/` and `.sources/`, builds the sidebar |
| `src/lib/markdown.ts` | The Markdown pipeline and building blocks |
| `src/lib/mkdocs-compat.ts` | Converts MkDocs syntax in older pages |
| `src/styles/tokens.css` | Designsystem tokens, mirrored from AI Universe |
| `scripts/fetch-sources.mjs` | Pulls docs from other repositories |
