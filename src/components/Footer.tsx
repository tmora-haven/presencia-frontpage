import { useSiteInfo, useSiteLinks, useTopCategories } from '../hooks/useWp';
import { FOOTER_SLUGS } from '../lib/siteLinks';
import './Footer.css';

export function Footer() {
  const { data: site } = useSiteInfo();
  const { data: links } = useSiteLinks(FOOTER_SLUGS);
  const { data: categories } = useTopCategories(9);
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__name">{site?.name ?? 'Periódico Presencia'}</p>
          <p className="footer__tagline">{site?.tagline ?? 'Tu Regional del Noreste'}</p>
        </div>
        {categories && categories.length > 0 ? (
          <nav aria-label="Secciones (pie)">
            <p className="footer__heading">Secciones</p>
            <ul className="footer__links footer__links--columns">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        {links && links.length > 0 ? (
          <nav aria-label="Enlaces del sitio">
            <p className="footer__heading">Presencia</p>
            <ul className="footer__links">
              {links.map((link) => (
                <li key={link.id}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      <div className="container footer__legal">
        <p>
          © {year} {site?.name ?? 'Periódico Presencia'}. Contenido servido en vivo desde la API REST de WordPress.
        </p>
        <p>Portada React de demostración · Monotu</p>
      </div>
    </footer>
  );
}
