// Landing section showcasing BulMaze branding on the home page.
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeLanding() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Image src="/logo.svg" alt="BulMaze logo" width={80} height={80} />
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-[var(--bm-primary)] to-[var(--bm-secondary)] bg-clip-text text-transparent">
          BulMaze
        </h1>
      </motion.div>
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
          className="px-6 py-3 rounded-lg shadow-lg bg-[var(--bm-primary)] hover:bg-teal-700 text-white flex items-center gap-2 transition-colors"
        >
          <Image src="/icons/maze.svg" alt="Maze icon" width={20} height={20} />
          Hemen Oyna
        </Link>
        <Link
          href="/career"
          className="px-6 py-3 rounded-lg shadow-lg bg-[var(--bm-secondary)] hover:bg-amber-600 text-white flex items-center gap-2 transition-colors"
        >
          <Image src="/icons/trophy.svg" alt="Trophy icon" width={20} height={20} />
          Kariyer Modu
        </Link>
      </motion.div>
    </section>
  );
}
