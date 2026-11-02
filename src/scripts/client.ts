const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

const COPY = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

// ---------- Theme ----------
$('#theme-toggle')?.addEventListener('click', () => {
  const dark = document.documentElement.classList.toggle('dark');
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {}
  renderMermaid(true);
});

// ---------- Mobile nav ----------
const menu = $('#menu-button');
const header = $('.site-header');

function setNav(open: boolean) {
  document.body.classList.toggle('nav-open', open);
  menu?.setAttribute('aria-expanded', String(open));
  menu?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

// The drawer opens below the header, whose height depends on the viewport.
const syncHeaderHeight = () => document.documentElement.style.setProperty('--header-height', `${header?.offsetHeight ?? 113}px`);
syncHeaderHeight();
addEventListener('resize', syncHeaderHeight);

menu?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
$('#sidebar')?.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a')) setNav(false);
});
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setNav(false);
});

// Keep the current product's tab in view on narrow screens.
$('.product-tab[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

// ---------- Code copy ----------
for (const block of $$('.code-block')) {
  const pre = $('pre', block)!;
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.setAttribute('aria-label', 'Copy code');
  button.innerHTML = COPY;
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? pre.innerText);
    button.innerHTML = CHECK;
    button.classList.add('copied');
    setTimeout(() => {
      button.innerHTML = COPY;
      button.classList.remove('copied');
    }, 1600);
  });
  $('.code-header', block)!.append(button);
}

// ---------- Tabs ----------
for (const tabs of $$('.tabs')) {
  const panes = $$(':scope > .tab', tabs);
  const list = document.createElement('div');
  list.className = 'tab-list';
  list.setAttribute('role', 'tablist');
  panes.forEach((pane, i) => {
    const button = document.createElement('button');
    button.setAttribute('role', 'tab');
    button.textContent = pane.dataset.label ?? `Tab ${i + 1}`;
    button.addEventListener('click', () => {
      panes.forEach((p, j) => p.classList.toggle('active', j === i));
      $$('button', list).forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
    });
    list.append(button);
  });
  tabs.prepend(list);
  tabs.classList.add('ready');
  (list.firstElementChild as HTMLButtonElement | null)?.click();
}

// ---------- Screenshot lightbox ----------
const lightbox = $<HTMLDialogElement>('#lightbox');
for (const img of $$<HTMLImageElement>('.frame img')) {
  img.addEventListener('click', () => {
    if (!lightbox) return;
    lightbox.replaceChildren(Object.assign(document.createElement('img'), { src: img.currentSrc, alt: img.alt }));
    lightbox.showModal();
  });
}
lightbox?.addEventListener('click', () => lightbox.close());

// ---------- Mermaid ----------
const diagrams = $$('pre.mermaid');
diagrams.forEach((d) => (d.dataset.source = d.textContent ?? ''));

async function renderMermaid(rerender = false) {
  if (!diagrams.length) return;
  const url = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';
  const { default: mermaid } = await import(/* @vite-ignore */ url);
  const css = getComputedStyle(document.documentElement);
  const hsl = (v: string) => `hsl(${css.getPropertyValue(v).trim().split(' ').join(', ')})`;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    fontFamily: 'Plus Jakarta Sans Variable, sans-serif',
    themeVariables: {
      primaryColor: hsl('--muted'),
      primaryBorderColor: hsl('--input-border'),
      primaryTextColor: hsl('--heading'),
      lineColor: hsl('--muted-foreground'),
      secondaryColor: hsl('--card'),
      tertiaryColor: hsl('--background'),
      clusterBkg: hsl('--surface-sunken'),
      clusterBorder: hsl('--border'),
      fontSize: '14px',
    },
  });
  if (rerender) diagrams.forEach((d) => {
    d.removeAttribute('data-processed');
    d.textContent = d.dataset.source ?? '';
  });
  await mermaid.run({ nodes: diagrams });
}
renderMermaid();

// ---------- Table of contents scrollspy ----------
const tocLinks = $$<HTMLAnchorElement>('.toc a');
if (tocLinks.length) {
  const targets = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean) as HTMLElement[];
  const update = () => {
    let current = targets[0];
    for (const t of targets) if (t.getBoundingClientRect().top < 160) current = t;
    tocLinks.forEach((a) => a.classList.toggle('active', decodeURIComponent(a.hash.slice(1)) === current?.id));
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

// ---------- Search (Pagefind, built by `npm run build`) ----------
const dialog = $<HTMLDialogElement>('#search-dialog')!;
const input = $<HTMLInputElement>('#search-input')!;
const results = $('#search-results')!;
let product = '';
let selected = 0;
let pagefind: any = null;

async function loadPagefind() {
  if (pagefind !== null) return pagefind;
  try {
    const bundle = '/pagefind/pagefind.js';
    pagefind = await import(/* @vite-ignore */ bundle);
    await pagefind.init();
  } catch {
    pagefind = false;
  }
  return pagefind;
}

function openSearch() {
  dialog.showModal();
  input.select();
  loadPagefind();
}

$('#search-trigger')?.addEventListener('click', openSearch);
addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    dialog.open ? dialog.close() : openSearch();
  } else if (e.key === '/' && !dialog.open && !(e.target instanceof HTMLInputElement)) {
    e.preventDefault();
    openSearch();
  }
});
dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());

for (const chip of $$<HTMLButtonElement>('#search-filters .chip')) {
  chip.addEventListener('click', () => {
    product = chip.dataset.product ?? '';
    $$('#search-filters .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    search();
  });
}

function select(i: number) {
  const links = $$<HTMLAnchorElement>('a', results);
  if (!links.length) return;
  selected = (i + links.length) % links.length;
  links.forEach((a, j) => a.setAttribute('aria-selected', String(j === selected)));
  links[selected].scrollIntoView({ block: 'nearest' });
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    select(selected + (e.key === 'ArrowDown' ? 1 : -1));
  } else if (e.key === 'Enter') {
    $$<HTMLAnchorElement>('a', results)[selected]?.click();
  }
});

let timer: number | undefined;
input.addEventListener('input', () => {
  clearTimeout(timer);
  timer = window.setTimeout(search, 120);
});

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

async function search() {
  const query = input.value.trim();
  if (!query) {
    results.innerHTML = '';
    return;
  }
  const pf = await loadPagefind();
  if (!pf) {
    results.innerHTML = '<li class="search-empty">Search is built with the site. Run <code>npm run build</code> and <code>npm run preview</code> to try it.</li>';
    return;
  }
  const res = await pf.search(query, product ? { filters: { product } } : {});
  const data = await Promise.all(res.results.slice(0, 12).map((r: any) => r.data()));
  if (input.value.trim() !== query) return;
  selected = 0;
  results.innerHTML = data.length
    ? data
        .map(
          (d: any, i: number) => `<li><a href="${d.url}" aria-selected="${i === 0}">
            <span class="result-product">${escapeHtml(d.meta.product ?? '')}</span>
            <span class="result-title">${escapeHtml(d.meta.title ?? d.url)}</span>
            <span class="result-excerpt">${d.excerpt}</span></a></li>`,
        )
        .join('')
    : `<li class="search-empty">No results for “${escapeHtml(query)}”.</li>`;
}
