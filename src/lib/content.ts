import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import { products, site, type Product } from '../config/products';
import { encodePath, renderMarkdown, type Heading } from './markdown';

// Every file lives at a "virtual path": local docs/<x> is <x>, and a remote
// product's .sources/<id>/<x> is <id>/<x>. Everything downstream (URLs, links,
// nav, assets) works on virtual paths, so remote docs behave like local ones.

const ROOT = process.cwd();
const DOCS = join(ROOT, 'docs');
const SOURCES = join(ROOT, '.sources');
const IGNORED = new Set(['.DS_Store', '.pages', '.source.json']);

export type FileEntry = { vpath: string; abs: string; product: Product | null; editUrl: string | null };

export type Page = {
  slug: string;
  vpath: string;
  product: Product;
  title: string;
  titleId: string | null;
  navTitle: string;
  description: string | null;
  summary: string | null;
  icon: string | null;
  html: string;
  headings: Heading[];
  editUrl: string | null;
  updated: Date | null;
  hidden: boolean;
  markdown: string;
};

export type NavItem =
  | { type: 'page'; title: string; slug: string; icon: string | null }
  | { type: 'group'; title: string; slug: string | null; icon: string | null; children: NavItem[] };

function walk(dir: string, base = ''): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (IGNORED.has(d.name) && d.isFile() && d.name !== '.pages') return [];
    const rel = base ? `${base}/${d.name}` : d.name;
    return d.isDirectory() ? walk(join(dir, d.name), rel) : [rel];
  });
}

function productOf(vpath: string): Product | null {
  return products.find((p) => vpath === p.id || vpath.startsWith(`${p.id}/`)) ?? null;
}

