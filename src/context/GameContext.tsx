'use client';

/* Global game state managed with React Context and useReducer. */

import { createContext, useContext, useReducer, type ReactNode } from 'react';

interface GameState {
  score: number;
  currentQuestion: number;
  questions: string[];
}

type GameAction =
  | { type: 'SET_QUESTIONS'; questions: string[] }
  | { type: 'ANSWER'; points: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET' };

const initialState: GameState = {
  score: 0,
  currentQuestion: 0,
  questions: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { score: 0, currentQuestion: 0, questions: action.questions };
    case 'ANSWER':
      return { ...state, score: state.score + action.points };
    case 'NEXT_QUESTION':
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}

