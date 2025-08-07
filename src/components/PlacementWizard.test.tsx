/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const { mockSetCEFR, mockCareerState, mockUiState } = vi.hoisted(() => {
  const mockSetCEFR = vi.fn();
  const mockCareerState = {
    setCEFR: mockSetCEFR,
    setLevelNumeric: vi.fn(),
    setRequiredXP: vi.fn(),
  };
  const mockUiState = { uiLang: 'en' };
  return { mockSetCEFR, mockCareerState, mockUiState };
});

vi.mock('@/lib/store', () => ({
  useCareerStore: (selector: any) => selector(mockCareerState),
  useUiStore: (selector: any) => selector(mockUiState),
}));

const { mockRouter } = vi.hoisted(() => ({ mockRouter: { push: vi.fn() } }));
vi.mock('next/navigation', () => ({ useRouter: () => mockRouter }));

const { mockPostJSON } = vi.hoisted(() => {
  const placementItems = Array.from({ length: 12 }, (_, i) => ({
    id: String(i),
    type: 'fill' as const,
    prompt: `p${i}`,
  }));
  const mockPostJSON = vi.fn((url: string) => {
    if (url === '/api/ai/placement') {
      return Promise.resolve({ items: placementItems });
    }
    if (url === '/api/ai/evaluate') {
      return Promise.resolve({ cefr: 'B2' });
    }
    return Promise.resolve({});
  });
  return { mockPostJSON };
});

vi.mock('@/lib/postJson', () => ({ postJSON: mockPostJSON }));

const PlacementWizard = (await import('./PlacementWizard')).default;

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe('PlacementWizard', () => {
  it('runs placement and redirects with celebration', async () => {
    render(<PlacementWizard />);

    fireEvent.click(await screen.findByText('Start Test'));
    await screen.findByText('Question 1');

    for (let i = 1; i < 10; i += 1) {
      const input = screen.getByPlaceholderText('Your answer');
      fireEvent.change(input, { target: { value: `ans${i}` } });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      await screen.findByText(`Question ${i + 1}`);
    }

    const input = screen.getByPlaceholderText('Your answer');
    fireEvent.change(input, { target: { value: 'final' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockPostJSON).toHaveBeenCalledTimes(2);
      expect(mockSetCEFR).toHaveBeenCalledWith('B2');
      expect(mockRouter.push).toHaveBeenCalledWith('/career?celebrate=1#dashboard');
      expect(window.localStorage.getItem('placementDone')).toBe('1');
    });
  });
});
