// CareerPage component integration test exercising full game flow
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CareerPage from '../CareerPage';

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  motion: {
    div: ({ children, ...rest }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div {...rest}>{children}</div>
    ),
    button: ({ children, ...rest }: { children: React.ReactNode } & Record<string, unknown>) => (
      <button {...rest}>{children}</button>
    ),
    span: ({ children, ...rest }: { children: React.ReactNode } & Record<string, unknown>) => (
      <span {...rest}>{children}</span>
    ),
  },
}));

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
