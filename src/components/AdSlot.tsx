import './AdSlot.css';

export type AdSize = 'leaderboard' | 'billboard' | 'rectangle' | 'halfpage';

const SPECS: Record<AdSize, { desktop: string; mobile: string }> = {
  leaderboard: { desktop: '970 × 90', mobile: '320 × 100' },
  billboard: { desktop: '970 × 250', mobile: '300 × 250' },
  rectangle: { desktop: '300 × 250', mobile: '300 × 250' },
  halfpage: { desktop: '300 × 600', mobile: '300 × 250' },
};

interface Props {
  size: AdSize;
  /** Stable identifier for the slot (what an ad server would target). */
  slot: string;
  className?: string;
}

/**
 * Generic, clearly-labelled advertising placeholder.
 * In production the inner block would be replaced by the ad server's tag
 * (GPT, Advanced Ads, …); the label, sizing and reserved space stay so the
 * layout never shifts when a creative loads.
 */
export function AdSlot({ size, slot, className }: Props) {
  const spec = SPECS[size];
  return (
    <aside className={`ad ad--${size} ${className ?? ''}`} aria-label="Publicidad" data-ad-slot={slot}>
      <span className="ad__label">Publicidad</span>
      <div className="ad__block">
        <span className="ad__mark" aria-hidden="true">
          AD
        </span>
        <span className="ad__text">Espacio publicitario</span>
        <span className="ad__spec">
          <span className="ad__spec-desktop">{spec.desktop}</span>
          <span className="ad__spec-mobile">{spec.mobile}</span>
        </span>
      </div>
    </aside>
  );
}
