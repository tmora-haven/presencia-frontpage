/** Minimal shapes of the WP REST v2 payloads we consume. */
export interface WpRendered {
  rendered: string;
}

export interface WpMediaSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WpMedia {
  id: number;
  alt_text?: string;
  source_url: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, WpMediaSize>;
  };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: 'category' | 'post_tag' | 'pueblo' | string;
}

export interface WpAuthor {
  id: number;
  name: string;
}

export interface WpPost {
  id: number;
  date_gmt: string;
  link: string;
  title: WpRendered;
  excerpt?: WpRendered;
  _embedded?: {
    author?: WpAuthor[];
    'wp:featuredmedia'?: WpMedia[];
    'wp:term'?: WpTerm[][];
  };
}

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WpPage {
  id: number;
  slug: string;
  link: string;
  title: WpRendered;
}

export interface WpSiteInfo {
  name: string;
  description: string;
  url: string;
}

/* ---------- Normalised domain model used by the UI ---------- */

export interface ArticleImage {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  publishedAt: string; // ISO 8601, UTC
  author: string | null;
  category: { name: string; slug: string } | null;
  /** Custom taxonomy `pueblo` (municipality) used by the newsroom. */
  pueblo: { name: string; slug: string } | null;
  image: ArticleImage | null;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  url: string;
}

export interface PrintEdition {
  id: number;
  title: string;
  url: string;
  publishedAt: string;
  cover: ArticleImage | null;
}

export interface SiteLink {
  id: number;
  label: string;
  url: string;
}
