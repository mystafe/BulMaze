'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LevelProgress from './LevelProgress';
import { useGameStore, useCareerStore } from '@/lib/store';
import { buildMask, calcXpGain } from '@/lib/scoring';

export interface GameBoardProps {
  word: string;
  hint: string;
}

export default function GameBoard({ word, hint }: GameBoardProps) {
  const [guess, setGuess] = useState('');
  const revealed = useGameStore((s) => s.revealed);
  const points = useGameStore((s) => s.points);
  const takeLetter = useGameStore((s) => s.takeLetter);
  const makeGuess = useGameStore((s) => s.makeGuess);
  const awardXP = useCareerStore((s) => s.awardXP);
  const level = useCareerStore((s) => s.levelNumeric);

  const mask = buildMask(word, revealed);

  const handleGuess = () => {
    if (makeGuess(guess)) {
      const xp = calcXpGain(level, points);
      awardXP(xp);
      alert(`Correct! +${xp} XP`);
    } else {
      alert('Try again');
    }
    setGuess('');
  };

  return (
    <div className="space-y-4">
      <LevelProgress />
      <p className="text-lg">Hint: {hint}</p>
      <p className="text-2xl tracking-widest">{mask}</p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={takeLetter}>Letter</Button>
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          placeholder="Your guess"
          aria-label="Guess"
        />
        <Button onClick={handleGuess}>Guess</Button>
      </div>
      <p>Points: {points}</p>
    </div>
  );
}