function remoteMeta(id: string): { repo: string; ref: string; path: string } | null {
  const file = join(SOURCES, id, '.source.json');
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

function loadFiles(): FileEntry[] {
  const remoteIds = new Set(products.filter((p) => p.source).map((p) => p.id));
  const local = walk(DOCS)
    .filter((rel) => !remoteIds.has(rel.split('/')[0]))
    .map((vpath) => ({
      vpath,
      abs: join(DOCS, vpath),
      product: productOf(vpath),
      editUrl: `https://github.com/${site.repo}/edit/${site.branch}/docs/${encodePath(vpath)}`,
    }));
  const remote = [...remoteIds].flatMap((id) => {
    const meta = remoteMeta(id);
    return walk(join(SOURCES, id)).map((rel) => ({
      vpath: `${id}/${rel}`,
      abs: join(SOURCES, id, rel),
      product: productOf(`${id}/${rel}`),
      editUrl: meta ? `https://github.com/${meta.repo}/edit/${meta.ref}/${encodePath(`${meta.path}/${rel}`)}` : null,
    }));
  });
  return [...local, ...remote];
}

export function slugFor(vpath: string): string {
  const noExt = vpath.replace(/\.mdx?$/, '');
  return noExt === 'index' ? '' : noExt.endsWith('/index') ? `${noExt.slice(0, -6)}/` : `${noExt}/`;
}

function lastUpdated(): Map<string, Date> {
  const dates = new Map<string, Date>();
  try {
    const log = execFileSync('git', ['log', '--format=%x00%ct', '--name-only', '--', 'docs'], { cwd: ROOT, maxBuffer: 64 << 20 }).toString();
    for (const chunk of log.split('\0').slice(1)) {
      const [ts, ...files] = chunk.trim().split('\n');
      for (const f of files) {
        const vpath = f.replace(/^docs\//, '');
        if (f && !dates.has(vpath)) dates.set(vpath, new Date(Number(ts) * 1000));
      }
    }
  } catch {}
  return dates;
}

type PagesFile = { title?: string; icon?: string; arrange?: string[]; hide?: boolean };

function readPagesFile(dirAbs: string): PagesFile {
  const file = join(dirAbs, '.pages');
  if (!existsSync(file)) return {};
  const out: PagesFile = {};
  let inArrange = false;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const item = line.match(/^\s+-\s+(.+?)\s*$/);
    if (inArrange && item) {
      out.arrange!.push(item[1].replace(/^["']|["']$/g, ''));
      continue;
    }
    inArrange = false;
    const kv = line.match(/^(\w+):\s*(.*?)\s*$/);
    if (!kv) continue;
    if (kv[1] === 'title') out.title = kv[2].replace(/^["']|["']$/g, '');
    if (kv[1] === 'icon') out.icon = kv[2];
    if (kv[1] === 'hide') out.hide = kv[2] === 'true';
    if (kv[1] === 'arrange') {
      out.arrange = [];
      inArrange = true;
    }
  }
  return out;
}

function prettify(name: string): string {
  const base = name.replace(/\.mdx?$/, '').replace(/^\d+[.\-_ ]+\s*/, '').replace(/[-_]/g, ' ').trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

type Site = {
  files: FileEntry[];
  pages: Map<string, Page>;
  byVpath: Map<string, Page>;
  nav: Map<string, NavItem[]>;
  flat: Map<string, Page[]>;
  dirs: Map<string, PagesFile & { abs: string }>;
};

async function build(): Promise<Site> {
  const files = loadFiles();
  const dirs = new Map<string, PagesFile & { abs: string }>();
  for (const f of files) {
    let dir = posix.dirname(f.vpath);
    while (dir !== '.' && !dirs.has(dir)) {
      const abs = f.abs.slice(0, f.abs.length - (f.vpath.length - dir.length));
      dirs.set(dir, { abs, ...readPagesFile(abs) });
      dir = posix.dirname(dir);
    }
  }
  const markdown = files.filter((f) => /\.mdx?$/.test(f.vpath) && f.product);
  const slugs = new Map(markdown.map((f) => [f.vpath, slugFor(f.vpath)]));
  const dates = lastUpdated();
  const hiddenDir = (vpath: string) => {
    for (let d = posix.dirname(vpath); d !== '.'; d = posix.dirname(d)) if (dirs.get(d)?.hide) return true;
    return false;
  };

  const pages = new Map<string, Page>();
  const byVpath = new Map<string, Page>();
  await Promise.all(
    markdown.map(async (f) => {
      const { data, content } = matter(readFileSync(f.abs, 'utf8'));
      const rendered = await renderMarkdown(content, {
        dir: posix.dirname(f.vpath),
        resolvePage: (v) => slugs.get(v) ?? null,
        isDir: (v) => dirs.has(v),
      });
      const name = posix.basename(f.vpath);
      const dirName = posix.basename(posix.dirname(f.vpath));
      const title = data.title ?? rendered.title ?? prettify(/^index\.mdx?$/.test(name) ? dirName : name);
      const page: Page = {
        slug: slugs.get(f.vpath)!,
        vpath: f.vpath,
        product: f.product!,
        title,
        titleId: rendered.titleId,
        navTitle: data.sidebarTitle ?? data.sidebar_title ?? title,
        description: data.description ?? null,
        summary: data.description ?? rendered.summary ?? `${title}. ${f.product!.description}`,
        icon: data.icon ?? null,
        html: rendered.html,
        headings: rendered.headings,
        editUrl: f.editUrl,
        updated: dates.get(f.vpath) ?? null,
        hidden: data.hidden === true || hiddenDir(f.vpath),
        markdown: content,
      };
      pages.set(page.slug, page);
      byVpath.set(f.vpath, page);
    }),
  );

  const nav = new Map<string, NavItem[]>();
  const flat = new Map<string, Page[]>();
  for (const product of products) {
    const items = navFor(product.id, files, byVpath, dirs);
    nav.set(product.id, items);
    const ordered: Page[] = [];
    const index = byVpath.get(`${product.id}/index.md`) ?? byVpath.get(`${product.id}/index.mdx`);
    if (index) ordered.push(index);
    const collect = (list: NavItem[]) => {
      for (const it of list) {
        const p = it.slug !== null ? pages.get(it.slug) : undefined;
        if (p && !ordered.includes(p)) ordered.push(p);
        if (it.type === 'group') collect(it.children);
      }
    };
    collect(items);
    flat.set(product.id, ordered);
  }
  return { files, pages, byVpath, nav, flat, dirs };
}

function navFor(dir: string, files: FileEntry[], byVpath: Map<string, Page>, dirs: Map<string, PagesFile & { abs: string }>): NavItem[] {
  const prefix = `${dir}/`;
  const children = new Set<string>();
  for (const f of files) {
    if (!f.vpath.startsWith(prefix)) continue;
    const head = f.vpath.slice(prefix.length).split('/')[0];
    const isDir = f.vpath.slice(prefix.length).includes('/');
    if (isDir || /\.mdx?$/.test(head)) children.add(isDir ? `${head}/` : head);
  }

  const items: { key: string; order: number; item: NavItem }[] = [];
  for (const child of children) {
    if (child.endsWith('/')) {
      const sub = `${dir}/${child.slice(0, -1)}`;
      const meta = dirs.get(sub);
      if (meta?.hide) continue;
      const kids = navFor(sub, files, byVpath, dirs);
      const index = byVpath.get(`${sub}/index.md`) ?? byVpath.get(`${sub}/index.mdx`);
      if (!kids.length && !index) continue;
      const title = meta?.title ?? index?.navTitle ?? prettify(child.slice(0, -1));
      const item: NavItem = kids.length
        ? { type: 'group', title, slug: index?.slug ?? null, icon: meta?.icon ?? index?.icon ?? null, children: kids }
        : { type: 'page', title, slug: index!.slug, icon: index!.icon };
      items.push({ key: child.slice(0, -1), order: 0, item });
    } else {
      if (/^index\.mdx?$/.test(child)) continue;
      const page = byVpath.get(`${dir}/${child}`);
      if (!page || page.hidden) continue;
      const { data } = matter(readFileSync(files.find((f) => f.vpath === page.vpath)!.abs, 'utf8'));
      items.push({ key: child, order: Number(data.order ?? 0), item: { type: 'page', title: page.navTitle, slug: page.slug, icon: page.icon } });
    }
  }

  items.sort((a, b) => a.order - b.order || collator.compare(a.key, b.key));

  const arrange = dirs.get(dir)?.arrange;
  if (!arrange) return items.map((i) => i.item);
  const placed = new Set<string>();
  const pick = (name: string) => items.find((i) => i.key === name || i.key === name.replace(/\/$/, ''));
  const head: NavItem[] = [];
  const tail: NavItem[] = [];
  let afterRest = false;
  for (const name of arrange) {
    if (name === '...') {
      afterRest = true;
      continue;
    }
    const found = pick(name);
    if (!found) continue;
    placed.add(found.key);
    (afterRest ? tail : head).push(found.item);
  }
  const rest = items.filter((i) => !placed.has(i.key)).map((i) => i.item);
  return [...head, ...rest, ...tail];
}

let cache: { key: string; site: Promise<Site> } | null = null;

function contentKey(): string {
  // Cheap fingerprint so dev picks up edits on reload without re-rendering every request.
  if (!import.meta.env.DEV) return 'build';
  const all = [...walk(DOCS).map((f) => join(DOCS, f)), ...walk(SOURCES).map((f) => join(SOURCES, f))];
  return `${all.length}:${Math.max(0, ...all.map((f) => statSync(f).mtimeMs))}`;
}

export function getSite(): Promise<Site> {
  const key = contentKey();
  if (cache?.key !== key) cache = { key, site: build() };
  return cache.site;
}

export function productIndexSlug(product: Product): string {
  return `${product.id}/`;
}
