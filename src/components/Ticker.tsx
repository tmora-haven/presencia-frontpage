import { useLatest } from '../hooks/useWp';
import { formatTime } from '../lib/format';
import './Ticker.css';

/** Scrolling "Último minuto" strip. Shares the latest-posts query with the hero. */
export function Ticker() {
  const { data } = useLatest();
  if (!data || data.length === 0) return null;

  const items = data.slice(0, 8);
  const list = (hidden: boolean) => (
    <ul className="ticker__list" aria-hidden={hidden || undefined}>
      {items.map((a) => (
        <li key={a.id}>
          <a href={a.url} target="_blank" rel="noopener noreferrer" tabIndex={hidden ? -1 : undefined}>
            <time dateTime={a.publishedAt}>{formatTime(a.publishedAt)}</time>
            {a.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="ticker" aria-label="Último minuto">
      <span className="ticker__badge">
        <span className="ticker__dot" aria-hidden="true" />
        Último minuto
      </span>
      <div className="ticker__viewport">
        <div className="ticker__track">
          {list(false)}
          {list(true)}
        </div>
      </div>
    </div>
  );
}
