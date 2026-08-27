import type { Article } from '../lib/types';
import './Kicker.css';

/** "CATEGORÍA · PUEBLO" label shared by every article treatment. */
export function Kicker({ article, className }: { article: Article; className?: string }) {
  if (!article.category && !article.pueblo) return null;
  return (
    <span className={`kicker ${className ?? ''}`}>
      {article.category ? <span className="kicker__category">{article.category.name}</span> : null}
      {article.pueblo ? (
        <span className="kicker__pueblo">
          <span className="kicker__pin" aria-hidden="true" />
          {article.pueblo.name}
        </span>
      ) : null}
    </span>
  );
}
