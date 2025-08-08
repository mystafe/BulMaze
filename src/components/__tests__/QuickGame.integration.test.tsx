// QuickGame component integration test for complete game flow
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

describe('QuickGame integration test', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('plays through questions and restarts', () => {
    const questions: Question[] = [
      { id: 1, question: '1+1?', options: ['2', '3'], answer: '2' },
      { id: 2, question: 'Capital?', options: ['Paris', 'Rome'], answer: 'Paris' },
    ];
    render(<QuickGame questions={questions} />);

    fireEvent.click(screen.getByText('2'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByText('Rome'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Finished!')).toBeInTheDocument();
    expect(screen.getByText(/Score: 1/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Restart'));
    expect(screen.getByText('1+1?')).toBeInTheDocument();
  });
});
