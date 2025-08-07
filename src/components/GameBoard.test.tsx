/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from './GameBoard';
import React from 'react';

vi.mock('@/components/LevelProgress', () => ({
  default: () => <div data-testid="level-progress" />,
}));

vi.mock('@/components/WordResultCard', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="word-result" onClick={onNext}>
      result
    </div>
  ),
}));

const mockGameState = {
  word: 'test',
  hint: 'clue',
  example: 'ex',
  exampleTranslation: 'ex t',
  revealed: new Set(['t']),
  points: 80,
  setWordItem: vi.fn(),
  reset: vi.fn(),
};

const mockCareerState = {
  awardXP: vi.fn(),
  levelNumeric: 2,
  cefr: 'A2',
};

const mockUiState = {
  uiLang: 'en',
  targetLang: 'en',
};

vi.mock('@/lib/store', () => ({
  useGameStore: Object.assign(
    (selector: any) => selector(mockGameState),
    { setState: vi.fn() }
  ),
  useCareerStore: (selector: any) => selector(mockCareerState),
  useUiStore: (selector: any) => selector(mockUiState),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) })),
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GameBoard', () => {
  it('renders mask and hint', () => {
    render(<GameBoard />);
    expect(screen.getByText('Hint: clue')).toBeDefined();
    expect(screen.getByText('t _ _ t')).toBeDefined();
  });

  it('awards XP on correct guess', () => {
    render(<GameBoard />);
    const input = screen.getAllByPlaceholderText('Your guess')[0];
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Guess' })[0]);
    expect(mockCareerState.awardXP).toHaveBeenCalledWith(76);
    expect(screen.getByTestId('word-result')).toBeDefined();
  });
});
