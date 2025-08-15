'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { postJSON } from '@/lib/postJson';
import QuickNav from '@/components/QuickNav';

const STEPS = 6;

const HangmanGame = () => {
  const { t } = useTranslation('game');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWord = useCallback(async () => {
    setLoading(true);
    const targetLanguage = localStorage.getItem('targetLanguage') || 'en';
    const data = await postJSON<string>('/api/ai/quick-game', {
      gameType: 'hangman',
      targetLanguage,
      count: 1,
      seed: Date.now(),
    });
    if (typeof data === 'string') {
      setWord(data.toUpperCase());
      setGuessedLetters([]);
      setIncorrectGuesses(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  const handleGuess = (letter: string) => {
    letter = letter.toUpperCase();
    if (guessedLetters.includes(letter) || isGameOver()) return;
    setGuessedLetters((prev) => [...prev, letter]);
    if (!word.includes(letter)) {
      setIncorrectGuesses((n) => n + 1);
    }
  };

  // Global keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[A-Za-zÇĞİÖŞÜçğıöşü]$/.test(key)) {
        handleGuess(key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleGuess]);

  const isGameOver = () =>
    incorrectGuesses >= STEPS ||
    word.split('').every((letter) => guessedLetters.includes(letter));

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-2">
        {t('hangman_title', { defaultValue: 'Hangman' })}
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
        <div>
          {/* Gallows and body parts */}
          <svg width="200" height="180" className="mx-auto mb-4">
            {/* Stand */}
            <line
              x1="10"
              y1="170"
              x2="150"
              y2="170"
              stroke="#444"
              strokeWidth="6"
            />
            <line
              x1="40"
              y1="20"
              x2="40"
              y2="170"
              stroke="#444"
              strokeWidth="6"
            />
            <line
              x1="40"
              y1="20"
              x2="120"
              y2="20"
              stroke="#444"
              strokeWidth="6"
            />
            <line
              x1="120"
              y1="20"
              x2="120"
              y2="40"
              stroke="#444"
              strokeWidth="6"
            />
            {/* Parts */}
            {incorrectGuesses > 0 && (
              <circle
                cx="120"
                cy="55"
                r="15"
                stroke="#e11"
                strokeWidth="4"
                fill="none"
              />
            )}
            {incorrectGuesses > 1 && (
              <line
                x1="120"
                y1="70"
                x2="120"
                y2="110"
                stroke="#e11"
                strokeWidth="4"
              />
            )}
            {incorrectGuesses > 2 && (
              <line
                x1="120"
                y1="80"
                x2="100"
                y2="95"
                stroke="#e11"
                strokeWidth="4"
              />
            )}
            {incorrectGuesses > 3 && (
              <line
                x1="120"
                y1="80"
                x2="140"
                y2="95"
                stroke="#e11"
                strokeWidth="4"
              />
            )}
            {incorrectGuesses > 4 && (
              <line
                x1="120"
                y1="110"
                x2="100"
                y2="130"
                stroke="#e11"
                strokeWidth="4"
              />
            )}
            {incorrectGuesses > 5 && (
              <line
                x1="120"
                y1="110"
                x2="140"
                y2="130"
                stroke="#e11"
                strokeWidth="4"
              />
            )}
          </svg>

          <div className="mb-4 text-3xl tracking-widest">
            {word.split('').map((letter, index) => (
              <span key={index} className="mx-2">
                {guessedLetters.includes(letter) ? letter : '_'}
              </span>
            ))}
          </div>

          {/* On-screen keyboard */}
          <div className="mb-4">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter) || isGameOver()}
                className="m-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="text-xl">
            {t('incorrect')}: {incorrectGuesses} / {STEPS}
          </div>
          {isGameOver() && (
            <div className="mt-4 text-2xl font-bold">
              {word.split('').every((letter) => guessedLetters.includes(letter))
                ? t('correct')
                : `${t('incorrect')}: ${word}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HangmanGame;
