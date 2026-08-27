import './SectionState.css';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
}

/** Inline, per-section error UI. One failing section never blanks the page. */
export function SectionError({ message, onRetry, retrying }: ErrorProps) {
  return (
    <div className="section-state section-state--error" role="alert">
      <p className="section-state__title">No se pudo cargar esta sección.</p>
      {message ? <p className="section-state__detail">{message}</p> : null}
      {onRetry ? (
        <button type="button" className="section-state__retry" onClick={onRetry} disabled={retrying}>
          {retrying ? 'Reintentando…' : 'Reintentar'}
        </button>
      ) : null}
    </div>
  );
}

interface SkeletonProps {
  variant: 'hero' | 'card' | 'line';
  count?: number;
}

export function Skeleton({ variant, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`skeleton skeleton--${variant}`} aria-hidden="true" />
      ))}
    </>
  );
}
