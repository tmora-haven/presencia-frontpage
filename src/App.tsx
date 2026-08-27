import { useLatest } from './hooks/useWp';
import { CategoryRail } from './components/CategoryRail';
import { Footer } from './components/Footer';
import { LeadStories } from './components/LeadStories';
import { Masthead } from './components/Masthead';
import { PrintEdition } from './components/PrintEdition';
import { SectionBoundary } from './components/SectionBoundary';

/** Category rails, in page order. Slugs match presenciapr.com; labels are fallbacks while loading. */
const RAILS = [
  { slug: 'deportes', label: 'Deportes' },
  { slug: 'editorial', label: 'Editorial' },
  { slug: 'salud', label: 'A tu salud' },
];

export default function App() {
  // Rails exclude stories already shown in the lead section. While the lead
  // query is pending, `exclude` is undefined and the rails wait (dependent query).
  const latest = useLatest();
  const exclude = latest.data ? latest.data.map((a) => a.id) : latest.isError ? [] : undefined;

  return (
    <>
      <a className="sr-only" href="#contenido">
        Saltar al contenido
      </a>
      <Masthead />
      <main id="contenido" className="container">
        <SectionBoundary>
          <LeadStories />
        </SectionBoundary>

        <SectionBoundary>
          <PrintEdition />
        </SectionBoundary>

        {RAILS.map((rail) => (
          <SectionBoundary key={rail.slug}>
            <CategoryRail slug={rail.slug} label={rail.label} exclude={exclude} />
          </SectionBoundary>
        ))}
      </main>
      <Footer />
    </>
  );
}
