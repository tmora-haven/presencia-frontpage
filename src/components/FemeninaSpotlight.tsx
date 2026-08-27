import { useCategoryFeed } from '../hooks/useWp';
import './FemeninaSpotlight.css';

export const FEMENINA_SLUG = 'presencia-femenina';
const PAGE_URL = 'https://presenciapr.com/presencia-femenina/';

/** Latest Presencia Femenina story as a magenta block beside the print edition. */
export function FemeninaSpotlight() {
  const { data } = useCategoryFeed(FEMENINA_SLUG, 1, []);
  const article = data?.articles[0];
  if (!article) return null;

  return (
    <section className="spot" aria-labelledby="spot-title">
      <div className="spot__inner">
        <a className="spot__media" href={article.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
          {article.image ? (
            <img
              src={article.image.src}
              srcSet={article.image.srcSet}
              sizes="(min-width: 64rem) 12rem, 40vw"
              width={article.image.width || undefined}
              height={article.image.height || undefined}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="spot__placeholder">♀</span>
          )}
        </a>
        <div className="spot__body">
          <a className="spot__brand" href={PAGE_URL} target="_blank" rel="noopener noreferrer">
            <span className="spot__brand-script">presencia</span>
            <span className="spot__brand-word">Femenina</span>
            <span className="spot__brand-mark" aria-hidden="true">♀</span>
          </a>
          {article.category && article.category.slug !== FEMENINA_SLUG ? (
            <span className="spot__kicker">{article.category.name}</span>
          ) : null}
          <h2 id="spot-title" className="spot__title">
            <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
          </h2>
          <a className="spot__cta" href={article.url} target="_blank" rel="noopener noreferrer">
            Leer el artículo <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
