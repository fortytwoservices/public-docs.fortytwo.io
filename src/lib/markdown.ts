import { posix } from 'node:path';
import sharp from 'sharp';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import { visit, SKIP } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import type { Root as MdRoot } from 'mdast';
import type { Root as HRoot, Element, ElementContent } from 'hast';
import { icon } from './icons';
import { mkdocsCompat } from './mkdocs-compat';

export type Heading = { depth: number; id: string; text: string };

export type LinkContext = {
  dir: string;
  resolvePage: (vpath: string) => string | null;
  isDir: (vpath: string) => boolean;
  // Local file behind a site path such as `checkid/media/x.png`, used to read image sizes.
  assetFile: (vpath: string) => string | null;
};

export type Rendered = { html: string; title: string | null; titleId: string | null; summary: string | null; headings: Heading[] };

// MkDocs Material has ~20 admonition types; the design system has four callout tones.
const CALLOUT_TONE: Record<string, string> = {
  note: 'info', info: 'info', abstract: 'info', summary: 'info', todo: 'info', example: 'info', quote: 'info',
  tip: 'success', hint: 'success', success: 'success', check: 'success', done: 'success',
  warning: 'warning', caution: 'warning', attention: 'warning', important: 'warning', question: 'warning', help: 'warning',
  danger: 'error', error: 'error', failure: 'error', fail: 'error', bug: 'error',
};
const TONE_ICON: Record<string, string> = {
  info: 'info', success: 'circle-check', warning: 'triangle-alert', error: 'circle-alert',
};

function raw(html: string): ElementContent {
  return { type: 'raw', value: html } as unknown as ElementContent;
}

function directives() {
  return (tree: MdRoot) => {
    visit(tree, (node: any, index, parent: any) => {
      if (node.type === 'textDirective' || node.type === 'leafDirective') {
        // Not ours: `Note:this` or `10:30` in prose. Put the text back.
        const text = { type: 'text', value: (node.type === 'leafDirective' ? '::' : ':') + node.name };
        parent.children.splice(index, 1, text, ...(node.children ?? []));
        return [SKIP, index];
      }
      if (node.type !== 'containerDirective') return;

      const attrs = node.attributes ?? {};
      const first = node.children[0];
      const label = first?.data?.directiveLabel ? node.children.shift().children : null;
      const name: string = node.name;

      if (name === 'details' || CALLOUT_TONE[name]) {
        const type = name === 'details' ? (attrs.type ?? 'note') : name;
        const tone = CALLOUT_TONE[type] ?? 'info';
        const title = label ?? [{ type: 'text', value: type.charAt(0).toUpperCase() + type.slice(1) }];
        const collapsible = name === 'details';
        node.data = {
          hName: collapsible ? 'details' : 'div',
          hProperties: { className: ['callout', `callout-${tone}`], open: collapsible && 'open' in attrs ? true : undefined },
        };
        node.children = [
          {
            type: 'paragraph',
            data: { hName: collapsible ? 'summary' : 'div', hProperties: { className: ['callout-title'] } },
            children: [{ type: 'html', value: icon(TONE_ICON[tone], 16) }, ...title],
          },
          { type: 'blockquote', data: { hName: 'div', hProperties: { className: ['callout-body'] } }, children: node.children },
        ];
        return;
      }

      const box = (hName: string, className: string[], extra: Record<string, unknown> = {}) => {
        node.data = { hName, hProperties: { className, ...extra } };
      };

      switch (name) {
        case 'tabs':
          box('div', ['tabs']);
          break;
        case 'tab':
          box('div', ['tab'], { dataLabel: label ? label.map((n: any) => n.value ?? '').join('') : 'Tab' });
          break;
        case 'cards':
          box('div', ['card-grid'], { dataCols: attrs.cols ?? '2' });
          break;
        case 'card': {
          box(attrs.href ? 'a' : 'div', ['card', attrs.href ? 'card-link' : ''], attrs.href ? { href: attrs.href } : {});
          const title = attrs.title ?? (label ? label.map((n: any) => n.value ?? '').join('') : '');
          node.children = [
            ...(attrs.icon ? [{ type: 'html', value: `<span class="card-icon">${icon(attrs.icon, 20)}</span>` }] : []),
            { type: 'paragraph', data: { hName: 'div', hProperties: { className: ['card-title'] } }, children: [{ type: 'text', value: title }] },
            { type: 'blockquote', data: { hName: 'div', hProperties: { className: ['card-body'] } }, children: node.children },
          ];
          break;
        }
        case 'steps':
          box('div', ['steps']);
          break;
        case 'screens':
          box('div', ['screens']);
          break;
        // A device screenshot that already has its own phone frame, so it is not put in a browser frame.
        // `side` puts a small phone next to the text instead, for step-by-step explanations.
        case 'screen': {
          const stage = { type: 'paragraph', data: { hName: 'div', hProperties: { className: ['screen-stage'] } }, children: [{ type: 'image', url: attrs.src, alt: attrs.title ?? '' }] };
          if ('side' in attrs) {
            box('div', ['screen-side']);
            node.children = [{ type: 'blockquote', data: { hName: 'div', hProperties: { className: ['screen-text'] } }, children: node.children }, stage];
            break;
          }
          box('figure', ['screen']);
          node.children = [
            stage,
            { type: 'blockquote', data: { hName: 'figcaption' }, children: [{ type: 'paragraph', data: { hName: 'strong' }, children: [{ type: 'text', value: attrs.title ?? '' }] }, ...node.children] },
          ];
          break;
        }
        default:
          box('div', [name]);
      }
    });
  };
}

