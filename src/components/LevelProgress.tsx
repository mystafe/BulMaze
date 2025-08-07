'use client';
import { useCareerStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function LevelProgress() {
  const { xp, requiredXp } = useCareerStore();
  const value = (xp / requiredXp) * 100;
  return (
    <div className="h-3 w-full overflow-hidden rounded-2xl bg-secondary shadow-inner">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
