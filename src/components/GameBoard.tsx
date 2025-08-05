'use client';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LevelProgress from './LevelProgress';
import WordResultCard from './WordResultCard';
import { useGameStore, useCareerStore, useUiStore } from '@/lib/store';
import { buildMask, calcXpGain } from '@/lib/scoring';
import { cn } from '@/lib/utils';

export default function GameBoard() {
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [shake, setShake] = useState(false);

  const word = useGameStore((s) => s.word);
  const hint = useGameStore((s) => s.hint);
  const example = useGameStore((s) => s.example);
  const translation = useGameStore((s) => s.exampleTranslation);
  const revealed = useGameStore((s) => s.revealed);
  const points = useGameStore((s) => s.points);
  const takeLetter = useGameStore((s) => s.takeLetter);
  const makeGuess = useGameStore((s) => s.makeGuess);
  const setWordItem = useGameStore((s) => s.setWordItem);

  const awardXP = useCareerStore((s) => s.awardXP);
  const level = useCareerStore((s) => s.levelNumeric);
  const cefr = useCareerStore((s) => s.cefr) || 'B1';

  const uiLang = useUiStore((s) => s.uiLang);
  const targetLang = useUiStore((s) => s.targetLang);

  const fetchWord = useCallback(async () => {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetLang,
        cefr,
        uiLanguage: uiLang,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setWordItem(data);
    }
  }, [targetLang, cefr, uiLang, setWordItem]);

  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  const mask = buildMask(word, revealed);

  const handleGuess = () => {
    if (makeGuess(guess)) {
      const xp = calcXpGain(level, points);
      awardXP(xp);
      setShowResult(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
    setGuess('');
  };

  const handleNext = () => {
    setShowResult(false);
    fetchWord();
  };

  if (!word) return <p>Loading...</p>;

  if (showResult)
    return (
      <WordResultCard
        word={word}
        example={example}
        translation={translation}
        onNext={handleNext}
      />
    );

  return (
    <div className="space-y-4">
      <LevelProgress />
      <p className="text-lg">Hint: {hint}</p>
      <p className="text-2xl tracking-widest">{mask}</p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={takeLetter}>
          Letter
        </Button>
        <Input
          className={cn(shake && 'shake')}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          placeholder="Your guess"
          aria-label="Guess"
        />
        <Button onClick={handleGuess}>Guess</Button>
      </div>
      <p>Points: {points}</p>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake {
          animation: shake 0.3s;
        }
      `}</style>
    </div>
  );
}

