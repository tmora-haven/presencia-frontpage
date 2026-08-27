import { useSiteInfo } from '../hooks/useWp';
import { formatToday } from '../lib/format';
import './Masthead.css';

const FALLBACK = { name: 'Periódico Presencia', tagline: 'Tu Regional del Noreste', url: 'https://presenciapr.com' };

export function Masthead() {
  const { data } = useSiteInfo();
  const site = data ?? FALLBACK;

  return (
    <header className="masthead">
      <div className="masthead__bar">
        <div className="container masthead__bar-inner">
          <span>{formatToday()}</span>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="masthead__site">
            {site.name} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="container masthead__brand">
        <a href={site.url} target="_blank" rel="noopener noreferrer" className="masthead__logo">
          <img src="/brand/presencia-logo.png" width={768} height={249} alt={site.name} fetchPriority="high" />
        </a>
        <p className="sr-only">{site.tagline}</p>
      </div>
    </header>
  );
}
