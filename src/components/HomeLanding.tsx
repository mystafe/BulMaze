'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeLanding() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      >
        BulMaze
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg sm:text-xl max-w-2xl text-gray-600 dark:text-gray-300"
      >
        Zeka oyunlarıyla dil becerilerini geliştir.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-wrap gap-4 justify-center"
      >
        <Link
          href="/quick"
          className="px-6 py-3 rounded-lg shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          Hemen Oyna
        </Link>
        <Link
          href="/career"
          className="px-6 py-3 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
        >
          Kariyer Modu
        </Link>
      </motion.div>
    </section>
  );
}
