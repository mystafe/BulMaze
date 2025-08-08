// QuickGame component unit tests covering edge cases
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import QuickGame, { Question } from '../QuickGame';

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    motion: {
      div: ({ children, initial, animate, exit, transition, ...props }: any) => (
        <div {...props}>{children}</div>
      ),
      button: ({ children, initial, animate, exit, transition, ...props }: any) => (
        <button {...props}>{children}</button>
      ),
      span: ({ children, initial, animate, exit, transition, ...props }: any) => (
        <span {...props}>{children}</span>
      ),
    },
  };
});

jest.mock('lucide-react', () => ({
  CheckCircle: () => <span data-testid="check" />,
  XCircle: () => <span data-testid="x" />,
}));

describe('QuickGame unit tests', () => {
  const questions: Question[] = [
    { id: 1, question: '1+1?', options: ['2', '3'], answer: '2' },
    { id: 2, question: '2+2?', options: ['3', '4'], answer: '4' },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders first question with initial score', () => {
    render(<QuickGame questions={questions} />);
    expect(screen.getByText('1+1?')).toBeInTheDocument();
    expect(screen.getByText(/Score: 0/)).toBeInTheDocument();
  });

  test('handles wrong answer without increasing score', () => {
    render(<QuickGame questions={questions} />);
    fireEvent.click(screen.getByText('3'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('2+2?')).toBeInTheDocument();
    expect(screen.getByText(/Score: 0/)).toBeInTheDocument();
  });

  test('handles correct answer and increments score', () => {
    render(<QuickGame questions={questions} />);
    fireEvent.click(screen.getByText('2'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('2+2?')).toBeInTheDocument();
    expect(screen.getByText(/Score: 1/)).toBeInTheDocument();
  });

  test('shows finish screen and restarts game', () => {
    render(<QuickGame questions={questions.slice(0, 1)} />);
    fireEvent.click(screen.getByText('2'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Finished!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Restart'));
    expect(screen.getByText('1+1?')).toBeInTheDocument();
  });
});
