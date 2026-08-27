import type { Article } from '../lib/types';
import { formatDate } from '../lib/format';
import './ArticleCard.css';

interface Props {
  article: Article;
  layout?: 'vertical' | 'horizontal';
  headingLevel?: 'h3' | 'h4';
  showExcerpt?: boolean;
  imageSizes?: string;
}

export function ArticleCard({
  article,
  layout = 'vertical',
  headingLevel: Heading = 'h3',
  showExcerpt = false,
  imageSizes = '(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw',
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
        {article.category ? <span className="card__kicker">{article.category.name}</span> : null}
        <Heading className="card__title">
          <a className="headline-link" href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </Heading>
        {showExcerpt && article.excerpt ? <p className="card__excerpt">{article.excerpt}</p> : null}
        <time className="card__date" dateTime={article.publishedAt}>
          {formatDate(article.publishedAt)}
        </time>
      </div>
    </article>
  );
}
