/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from './GameBoard';
import React from 'react';

vi.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

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
  takeLetter: vi.fn(),
  makeGuess: vi.fn(),
  setWordItem: vi.fn(),
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
  useGameStore: (selector: any) => selector(mockGameState),
  useCareerStore: (selector: any) => selector(mockCareerState),
  useUiStore: (selector: any) => selector(mockUiState),
}));

vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.resolve({ ok: false })),
);

beforeEach(() => {
  vi.clearAllMocks();
  mockGameState.makeGuess.mockReturnValue(false);
});

describe('GameBoard', () => {
  it('renders mask and hint', () => {
    render(<GameBoard />);
    expect(screen.getByText('hint: clue')).toBeDefined();
    expect(screen.getByText('t _ _ t')).toBeDefined();
  });

  it('awards XP on correct guess', () => {
    mockGameState.makeGuess.mockReturnValue(true);
    render(<GameBoard />);
    const input = screen.getAllByPlaceholderText('guessPlaceholder')[0];
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'guess' })[0]);
    expect(mockCareerState.awardXP).toHaveBeenCalledWith(76);
    expect(screen.getByTestId('word-result')).toBeDefined();
  });
});
