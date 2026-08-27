import './AdSlot.css';

export type AdSize = 'leaderboard' | 'billboard' | 'rectangle' | 'halfpage';

/**
 * IAB sizes per breakpoint (mobile < 48rem ≤ tablet < 66rem ≤ desktop).
 * The rendered block is exactly these pixels — never scaled — so what the
 * client sees is the creative's true footprint.
 */
const SPECS: Record<AdSize, { mobile: string; tablet: string; desktop: string }> = {
  leaderboard: { mobile: '320 × 100', tablet: '728 × 90', desktop: '970 × 90' },
  billboard: { mobile: '300 × 250', tablet: '728 × 90', desktop: '970 × 250' },
  rectangle: { mobile: '300 × 250', tablet: '300 × 250', desktop: '300 × 250' },
  halfpage: { mobile: '300 × 250', tablet: '300 × 250', desktop: '300 × 600' },
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
 * (GPT, Advanced Ads, …); the label and reserved size stay so the layout
 * never shifts when a creative loads.
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
          <span className="ad__spec--mobile">{spec.mobile}</span>
          <span className="ad__spec--tablet">{spec.tablet}</span>
          <span className="ad__spec--desktop">{spec.desktop}</span>
        </span>
      </div>
    </aside>
  );
}
