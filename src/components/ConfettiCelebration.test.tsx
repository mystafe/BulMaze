import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ConfettiCelebration from './ConfettiCelebration';

const mockConfetti = vi.fn();
vi.mock('canvas-confetti', () => ({ default: mockConfetti }));

describe('ConfettiCelebration', () => {
  it('fires confetti on game win and placement finish', async () => {
    render(<ConfettiCelebration />);
    // wait for dynamic import to resolve
    await new Promise((r) => setTimeout(r, 0));
    window.dispatchEvent(new Event('bulmaze:win'));
    window.dispatchEvent(new Event('bulmaze:placement-finished'));
    await waitFor(() => {
      expect(mockConfetti).toHaveBeenCalledTimes(2);
    });
  });
});
