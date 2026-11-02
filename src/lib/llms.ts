import { posix } from 'node:path';
import { products, site } from '../config/products';
import type { NavItem, Page } from './content';
import { encodePath } from './markdown';
import { mkdocsCompat } from './mkdocs-compat';

type Site = { pages: Map<string, Page>; byVpath: Map<string, Page>; nav: Map<string, NavItem[]>; flat: Map<string, Page[]> };

export function pageUrl(page: Page): string {
  return `${site.url}/${encodePath(page.slug)}`;
}

function visible(site: Site, productId: string): Page[] {
  return (site.flat.get(productId) ?? []).filter((p) => !p.hidden);
}

// The llms.txt index: one heading per product, one line per page, in sidebar order.
export function llmsIndex(content: Site): string {
  const lines = [
    `# ${site.title}`,
    '',
    '> Documentation and user guides for Fortytwo products and managed services: AI Universe, Identity Universe, managed Entra ID services, Azure Marketplace offerings and reference architectures. Fortytwo: We Build Intelligent Companies.',
    '',
    `The full text of every page is in ${site.url}/llms-full.txt.`,
  ];
  for (const product of products) {
    const pages = visible(content, product.id);
    if (!pages.length) continue;
    lines.push('', `## ${product.name}`, '', product.description, '');
    for (const page of pages) lines.push(`- [${page.title}](${pageUrl(page)})${page.summary ? `: ${page.summary}` : ''}`);
  }
  return `${lines.join('\n')}\n`;
}

// Relative Markdown links only make sense next to the source file; make them absolute.
function absoluteLinks(markdown: string, page: Page, content: Site): string {
  const dir = posix.dirname(page.vpath);
  return markdown.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g, (match, bang: string, text: string, href: string, rest: string) => {
    if (/^([a-z][a-z0-9+.-]*:|#)/i.test(href)) return match;
    const [path, hash] = href.split('#');
    const anchor = hash ? `#${hash}` : '';
    if (href.startsWith('/')) return `${bang}[${text}](${site.url}${href}${rest})`;
    let decoded = path;
    try {
      decoded = decodeURI(path);
    } catch {}
    const target = posix.normalize(posix.join(dir, decoded)).replace(/\/$/, '');
    const linked = content.byVpath.get(target) ?? content.byVpath.get(`${target}/index.md`);
    const url = linked ? pageUrl(linked) : `${site.url}/${encodePath(target)}`;
    return `${bang}[${text}](${url}${anchor}${rest})`;
  });
}

export function llmsFull(content: Site): string {
  const parts = [`# ${site.title}`, '', `> Every page of ${site.url}, as Markdown.`];
  for (const product of products) {
    for (const page of visible(content, product.id)) {
      const body = absoluteLinks(mkdocsCompat(page.markdown), page, content)
        .replace(/^\s*#\s+.*\n/, '')
        .trim();
      parts.push('', '---', '', `# ${page.title}`, '', `Product: ${product.name}`, `Source: ${pageUrl(page)}`, '', body);
    }
  }
  return `${parts.join('\n')}\n`;
}
