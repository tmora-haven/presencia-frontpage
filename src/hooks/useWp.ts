/**
 * TanStack Query hooks. Query keys are namespaced under `wp` so the whole
 * cache can be invalidated at once, and every key includes its parameters so
 * two components asking for the same data share one in-flight request.
 */
import { useQuery } from '@tanstack/react-query';
import {
  getCategoryFeed,
  getLatestPosts,
  getPrintEditions,
  getSiteInfo,
  getSiteLinks,
  getTopCategories,
  getTagFeed,
  getChildCategories,
} from '../lib/wpClient';

export const LATEST_COUNT = 4; // the "Lo más reciente" list beside the slideshow
export const BENTO_SLUG = 'regionales';
export const BENTO_COUNT = 8;
export const FEATURED_TAG = 'noticias-destacadas';
export const FEATURED_COUNT = 5;
export const RAIL_COUNT = 4;
export const PRINT_COUNT = 11; // current issue + ten previous editions

export const wpKeys = {
  all: ['wp'] as const,
  site: () => [...wpKeys.all, 'site'] as const,
  latest: (count: number) => [...wpKeys.all, 'posts', 'latest', count] as const,
  category: (slug: string, count: number, exclude: number[], excludeCategorySlug?: string) =>
    [...wpKeys.all, 'posts', 'category', slug, count, exclude, excludeCategorySlug ?? null] as const,
  print: (count: number) => [...wpKeys.all, 'impreso', count] as const,
  links: (slugs: string[]) => [...wpKeys.all, 'pages', slugs] as const,
  nav: (count: number) => [...wpKeys.all, 'categories', 'top', count] as const,
  tag: (slug: string, count: number) => [...wpKeys.all, 'posts', 'tag', slug, count] as const,
  children: (parentId: number, count: number) => [...wpKeys.all, 'categories', 'children', parentId, count] as const,
};

export function useFeatured(count = FEATURED_COUNT) {
  return useQuery({
    queryKey: wpKeys.tag(FEATURED_TAG, count),
    queryFn: ({ signal }) => getTagFeed(FEATURED_TAG, count, signal),
  });
}

export function useChildCategories(parentId: number | undefined, count = 6) {
  return useQuery({
    queryKey: wpKeys.children(parentId ?? 0, count),
    queryFn: ({ signal }) => getChildCategories(parentId!, count, signal),
    enabled: parentId !== undefined,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useTopCategories(count = 9) {
  return useQuery({
    queryKey: wpKeys.nav(count),
    queryFn: ({ signal }) => getTopCategories(count, signal),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useSiteInfo() {
  return useQuery({
    queryKey: wpKeys.site(),
    queryFn: ({ signal }) => getSiteInfo(signal),
    staleTime: 60 * 60 * 1000,
  });
}

export function useLatest(count = LATEST_COUNT) {
  return useQuery({
    queryKey: wpKeys.latest(count),
    queryFn: ({ signal }) => getLatestPosts(count, signal),
  });
}

/**
 * Dependent query: rails wait for the latest feed so they can exclude stories
 * already shown above the fold and avoid duplicate headlines on the page.
 */
export function useCategoryFeed(
  slug: string,
  count = RAIL_COUNT,
  exclude: number[] | undefined,
  excludeCategorySlug?: string,
) {
  return useQuery({
    queryKey: wpKeys.category(slug, count, exclude ?? [], excludeCategorySlug),
    queryFn: ({ signal }) => getCategoryFeed(slug, count, exclude ?? [], signal, excludeCategorySlug),
    enabled: exclude !== undefined,
  });
}

export function usePrintEditions(count = PRINT_COUNT) {
  return useQuery({
    queryKey: wpKeys.print(count),
    queryFn: ({ signal }) => getPrintEditions(count, signal),
    staleTime: 60 * 60 * 1000,
  });
}

export function useSiteLinks(slugs: string[]) {
  return useQuery({
    queryKey: wpKeys.links(slugs),
    queryFn: ({ signal }) => getSiteLinks(slugs, signal),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
