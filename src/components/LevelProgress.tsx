'use client';
import { motion } from 'framer-motion';
import { useCareerStore } from '@/lib/store';
import { requiredXp } from '@/lib/levels';

export default function LevelProgress() {
  const { level, xp } = useCareerStore();
  const max = requiredXp(level);
  const width = (xp / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <motion.div
        className="bg-green-500 h-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
