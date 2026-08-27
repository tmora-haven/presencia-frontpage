import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, server } from '../test/server';
import { renderWithQuery } from '../test/render';
import { FemeninaSection } from './FemeninaSection';
import { FemeninaSpotlight } from './FemeninaSpotlight';
import { PalabraSection } from './PalabraSection';

describe('<FemeninaSection />', () => {
  it('renders the sub-brand with chips from child categories', async () => {
    renderWithQuery(<FemeninaSection exclude={[]} />);
    await screen.findByRole('heading', { name: 'Presencia Femenina' });
    const chips = await screen.findByRole('list', { name: 'Temas de Presencia Femenina' });
    expect(chips).toHaveTextContent('Moda');
    expect(chips).toHaveTextContent('Arte');
    expect(screen.getByRole('link', { name: /Entrar a Presencia Femenina/ })).toHaveAttribute(
      'href',
      'https://presenciapr.com/presencia-femenina/',
    );
  });
});

describe('<FemeninaSpotlight />', () => {
  it('renders the latest Femenina story with brand link', async () => {
    renderWithQuery(<FemeninaSpotlight />);
    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent('Titular 1 – prueba');
    expect(screen.getByRole('link', { name: /Femenina/ })).toHaveAttribute('href', 'https://presenciapr.com/presencia-femenina/');
  });
});

describe('<PalabraSection />', () => {
  it('renders the lead reflection and previous ones', async () => {
    renderWithQuery(<PalabraSection exclude={[]} />);
    await screen.findByRole('heading', { name: 'La Palabra del Día' });
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Titular 1');
    expect(screen.getByText('Reflexiones anteriores')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    // lead + two previous reflections each carry their featured image
    expect(document.querySelectorAll('.palabra__lead-media img, .palabra__list-thumb img')).toHaveLength(3);
  });

  it('renders nothing when the column has no posts', async () => {
    server.use(http.get(`${API}/wp/v2/posts`, () => HttpResponse.json([])));
    const { container } = renderWithQuery(<PalabraSection exclude={[]} />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
