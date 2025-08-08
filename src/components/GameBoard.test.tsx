/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

const {
  mockGameState,
  mockCareerState,
  mockUiState,
  mockSetState,
} = vi.hoisted(() => {
  const mockGameState = {
    word: 'test',
    hint: 'clue',
    example: 'ex',
    exampleTranslation: 'ex t',
    revealed: new Set(['t']),
    points: 80,
    lettersTaken: 2,
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
  const mockSetState = vi.fn((fn: any) => {
    const result = typeof fn === 'function' ? fn(mockGameState) : fn;
    Object.assign(mockGameState, result);
  });
  return { mockGameState, mockCareerState, mockUiState, mockSetState };
});

vi.mock('@/lib/store', () => ({
  useGameStore: Object.assign(
    (selector: any) => selector(mockGameState),
    { setState: mockSetState }
  ),
  useCareerStore: (selector: any) => selector(mockCareerState),
  useUiStore: (selector: any) => selector(mockUiState),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })),
);

beforeEach(() => {
  mockGameState.word = 'test';
  mockGameState.hint = 'clue';
  mockGameState.example = 'ex';
  mockGameState.exampleTranslation = 'ex t';
  mockGameState.revealed = new Set(['t']);
  mockGameState.points = 80;
  mockGameState.lettersTaken = 2;
  mockGameState.setWordItem.mockReset();
  mockGameState.reset.mockReset();
  mockCareerState.awardXP.mockReset();
  vi.clearAllMocks();
});

describe('GameBoard', () => {
  it('shows result, resets and fetches next word on next', async () => {
    render(<GameBoard />);
    const input = (await screen.findAllByPlaceholderText('Your guess'))[0];
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click((await screen.findAllByRole('button', { name: 'Guess' }))[0]);

    expect(screen.getByTestId('word-result')).toBeDefined();

    fireEvent.click(screen.getByTestId('word-result'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockGameState.reset).toHaveBeenCalledTimes(1);
    });
  });

  it('reduces points to 90 when taking a letter', async () => {
    mockGameState.revealed = new Set();
    mockGameState.points = 100;
    mockGameState.lettersTaken = 0;
    render(<GameBoard />);
    fireEvent.click((await screen.findAllByRole('button', { name: 'Letter' }))[0]);

    expect(mockGameState.points).toBe(90);
    expect(mockGameState.lettersTaken).toBe(1);
  });
});
