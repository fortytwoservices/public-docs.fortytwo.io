// Fails the build when a page links to a page, file or #anchor that does not exist,
// or when Markdown was left unrendered (a raw `[text](path)` or `:::` in the page).
// Usage: node scripts/check-links.mjs [dist]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
}

function target(path) {
  const file = join(root, path);
  if (path.endsWith('/')) return join(file, 'index.html');
  if (existsSync(file) && statSync(file).isDirectory()) return join(file, 'index.html');
  return file;
}

const idCache = new Map();
function ids(file) {
  if (!idCache.has(file)) idCache.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return idCache.get(file);
}

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

const problems = [];
const pages = walk(root).filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const where = `/${relative(root, page).replace(/index\.html$/, '')}`;
  // Redirect stubs and the 404 page only point at pages checked elsewhere.
  if (html.includes('http-equiv="refresh"')) continue;

  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (!url.startsWith('/') || url.startsWith('//')) {
      if (url.startsWith('#') && url.length > 1 && !ids(page).has(decode(url.slice(1)))) problems.push(`${where}: missing anchor ${url}`);
      continue;
    }
    const [pathPart, hash] = url.split('#');
    const file = target(decode(pathPart.split('?')[0]));
    if (!existsSync(file)) {
      problems.push(`${where}: broken link ${url}`);
      continue;
    }
    if (hash && file.endsWith('.html') && !ids(file).has(decode(hash))) problems.push(`${where}: missing anchor ${url}`);
  }

  const text = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(pre|code|script|style)[\s\S]*?<\/\1>/g, '');
  if (/\]\((?:\.|\/|https?:)[^)\s]*\)/.test(text)) problems.push(`${where}: unrendered Markdown link`);
  if (/(^|>)\s*:::/m.test(text)) problems.push(`${where}: unrendered ::: block`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) in ${pages.length} pages`);
  process.exit(1);
}
console.log(`Links OK in ${pages.length} pages`);
