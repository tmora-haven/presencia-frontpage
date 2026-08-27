import { useCategoryFeed } from '../hooks/useWp';
import type { Article } from '../lib/types';
import { Kicker } from './Kicker';
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
  /** Leave out posts that also belong to this category (avoids cross-section duplicates). */
  excludeCategorySlug?: string;
}

const CATEGORY_BASE = 'https://presenciapr.com/category/';

/**
 * One data hook, three presentations:
 *  - feature: lead story + list + a half-page ad sidebar
 *  - opinion: text-first, tinted band with oversized quote marks (for Editorial)
 *  - scroll:  horizontal snap-scroll cards on small screens, 4-up on desktop
 */
export function CategoryRail({ slug, label, variant = 'feature', count, exclude, excludeCategorySlug }: Props) {
  const { data, isPending, isError, error, refetch, isFetching } = useCategoryFeed(slug, count, exclude, excludeCategorySlug);
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
        {variant === 'scroll' && <ScrollLayout articles={data.articles} slug={slug} />}
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
          <a className="opinion__media" href={a.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
            {a.image ? (
              <img
                src={a.image.src}
                srcSet={a.image.srcSet}
                sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 45vw, 100vw"
                width={a.image.width || undefined}
                height={a.image.height || undefined}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="opinion__placeholder" />
            )}
            <span className="opinion__quote" aria-hidden="true">
              “
            </span>
          </a>
          <Kicker article={a} />
          <h3 className="opinion__title">
            <a className="headline-link" href={a.url} target="_blank" rel="noopener noreferrer">
              {a.title}
            </a>
          </h3>
          {a.excerpt ? <p className="opinion__excerpt">{a.excerpt}</p> : null}
          {a.author ? <p className="opinion__meta"><span className="opinion__author">{a.author}</span></p> : null}
        </article>
      ))}
    </div>
  );
}

function ScrollLayout({ articles, slug }: { articles: Article[]; slug: string }) {
  return (
    <div className="scroll" tabIndex={0}>
      {articles.map((a) => (
        <div key={a.id} className="scroll__item">
          <ArticleCard article={a} imageSizes="(min-width: 64rem) 25vw, 70vw" />
        </div>
      ))}
      <div className="scroll__item scroll__item--ad">
        <AdSlot size="rectangle" slot={`rail-${slug}`} />
      </div>
    </div>
  );
}
