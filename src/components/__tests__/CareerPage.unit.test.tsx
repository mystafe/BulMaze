// CareerPage component unit tests checking individual interactions
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
