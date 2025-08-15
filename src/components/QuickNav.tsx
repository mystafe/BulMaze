'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function QuickNav() {
  const { t } = useTranslation('game');
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="opacity-60">
        {t('quick', { defaultValue: 'Quick' })}:
      </span>
      <Link
        href="/quick/word-scramble"
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {t('scramble_title', { defaultValue: 'Word Scramble' })}
      </Link>
      <Link
        href="/quick/wordle"
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {t('wordle_title', { defaultValue: 'Wordle' })}
      </Link>
      <Link
        href="/quick/hangman"
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {t('hangman_title', { defaultValue: 'Hangman' })}
      </Link>
      <Link
        href="/quick/crossword"
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {t('crossword_title', { defaultValue: 'Crossword' })}
      </Link>
    </nav>
  );
}
