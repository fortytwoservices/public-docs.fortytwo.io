import type { APIRoute } from 'astro';
import { getSite, type Page } from '../lib/content';
import { pageMarkdown } from '../lib/llms';

// Every page is also served as Markdown at its URL plus .md (/checkid/faq/ -> /checkid/faq.md).
export async function getStaticPaths() {
  const site = await getSite();
  return [...site.pages.values()].map((page) => ({ params: { slug: page.slug.replace(/\/$/, '') }, props: { page } }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(pageMarkdown((props as { page: Page }).page, await getSite()), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
