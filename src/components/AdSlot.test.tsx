import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdSlot } from './AdSlot';

describe('<AdSlot />', () => {
  it('is labelled as advertising for assistive tech and visually', () => {
    render(<AdSlot size="leaderboard" slot="test" />);
    const ad = screen.getByRole('complementary', { name: 'Publicidad' });
    expect(ad).toHaveTextContent('Publicidad');
    expect(ad).toHaveAttribute('data-ad-slot', 'test');
  });

  it('declares the exact IAB size for every breakpoint', () => {
    render(<AdSlot size="halfpage" slot="side" />);
    const ad = screen.getByRole('complementary', { name: 'Publicidad' });
    expect(within(ad).getByText('300 × 600')).toHaveClass('ad__spec--desktop');
    expect(within(ad).getByText('300 × 250', { selector: '.ad__spec--mobile' })).toBeInTheDocument();
  });
});
