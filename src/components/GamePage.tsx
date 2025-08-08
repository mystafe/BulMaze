// Game screen mockup applying BulMaze branding.
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
        className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--bm-primary)] flex items-center gap-2"
      >
        <Image src="/icons/brain.svg" alt="Brain icon" width={28} height={28} />
        Hızlı Oyun
      </motion.h2>
      <div className="w-full max-w-xl bg-[var(--bm-bg)] dark:bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-[var(--bm-primary)]">
        <QuickGame />
      </div>
    </motion.section>
  );
}
