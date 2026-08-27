import { useCategoryFeed } from '../hooks/useWp';
import type { Article } from '../lib/types';
import { formatDate } from '../lib/format';
import { AdSlot } from './AdSlot';
import { ArticleCard } from './ArticleCard';
import { SectionHeading } from './SectionHeading';
import { SectionError, Skeleton } from './SectionState';
import './CategoryRail.css';

export type RailVariant = 'feature' | 'opinion' | 'scroll';

interface Props {
  slug: string;
  /** Fallback label while the category name loads. */
  label: string;
  variant?: RailVariant;
  count?: number;
  exclude: number[] | undefined;
}

const CATEGORY_BASE = 'https://presenciapr.com/category/';

/**
 * One data hook, three presentations:
 *  - feature: lead story + list + a half-page ad sidebar
 *  - opinion: text-first, tinted band with oversized quote marks (for Editorial)
 *  - scroll:  horizontal snap-scroll cards on small screens, 4-up on desktop
 */
export function CategoryRail({ slug, label, variant = 'feature', count, exclude }: Props) {
  const { data, isPending, isError, error, refetch, isFetching } = useCategoryFeed(slug, count, exclude);
  const headingId = `rail-${slug}`;
  const className = `rail rail--${variant}`;

  if (isPending) {
    return (
      <section className={className} aria-busy="true" aria-labelledby={headingId}>
        <SectionHeading id={headingId} title={label} />
        <div className="rail__skeletons">
          <Skeleton variant="card" count={4} />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={className} aria-labelledby={headingId}>
        <SectionHeading id={headingId} title={label} />
        <SectionError message={error.message} onRetry={() => refetch()} retrying={isFetching} />
      </section>
    );
  }

  if (!data || data.articles.length === 0) return null;

  const href = `${CATEGORY_BASE}${data.category.slug}/`;

  return (
    <section className={className} aria-labelledby={headingId}>
      <div className={variant === 'opinion' ? 'container' : undefined}>
        <SectionHeading id={headingId} title={data.category.name} href={href} />
        {variant === 'feature' && <FeatureLayout articles={data.articles} slug={slug} />}
        {variant === 'opinion' && <OpinionLayout articles={data.articles} />}
        {variant === 'scroll' && <ScrollLayout articles={data.articles} />}
      </div>
    </section>
  );
}

function FeatureLayout({ articles, slug }: { articles: Article[]; slug: string }) {
  const [lead, ...others] = articles;
  return (
    <div className="feature">
      <ArticleCard article={lead} showExcerpt imageSizes="(min-width: 64rem) 40vw, 100vw" />
      <div className="feature__list">
        {others.map((a) => (
          <ArticleCard key={a.id} article={a} layout="horizontal" imageSizes="20vw" />
        ))}
      </div>
      <AdSlot size="halfpage" slot={`rail-${slug}`} className="feature__ad" />
    </div>
  );
}

function OpinionLayout({ articles }: { articles: Article[] }) {
  return (
    <div className="opinion">
      {articles.map((a) => (
        <article key={a.id} className="opinion__item">
          <span className="opinion__quote" aria-hidden="true">
            “
          </span>
          <h3 className="opinion__title">
            <a className="headline-link" href={a.url} target="_blank" rel="noopener noreferrer">
              {a.title}
            </a>
          </h3>
          {a.excerpt ? <p className="opinion__excerpt">{a.excerpt}</p> : null}
          <p className="opinion__meta">
            {a.author ? <span className="opinion__author">{a.author}</span> : null}
            <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
          </p>
        </article>
      ))}
    </div>
  );
}

function ScrollLayout({ articles }: { articles: Article[] }) {
  return (
    <div className="scroll" tabIndex={0}>
      {articles.map((a) => (
        <div key={a.id} className="scroll__item">
          <ArticleCard article={a} imageSizes="(min-width: 64rem) 25vw, 70vw" />
        </div>
      ))}
    </div>
  );
}
