import { useEffect, useId, useState } from 'react';
import { useSiteLinks, useTopCategories } from '../hooks/useWp';
import { FOOTER_SLUGS } from '../lib/siteLinks';
import './NavBar.css';

const FALLBACK_NAV = [
  { id: 0, name: 'Noticias', slug: 'noticias', url: 'https://presenciapr.com/category/noticias/', count: 0 },
  { id: 1, name: 'Deportes', slug: 'deportes', url: 'https://presenciapr.com/category/noticias/deportes/', count: 0 },
  { id: 2, name: 'Editorial', slug: 'editorial', url: 'https://presenciapr.com/category/noticias/editorial/', count: 0 },
];

/**
 * Sticky category navigation. WordPress hides `wp/v2/menus` behind auth, so
 * the menu is derived from the most-used categories — which also keeps it
 * honest: it always reflects what the newsroom actually publishes.
 */
export function NavBar() {
  const { data: categories } = useTopCategories(9);
  const { data: pages } = useSiteLinks(FOOTER_SLUGS);
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const items = categories ?? FALLBACK_NAV;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav className="nav" aria-label="Secciones">
      <div className="container nav__inner">
        <a className="nav__home" href="#contenido">
          Portada
        </a>
        <ul className="nav__list">
          {items.map((c) => (
            <li key={c.id}>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls={drawerId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-icon" aria-hidden="true" />
          <span>{open ? 'Cerrar' : 'Menú'}</span>
        </button>
      </div>

      <div id={drawerId} className="nav__drawer" hidden={!open}>
        <div className="container nav__drawer-inner">
          <p className="nav__drawer-title">Secciones</p>
          <ul className="nav__drawer-list">
            {items.map((c) => (
              <li key={c.id}>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.name}
                  {c.count > 0 ? <span className="nav__count">{c.count.toLocaleString('es-PR')}</span> : null}
                </a>
              </li>
            ))}
          </ul>
          {pages && pages.length > 0 ? (
            <>
              <p className="nav__drawer-title">Presencia</p>
              <ul className="nav__drawer-list nav__drawer-list--secondary">
                {pages.map((p) => (
                  <li key={p.id}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      {p.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
