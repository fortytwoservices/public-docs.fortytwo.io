import type { APIRoute } from 'astro';
import { getSite } from '../lib/content';
import { llmsIndex } from '../lib/llms';

export const GET: APIRoute = async () =>
  new Response(llmsIndex(await getSite()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
