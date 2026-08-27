import { useRef } from 'react';
import { usePrintEditions } from '../hooks/useWp';
import type { PrintEdition as Edition } from '../lib/types';
import { formatDate } from '../lib/format';
import './PrintEdition.css';

const ARCHIVE_URL = 'https://presenciapr.com/impreso/';

/**
 * Print editions (custom post type `impreso`): the current issue is the hero,
 * the ten previous issues sit in a snap-scrolling strip with prev/next controls.
 * Hidden entirely on error/empty — it's a bonus, not a dependency.
 */
export function PrintEdition() {
  const { data } = usePrintEditions();
  const strip = useRef<HTMLUListElement>(null);
  if (!data || data.length === 0) return null;

  const [current, ...previous] = data;

  const scroll = (dir: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="print" aria-labelledby="print-title">
      <div className="print__inner">
        <div className="print__current">
          <Cover edition={current} sizes="(min-width: 40rem) 16rem, 60vw" eager />
          <div className="print__body">
            <span className="print__kicker">
              <span className="print__pulse" aria-hidden="true" />
              Edición impresa · esta semana
            </span>
            <h2 id="print-title" className="print__title">
              {current.title}
            </h2>
            <p className="print__date">
              <time dateTime={current.publishedAt}>{formatDate(current.publishedAt)}</time>
            </p>
            <p className="print__blurb">
              La edición semanal completa, tal como llega a los hogares del Noreste, gratis y en formato digital.
            </p>
            <div className="print__actions">
              <a className="print__cta" href={current.url} target="_blank" rel="noopener noreferrer">
                Leer la edición digital
              </a>
              <a className="print__archive" href={ARCHIVE_URL} target="_blank" rel="noopener noreferrer">
                Archivo de ediciones <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {previous.length > 0 ? (
          <div className="print__previous">
            <div className="print__previous-head">
              <p className="print__previous-title">Ediciones anteriores</p>
              <div className="print__nav">
                <button type="button" className="print__arrow" onClick={() => scroll(-1)} aria-label="Ediciones más recientes">
                  ‹
                </button>
                <button type="button" className="print__arrow" onClick={() => scroll(1)} aria-label="Ediciones más antiguas">
                  ›
                </button>
              </div>
            </div>
            <ul className="print__strip" ref={strip} aria-label="Ediciones anteriores">
              {previous.map((e) => (
                <li key={e.id} className="print__item">
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="print__item-link">
                    <Cover edition={e} sizes="9rem" />
                    <span className="print__item-title">{e.title}</span>
                    <time className="print__item-date" dateTime={e.publishedAt}>
                      {formatDate(e.publishedAt)}
                    </time>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Cover({ edition, sizes, eager }: { edition: Edition; sizes: string; eager?: boolean }) {
  const cover = edition.cover;
  const Wrapper = eager ? 'a' : 'span';
  return (
    <Wrapper
      className="print__cover"
      {...(eager ? { href: edition.url, target: '_blank', rel: 'noopener noreferrer', tabIndex: -1, 'aria-hidden': true } : {})}
    >
      {cover ? (
        <img
          src={cover.src}
          srcSet={cover.srcSet}
          sizes={sizes}
          width={cover.width || undefined}
          height={cover.height || undefined}
          alt=""
          loading={eager ? undefined : 'lazy'}
          decoding="async"
        />
      ) : (
        <span className="print__cover-placeholder">{edition.title}</span>
      )}
    </Wrapper>
  );
}
