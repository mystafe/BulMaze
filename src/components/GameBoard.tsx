'use client';
import { useState } from 'react';
import { useGameStore, useCareerStore } from '@/lib/store';
import { buildMask, revealRandomLetter, calcPoints, calcXpGain } from '@/lib/scoring';

export default function GameBoard({ word, hint }: { word: string; hint: string }) {
  const [input, setInput] = useState('');
  const { revealed, points } = useGameStore();
  const awardXP = useCareerStore((s) => s.awardXP);
  const level = useCareerStore.getState().levelNumeric;

  const mask = buildMask(word, revealed);

  const takeLetter = () => {
    useGameStore.setState((s) => ({
      revealed: revealRandomLetter(word, s.revealed),
      lettersTaken: s.lettersTaken + 1,
      points: calcPoints(s.lettersTaken + 1),
    }));
  };

  const guess = () => {
    if (input.toLowerCase() === word.toLowerCase()) {
      const xp = calcXpGain(level, points);
      awardXP(xp);
      alert(`Correct! +${xp} XP`);
    } else {
      alert('Try again');
    }
    setInput('');
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">Hint: {hint}</p>
      <p className="text-2xl tracking-widest">{mask}</p>
      <div className="flex gap-2">
        <button onClick={takeLetter} className="px-3 py-1 bg-blue-500 text-white rounded">Letter</button>
        <input
          className="border p-1 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && guess()}
          aria-label="Guess"
        />
        <button onClick={guess} className="px-3 py-1 bg-green-600 text-white rounded">Guess</button>
      </div>
      <p>Points: {points}</p>
    </div>
  );
}
