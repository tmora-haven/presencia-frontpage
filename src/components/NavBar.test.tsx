import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithQuery } from '../test/render';
import { NavBar } from './NavBar';

describe('<NavBar />', () => {
  it('builds the menu from API categories, dropping "uncategorized"', async () => {
    renderWithQuery(<NavBar />);
    const nav = screen.getByRole('navigation', { name: 'Secciones' });
    expect(await screen.findAllByRole('link', { name: 'Deportes' })).not.toHaveLength(0);
    expect(nav).not.toHaveTextContent('Uncategorized');
  });

  it('toggles the drawer with a11y state and closes on Escape', async () => {
    renderWithQuery(<NavBar />);
    const button = screen.getByRole('button', { name: 'Menú' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Menú' })).toHaveAttribute('aria-expanded', 'false');
  });
});
