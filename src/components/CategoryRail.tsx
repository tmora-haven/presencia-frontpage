import { useCategoryFeed } from '../hooks/useWp';
import { ArticleCard } from './ArticleCard';
import { SectionHeading } from './SectionHeading';
import { SectionError, Skeleton } from './SectionState';
import './CategoryRail.css';

interface Props {
  slug: string;
  /** Fallback label while the category name loads. */
  label: string;
  exclude: number[] | undefined;
}

export function CategoryRail({ slug, label, exclude }: Props) {
  const { data, isPending, isError, error, refetch, isFetching } = useCategoryFeed(slug, undefined, exclude);
  const headingId = `rail-${slug}`;

  if (isPending) {
    return (
      <section className="rail" aria-busy="true" aria-labelledby={headingId}>
        <SectionHeading id={headingId} title={label} />
        <div className="rail__grid">
          <Skeleton variant="card" count={4} />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rail" aria-labelledby={headingId}>
        <SectionHeading id={headingId} title={label} />
        <SectionError message={error.message} onRetry={() => refetch()} retrying={isFetching} />
      </section>
    );
  }

  // Category missing on this install, or no posts: render nothing rather than an empty shell.
  if (!data || data.articles.length === 0) return null;

  const [lead, ...others] = data.articles;

  return (
    <section className="rail" aria-labelledby={headingId}>
      <SectionHeading
        id={headingId}
        title={data.category.name}
        href={`https://presenciapr.com/category/${data.category.slug}/`}
      />
      <div className="rail__layout">
        <ArticleCard article={lead} showExcerpt imageSizes="(min-width: 64rem) 40vw, 100vw" />
        <div className="rail__list">
          {others.map((article) => (
            <ArticleCard key={article.id} article={article} layout="horizontal" imageSizes="20vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
