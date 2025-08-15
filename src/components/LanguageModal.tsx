'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: string) => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'tr', name: 'Turkish' },
];

export default function LanguageModal({
  isOpen,
  onClose,
  onLanguageSelect,
}: LanguageModalProps) {
  const { t } = useTranslation('common');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleLanguageSelect = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">{t('select_language')}</h2>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="" disabled>
            {t('select_language')}
          </option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleLanguageSelect}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            disabled={!selectedLanguage}
          >
            {t('start_game')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
