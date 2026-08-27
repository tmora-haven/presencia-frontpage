/**
 * Typed, read-only client for the public WordPress REST API (wp/v2).
 *
 * Design notes
 * - Components never build URLs; everything goes through here.
 * - Every request has a timeout (AbortSignal.timeout) so a slow origin can't
 *   hang a section forever.
 * - `_fields` trims payloads to what we render; `_embed` pulls featured media,
 *   author and terms in the same round-trip (avoids N+1 media requests).
 * - Responses are normalised into plain-text domain objects (see types.ts);
 *   no HTML from the API ever reaches the render tree.
 */
import { API_BASE } from '../config';
import { decodeHtml } from './decodeHtml';
import type {
  Article,
  ArticleImage,
  PrintEdition,
  SiteInfo,
  SiteLink,
  WpCategory,
  WpMedia,
  WpPage,
  WpPost,
  WpSiteInfo,
} from './types';

export class WpApiError extends Error {
  readonly status: number | null;
  readonly url: string;

  constructor(message: string, status: number | null, url: string) {
    super(message);
    this.name = 'WpApiError';
    this.status = status;
    this.url = url;
  }
}

const REQUEST_TIMEOUT_MS = 10_000;

const POST_FIELDS = [
  'id',
  'date_gmt',
  'link',
  'title',
  'excerpt',
  '_links',
  '_embedded',
].join(',');

function buildUrl(path: string, params: Record<string, string | number | undefined>): URL {
  const url = new URL(`wp-json/${path.replace(/^\/+/, '')}`, API_BASE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }
  return url;
}

async function getJson<T>(url: URL, signal?: AbortSignal): Promise<T> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(url, {
      signal: combined,
      headers: { Accept: 'application/json' },
      credentials: 'omit', // public endpoints only — never send cookies
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'error de red';
    throw new WpApiError(`No se pudo conectar con la API (${reason})`, null, url.toString());
  }
  if (!response.ok) {
    throw new WpApiError(`La API respondió ${response.status}`, response.status, url.toString());
  }
  return (await response.json()) as T;
}

/* ---------- normalisers ---------- */

function pickImage(media: WpMedia | undefined): ArticleImage | null {
  if (!media?.source_url) return null;
  const sizes = media.media_details?.sizes ?? {};
  const preferred = sizes.medium_large ?? sizes.large ?? sizes.full;
  const src = preferred?.source_url ?? media.source_url;
  const width = preferred?.width ?? media.media_details?.width ?? 0;
  const height = preferred?.height ?? media.media_details?.height ?? 0;
  const srcSet = Object.values(sizes)
    .filter((s) => s.width >= 300)
    .sort((a, b) => a.width - b.width)
    .map((s) => `${s.source_url} ${s.width}w`)
    .join(', ');
  return {
    src,
    srcSet: srcSet || undefined,
    width,
    height,
    alt: decodeHtml(media.alt_text),
  };
}

export function normalizePost(post: WpPost): Article {
  const terms = post._embedded?.['wp:term']?.flat() ?? [];
  const category = terms.find((t) => t.taxonomy === 'category');
  return {
    id: post.id,
    title: decodeHtml(post.title?.rendered),
    excerpt: decodeHtml(post.excerpt?.rendered),
    url: post.link,
    publishedAt: `${post.date_gmt}Z`,
    author: post._embedded?.author?.[0]?.name ? decodeHtml(post._embedded.author[0].name) : null,
    category: category ? { name: decodeHtml(category.name), slug: category.slug } : null,
    image: pickImage(post._embedded?.['wp:featuredmedia']?.[0]),
  };
}

/* ---------- public API ---------- */

export async function getSiteInfo(signal?: AbortSignal): Promise<SiteInfo> {
  const data = await getJson<WpSiteInfo>(buildUrl('', { _fields: 'name,description,url' }), signal);
  return {
    name: decodeHtml(data.name),
    tagline: decodeHtml(data.description),
    url: data.url,
  };
}

export async function getLatestPosts(count: number, signal?: AbortSignal): Promise<Article[]> {
  const url = buildUrl('wp/v2/posts', {
    per_page: count,
    orderby: 'date',
    order: 'desc',
    _embed: 'wp:featuredmedia,author,wp:term',
    _fields: POST_FIELDS,
  });
  const posts = await getJson<WpPost[]>(url, signal);
  return posts.map(normalizePost);
}

export async function getCategoryBySlug(slug: string, signal?: AbortSignal): Promise<WpCategory | null> {
  const url = buildUrl('wp/v2/categories', { slug, _fields: 'id,name,slug,count' });
  const [category] = await getJson<WpCategory[]>(url, signal);
  return category ?? null;
}

export interface CategoryFeed {
  category: { id: number; name: string; slug: string };
  articles: Article[];
}

/** Resolves a category by slug and returns its most recent posts (one logical query for the UI). */
export async function getCategoryFeed(
  slug: string,
  count: number,
  exclude: number[] = [],
  signal?: AbortSignal,
): Promise<CategoryFeed | null> {
  const category = await getCategoryBySlug(slug, signal);
  if (!category) return null;
  const url = buildUrl('wp/v2/posts', {
    categories: category.id,
    per_page: count,
    exclude: exclude.length ? exclude.join(',') : undefined,
    _embed: 'wp:featuredmedia,author,wp:term',
    _fields: POST_FIELDS,
  });
  const posts = await getJson<WpPost[]>(url, signal);
  return {
    category: { id: category.id, name: decodeHtml(category.name), slug: category.slug },
    articles: posts.map(normalizePost),
  };
}

/** Print editions live in the custom post type `impreso`. */
export async function getPrintEditions(count: number, signal?: AbortSignal): Promise<PrintEdition[]> {
  const url = buildUrl('wp/v2/impreso', {
    per_page: count,
    _embed: 'wp:featuredmedia',
    _fields: 'id,date_gmt,link,title,_links,_embedded',
  });
  const items = await getJson<WpPost[]>(url, signal);
  return items.map((item) => ({
    id: item.id,
    title: decodeHtml(item.title?.rendered),
    url: item.link,
    publishedAt: `${item.date_gmt}Z`,
    cover: pickImage(item._embedded?.['wp:featuredmedia']?.[0]),
  }));
}

/** Public pages used for the footer navigation, in the order of `slugs`. */
export async function getSiteLinks(slugs: string[], signal?: AbortSignal): Promise<SiteLink[]> {
  const url = buildUrl('wp/v2/pages', {
    slug: slugs.join(','),
    per_page: slugs.length,
    _fields: 'id,slug,link,title',
  });
  const pages = await getJson<WpPage[]>(url, signal);
  const bySlug = new Map(pages.map((p) => [p.slug, p]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is WpPage => Boolean(p))
    .map((p) => ({ id: p.id, label: decodeHtml(p.title.rendered), url: p.link }));
}
