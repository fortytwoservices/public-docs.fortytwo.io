import { execFileSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import legacyUrls from './src/integrations/legacy-urls.ts';

// Last commit date per docs file, so the sitemap tells search engines what actually changed.
function gitDates() {
  const dates = new Map();
  try {
    const log = execFileSync('git', ['log', '--format=%x00%cI', '--name-only', '--', 'docs'], { maxBuffer: 64 << 20 }).toString();
    for (const chunk of log.split('\0').slice(1)) {
      const [date, ...files] = chunk.trim().split('\n');
      for (const f of files) if (f && !dates.has(f)) dates.set(f.replace(/^docs\//, ''), date);
    }
  } catch {}
  return dates;
}
const dates = gitDates();

function lastmod(url) {
  const path = decodeURIComponent(new URL(url).pathname).replace(/^\//, '');
  return dates.get(`${path}index.md`) ?? dates.get(`${path.replace(/\/$/, '')}.md`);
}

export default defineConfig({
  site: 'https://docs.fortytwo.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  // sitemap first, so legacy-urls can also publish it as /sitemap.xml like MkDocs did.
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      serialize: (item) => ({ ...item, lastmod: lastmod(item.url) }),
    }),
    legacyUrls(),
  ],
});
