'use client';

/* Example component consuming the game context. */

import { useGameContext } from '@/context/GameContext';

export default function GameStatus() {
  const {
    state: { score, currentQuestion, questions },
    dispatch,
  } = useGameContext();

  const current = questions[currentQuestion] ?? 'No question';

  return (
    <div className="space-y-2">
      <p>Score: {score}</p>
      <p>Active question: {current}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded bg-blue-500 px-2 py-1 text-white"
          onClick={() => dispatch({ type: 'ANSWER', points: 10 })}
        >
          +10
        </button>
        <button
          type="button"
          className="rounded bg-gray-500 px-2 py-1 text-white"
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
        >
          Next
        </button>
      </div>
    </div>
  );
}

