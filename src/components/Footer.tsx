import { useSiteInfo, useSiteLinks } from '../hooks/useWp';
import './Footer.css';

const FOOTER_SLUGS = ['mision', 'contacto', 'media-kit', 'terminos-y-condiciones'];

export function Footer() {
  const { data: site } = useSiteInfo();
  const { data: links } = useSiteLinks(FOOTER_SLUGS);
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__name">{site?.name ?? 'Periódico Presencia'}</p>
          <p className="footer__tagline">{site?.tagline ?? 'Tu Regional del Noreste'}</p>
        </div>
        {links && links.length > 0 ? (
          <nav aria-label="Enlaces del sitio">
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
