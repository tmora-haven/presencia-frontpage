import { BENTO_COUNT, BENTO_SLUG, useCategoryFeed, useFeatured, useLatest } from './hooks/useWp';
import { AdSlot } from './components/AdSlot';
import { CategoryRail } from './components/CategoryRail';
import { FemeninaSection } from './components/FemeninaSection';
import { FEMENINA_SLUG } from './components/FemeninaSpotlight';
import { FloatingIssue } from './components/FloatingIssue';
import { Footer } from './components/Footer';
import { LeadStories } from './components/LeadStories';
import { Masthead } from './components/Masthead';
import { NavBar } from './components/NavBar';
import { PalabraSection } from './components/PalabraSection';
import { PreviousEditions } from './components/PreviousEditions';
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
  // Same query the Regionales bento uses (shared cache) so later rails skip those stories too.
  const bento = useCategoryFeed(BENTO_SLUG, BENTO_COUNT, exclude);
  const railExclude = exclude && settled(bento) ? [...exclude, ...(bento.data?.articles ?? []).map((a) => a.id)] : undefined;
  // Femenina and Palabra rarely overlap Regionales, so they only wait on the hero queries
  // (no waterfall behind the bento). The spotlight query is the same one the hero block uses.
  const spotlight = useCategoryFeed(FEMENINA_SLUG, 1, []);
  const femeninaExclude =
    exclude && settled(spotlight) ? [...exclude, ...(spotlight.data?.articles ?? []).map((a) => a.id)] : undefined;

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
          <FemeninaSection exclude={femeninaExclude} />
        </SectionBoundary>

        <SectionBoundary>
          <CategoryRail slug="policiacas" label="Policiacas" variant="feature" kicker="pueblo" ad={false} exclude={railExclude} />
        </SectionBoundary>

        <AdSlot size="leaderboard" slot="portada-femenina" className="ad-row" />

        <SectionBoundary>
          <CategoryRail
            slug="gobierno-y-politica"
            label="Gobierno y política"
            variant="scroll"
            kicker="pueblo"
            ad={false}
            exclude={railExclude}
          />
        </SectionBoundary>

        <SectionBoundary>
          <CategoryRail slug="deportes" label="Deportes" variant="feature" exclude={railExclude} />
        </SectionBoundary>

        <SectionBoundary>
          <CategoryRail slug="nacionales" label="Nacionales" variant="list" count={6} kicker="pueblo" exclude={railExclude} />
        </SectionBoundary>

        <SectionBoundary>
          <CategoryRail
            slug="editorial"
            label="Editorial"
            variant="opinion"
            exclude={railExclude}
            excludeCategorySlug="la-palabra-del-dia"
          />
        </SectionBoundary>

        <SectionBoundary>
          <PalabraSection exclude={exclude} />
        </SectionBoundary>

        <AdSlot size="billboard" slot="portada-mid" className="ad-row" />

        <SectionBoundary>
          <CategoryRail slug="salud" label="A tu salud" variant="scroll" exclude={railExclude} />
        </SectionBoundary>

        <AdSlot size="billboard" slot="portada-bottom" className="ad-row" />
      </main>
      <PreviousEditions />
      <Footer />
      <FloatingIssue />
    </>
  );
}
