'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageModal from '@/components/LanguageModal';
import { useRouter } from 'next/navigation';

const games = [
  { id: 'word-scramble', name: 'Word Scramble' },
  { id: 'wordle', name: 'Wordle' },
  { id: 'hangman', name: 'Hangman' },
  { id: 'crossword', name: 'Crossword' },
];

export default function QuickGamesPage() {
  const { t } = useTranslation('game');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const targetLanguage = localStorage.getItem('targetLanguage');
    if (!targetLanguage) {
      setIsModalOpen(true);
    }
  }, []);

  const handleGameClick = (gameId: string) => {
    const targetLanguage = localStorage.getItem('targetLanguage');
    if (targetLanguage) {
      router.push(`/quick/${gameId}`);
    } else {
      setSelectedGame(gameId);
      setIsModalOpen(true);
    }
  };

  const handleLanguageSelect = (language: string) => {
    localStorage.setItem('targetLanguage', language);
    setIsModalOpen(false);
    if (selectedGame) {
      router.push(`/quick/${selectedGame}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-8"
      >
        {t('quick_games')}
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <a
              onClick={() => handleGameClick(game.id)}
              className="block p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <h2 className="text-2xl font-semibold">{game.name}</h2>
            </a>
          </motion.div>
        ))}
      </div>
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLanguageSelect={handleLanguageSelect}
      />
    </div>
  );
}
