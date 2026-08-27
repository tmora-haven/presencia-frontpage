import { usePrintEditions } from '../hooks/useWp';
import { formatDate } from '../lib/format';
import './PrintEdition.css';

/** Latest issue from the `impreso` custom post type. Hidden entirely on error/empty. */
export function PrintEdition() {
  const { data } = usePrintEditions(1);
  const edition = data?.[0];
  if (!edition) return null;

  return (
    <section className="print" aria-labelledby="print-title">
      <div className="print__inner">
        {edition.cover ? (
          <a href={edition.url} target="_blank" rel="noopener noreferrer" className="print__cover" tabIndex={-1} aria-hidden="true">
            <img
              src={edition.cover.src}
              srcSet={edition.cover.srcSet}
              sizes="(min-width: 40rem) 14rem, 60vw"
              width={edition.cover.width || undefined}
              height={edition.cover.height || undefined}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </a>
        ) : null}
        <div className="print__body">
          <span className="print__kicker">Edición impresa</span>
          <h2 id="print-title" className="print__title">
            {edition.title}
          </h2>
          <p className="print__date">
            <time dateTime={edition.publishedAt}>{formatDate(edition.publishedAt)}</time>
          </p>
          <a className="print__cta" href={edition.url} target="_blank" rel="noopener noreferrer">
            Leer la edición digital
          </a>
        </div>
      </div>
    </section>
  );
}
