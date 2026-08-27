import type { Article } from '../lib/types';
import './Kicker.css';

export type KickerMode = 'full' | 'pueblo';

/**
 * "CATEGORÍA · PUEBLO" label shared by every article treatment.
 * `mode="pueblo"` shows only the municipality — used inside sections whose
 * category is already the heading.
 */
export function Kicker({ article, className, mode = 'full' }: { article: Article; className?: string; mode?: KickerMode }) {
  const showCategory = mode === 'full' && Boolean(article.category);
  if (!showCategory && !article.pueblo) return null;
  return (
    <span className={`kicker ${mode === 'pueblo' ? 'kicker--pueblo-only' : ''} ${className ?? ''}`}>
      {showCategory ? <span className="kicker__category">{article.category!.name}</span> : null}
      {article.pueblo ? (
        <span className="kicker__pueblo">
          <span className="kicker__pin" aria-hidden="true" />
          {article.pueblo.name}
        </span>
      ) : null}
    </span>
  );
}
