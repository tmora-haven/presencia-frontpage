import { useRef } from 'react';
import { PRINT_COUNT, usePrintEditions } from '../hooks/useWp';
import { formatDate } from '../lib/format';
import './PreviousEditions.css';

const ARCHIVE_URL = 'https://presenciapr.com/impreso/';

/** Archive strip of the ten editions before the current one; sits just above the footer. */
export function PreviousEditions() {
  const { data } = usePrintEditions(PRINT_COUNT);
  const strip = useRef<HTMLUListElement>(null);
  const previous = data?.slice(1) ?? [];
  if (previous.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="editions" aria-labelledby="editions-title">
      <div className="container">
        <div className="editions__head">
          <div>
            <h2 id="editions-title" className="editions__title">Ediciones anteriores</h2>
            <p className="editions__sub">El archivo semanal de Presencia, listo para leer en digital.</p>
          </div>
          <div className="editions__nav">
            <a className="editions__archive" href={ARCHIVE_URL} target="_blank" rel="noopener noreferrer">
              Archivo completo <span aria-hidden="true">→</span>
            </a>
            <button type="button" className="editions__arrow" onClick={() => scroll(-1)} aria-label="Ediciones más recientes">
              ‹
            </button>
            <button type="button" className="editions__arrow" onClick={() => scroll(1)} aria-label="Ediciones más antiguas">
              ›
            </button>
          </div>
        </div>
        <ul className="editions__strip" ref={strip} aria-label="Ediciones anteriores">
          {previous.map((e) => (
            <li key={e.id} className="editions__item">
              <a href={e.url} target="_blank" rel="noopener noreferrer" className="editions__link">
                <span className="editions__cover">
                  {e.cover ? (
                    <img
                      src={e.cover.src}
                      srcSet={e.cover.srcSet}
                      sizes="10rem"
                      width={e.cover.width || undefined}
                      height={e.cover.height || undefined}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="editions__placeholder">{e.title}</span>
                  )}
                </span>
                <span className="editions__name">{e.title}</span>
                <time className="editions__date" dateTime={e.publishedAt}>{formatDate(e.publishedAt)}</time>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
