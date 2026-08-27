import type { WpPost } from '../lib/types';

export function makePost(overrides: Partial<WpPost> & { id: number }): WpPost {
  return {
    date_gmt: '2026-08-27T14:30:00',
    link: `https://example.test/post-${overrides.id}/`,
    title: { rendered: `Titular ${overrides.id} &#8211; prueba` },
    excerpt: { rendered: '<p>Resumen de la <strong>noticia</strong> [&hellip;]</p>' },
    _embedded: {
      author: [{ id: 1, name: 'Redacción Presencia' }],
      'wp:featuredmedia': [
        {
          id: 100 + overrides.id,
          alt_text: '',
          source_url: `https://example.test/img-${overrides.id}.jpg`,
          media_details: {
            width: 1024,
            height: 768,
            sizes: {
              medium: { source_url: `https://example.test/img-${overrides.id}-300.jpg`, width: 300, height: 225 },
              medium_large: { source_url: `https://example.test/img-${overrides.id}-768.jpg`, width: 768, height: 576 },
              full: { source_url: `https://example.test/img-${overrides.id}.jpg`, width: 1024, height: 768 },
            },
          },
        },
      ],
      'wp:term': [
        [
          { id: 21, name: 'Noticias', slug: 'noticias', taxonomy: 'category' },
          { id: 4265, name: 'Regionales', slug: 'regionales', taxonomy: 'category' },
        ],
        [{ id: 5001, name: 'Río Grande', slug: 'rio-grande', taxonomy: 'pueblo' }],
      ],
    },
    ...overrides,
  };
}
