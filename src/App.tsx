import { useFeatured, useLatest } from './hooks/useWp';
import { AdSlot } from './components/AdSlot';
import { CategoryRail } from './components/CategoryRail';
import { FemeninaSection } from './components/FemeninaSection';
import { FloatingIssue } from './components/FloatingIssue';
import { Footer } from './components/Footer';
import { LeadStories } from './components/LeadStories';
import { Masthead } from './components/Masthead';
import { NavBar } from './components/NavBar';
import { PalabraSection } from './components/PalabraSection';
import { PrintEdition } from './components/PrintEdition';
import { SectionBoundary } from './components/SectionBoundary';
import { Ticker } from './components/Ticker';

export default function App() {
  // Rails exclude stories already shown in the lead section. While the lead
  // query is pending, `exclude` is undefined and the rails wait (dependent query).
  const latest = useLatest();
  const featured = useFeatured();
  const settled = (q: { data?: unknown; isError: boolean }) => q.data !== undefined || q.isError;
  const exclude =
    settled(latest) && settled(featured)
      ? [...(latest.data ?? []), ...(featured.data ?? [])].map((a) => a.id)
      : undefined;

  return (
    <>
      <a className="sr-only" href="#contenido">
        Saltar al contenido
      </a>
      <Masthead />
      <NavBar />

      <main id="contenido" className="container">
        <AdSlot size="leaderboard" slot="portada-top" className="ad-row" />
        <Ticker />

        <SectionBoundary>
          <LeadStories />
        </SectionBoundary>

        <SectionBoundary>
          <FemeninaSection exclude={exclude} />
        </SectionBoundary>

        <SectionBoundary>
          <CategoryRail slug="deportes" label="Deportes" variant="feature" exclude={exclude} />
        </SectionBoundary>

        <SectionBoundary>
          <PrintEdition />
        </SectionBoundary>

        <SectionBoundary>
          <CategoryRail
            slug="editorial"
            label="Editorial"
            variant="opinion"
            exclude={exclude}
            excludeCategorySlug="la-palabra-del-dia"
          />
        </SectionBoundary>

        <SectionBoundary>
          <PalabraSection exclude={exclude} />
        </SectionBoundary>

        <AdSlot size="billboard" slot="portada-mid" className="ad-row" />

        <SectionBoundary>
          <CategoryRail slug="salud" label="A tu salud" variant="scroll" exclude={exclude} />
        </SectionBoundary>
      </main>
      <Footer />
      <FloatingIssue />
    </>
  );
}
