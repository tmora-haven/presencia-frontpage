import { BENTO_COUNT, BENTO_SLUG, useCategoryFeed, useFeatured, useLatest } from '../hooks/useWp';
import { AdSlot } from './AdSlot';
import { ArticleCard } from './ArticleCard';
import { FeaturedSlideshow } from './FeaturedSlideshow';
import { Kicker } from './Kicker';
import { FemeninaSpotlight } from './FemeninaSpotlight';
import { PrintEdition } from './PrintEdition';
import { SectionBoundary } from './SectionBoundary';
import { SectionHeading } from './SectionHeading';
import { SectionError, Skeleton } from './SectionState';
import './LeadStories.css';

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
  // Bento: Regionales, minus anything already shown in the side list or the slideshow.
  const bentoExclude =
    data !== undefined && (featured.data !== undefined || featured.isError)
      ? [...data, ...(featured.data ?? [])].map((a) => a.id)
      : undefined;
  const bento = useCategoryFeed(BENTO_SLUG, BENTO_COUNT, bentoExclude);

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
  const side = data;
  // Featured still loading → hold the slot with a skeleton; failed/empty → promote the latest story.
  const slides = featured.data && featured.data.length > 0 ? featured.data : featured.isPending ? null : data.slice(0, 1);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__main-col">
          {slides ? <FeaturedSlideshow articles={slides} /> : <div className="hero__main" aria-busy="true"><Skeleton variant="hero" /></div>}
          <div className="hero__blocks">
            <SectionBoundary>
              <PrintEdition card />
            </SectionBoundary>
            <SectionBoundary>
              <FemeninaSpotlight />
            </SectionBoundary>
          </div>
        </div>

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

      {bento.isPending ? (
        <section className="latest" aria-busy="true" aria-label="Cargando Regionales">
          <div className="bento">
            <Skeleton variant="card" count={4} />
          </div>
        </section>
      ) : bento.isError ? (
        <section className="latest" aria-labelledby="latest-title">
          <SectionHeading id="latest-title" title="Regionales" />
          <SectionError message={bento.error.message} onRetry={() => bento.refetch()} retrying={bento.isFetching} />
        </section>
      ) : bento.data && bento.data.articles.length > 0 ? (
        <section className="latest" aria-labelledby="latest-title">
          <SectionHeading
            id="latest-title"
            title={bento.data.category.name}
            href={`https://presenciapr.com/category/${bento.data.category.slug}/`}
          />
          <div className="bento">
            {bento.data.articles.map((article, i) => {
              const card = (
                <ArticleCard
                  key={article.id}
                  article={article}
                  showExcerpt={i === 0}
                  imageSizes={i === 0 ? '(min-width: 64rem) 50vw, 100vw' : '(min-width: 64rem) 25vw, 50vw'}
                  kicker="pueblo"
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
