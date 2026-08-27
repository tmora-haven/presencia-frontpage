import { useCategoryFeed } from '../hooks/useWp';
import type { Article, ArticleImage } from '../lib/types';
import { SectionError, Skeleton } from './SectionState';
import './PalabraSection.css';

const SLUG = 'la-palabra-del-dia';
const COUNT = 3;

const dayBadge = new Intl.DateTimeFormat('es-PR', { day: 'numeric', timeZone: 'America/Puerto_Rico' });
const monthBadge = new Intl.DateTimeFormat('es-PR', { month: 'short', timeZone: 'America/Puerto_Rico' });

function Thumb({ image, url, sizes, className }: { image: ArticleImage | null; url: string; sizes: string; className: string }) {
  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
      {image ? (
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          width={image.width || undefined}
          height={image.height || undefined}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="palabra__placeholder">✦</span>
      )}
    </a>
  );
}

function DateBadge({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <time className="palabra__badge" dateTime={iso}>
      <span className="palabra__badge-day">{dayBadge.format(d)}</span>
      <span className="palabra__badge-month">{monthBadge.format(d).replace('.', '')}</span>
    </time>
  );
}

/**
 * "La Palabra del Día" is a weekly devotional column with no featured images,
 * so this section is typographic: a warm band, a large reflective lead with
 * pull-quote styling, and two earlier reflections as a compact list.
 */
export function PalabraSection({ exclude }: { exclude: number[] | undefined }) {
  const { data, isPending, isError, error, refetch, isFetching } = useCategoryFeed(SLUG, COUNT, exclude);

  if (isPending) {
    return (
      <section className="palabra" aria-busy="true" aria-label="Cargando La Palabra del Día">
        <div className="container">
          <Skeleton variant="line" count={4} />
        </div>
      </section>
    );
  }
  if (isError) {
    return (
      <section className="palabra" aria-label="La Palabra del Día">
        <div className="container">
          <SectionError message={error.message} onRetry={() => refetch()} retrying={isFetching} />
        </div>
      </section>
    );
  }
  if (!data || data.articles.length === 0) return null;

  const [lead, ...previous] = data.articles;

  return (
    <section className="palabra" aria-labelledby="palabra-title">
      <div className="container palabra__inner">
        <header className="palabra__head">
          <span className="palabra__ornament" aria-hidden="true">✦</span>
          <h2 id="palabra-title" className="palabra__title">{data.category.name}</h2>
          <p className="palabra__sub">Reflexión semanal</p>
        </header>

        <Lead article={lead} />

        {previous.length > 0 ? (
          <div className="palabra__previous">
            <p className="palabra__previous-title">Reflexiones anteriores</p>
            <ul className="palabra__list">
              {previous.map((a) => (
                <li key={a.id}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    <Thumb image={a.image} url={a.url} sizes="6rem" className="palabra__list-thumb" />
                    <span className="palabra__list-text">
                      <DateBadge iso={a.publishedAt} />
                      <span className="palabra__list-headline">{a.title}</span>
                      {a.author ? <span className="palabra__list-author">{a.author}</span> : null}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <a className="palabra__cta" href={`https://presenciapr.com/category/${data.category.slug}/`} target="_blank" rel="noopener noreferrer">
          Todas las reflexiones <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

function Lead({ article }: { article: Article }) {
  return (
    <article className="palabra__lead">
      <Thumb image={article.image} url={article.url} sizes="(min-width: 64rem) 30vw, 100vw" className="palabra__lead-media" />
      <div className="palabra__lead-body">
        <DateBadge iso={article.publishedAt} />
        <h3 className="palabra__lead-title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
        </h3>
        {article.excerpt ? (
          <div className="palabra__quote-wrap">
            <p className="palabra__quote">{article.excerpt}</p>
          </div>
        ) : null}
        <p className="palabra__meta">
          {article.author ? <span className="palabra__author">{article.author}</span> : null}
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="palabra__read">
            Leer la reflexión
          </a>
        </p>
      </div>
    </article>
  );
}
