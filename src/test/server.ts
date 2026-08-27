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
    const base = url.searchParams.has('tags') ? 100 : 0;
    const posts = Array.from({ length: perPage }, (_, i) => makePost({ id: base + i + 1 })).filter(
      (p) => !exclude.includes(p.id),
    );
    return HttpResponse.json(posts);
  }),
  http.get(`${API}/wp/v2/categories`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    if (params.get('parent') === '9743') {
      return HttpResponse.json([
        { id: 1, name: 'Moda', slug: 'moda', link: 'https://example.test/category/moda/' },
        { id: 2, name: 'Arte', slug: 'arte', link: 'https://example.test/category/arte/' },
      ]);
    }
    if (params.get('orderby') === 'count') {
      return HttpResponse.json([
        { id: 1, name: 'Uncategorized', slug: 'uncategorized', link: 'https://example.test/category/uncategorized/', count: 900 },
        { id: 21, name: 'Noticias', slug: 'noticias', link: 'https://example.test/category/noticias/', count: 500 },
        { id: 22, name: 'Deportes', slug: 'deportes', link: 'https://example.test/category/deportes/', count: 100 },
      ]);
    }
    const slug = params.get('slug');
    if (slug === 'deportes') return HttpResponse.json([{ id: 22, name: 'Deportes', slug, count: 10 }]);
    if (slug === 'regionales') return HttpResponse.json([{ id: 4265, name: 'Regionales', slug, count: 100 }]);
    if (slug === 'policiacas') return HttpResponse.json([{ id: 6140, name: 'Policiacas', slug, count: 50 }]);
    if (slug === 'nacionales') return HttpResponse.json([{ id: 11104, name: 'Nacionales', slug, count: 40 }]);
    if (slug === 'presencia-femenina') return HttpResponse.json([{ id: 9743, name: 'Presencia Femenina', slug, count: 300 }]);
    if (slug === 'la-palabra-del-dia') return HttpResponse.json([{ id: 31, name: 'La Palabra del Día', slug, count: 600 }]);
    return HttpResponse.json([]);
  }),
  http.get(`${API}/wp/v2/tags`, ({ request }) => {
    const slug = new URL(request.url).searchParams.get('slug');
    if (slug === 'noticias-destacadas') return HttpResponse.json([{ id: 15632, name: 'noticias destacadas', slug, count: 750 }]);
    return HttpResponse.json([]);
  }),
  http.get(`${API}/wp/v2/impreso`, ({ request }) => {
    const perPage = Number(new URL(request.url).searchParams.get('per_page') ?? 1);
    return HttpResponse.json(
      Array.from({ length: perPage }, (_, i) => {
        const p = makePost({ id: 900 + i, title: { rendered: `Edición ${700 - i}` } });
        delete p.excerpt;
        return p;
      }),
    );
  }),
  http.get(`${API}/wp/v2/pages`, () => HttpResponse.json([])),
];

export const server = setupServer(...handlers);
