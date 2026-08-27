import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, server } from '../test/server';
import { makePost } from '../test/fixtures';
import { getCategoryFeed, getLatestPosts, normalizePost } from './wpClient';

describe('normalizePost', () => {
  it('produces plain-text fields and a responsive image', () => {
    const article = normalizePost(makePost({ id: 7 }));
    expect(article.title).toBe('Titular 7 – prueba');
    expect(article.excerpt).toBe('Resumen de la noticia…');
    expect(article.publishedAt).toBe('2026-08-27T14:30:00Z');
    expect(article.author).toBe('Redacción Presencia');
    expect(article.category).toEqual({ name: 'Noticias', slug: 'noticias' });
    expect(article.image).toMatchObject({ src: 'https://example.test/img-7-768.jpg', width: 768, height: 576 });
    expect(article.image?.srcSet).toContain('300w');
    expect(article.image?.srcSet).toContain('1024w');
  });

  it('tolerates posts without embedded data', () => {
    const article = normalizePost({ id: 1, date_gmt: '2026-01-01T00:00:00', link: 'https://x/', title: { rendered: 'A' } });
    expect(article.image).toBeNull();
    expect(article.author).toBeNull();
    expect(article.category).toBeNull();
    expect(article.excerpt).toBe('');
  });
});

describe('getLatestPosts', () => {
  it('requests the right params and returns normalised articles', async () => {
    let captured: URL | null = null;
    server.use(
      http.get(`${API}/wp/v2/posts`, ({ request }) => {
        captured = new URL(request.url);
        return HttpResponse.json([makePost({ id: 1 })]);
      }),
    );
    const articles = await getLatestPosts(9);
    expect(articles).toHaveLength(1);
    expect(captured!.searchParams.get('per_page')).toBe('9');
    expect(captured!.searchParams.get('_embed')).toContain('wp:featuredmedia');
    expect(captured!.searchParams.get('_fields')).toContain('_embedded');
  });

  it('throws WpApiError with status on HTTP failure', async () => {
    server.use(http.get(`${API}/wp/v2/posts`, () => HttpResponse.json({ code: 'err' }, { status: 500 })));
    await expect(getLatestPosts(3)).rejects.toMatchObject({ name: 'WpApiError', status: 500 });
  });
});

describe('getCategoryFeed', () => {
  it('returns null for unknown categories', async () => {
    await expect(getCategoryFeed('no-existe', 4)).resolves.toBeNull();
  });

  it('can exclude an overlapping category', async () => {
    let captured: URL | null = null;
    server.use(
      http.get(`${API}/wp/v2/posts`, ({ request }) => {
        captured = new URL(request.url);
        return HttpResponse.json([]);
      }),
    );
    await getCategoryFeed('deportes', 4, [], undefined, 'la-palabra-del-dia');
    expect(captured!.searchParams.get('categories')).toBe('22');
    expect(captured!.searchParams.get('categories_exclude')).toBe('31');
  });

  it('passes exclusions through to the posts query', async () => {
    const feed = await getCategoryFeed('deportes', 4, [1, 2]);
    expect(feed?.category).toEqual({ id: 22, name: 'Deportes', slug: 'deportes' });
    expect(feed?.articles.map((a) => a.id)).toEqual([3, 4]);
  });
});
