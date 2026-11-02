import type { APIRoute } from 'astro';
import { getSite } from '../lib/content';
import { llmsFull } from '../lib/llms';

export const GET: APIRoute = async () =>
  new Response(llmsFull(await getSite()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
