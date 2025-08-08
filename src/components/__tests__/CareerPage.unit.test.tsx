// CareerPage component unit tests checking individual interactions
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

describe('CareerPage unit tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders initial question and progress', () => {
    render(<CareerPage />);
    expect(screen.getByText('What is the capital of Turkey?')).toBeInTheDocument();
    expect(screen.getByText('Soru 1 / 5')).toBeInTheDocument();
  });

  test('advances to next question after answering', () => {
    render(<CareerPage />);
    fireEvent.click(screen.getByText('Istanbul'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('2 + 2 equals?')).toBeInTheDocument();
    expect(screen.getByText('Soru 2 / 5')).toBeInTheDocument();
  });
});
