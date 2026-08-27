import { useEffect, useState } from 'react';
import { usePrintEditions } from '../hooks/useWp';
import './FloatingIssue.css';

const DISMISS_KEY = 'presencia.floating-issue.dismissed';

function readDismissed(): string | null {
  try {
    return sessionStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
}

/**
 * Floating call-to-action for the latest print issue. It hides itself while the
 * print section is on screen (no point advertising what the reader is looking
 * at) and can be dismissed for the session — the dismissal is keyed by issue
 * id, so a new edition brings it back.
 */
export function FloatingIssue({ watch = '.print' }: { watch?: string }) {
  const { data } = usePrintEditions(1); // shares the card's single-issue query
  const latest = data?.[0];
  const [dismissed, setDismissed] = useState<string | null>(() => readDismissed());
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    if (!latest || typeof IntersectionObserver === 'undefined') return;
    const target = document.querySelector(watch);
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setSectionVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(target);
    return () => io.disconnect();
  }, [latest, watch]);

  if (!latest || dismissed === String(latest.id)) return null;

  const dismiss = () => {
    setDismissed(String(latest.id));
    try {
      sessionStorage.setItem(DISMISS_KEY, String(latest.id));
    } catch {
      /* storage unavailable: dismissal lasts for this render tree only */
    }
  };

  return (
    <div className={`fab ${sectionVisible ? 'fab--hidden' : ''}`} role="complementary" aria-label="Última edición impresa">
      <a className="fab__link" href={latest.url} target="_blank" rel="noopener noreferrer">
        {latest.cover ? (
          <img
            className="fab__cover"
            src={latest.cover.src}
            srcSet={latest.cover.srcSet}
            sizes="3rem"
            width={latest.cover.width || undefined}
            height={latest.cover.height || undefined}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <span className="fab__text">
          <span className="fab__kicker">¡Ya salió!</span>
          <span className="fab__title">{latest.title}</span>
          <span className="fab__cta">Leer ahora <span aria-hidden="true">→</span></span>
        </span>
      </a>
      <button type="button" className="fab__close" onClick={dismiss} aria-label="Ocultar aviso de la última edición">
        ×
      </button>
    </div>
  );
}
