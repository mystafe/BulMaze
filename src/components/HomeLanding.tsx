"use client";

// Landing section showcasing BulMaze branding on the home page with onboarding flow.

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HomeLanding() {
  const [phase, setPhase] = useState<'intro' | 'username'>('intro');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const startGame = () => {
    if (!username.trim()) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bm-username', username.trim());
    }
    router.push('/quick');
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
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
              <Button
                onClick={() => setPhase('username')}
                className="px-6 py-3 rounded-lg shadow-lg bg-[var(--bm-primary)] hover:bg-teal-700 text-white flex items-center gap-2"
              >
                Hemen Oyna
              </Button>
              <Link
                href="/career"
                className="px-6 py-3 rounded-lg shadow-lg bg-[var(--bm-secondary)] hover:bg-amber-600 text-white flex items-center gap-2 transition-colors"
              >
                Kariyer Modu
              </Link>
            </motion.div>
          </motion.div>
        )}

        {phase === 'username' && (
          <motion.div
            key="username"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mx-auto"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--bm-primary)] to-[var(--bm-secondary)] bg-clip-text text-transparent">
              Başlayalım!
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Oyuna katılmadan önce bir kullanıcı adı seç.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                startGame();
              }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adı"
                className="max-w-sm"
              />
              <Button
                type="submit"
                disabled={!username.trim()}
                className="px-6 py-3 rounded-lg shadow-lg bg-[var(--bm-primary)] hover:bg-teal-700 text-white"
              >
                Başla
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
