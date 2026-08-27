import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdSlot } from './AdSlot';

describe('<AdSlot />', () => {
  it('is labelled as advertising for assistive tech and visually', () => {
    render(<AdSlot size="leaderboard" slot="test" />);
    const ad = screen.getByRole('complementary', { name: 'Publicidad' });
    expect(ad).toHaveTextContent('Publicidad');
    expect(ad).toHaveAttribute('data-ad-slot', 'test');
  });
});
