import { useLatest } from '../hooks/useWp';
import { formatDate, formatTime } from '../lib/format';
import { ArticleCard } from './ArticleCard';
import { SectionHeading } from './SectionHeading';
import { SectionError, Skeleton } from './SectionState';
import './LeadStories.css';

/**
 * Hero (latest story) + "Últimas noticias" grid.
 * Both consume the same query, so TanStack Query issues a single request.
 */
export function LeadStories() {
  const { data, isPending, isError, error, refetch, isFetching } = useLatest();

  if (isPending) {
    return (
      <section className="lead" aria-busy="true" aria-label="Cargando portada">
        <div className="lead__hero">
          <Skeleton variant="hero" />
          <div>
            <Skeleton variant="line" count={3} />
          </div>
        </div>
        <div className="lead__grid">
          <Skeleton variant="card" count={4} />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="lead">
        <SectionError message={error.message} onRetry={() => refetch()} retrying={isFetching} />
      </section>
    );
  }

  const [hero, ...rest] = data;
  if (!hero) return null;

  return (
    <>
      <section className="lead__hero" aria-labelledby="hero-title">
        <a
          className="lead__hero-media"
          href={hero.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
        >
          {hero.image ? (
            <img
              src={hero.image.src}
              srcSet={hero.image.srcSet}
              sizes="(min-width: 64rem) 60vw, 100vw"
              width={hero.image.width || undefined}
              height={hero.image.height || undefined}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div className="lead__hero-placeholder" />
          )}
        </a>
        <div className="lead__hero-body">
          {hero.category ? <span className="lead__kicker">{hero.category.name}</span> : null}
          <h1 id="hero-title" className="lead__title">
            <a className="headline-link" href={hero.url} target="_blank" rel="noopener noreferrer">
              {hero.title}
            </a>
          </h1>
          {hero.excerpt ? <p className="lead__excerpt">{hero.excerpt}</p> : null}
          <p className="lead__meta">
            {hero.author ? <span>{hero.author} · </span> : null}
            <time dateTime={hero.publishedAt}>
              {formatDate(hero.publishedAt)}, {formatTime(hero.publishedAt)}
            </time>
          </p>
        </div>
      </section>

      {rest.length > 0 ? (
        <section className="lead__latest" aria-labelledby="latest-title">
          <SectionHeading id="latest-title" title="Últimas noticias" href="https://presenciapr.com/" />
          <div className="lead__grid">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