const LANG_LABEL: Record<string, string> = {
  powershell: 'PowerShell', bash: 'Terminal', json: 'JSON', yaml: 'YAML', yml: 'YAML', xml: 'XML', html: 'HTML',
  http: 'HTTP', hcl: 'Terraform', javascript: 'JavaScript', typescript: 'TypeScript', go: 'Go', csharp: 'C#', sql: 'SQL',
};
const LANG_ALIAS: Record<string, string> = { ps1: 'powershell', pwsh: 'powershell', user: 'text', sh: 'bash', shell: 'bash', console: 'bash' };

// Older pages often leave code blocks untagged; a rough guess beats no highlighting.
function guessLang(code: string): string | null {
  const text = code.trim();
  if (/^[[{]/.test(text)) {
    try {
      JSON.parse(text);
      return 'json';
    } catch {}
  }
  if (/^\s*(\$[\w:]+\s*=|[A-Z][a-z]+-[A-Z][A-Za-z]+\b)/m.test(text)) return 'powershell';
  if (/^\s*(az|curl|npm|npx|git|kubectl|terraform|helm|sudo|export|oras|chmod)\s/m.test(text)) return 'bash';
  if (/^<[\w?!]/.test(text)) return 'xml';
  return null;
}

function codeBlocks() {
  return (tree: MdRoot) => {
    visit(tree, 'code', (node: any, index, parent: any) => {
      const lang = node.lang?.toLowerCase();
      node.lang = lang ? (LANG_ALIAS[lang] ?? lang) : guessLang(node.value);
      if (node.lang !== 'mermaid') return;
      const escaped = node.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      parent.children[index!] = { type: 'html', value: `<pre class="mermaid">${escaped}</pre>` };
    });
  };
}

function isRelative(url: string): boolean {
  return !/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(url);
}

export function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

function links(ctx: LinkContext) {
  const rewrite = (url: string): string => {
    if (!isRelative(url)) return url;
    const [pathPart, hash] = url.split('#');
    let decoded = pathPart;
    try {
      decoded = decodeURI(pathPart);
    } catch {}
    const target = posix.normalize(posix.join(ctx.dir, decoded)).replace(/\/$/, '');
    const anchor = hash ? `#${hash}` : '';
    if (/\.mdx?$/.test(target)) {
      const slug = ctx.resolvePage(target);
      return slug === null ? url : `/${encodePath(slug)}${anchor}`;
    }
    if (pathPart === '' || ctx.isDir(target)) {
      const slug = ctx.resolvePage(`${target}/index.md`);
      return `/${encodePath(slug ?? `${target}/`)}${anchor}`;
    }
    return `/${encodePath(target)}`;
  };

  return (tree: HRoot) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && typeof node.properties.href === 'string') node.properties.href = rewrite(node.properties.href);
      if ((node.tagName === 'img' || node.tagName === 'video') && typeof node.properties.src === 'string') node.properties.src = rewrite(node.properties.src);
    });
  };
}

// Screenshots are mostly taken on retina screens, so a wide one is shown at half its
// pixel size, and nothing is taller than MAX_HEIGHT. Width and height also stop layout shift.
const RETINA_FROM = 1000;
const MAX_HEIGHT = 640;
const sizeCache = new Map<string, Promise<{ width?: number; height?: number }>>();

