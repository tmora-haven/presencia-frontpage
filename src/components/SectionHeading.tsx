import './SectionHeading.css';

interface Props {
  title: string;
  href?: string;
  id: string;
}

export function SectionHeading({ title, href, id }: Props) {
  return (
    <div className="section-heading">
      <h2 id={id} className="section-heading__title">
        {title}
      </h2>
      {href ? (
        <a className="section-heading__more" href={href} target="_blank" rel="noopener noreferrer">
          Ver todo <span aria-hidden="true">→</span>
        </a>
      ) : null}
    </div>
  );
}
