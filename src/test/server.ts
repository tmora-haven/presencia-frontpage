import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { makePost } from './fixtures';

export const API = 'https://example.test/wp-json';

export const handlers = [
  http.get(`${API}/`, () =>
    HttpResponse.json({ name: 'Periódico Prueba', description: 'Tu Regional', url: 'https://example.test' }),
  ),
  http.get(`${API}/wp/v2/posts`, ({ request }) => {
    const url = new URL(request.url);
    const perPage = Number(url.searchParams.get('per_page') ?? 10);
    const exclude = (url.searchParams.get('exclude') ?? '').split(',').filter(Boolean).map(Number);
    const posts = Array.from({ length: perPage }, (_, i) => makePost({ id: i + 1 })).filter(
      (p) => !exclude.includes(p.id),
    );
    return HttpResponse.json(posts);
  }),
  http.get(`${API}/wp/v2/categories`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    if (params.get('orderby') === 'count') {
      return HttpResponse.json([
        { id: 1, name: 'Uncategorized', slug: 'uncategorized', link: 'https://example.test/category/uncategorized/', count: 900 },
        { id: 21, name: 'Noticias', slug: 'noticias', link: 'https://example.test/category/noticias/', count: 500 },
        { id: 22, name: 'Deportes', slug: 'deportes', link: 'https://example.test/category/deportes/', count: 100 },
      ]);
    }
    const slug = params.get('slug');
    if (slug === 'deportes') return HttpResponse.json([{ id: 22, name: 'Deportes', slug, count: 10 }]);
    return HttpResponse.json([]);
  }),
  http.get(`${API}/wp/v2/impreso`, () => HttpResponse.json([])),
  http.get(`${API}/wp/v2/pages`, () => HttpResponse.json([])),
];

export const server = setupServer(...handlers);
