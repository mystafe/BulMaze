'use client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LevelProgress from './LevelProgress';
import WordResultCard from './WordResultCard';
import ErrorState from './ErrorState';
import {
  useGameStore,
  useCareerStore,
  useUiStore,
  type WordItem,
} from '@/lib/store';
import { buildMask, calcXpGain } from '@/lib/scoring';
import { fetchJson } from '@/lib/fetchJson';
import { Loader2 } from 'lucide-react';

export default function GameBoard() {
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const word = useGameStore((s) => s.word);
  const hint = useGameStore((s) => s.hint);
  const example = useGameStore((s) => s.example);
  const translation = useGameStore((s) => s.exampleTranslation);
  const revealed = useGameStore((s) => s.revealed);
  const points = useGameStore((s) => s.points);
  const takeLetter = useGameStore((s) => s.takeLetter);
  const makeGuess = useGameStore((s) => s.makeGuess);
  const setWordItem = useGameStore((s) => s.setWordItem);
  const reset = useGameStore((s) => s.reset);

  const awardXP = useCareerStore((s) => s.awardXP);
  const level = useCareerStore((s) => s.levelNumeric);
  const cefr = useCareerStore((s) => s.cefr) || 'B1';

  const uiLang = useUiStore((s) => s.uiLang);
  const targetLang = useUiStore((s) => s.targetLang);

  const fetchWord = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchJson<WordItem>(
        '/api/ai/generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetLang,
            cefr,
            uiLanguage: uiLang,
          }),
        },
      );
      setWordItem(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [targetLang, cefr, uiLang, setWordItem]);

  useEffect(() => {
    if (!word) {
      fetchWord();
    }
  }, [fetchWord, word]);

  const mask = useMemo(() => buildMask(word, revealed), [word, revealed]);

  const handleGuess = () => {
    if (makeGuess(guess)) {
      const xp = calcXpGain(level, points);
      const leveledUp = awardXP(xp);
      window.dispatchEvent(
        new CustomEvent('bulmaze:win', { detail: { leveledUp, xp } }),
      );
      setShowResult(true);
    }
    setGuess('');
  };

  const handleNext = () => {
    setShowResult(false);
    reset();
    void fetchWord();
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  if (error) return <ErrorState onRetry={fetchWord} />;
  if (!word) return null;

  if (showResult)
    return (
      <WordResultCard
        word={word}
        example={example}
        translation={translation}
        onNext={handleNext}
        loading={loading}
      />
    );

  return (
    <div className="space-y-6">
      <LevelProgress />
      <p className="text-lg">
        Hint: {hint}
      </p>
      <p className="text-2xl tracking-widest">{mask}</p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={takeLetter}
          aria-label="Letter"
          disabled={loading}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Letter
        </Button>
        <Input
          className="focus:outline-none focus:ring-2 focus:ring-primary"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          placeholder="Your guess"
          aria-label="Guess"
          disabled={loading}
        />
        <Button
          onClick={handleGuess}
          aria-label="Guess"
          disabled={loading}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Guess
        </Button>
      </div>
      <p>
        Points: {points}
      </p>
    </div>
  );
}
