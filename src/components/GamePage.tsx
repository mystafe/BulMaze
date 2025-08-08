'use client';

import { motion } from 'framer-motion';
import QuickGame from './QuickGame';

export default function GamePage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center"
    >
      <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl sm:text-4xl font-bold mb-8 text-center"
      >
        Hızlı Oyun
      </motion.h2>
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <QuickGame />
      </div>
    </motion.section>
  );
}
