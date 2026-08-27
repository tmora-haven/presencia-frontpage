import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery } from '../test/render';
import { FloatingIssue } from './FloatingIssue';
import { PrintEdition } from './PrintEdition';

describe('<PrintEdition />', () => {
  it('highlights the current issue and lists the ten previous ones', async () => {
    renderWithQuery(<PrintEdition />);
    expect(await screen.findByRole('heading', { name: 'Edición 700' })).toBeInTheDocument();
    const strip = screen.getByRole('list', { name: 'Ediciones anteriores' });
    const items = within(strip).getAllByRole('listitem');
    expect(items).toHaveLength(10);
    expect(items[0]).toHaveTextContent('Edición 699');
    expect(within(strip).queryByText('Edición 700')).not.toBeInTheDocument();
    expect(strip.querySelectorAll('img')).toHaveLength(10);
  });

  it('scrolls the strip with the arrow buttons', async () => {
    renderWithQuery(<PrintEdition />);
    await screen.findByRole('heading', { name: 'Edición 700' });
    const strip = screen.getByRole('list', { name: 'Ediciones anteriores' });
    strip.scrollBy = vi.fn();
    await userEvent.click(screen.getByRole('button', { name: 'Ediciones más antiguas' }));
    expect(strip.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
  });
});

describe('<PrintEdition card />', () => {
  it('shows only the current issue', async () => {
    renderWithQuery(<PrintEdition card />);
    expect(await screen.findByRole('heading', { name: 'Edición 700' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Ediciones anteriores' })).not.toBeInTheDocument();
  });
});

describe('<FloatingIssue />', () => {
  it('links to the latest issue and can be dismissed for the session', async () => {
    sessionStorage.clear();
    renderWithQuery(<FloatingIssue />);
    const fab = await screen.findByRole('complementary', { name: 'Última edición impresa' });
    expect(within(fab).getByRole('link')).toHaveAttribute('href', 'https://example.test/post-900/');
    expect(fab).toHaveTextContent('Edición 700');
    await userEvent.click(within(fab).getByRole('button', { name: /Ocultar/ }));
    expect(screen.queryByRole('complementary', { name: 'Última edición impresa' })).not.toBeInTheDocument();
    expect(sessionStorage.getItem('presencia.floating-issue.dismissed')).toBe('900');
  });
});
