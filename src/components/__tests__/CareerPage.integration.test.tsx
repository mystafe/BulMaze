// CareerPage component integration test exercising full game flow
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CareerPage from '../CareerPage';

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

describe('CareerPage integration test', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('completes quiz with mixed answers and restarts', () => {
    render(<CareerPage />);
    const answers = [
      'Ankara',
      '3',
      'Python',
      'HighText Machine Language',
      'Mars',
    ];
    answers.forEach((ans) => {
      fireEvent.click(screen.getByText(ans));
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    });
    expect(screen.getByText('Skor: 3 / 5')).toBeInTheDocument();
    expect(screen.getByText(/Devam!/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Yeniden Başla'));
    expect(screen.getByText('What is the capital of Turkey?')).toBeInTheDocument();
  });
});
