'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LevelProgress from './LevelProgress';
import WordResultCard from './WordResultCard';
import { useGameStore, useCareerStore, useUiStore } from '@/lib/store';
import { buildMask, calcXpGain } from '@/lib/scoring';

export default function GameBoard() {
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);

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
    }
    setGuess('');
  };

  const handleNext = () => {
    setShowResult(false);
    fetchWord();
  };

  const { t } = useTranslation('game');

  if (!word) return <p>{t('loading')}</p>;

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
    <div className="space-y-6">
      <LevelProgress />
      <p className="text-lg">
        {t('hint')}: {hint}
      </p>
      <p className="text-2xl tracking-widest">{mask}</p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={takeLetter}
          aria-label={t('letter')}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {t('letter')}
        </Button>
        <Input
          className="focus:outline-none focus:ring-2 focus:ring-primary"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          placeholder={t('guessPlaceholder')}
          aria-label={t('guess')}
        />
        <Button
          onClick={handleGuess}
          aria-label={t('guess')}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {t('guess')}
        </Button>
      </div>
      <p>
        {t('points')}: {points}
      </p>
    </div>
  );
}
