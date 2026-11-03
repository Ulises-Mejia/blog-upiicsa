import type { APIRoute } from 'astro';
import { getIdentidadContent } from '../../data/identidad-content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const content = await getIdentidadContent();

  return new Response(JSON.stringify(content), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
