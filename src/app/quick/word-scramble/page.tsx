'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { postJSON } from '@/lib/postJson';
import QuickNav from '@/components/QuickNav';

const scrambleWord = (word: string) => {
  const a = word.split('');
  const n = a.length;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
};

const WordScrambleGame = () => {
  const { t, i18n } = useTranslation('game');
  const [originalWord, setOriginalWord] = useState<string>('');
  const [scrambledWord, setScrambledWord] = useState<string>('');
  const [guess, setGuess] = useState<string>('');
  const [result, setResult] = useState<true | false | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWord = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setGuess('');
    try {
      const targetLanguage = localStorage.getItem('targetLanguage') || 'en';
      const data = await postJSON<string[]>('/api/ai/quick-game', {
        gameType: 'word-scramble',
        targetLanguage,
        uiLanguage: (i18n.language as any) || 'en',
        count: 1,
        seed: Date.now(),
      });

      if (Array.isArray(data) && typeof data[0] === 'string') {
        const word = data[0];
        setOriginalWord(word);
        setScrambledWord(scrambleWord(word));
      } else {
        setError(t('fetchError'));
      }
    } catch (err) {
      console.error(err);
      setError(t('fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t, i18n.language]);

  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  const submitGuess = () => {
    if (!originalWord) return;
    const isCorrect = guess.trim().toLowerCase() === originalWord.toLowerCase();
    setResult(isCorrect);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitGuess();
    }
  };

  const useHint = () => {
    let pos = 0;
    while (
      pos < originalWord.length &&
      (guess[pos] || '').toLowerCase() === originalWord[pos]?.toLowerCase()
    )
      pos++;
    const next = guess.split('');
    next[pos] = originalWord[pos] || '';
    setGuess(next.join(''));
  };

  const passWord = () => {
    setGuess(originalWord);
    setResult(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-2"
      >
        {t('scramble_title', { defaultValue: 'Word Scramble' })}
      </motion.h1>
      <QuickNav />
      <div className="text-center mb-4">
        <button
          onClick={fetchWord}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {t('new_game', { defaultValue: 'New Game' })}
        </button>
      </div>
      {loading ? (
        <div>{t('loading')}</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl text-center tracking-widest mb-3">
              {scrambledWord}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t('guessPlaceholder')}
                className="flex-1 p-2 rounded border bg-white dark:bg-gray-800"
              />
              <button
                onClick={submitGuess}
                className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                disabled={result === true}
              >
                {t('guess')}
              </button>
              <button
                onClick={useHint}
                className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                disabled={result === true}
              >
                {t('hint')}
              </button>
              <button
                onClick={result ? fetchWord : passWord}
                className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                {result ? t('next', { defaultValue: 'Next' }) : t('pass')}
              </button>
            </div>
            {result !== null && (
              <div
                className={result ? 'text-green-600 mt-2' : 'text-red-500 mt-2'}
              >
                {result ? t('correct') : t('incorrect')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordScrambleGame;
