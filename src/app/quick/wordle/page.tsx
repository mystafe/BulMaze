'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { postJSON } from '@/lib/postJson';
import QuickNav from '@/components/QuickNav';

const WordleGame = () => {
  const { t } = useTranslation('game');
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWord = useCallback(async () => {
    setLoading(true);
    const targetLanguage = localStorage.getItem('targetLanguage') || 'en';
    const data = await postJSON<string>('/api/ai/quick-game', {
      gameType: 'wordle',
      targetLanguage,
      count: 1,
      seed: Date.now(),
    });
    if (typeof data === 'string') {
      const upper = data.toUpperCase();
      setWord(upper);
      setGuesses(Array(6).fill(''));
      setCurrentGuess('');
      setIsGameOver(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isGameOver) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      submitGuess();
    } else if (e.key === 'Backspace') {
      // allow normal backspace via onChange as well
      return;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGameOver) return;
    const value = e.target.value.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, '');
    setCurrentGuess(value.slice(0, word.length));
  };

  const submitGuess = () => {
    if (isGameOver || currentGuess.length !== word.length) return;
    const newGuesses = [...guesses];
    const emptyIndex = newGuesses.findIndex((g) => g === '');
    if (emptyIndex === -1) return;
    newGuesses[emptyIndex] = currentGuess;
    setGuesses(newGuesses);
    setCurrentGuess('');
    if (currentGuess === word || emptyIndex === newGuesses.length - 1) {
      setIsGameOver(true);
    }
  };

  const getTileColor = (
    letter: string | undefined,
    index: number,
    guess: string,
  ) => {
    if (!guess) return 'bg-gray-300 dark:bg-gray-700';
    if (letter === word[index]) return 'bg-green-500';
    if (letter && word.includes(letter)) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">
        {t('wordle_title', { defaultValue: 'Wordle' })}
      </h1>
      <QuickNav />
      <button
        onClick={fetchWord}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {t('new_game')}
      </button>
      {loading ? (
        <div>{t('loading')}</div>
      ) : (
        <div className="flex flex-col items-center">
          <div
            className="mb-4"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${word.length}, 3rem)`,
              gap: '0.25rem',
            }}
          >
            {guesses.map((guess, i) =>
              Array(word.length)
                .fill(0)
                .map((_, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-12 h-12 flex items-center justify-center text-2xl font-bold text-white ${getTileColor(guess[j], j, guess)}`}
                  >
                    {guess[j] ||
                      (i === guesses.findIndex((g) => g === '')
                        ? currentGuess[j]
                        : '')}
                  </div>
                )),
            )}
          </div>
          <input
            type="text"
            value={currentGuess}
            onChange={onChange}
            onKeyDown={onKeyDown}
            maxLength={word.length || 5}
            className="w-40 text-center text-xl p-2 border rounded"
            disabled={isGameOver}
          />
          <button
            onClick={submitGuess}
            className="mt-2 px-3 py-2 bg-emerald-600 text-white rounded"
          >
            {t('guess')}
          </button>
          {isGameOver && (
            <div className="mt-4 text-xl">
              {guesses.includes(word)
                ? t('correct')
                : `${t('incorrect')}: ${word}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordleGame;
