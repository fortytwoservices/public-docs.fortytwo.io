// Pulls the docs folder of every product that lives in another repository into
// .sources/<product id>/, so the site builds them exactly like local docs.
// Private repos need GITHUB_TOKEN (CI: a token with read access to those repos).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { products } = await import('../src/config/products.ts');
const remote = products.filter((p) => p.source);
const out = '.sources';

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const product of remote) {
  const { repo, ref = 'main', path = 'docs' } = product.source;
  const token = process.env.GITHUB_TOKEN;
  const url = token
    ? `https://x-access-token:${token}@github.com/${repo}.git`
    : `https://github.com/${repo}.git`;
  const work = join(tmpdir(), `docs-source-${product.id.replace(/\W/g, '-')}-${Date.now()}`);
  const git = (...args) => execFileSync('git', args, { cwd: work, stdio: 'pipe' });

  try {
    mkdirSync(work, { recursive: true });
    git('init', '-q');
    git('remote', 'add', 'origin', url);
    git('sparse-checkout', 'set', '--no-cone', `/${path}/`);
    git('fetch', '-q', '--depth=1', 'origin', ref);
    git('checkout', '-q', 'FETCH_HEAD');
    const sha = git('rev-parse', 'HEAD').toString().trim();

    const from = join(work, path);
    if (!existsSync(from)) throw new Error(`${repo}@${ref} has no ${path}/`);
    const to = join(out, product.id);
    cpSync(from, to, { recursive: true });
    writeFileSync(join(to, '.source.json'), JSON.stringify({ repo, ref, path, sha }));
    console.log(`sources: ${product.id} <- ${repo}@${ref}/${path} (${sha.slice(0, 7)})`);
  } catch (err) {
    // A broken source must fail CI, but local dev keeps working on the other products.
    const message = `sources: could not fetch ${repo} for ${product.id}: ${err.message}`;
    if (process.env.CI) throw new Error(message);
    console.warn(message);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (remote.length === 0) console.log('sources: no remote products configured');
