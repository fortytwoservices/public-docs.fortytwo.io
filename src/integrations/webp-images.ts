import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import type { AstroIntegration } from 'astro';

// Pages show a WebP copy of every PNG and JPEG they embed, usually a fraction of the size.
// The original files stay where they are, because other sites link to them directly.

const RASTER = /\.(png|jpe?g)$/i;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
}

function decode(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

export default function webpImages(): AstroIntegration {
  return {
    name: 'webp-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const converted = new Map<string, Promise<boolean>>();
        let saved = 0;

        // A copy is only used when it is actually smaller.
        const convert = (src: string) => {
          if (!converted.has(src)) {
            converted.set(
              src,
              (async () => {
                const file = join(out, decode(src));
                if (!existsSync(file)) return false;
                const webp = await sharp(file).webp({ quality: 82, effort: 5 }).toBuffer();
                const before = statSync(file).size;
                if (webp.length >= before) return false;
                writeFileSync(file.replace(RASTER, '.webp'), webp);
                saved += before - webp.length;
                return true;
              })(),
            );
          }
          return converted.get(src)!;
        };

        const pages = walk(out).filter((f) => f.endsWith('.html'));
        for (const page of pages) {
          const html = readFileSync(page, 'utf8');
          const srcs = [...html.matchAll(/<img\b[^>]*?\ssrc="(\/[^"?#]+)"/g)].map((m) => m[1]).filter((s) => RASTER.test(s));
          if (!srcs.length) continue;
          const ok = new Set<string>();
          for (const src of new Set(srcs)) if (await convert(src)) ok.add(src);
          if (!ok.size) continue;
          const next = html.replace(/(<img\b[^>]*?\ssrc=")(\/[^"?#]+)(")/g, (m, a: string, src: string, b: string) =>
            ok.has(src) ? `${a}${src.replace(RASTER, '.webp')}${b}` : m,
          );
          writeFileSync(page, next);
        }
        const count = [...converted.values()].length;
        logger.info(`${count} images checked, WebP copies save ${(saved / 1024 / 1024).toFixed(1)} MB`);
      },
    },
  };
}
