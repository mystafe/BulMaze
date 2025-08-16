'use client';

// Landing section showcasing WordMaster branding on the home page with onboarding flow.

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

export default function HomeLanding() {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const primaryHref = session ? '/trainer' : '/auth/signin';
  const primaryLabel = session
    ? t('cta_learn', { defaultValue: 'Start Learning' })
    : t('sign_in_cta', { defaultValue: 'Sign In to Start' });
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Image src="/logo.svg" alt="WordMaster logo" width={80} height={80} />
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-[var(--bm-primary)] to-[var(--bm-secondary)] bg-clip-text text-transparent">
            WordMaster
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl max-w-2xl text-gray-600 dark:text-gray-300"
        >
          {t('hero_subtitle', {
            defaultValue:
              'Master English vocabulary through interactive word games and spaced repetition learning.',
          })}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link
            href={primaryHref}
            className="px-6 py-3 rounded-lg shadow-lg bg-[var(--bm-primary)] hover:bg-teal-700 text-white flex items-center gap-2"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/quick"
            className="px-6 py-3 rounded-lg shadow-lg bg-[var(--bm-secondary)] hover:bg-amber-600 text-white flex items-center gap-2 transition-colors"
          >
            {t('cta_quick', { defaultValue: 'Quick Games' })}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
