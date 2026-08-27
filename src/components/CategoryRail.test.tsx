import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithQuery } from '../test/render';
import { CategoryRail } from './CategoryRail';

describe('<CategoryRail />', () => {
  it('waits for exclusions before fetching (dependent query)', () => {
    renderWithQuery(<CategoryRail slug="deportes" label="Deportes" exclude={undefined} />);
    expect(screen.getByRole('region', { name: 'Deportes' })).toHaveAttribute('aria-busy', 'true');
  });

  it('renders the category name from the API and excludes lead stories', async () => {
    renderWithQuery(<CategoryRail slug="deportes" label="Deportes" exclude={[1]} />);
    await screen.findByRole('link', { name: 'Titular 2 – prueba' });
    expect(screen.queryByRole('link', { name: 'Titular 1 – prueba' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver todo/i })).toHaveAttribute('href', 'https://presenciapr.com/category/deportes/');
  });

  it('shows category and pueblo in the kicker and no dates', async () => {
    renderWithQuery(<CategoryRail slug="deportes" label="Deportes" exclude={[]} />);
    await screen.findByRole('link', { name: 'Titular 1 – prueba' });
    const kickers = document.querySelectorAll('.kicker');
    expect(kickers.length).toBeGreaterThan(0);
    expect(kickers[0]).toHaveTextContent('Regionales');
    expect(kickers[0]).toHaveTextContent('Río Grande');
    expect(document.querySelectorAll('article time')).toHaveLength(0);
  });

  it('opinion variant shows a featured image per article', async () => {
    renderWithQuery(<CategoryRail slug="deportes" label="Deportes" variant="opinion" exclude={[]} />);
    await screen.findByRole('link', { name: 'Titular 1 – prueba' });
    expect(document.querySelectorAll('.opinion__media img')).toHaveLength(4);
  });

  it('renders nothing for a category that does not exist', async () => {
    const { container } = renderWithQuery(<CategoryRail slug="nada" label="Nada" exclude={[]} />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
