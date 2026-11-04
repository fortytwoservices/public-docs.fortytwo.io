import { createReadStream, existsSync, mkdirSync, copyFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { products, redirects } from '../config/products';

// MkDocs served every non-Markdown file under docs/ at its own path
// (docs/Generic/media/x.png -> /Generic/media/x.png), and other sites link to
// those files directly. This keeps every such URL, and the old redirects, working.

const ROOT = process.cwd();
const SKIP = /(^|\/)(\.DS_Store|\.pages|\.source\.json)$|\.mdx?$/;

function walk(dir: string, base = ''): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const rel = base ? `${base}/${d.name}` : d.name;
    return d.isDirectory() ? walk(join(dir, d.name), rel) : [rel];
  });
}

export function legacyFiles(): Map<string, string> {
  const remote = new Set(products.filter((p) => p.source).map((p) => p.id));
  const files = new Map<string, string>();
  for (const rel of walk(join(ROOT, 'docs'))) {
    if (!SKIP.test(rel) && !remote.has(rel.split('/')[0])) files.set(rel, join(ROOT, 'docs', rel));
  }
  for (const id of remote) {
    for (const rel of walk(join(ROOT, '.sources', id))) {
      if (!SKIP.test(rel)) files.set(`${id}/${rel}`, join(ROOT, '.sources', id, rel));
    }
  }
  return files;
}

// mkdocs-redirects wrote its keys literally, so "Self%20Hosted%20Runners" is a real
// folder name on the live site. Write both that and the decoded form.
function redirectFolders(from: string): string[] {
  const folder = from.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '').replace(/\/$/, '');
  return [...new Set([folder, decodeURIComponent(folder)])];
}

function redirectPage(to: string): string {
  const url = `/${to.replace(/\.mdx?$/, '/').replace(/(^|\/)index\/$/, '$1')}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Redirecting</title><link rel="canonical" href="${url}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${url}"></head><body><a href="${url}">${url}</a></body></html>`;
}

const TYPES: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
  pdf: 'application/pdf', asc: 'text/plain; charset=utf-8', json: 'application/json', txt: 'text/plain; charset=utf-8',
};

export default function legacyUrls(): AstroIntegration {
  return {
    name: 'legacy-urls',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const path = decodeURIComponent((req.url ?? '/').split('?')[0]).replace(/^\//, '');
          const file = legacyFiles().get(path);
          if (!file) return next();
          res.setHeader('Content-Type', TYPES[path.split('.').pop()!.toLowerCase()] ?? 'application/octet-stream');
          createReadStream(file).pipe(res);
        });
      },
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const files = legacyFiles();
        for (const [rel, abs] of files) {
          const target = join(out, rel);
          mkdirSync(dirname(target), { recursive: true });
          copyFileSync(abs, target);
        }
        let written = 0;
        for (const [from, to] of Object.entries(redirects)) {
          for (const folder of redirectFolders(from)) {
            const target = join(out, folder, 'index.html');
            if (existsSync(target) && statSync(target).size > 0) continue;
            mkdirSync(dirname(target), { recursive: true });
            writeFileSync(target, redirectPage(to));
            written++;
          }
        }
        if (existsSync(join(out, 'sitemap-index.xml'))) copyFileSync(join(out, 'sitemap-index.xml'), join(out, 'sitemap.xml'));
        logger.info(`${files.size} files kept at their original URLs, ${written} redirects written`);
      },
    },
  };
}
