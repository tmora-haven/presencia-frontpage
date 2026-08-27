import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Article } from '../lib/types';
import { formatDate, formatTime } from '../lib/format';
import './FeaturedSlideshow.css';

const AUTOPLAY_MS = 6000;

interface Props {
  articles: Article[];
  /** Heading level for the active slide's title (h1 on the frontpage). */
  titleAs?: 'h1' | 'h2';
}

/**
 * Accessible carousel (WAI-ARIA "carousel" pattern):
 *  - region with aria-roledescription, slides as role="group"
 *  - prev/next + dot buttons, ←/→ keys while focused
 *  - autoplay pauses on hover/focus and is disabled under prefers-reduced-motion
 *  - inactive slides are aria-hidden and un-tabbable
 */
export function FeaturedSlideshow({ articles, titleAs: Title = 'h1' }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);
  const id = useId();
  const count = articles.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    reduceMotion.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reduceMotion.current) return;
    const t = window.setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [count, paused, index, go]);

  if (count === 0) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1);
    if (e.key === 'ArrowLeft') go(index - 1);
  };

  return (
    <section
      className="slides"
      aria-roledescription="carrusel"
      aria-label="Noticias destacadas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKey}
    >
      <div className="slides__viewport">
        <div className="slides__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {articles.map((a, i) => {
            const active = i === index;
            return (
              <article
                key={a.id}
                id={`${id}-slide-${i}`}
                className="slide"
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${count}`}
                aria-hidden={!active}
                // @ts-expect-error inert is valid HTML; React types lag behind
                inert={active ? undefined : ''}
              >
                <a className="slide__media" href={a.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                  {a.image ? (
                    <img
                      src={a.image.src}
                      srcSet={a.image.srcSet}
                      sizes="(min-width: 64rem) 66vw, 100vw"
                      width={a.image.width || undefined}
                      height={a.image.height || undefined}
                      alt=""
                      loading={i === 0 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 ? 'high' : undefined}
                      decoding="async"
                    />
                  ) : (
                    <div className="slide__placeholder" />
                  )}
                </a>
                <div className="slide__body">
                  <span className="slide__kicker">
                    <span className="slide__star" aria-hidden="true">★</span> Destacada
                    {a.category ? <> · {a.category.name}</> : null}
                  </span>
                  {active ? (
                    <Title id="hero-title" className="slide__title">
                      <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
                    </Title>
                  ) : (
                    <p className="slide__title">
                      <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
                    </p>
                  )}
                  {a.excerpt ? <p className="slide__excerpt">{a.excerpt}</p> : null}
                  <p className="slide__meta">
                    {a.author ? <span>{a.author} · </span> : null}
                    <time dateTime={a.publishedAt}>
                      {formatDate(a.publishedAt)}, {formatTime(a.publishedAt)}
                    </time>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {count > 1 ? (
        <div className="slides__controls">
          <button type="button" className="slides__arrow" onClick={() => go(index - 1)} aria-label="Anterior">
            ‹
          </button>
          <div className="slides__dots" role="tablist" aria-label="Seleccionar noticia">
            {articles.map((a, i) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                className="slides__dot"
                aria-selected={i === index}
                aria-controls={`${id}-slide-${i}`}
                aria-label={`Noticia ${i + 1}: ${a.title}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <span className="slides__counter" aria-live="polite">
            {index + 1} / {count}
          </span>
          <button type="button" className="slides__arrow" onClick={() => go(index + 1)} aria-label="Siguiente">
            ›
          </button>
        </div>
      ) : null}
    </section>
  );
}
