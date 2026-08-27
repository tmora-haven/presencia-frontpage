import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { normalizePost } from '../lib/wpClient';
import { makePost } from '../test/fixtures';
import { FeaturedSlideshow } from './FeaturedSlideshow';

const articles = [1, 2, 3].map((id) => normalizePost(makePost({ id })));

describe('<FeaturedSlideshow />', () => {
  it('exposes one active slide as the h1 and hides the rest', () => {
    render(<FeaturedSlideshow articles={articles} />);
    expect(screen.getByRole('region', { name: 'Noticias destacadas' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titular 1 – prueba');
    expect(screen.getAllByRole('group', { hidden: true })).toHaveLength(3);
    expect(screen.getAllByRole('group')).toHaveLength(1); // only the active one is exposed
  });

  it('advances with next/prev, dots and arrow keys, wrapping around', async () => {
    render(<FeaturedSlideshow articles={articles} />);
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titular 2');
    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titular 3');
    await userEvent.click(screen.getByRole('tab', { name: /Noticia 2/ }));
    expect(screen.getByRole('tab', { name: /Noticia 2/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titular 3');
  });

  it('renders no controls for a single slide', () => {
    render(<FeaturedSlideshow articles={articles.slice(0, 1)} />);
    expect(screen.queryByRole('button', { name: 'Siguiente' })).not.toBeInTheDocument();
  });
});
