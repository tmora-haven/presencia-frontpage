import type { Article } from '../lib/types';
import { Kicker, type KickerMode } from './Kicker';
import './ArticleCard.css';

interface Props {
  article: Article;
  layout?: 'vertical' | 'horizontal';
  headingLevel?: 'h3' | 'h4';
  showExcerpt?: boolean;
  imageSizes?: string;
  kicker?: KickerMode;
}

export function ArticleCard({
  article,
  layout = 'vertical',
  headingLevel: Heading = 'h3',
  showExcerpt = false,
  imageSizes = '(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw',
  kicker = 'full',
}: Props) {
  return (
    <article className={`card card--${layout}`}>
      <a
        className="card__media"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
      >
        {article.image ? (
          <img
            src={article.image.src}
            srcSet={article.image.srcSet}
            sizes={imageSizes}
            width={article.image.width || undefined}
            height={article.image.height || undefined}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="card__placeholder" />
        )}
      </a>
      <div className="card__body">
        <Kicker article={article} mode={kicker} />
        <Heading className="card__title">
          <a className="headline-link" href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </Heading>
        {showExcerpt && article.excerpt ? <p className="card__excerpt">{article.excerpt}</p> : null}
      </div>
    </article>
  );
}
