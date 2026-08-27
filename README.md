# Periódico Presencia — Portada React sobre la API REST de WordPress

Una portada de periódico moderna, construida **exclusivamente** con React y la
API REST pública de WordPress de [presenciapr.com](https://presenciapr.com).
No hay tema de WordPress, ni PHP, ni plugins: el sitio existente sigue siendo
la fuente de verdad y esta aplicación lo consume como un *headless CMS*.

> Demostración técnica de Monotu. El contenido que se muestra es el contenido
> real y en vivo del periódico.

## Qué demuestra

| Capacidad | Dónde verla |
|---|---|
| Consumo tipado de la API REST (`wp/v2`) con `_embed` y `_fields` | `src/lib/wpClient.ts` |
| Caché, deduplicación y reintentos con *backoff* (TanStack Query) | `src/hooks/useWp.ts`, `src/queryClient.ts` |
| Consultas dependientes (las secciones excluyen las noticias ya mostradas) | `App.tsx` → `CategoryRail` |
| Custom post types (`impreso`) y taxonomías personalizadas (`pueblo` junto a la categoría) | `PrintEdition.tsx`, `Kicker.tsx` |
| Menú derivado de la API (las categorías más usadas) con *drawer* móvil accesible | `NavBar.tsx` |
| Espacios publicitarios etiquetados, con tamaño reservado (sin *layout shift*) | `AdSlot.tsx` |
| Tres presentaciones de sección con un solo hook: destacada, opinión, carrusel | `CategoryRail.tsx` |
| Slideshow accesible de «noticias destacadas» (etiqueta), con autoplay respetuoso | `FeaturedSlideshow.tsx` |
| Sub-marca **Presencia Femenina** con su propia identidad y chips de subcategorías | `FemeninaSection.tsx` |
| Sección tipográfica para **La Palabra del Día** (columna sin imágenes) | `PalabraSection.tsx` |
| Edición impresa: número actual destacado + tira de 10 ediciones anteriores | `PrintEdition.tsx` |
| Botón flotante de la última edición (se oculta sobre su sección, descartable por sesión) | `FloatingIssue.tsx` |
| Ticker «Último minuto» (pausa al pasar el cursor, estático con *reduced motion*) | `Ticker.tsx` |
| Estados de carga (*skeletons*), error por sección con reintento y vacíos | `SectionState.tsx`, `SectionBoundary.tsx` |
| Seguridad: ningún HTML de la API llega al DOM | `src/lib/decodeHtml.ts` + pruebas |
| Imágenes responsivas sin *layout shift* (`srcset`, `width/height`, `lazy`) | `ArticleCard.tsx`, `LeadStories.tsx` |
| Accesibilidad: landmarks, jerarquía de encabezados, `aria-busy`, foco visible | todos los componentes |
| Pruebas unitarias, de integración (MSW) y E2E (Playwright) | `src/**/*.test.*`, `e2e/` |

## Arquitectura

```
WordPress (presenciapr.com)
        │  HTTPS · JSON · solo lectura · sin credenciales
        ▼
src/lib/wpClient.ts      ← único lugar que construye URLs; normaliza a texto plano
        ▼
src/hooks/useWp.ts       ← TanStack Query: claves, caché, dependencias
        ▼
src/components/*         ← presentación pura; reciben datos ya seguros
```

**Decisiones clave**

- **Texto plano, nunca HTML.** WordPress devuelve títulos y extractos como HTML.
  `decodeHtml()` los convierte a texto (decodifica entidades, elimina etiquetas)
  y React los renderiza con su escape normal. Un `<script>` en un título se
  muestra como texto inofensivo. No se usa `dangerouslySetInnerHTML` en ningún
  sitio.
- **Fallos aislados.** Cada sección tiene su propia consulta y su propio
  *error boundary*. Si la categoría *Deportes* falla, el resto de la portada
  sigue en pie y la sección ofrece «Reintentar».
- **Una petición por dato.** El héroe y la parrilla de «Últimas noticias»
  comparten la misma consulta; TanStack Query la deduplica. `_embed` trae
  imagen, autor y categorías en la misma respuesta (evita N+1).
- **Configurable.** La URL del sitio viene de `VITE_WP_API_URL` y se valida al
  arrancar (debe ser `https://`). El mismo código funciona contra cualquier
  WordPress con la API REST pública.
- **Menú sin autenticación.** WordPress protege `wp/v2/menus` con credenciales;
  en lugar de exponer un token en el navegador, el menú se construye con las
  categorías más publicadas (`orderby=count`), que coinciden con el menú real del
  periódico y se mantienen solas.
- **Publicidad honesta.** Cada `AdSlot` lleva la etiqueta visible «Publicidad»,
  un `aria-label` equivalente y un `data-ad-slot` estable para el servidor de
  anuncios. Reserva el tamaño estándar (970×90, 970×250, 300×250, 300×600 en
  escritorio; 320×100 / 300×250 en móvil) para que cargar una creatividad no
  mueva el contenido.
- **CSS propio con tokens.** Sin frameworks de utilidades; `src/styles/tokens.css`
  define marca, tipografía y espaciado. El bundle completo pesa ~74 kB gzip.

## Ejecutar

```bash
cp .env.example .env      # apunta a https://presenciapr.com por defecto
npm install
npm run dev               # http://localhost:5173
```

Otros comandos:

```bash
npm run build             # producción en dist/ (desplegable en cualquier hosting estático)
npm run preview           # sirve dist/
npm run typecheck         # TypeScript estricto
npm run lint              # oxlint
npm test                  # Vitest + Testing Library + MSW (36 pruebas)
npm run e2e               # Playwright: smoke test estructural contra el sitio en vivo
```

## Pruebas

- **Unitarias** — `decodeHtml` (entidades, etiquetas, inyección), validación de
  configuración, normalización de posts y construcción de peticiones.
- **Integración** — componentes contra una API simulada con MSW: skeleton →
  datos, error → reintento exitoso, vacío → no se renderiza, HTML malicioso →
  texto inerte.
- **E2E** — un único smoke test que verifica la *estructura* de la portada
  (cabecera, titular principal, al menos una sección, pie) sin depender de
  titulares concretos, para que las noticias del día no lo hagan frágil. También
  comprueba que todo enlace externo lleve `rel="noopener"`.

## Requisitos del lado WordPress

Solo endpoints públicos de lectura: `/wp-json/`, `wp/v2/posts`,
`wp/v2/categories`, `wp/v2/pages`, `wp/v2/impreso`. El sitio ya expone
cabeceras CORS para orígenes de desarrollo; para producción basta con añadir
el dominio de la portada a la lista de orígenes permitidos.

## Estructura

```
src/
  config.ts              validación de VITE_WP_API_URL
  queryClient.ts         políticas de caché y reintento
  lib/
    wpClient.ts          cliente tipado de la API
    decodeHtml.ts        HTML → texto plano seguro
    format.ts            fechas en es-PR
    types.ts             tipos de la API y del dominio
  hooks/useWp.ts         hooks de TanStack Query
  components/            Masthead, NavBar, Ticker, AdSlot, LeadStories (slideshow + bento),
                         FeaturedSlideshow, FemeninaSection, PalabraSection,
                         CategoryRail (feature | opinion | scroll), PrintEdition, Footer, …
  styles/                tokens.css, global.css
  test/                  MSW, fixtures, helpers
e2e/smoke.spec.ts        Playwright
```
