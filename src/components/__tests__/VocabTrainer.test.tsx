import { render, screen, fireEvent } from '@testing-library/react';
import VocabTrainer from '../VocabTrainer';
import { initCard, review } from '../../lib/spacedRepetition';

jest.mock('zustand', () => ({
  create: () => () => ({}),
}));

jest.mock('../../lib/spacedRepetition', () => {
  const actual = jest.requireActual('../../lib/spacedRepetition');
  return {
    ...actual,
    review: jest.fn(),
  };
});

describe('VocabTrainer', () => {
  it('renders word', () => {
    const queue = [
      { id: 1, word: 'ябълка', translation: 'apple', state: initCard() },
    ];
    render(<VocabTrainer initialQueue={queue} />);
    expect(screen.getByText('ябълка')).toBeInTheDocument();
  });

  it('clicking "Good" calls review() with quality 4', () => {
    const queue = [
      { id: 1, word: 'ябълка', translation: 'apple', state: initCard() },
    ];
    render(<VocabTrainer initialQueue={queue} />);
    fireEvent.click(screen.getByText('Good (4)'));
    expect(review).toHaveBeenCalledWith(queue[0].state, 4);
  });
});