function sizes(ctx: LinkContext) {
  return async (tree: HRoot) => {
    const imgs: Element[] = [];
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && typeof node.properties.src === 'string' && node.properties.src.startsWith('/') && !node.properties.width) imgs.push(node);
    });
    await Promise.all(
      imgs.map(async (node) => {
        const file = ctx.assetFile(decodeURIComponent(String(node.properties.src).slice(1)));
        if (!file) return;
        if (!sizeCache.has(file)) sizeCache.set(file, sharp(file).metadata().catch(() => ({})));
        const { width, height } = await sizeCache.get(file)!;
        if (!width || !height) return;
        let scale = width >= RETINA_FROM ? 0.5 : 1;
        scale = Math.min(scale, MAX_HEIGHT / height);
        node.properties.width = Math.round(width * scale);
        node.properties.height = Math.round(height * scale);
      }),
    );
  };
}

// Below this width an image is a button, logo or icon, not a screenshot, so it gets no frame.
const FRAME_FROM = 480;

function images() {
  return (tree: HRoot) => {
    visit(tree, 'element', (node: Element, index, parent: any) => {
      if (node.tagName !== 'img') return;
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
      const caption = node.properties.title as string | undefined;
      // An image alone in a paragraph is a screenshot: frame it like the portal's BrowserFrame.
      const alone = parent?.tagName === 'p' && parent.children.filter((c: any) => !(c.type === 'text' && !c.value.trim())).length === 1;
      const small = Number(node.properties.width) < FRAME_FROM;
      if (!caption && (!alone || small)) return;
      delete node.properties.title;
      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        // Dialog and modal shots are portrait cut-outs, not browser windows.
        properties: { className: String(node.properties.src).includes('-dialog') ? ['frame', 'frame-dialog'] : ['frame'] },
        children: [
          { type: 'element', tagName: 'div', properties: { className: ['frame-body'] }, children: [{ ...node }] },
          ...(caption ? [{ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] } as Element] : []),
        ],
      };
      if (alone) {
        Object.assign(parent, figure);
      } else {
        parent.children[index!] = figure;
      }
      return SKIP;
    });
  };
}

// Search engines show about 155 characters of a meta description; cut on a word boundary.
function summarize(text: string): string | null {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length < 40) return null;
  if (clean.length <= 155) return clean;
  return `${clean.slice(0, 155).replace(/\s+\S*$/, '')}…`;
}

// Shiki writes `class` as a string; rehype writes `className` as an array.
function classes(node: Element): string[] {
  const value = node.properties.className ?? node.properties.class ?? [];
  return Array.isArray(value) ? value.map(String) : String(value).split(/\s+/);
}

function structure(out: { title: string | null; titleId: string | null; summary: string | null; headings: Heading[] }) {
  return (tree: HRoot) => {
    visit(tree, 'element', (node: Element, index, parent: any) => {
      if (node.tagName === 'h1' && out.title === null && parent === tree) {
        out.title = toString(node).trim();
        out.titleId = node.properties.id ? String(node.properties.id) : null;
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
      if ((node.tagName === 'p' || node.tagName === 'li') && out.summary === null) {
        out.summary = summarize(toString(node));
      }
      if ((node.tagName === 'h2' || node.tagName === 'h3') && node.properties.id) {
        const id = String(node.properties.id);
        out.headings.push({ depth: node.tagName === 'h2' ? 2 : 3, id, text: toString(node).trim() });
        node.children.push({
          type: 'element',
          tagName: 'a',
          properties: { className: ['anchor'], href: `#${id}`, ariaLabel: 'Link to this section' },
          children: [raw(icon('link', 14))],
        });
      }
      if (node.tagName === 'pre' && classes(node).includes('shiki')) {
        const code = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code');
        const lang = (code ? classes(code) : []).find((c) => c.startsWith('language-'))?.slice(9) ?? '';
        parent.children[index!] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-block'] },
          children: [
            { type: 'element', tagName: 'div', properties: { className: ['code-header'] }, children: [{ type: 'text', value: LANG_LABEL[lang] ?? (lang === 'text' || lang === 'plaintext' ? '' : lang) }] },
            node,
          ],
        };
        return SKIP;
      }
      if (node.tagName === 'table') {
        parent.children[index!] = { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [node] };
        return SKIP;
      }
    });
  };
}

export async function renderMarkdown(source: string, ctx: LinkContext): Promise<Rendered> {
  const out = { title: null as string | null, titleId: null as string | null, summary: null as string | null, headings: [] as Heading[] };
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(directives)
    .use(codeBlocks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(links, ctx)
    .use(sizes, ctx)
    .use(images)
    .use(rehypeShiki, {
      themes: { light: 'light-plus', dark: 'github-dark' },
      defaultColor: false,
      addLanguageClass: true,
      lazy: true,
      fallbackLanguage: 'plaintext',
    })
    .use(structure, out)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(mkdocsCompat(source));
  return { html: String(file), ...out };
}
