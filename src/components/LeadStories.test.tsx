import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, server } from '../test/server';
import { makePost } from '../test/fixtures';
import { renderWithQuery } from '../test/render';
import { LeadStories } from './LeadStories';

describe('<LeadStories />', () => {
  it('shows a skeleton while loading, then the hero and grid', async () => {
    renderWithQuery(<LeadStories />);
    expect(screen.getByLabelText('Cargando portada')).toBeInTheDocument();

    const hero = await screen.findByRole('heading', { level: 1 });
    expect(hero).toHaveTextContent('Titular 101 – prueba'); // from the "destacadas" tag query
    expect(screen.getByRole('region', { name: 'Noticias destacadas' })).toBeInTheDocument();
    const latest = screen.getByRole('region', { name: 'Últimas noticias' });
    expect(within(latest).getAllByRole('article')).toHaveLength(8);
    expect(within(latest).getByRole('complementary', { name: 'Publicidad' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Lo más reciente' })).toBeInTheDocument();
  });

  it('falls back to the latest story when the featured tag is empty', async () => {
    server.use(http.get(`${API}/wp/v2/tags`, () => HttpResponse.json([])));
    renderWithQuery(<LeadStories />);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Titular 1 – prueba');
    expect(screen.queryByRole('button', { name: 'Siguiente' })).not.toBeInTheDocument();
  });

  it('renders API HTML as inert text (no injected elements)', async () => {
    server.use(
      http.get(`${API}/wp/v2/posts`, () =>
        HttpResponse.json([makePost({ id: 1, title: { rendered: 'Hola <img src=x onerror="window.pwned=1">' } })]),
      ),
    );
    const { container } = renderWithQuery(<LeadStories />);
    await screen.findByRole('heading', { level: 1 });
    expect(container.querySelector('h1 img')).toBeNull();
    expect((window as unknown as { pwned?: number }).pwned).toBeUndefined();
  });

  it('shows an inline error with a working retry', async () => {
    let calls = 0;
    server.use(
      http.get(`${API}/wp/v2/posts`, () => {
        calls += 1;
        return calls === 1 ? HttpResponse.json({}, { status: 503 }) : HttpResponse.json([makePost({ id: 42 })]);
      }),
    );
    renderWithQuery(<LeadStories />);
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No se pudo cargar esta sección');

    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titular 42'));
  });

  it('renders nothing when the feed is empty', async () => {
    server.use(http.get(`${API}/wp/v2/posts`, () => HttpResponse.json([])));
    const { container } = renderWithQuery(<LeadStories />);
    await waitFor(() => expect(screen.queryByLabelText('Cargando portada')).not.toBeInTheDocument());
    expect(container).toBeEmptyDOMElement();
  });
});
