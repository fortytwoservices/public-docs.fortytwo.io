# AGENTS.md

Instructions for AI coding assistants (Claude Code, Codex, Copilot, Cursor and others) working in this
repository. People should start with [README.md](README.md), which is the authoring guide. This file
adds the rules an assistant needs to change the docs without breaking them.

## What this is

The source of [docs.fortytwo.io](https://docs.fortytwo.io): public documentation for every Fortytwo
product. Astro builds a static site from the Markdown in `docs/` (and from other repositories, see
"Remote products"), Pagefind indexes it for search, and GitHub Pages hosts it. The site replaced an
MkDocs site and keeps all of its URLs.

## Commands

```bash
npm ci                  # install (Node 24, see .devcontainer)
npm run dev             # http://localhost:4321, reloads on edit; search does not work here
npm run build           # full site in dist/ with the search index
npm run preview         # serve dist/ on http://localhost:4321; use this to test search
npm run check:links     # after a build: broken links, missing #anchors, unrendered Markdown
npx astro check         # type check
```

Before you say a change is done, run `npx astro check`, `npm run build` and `npm run check:links`.
CI runs the build and the link check on every pull request and fails on any problem.

## Rules that protect the live site

- **Never change a URL.** Customers, Microsoft Marketplace listings and other sites link to these pages
  and files. The file path is the URL (`docs/a/b.md` is `/a/b/`), so do not rename, move or delete files
  or folders under `docs/`, including folder names with spaces or capitals such as
  `docs/Managed Azure AD B2C/`. To reorganise the sidebar, use `.pages` (`arrange`, `sections`) and
  `sidebarTitle` frontmatter instead of moving files.
- **Images and other files keep their paths too.** Every non-Markdown file under `docs/` is served at
  its own path, because other sites link to them directly. Do not move, rename or overwrite them.
  The build adds WebP copies by itself; do not convert files by hand.
- **Old MkDocs redirects** live in `redirects` in `src/config/products.ts`. Keep them.
- **Heading text is an anchor.** Changing a heading changes its `#id`. Search `docs/` for links to that
  anchor and update them, then run the link check.
- **Remote products** (a product with `source` in `src/config/products.ts`) are fetched into `.sources/`
  at build time. Edit those docs in their own repository, never in `.sources/`.

## Writing docs

- English, except sections that are Norwegian on purpose (for example under
  `docs/Entra Reference Architecture/Norske kommuner og fylkeskommuner/`). Keep them Norwegian.
- No emojis. Prefer commas, colons or full stops to em-dashes in prose.
- Give every page a one-sentence `description:` in its frontmatter. It is the search snippet and the
  link preview.
- Use the building blocks in README.md instead of hand-made structure: `:::note`/`:::warning` instead
  of quoted "Note:" lines, `::::steps` for procedures, `::::tabs` for alternatives, `:::details` for
  optional or troubleshooting content, `::::cards` for overviews.
- A container holding other containers needs one more colon than its children
  (`:::::steps` around a `::::note`, and so on). An unclosed or wrongly nested block shows up as
  literal `:::` text, which the link check reports.
- Code blocks always get a language (`powershell`, `bash`, `json`, `http`, `hcl`...).
- Write about the product as it is. Do not invent features, prices, limits or UI labels; check the
  product or ask. Use fictional names in examples (Nordlys AS, not a real customer).
- When restructuring a page for readability, keep the wording. Changing what a page says is a
  separate change for the product owner to approve.
- Screenshots that belong to one page sit next to it (for example `media/`) and are linked relatively.
  Shared screenshots go in `public/screenshots/<product>/`.

## Where the code is

| Path | What |
|-|-|
| `docs/<product>/` | Content, one folder per product, sidebar order in `.pages` files |
| `src/config/products.ts` | Products, header tabs, remote sources, MkDocs redirects |
| `src/lib/content.ts` | Reads `docs/` and `.sources/`, builds pages and the sidebar |
| `src/lib/markdown.ts` | Markdown pipeline: building blocks, links, image sizing, code highlighting |
| `src/lib/mkdocs-compat.ts` | Converts MkDocs syntax in older pages |
| `src/lib/llms.ts` | `/llms.txt`, `/llms-full.txt` and the per-page `.md` versions |
| `src/layouts/` | Page shell (`Base.astro`) and doc page (`Doc.astro`) |
| `src/scripts/client.ts` | All browser code: search, theme, mobile menu, lightbox, copy buttons |
| `src/styles/tokens.css` | Design tokens, mirrored from the AI Universe design system |
| `src/integrations/` | Build steps: legacy URLs and redirects, WebP copies |
| `scripts/` | Fetching remote sources, the link check |

## Changing the site code

- Match the surrounding code: small functions, few comments, comments only for why.
- Colours, radii and shadows come from the tokens in `src/styles/tokens.css`. Support light and dark
  mode (`.dark` on `<html>`) for anything you add.
- Check the result in a browser at desktop width and at 375 px, in both themes.
- SEO matters: docs.fortytwo.io ranks well. Keep canonical URLs, meta descriptions, the sitemap and
  `robots.txt` working.
- Open a pull request to `main` for every change; do not push to `main`.
