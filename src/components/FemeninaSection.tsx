import { useCategoryFeed, useChildCategories } from '../hooks/useWp';
import { Kicker } from './Kicker';
import { SectionError, Skeleton } from './SectionState';
import './FemeninaSection.css';

const SLUG = 'presencia-femenina';
const PAGE_URL = 'https://presenciapr.com/presencia-femenina/';
const COUNT = 5;

/**
 * Presencia Femenina is a sub-brand with its own identity on presenciapr.com
 * (magenta + lime, slab-serif headlines, magazine feel). This section carries
 * that identity onto the frontpage instead of the newspaper's black/green.
 */
export function FemeninaSection({ exclude }: { exclude: number[] | undefined }) {
  const feed = useCategoryFeed(SLUG, COUNT, exclude);
  const chips = useChildCategories(feed.data?.category.id, 6);

  if (feed.isPending) {
    return (
      <section className="fem" aria-busy="true" aria-label="Cargando Presencia Femenina">
        <div className="container fem__inner">
          <Skeleton variant="card" count={3} />
        </div>
      </section>
    );
  }
  if (feed.isError) {
    return (
      <section className="fem" aria-label="Presencia Femenina">
        <div className="container">
          <SectionError message={feed.error.message} onRetry={() => feed.refetch()} retrying={feed.isFetching} />
        </div>
      </section>
    );
  }
  if (!feed.data || feed.data.articles.length === 0) return null;

  const [lead, ...rest] = feed.data.articles;

  return (
    <section className="fem" aria-labelledby="fem-title">
      <div className="container fem__inner">
        <header className="fem__head">
          <a href={PAGE_URL} target="_blank" rel="noopener noreferrer" className="fem__logo">
            <img src="/brand/presencia-femenina-logo.png" width={768} height={258} alt="" loading="lazy" decoding="async" />
            <h2 id="fem-title" className="sr-only">Presencia Femenina</h2>
          </a>
          <p className="fem__tagline">Moda, arte, bienestar e historias que inspiran</p>
          {chips.data && chips.data.length > 0 ? (
            <ul className="fem__chips" aria-label="Temas de Presencia Femenina">
              {chips.data.map((c) => (
                <li key={c.id}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <article className="fem__lead">
          <a className="fem__lead-media" href={lead.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
            {lead.image ? (
              <img
                src={lead.image.src}
                srcSet={lead.image.srcSet}
                sizes="(min-width: 64rem) 45vw, 100vw"
                width={lead.image.width || undefined}
                height={lead.image.height || undefined}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="fem__placeholder" />
            )}
          </a>
          <div className="fem__lead-body">
            <Kicker article={lead} className="fem__kicker" />
            <h3 className="fem__lead-title">
              <a href={lead.url} target="_blank" rel="noopener noreferrer">{lead.title}</a>
            </h3>
            {lead.excerpt ? <p className="fem__excerpt">{lead.excerpt}</p> : null}
            {lead.author ? <p className="fem__meta">{lead.author}</p> : null}
          </div>
        </article>

        {rest.length > 0 ? (
          <div className="fem__grid">
            {rest.map((a) => (
              <article key={a.id} className="fem__card">
                <a className="fem__card-media" href={a.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                  {a.image ? (
                    <img
                      src={a.image.src}
                      srcSet={a.image.srcSet}
                      sizes="(min-width: 64rem) 14vw, 45vw"
                      width={a.image.width || undefined}
                      height={a.image.height || undefined}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="fem__placeholder" />
                  )}
                </a>
                <Kicker article={a} className="fem__kicker" />
                <h3 className="fem__card-title">
                  <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
                </h3>
              </article>
            ))}
          </div>
        ) : null}

        <a className="fem__cta" href={PAGE_URL} target="_blank" rel="noopener noreferrer">
          Entrar a Presencia Femenina <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
