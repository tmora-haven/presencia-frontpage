import { useFeatured, useLatest } from '../hooks/useWp';
import { AdSlot } from './AdSlot';
import { ArticleCard } from './ArticleCard';
import { FeaturedSlideshow } from './FeaturedSlideshow';
import { Kicker } from './Kicker';
import { SectionHeading } from './SectionHeading';
import { SectionError, Skeleton } from './SectionState';
import './LeadStories.css';

const HERO_SIDE = 4; // numbered "Lo más reciente" list next to the hero
const BENTO_AD_INDEX = 2; // where the rectangle ad sits inside the bento grid

/**
 * Featured slideshow (tag "noticias destacadas") + numbered "Lo más reciente"
 * list + bento grid of the latest news. The slideshow has its own query; if
 * the tag is empty or fails, the latest story is promoted to a single slide so
 * the frontpage never loses its lead.
 */
export function LeadStories() {
  const { data, isPending, isError, error, refetch, isFetching } = useLatest();
  const featured = useFeatured();

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

  if (data.length === 0) return null;
  const side = data.slice(0, HERO_SIDE);
  const bento = data.slice(HERO_SIDE);
  // Featured still loading → hold the slot with a skeleton; failed/empty → promote the latest story.
  const slides = featured.data && featured.data.length > 0 ? featured.data : featured.isPending ? null : data.slice(0, 1);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        {slides ? <FeaturedSlideshow articles={slides} /> : <div className="hero__main" aria-busy="true"><Skeleton variant="hero" /></div>}

        {side.length > 0 ? (
          <aside className="hero__side" aria-label="Lo más reciente">
            <p className="hero__side-title">Lo más reciente</p>
            <ol className="hero__side-list">
              {side.map((a) => (
                <li key={a.id}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    <Kicker article={a} />
                    <span className="hero__side-headline">{a.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            <AdSlot size="rectangle" slot="portada-lateral" className="hero__side-ad" />
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
