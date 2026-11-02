// Fails the build when a page links to a page, file or #anchor that does not exist,
// or when Markdown was left unrendered (a raw `[text](path)` or `:::` in the page).
// Usage: node scripts/check-links.mjs [dist]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'parse5';

const root = process.argv[2] ?? 'dist';
// Text inside these is code or not shown, so Markdown-looking text there is fine.
const NOT_PROSE = new Set(['pre', 'code', 'script', 'style', 'template']);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
}

function target(path) {
  const file = join(root, path);
  if (path.endsWith('/')) return join(file, 'index.html');
  if (existsSync(file) && statSync(file).isDirectory()) return join(file, 'index.html');
  return file;
}

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

// One pass over the parsed page: element ids, link targets and the visible prose text.
function read(file) {
  const page = { ids: new Set(), links: [], prose: [], redirect: false };
  const visit = (node, inProse) => {
    if (node.nodeName === '#text') {
      if (inProse) page.prose.push(node.value);
      return;
    }
    for (const { name, value } of node.attrs ?? []) {
      if (name === 'id') page.ids.add(value);
      if (name === 'href' || name === 'src') page.links.push(value);
      if (name === 'http-equiv' && value.toLowerCase() === 'refresh') page.redirect = true;
    }
    const prose = inProse && !NOT_PROSE.has(node.nodeName);
    for (const child of node.childNodes ?? []) visit(child, prose);
  };
  visit(parse(readFileSync(file, 'utf8')), true);
  page.prose = page.prose.join('\n');
  return page;
}

const cache = new Map();
const pageAt = (file) => {
  if (!cache.has(file)) cache.set(file, read(file));
  return cache.get(file);
};

const problems = [];
const pages = walk(root).filter((f) => f.endsWith('.html'));
for (const file of pages) {
  const page = pageAt(file);
  const where = `/${relative(root, file).replace(/index\.html$/, '')}`;
  // Redirect stubs only point at pages that are checked themselves.
  if (page.redirect) continue;

  for (const url of page.links) {
    if (url.startsWith('#')) {
      if (url.length > 1 && !page.ids.has(decode(url.slice(1)))) problems.push(`${where}: missing anchor ${url}`);
      continue;
    }
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    const [pathPart, hash] = url.split('#');
    const linked = target(decode(pathPart.split('?')[0]));
    if (!existsSync(linked)) {
      problems.push(`${where}: broken link ${url}`);
      continue;
    }
    if (hash && linked.endsWith('.html') && !pageAt(linked).ids.has(decode(hash))) problems.push(`${where}: missing anchor ${url}`);
  }

  if (/\]\((?:\.|\/|https?:)[^)\s]*\)/.test(page.prose)) problems.push(`${where}: unrendered Markdown link`);
  if (/(^|\n)\s*:::/.test(page.prose)) problems.push(`${where}: unrendered ::: block`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) in ${pages.length} pages`);
  process.exit(1);
}
console.log(`Links OK in ${pages.length} pages`);
