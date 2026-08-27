import { useLatest } from '../hooks/useWp';
import { formatDate, formatTime } from '../lib/format';
import { AdSlot } from './AdSlot';
import { ArticleCard } from './ArticleCard';
import { SectionHeading } from './SectionHeading';
import { SectionError, Skeleton } from './SectionState';
import './LeadStories.css';

const HERO_SIDE = 4; // numbered "Lo más reciente" list next to the hero
const BENTO_AD_INDEX = 2; // where the rectangle ad sits inside the bento grid

/**
 * Hero (latest story, headline over image) + numbered side list + bento grid.
 * Everything here consumes one query, so TanStack Query issues one request.
 */
export function LeadStories() {
  const { data, isPending, isError, error, refetch, isFetching } = useLatest();

  if (isPending) {
    return (
      <section className="lead" aria-busy="true" aria-label="Cargando portada">
        <div className="hero">
          <Skeleton variant="hero" />
          <div>
            <Skeleton variant="line" count={6} />
          </div>
        </div>
        <div className="bento">
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
  const side = rest.slice(0, HERO_SIDE);
  const bento = rest;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <article className="hero__main">
          <a className="hero__media" href={hero.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
            {hero.image ? (
              <img
                src={hero.image.src}
                srcSet={hero.image.srcSet}
                sizes="(min-width: 64rem) 66vw, 100vw"
                width={hero.image.width || undefined}
                height={hero.image.height || undefined}
                alt=""
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div className="hero__placeholder" />
            )}
          </a>
          <div className="hero__body">
            {hero.category ? <span className="hero__kicker">{hero.category.name}</span> : null}
            <h1 id="hero-title" className="hero__title">
              <a href={hero.url} target="_blank" rel="noopener noreferrer">
                {hero.title}
              </a>
            </h1>
            {hero.excerpt ? <p className="hero__excerpt">{hero.excerpt}</p> : null}
            <p className="hero__meta">
              {hero.author ? <span>{hero.author} · </span> : null}
              <time dateTime={hero.publishedAt}>
                {formatDate(hero.publishedAt)}, {formatTime(hero.publishedAt)}
              </time>
            </p>
          </div>
        </article>

        {side.length > 0 ? (
          <aside className="hero__side" aria-label="Lo más reciente">
            <p className="hero__side-title">Lo más reciente</p>
            <ol className="hero__side-list">
              {side.map((a) => (
                <li key={a.id}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    {a.category ? <span className="hero__side-kicker">{a.category.name}</span> : null}
                    <span className="hero__side-headline">{a.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        ) : null}
      </section>

      {bento.length > 0 ? (
        <section className="latest" aria-labelledby="latest-title">
          <SectionHeading id="latest-title" title="Últimas noticias" href="https://presenciapr.com/" />
          <div className="bento">
            {bento.map((article, i) => {
              const card = (
                <ArticleCard
                  key={article.id}
                  article={article}
                  showExcerpt={i === 0}
                  imageSizes={i === 0 ? '(min-width: 64rem) 50vw, 100vw' : '(min-width: 64rem) 25vw, 50vw'}
                />
              );
              if (i !== BENTO_AD_INDEX) return card;
              return [card, <AdSlot key="ad-bento" size="rectangle" slot="portada-bento" className="bento__ad" />];
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
