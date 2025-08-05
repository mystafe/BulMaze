'use client';
import { useEffect, useRef, useState } from 'react';
import { useCareerStore } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
import ConfettiCelebration from './ConfettiCelebration';

export default function LevelProgress() {
  const { xp, requiredXp, levelNumeric } = useCareerStore();
  const value = (xp / requiredXp) * 100;
  const prevLevel = useRef(levelNumeric);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (levelNumeric > prevLevel.current) {
      setCelebrate(true);
      prevLevel.current = levelNumeric;
    }
  }, [levelNumeric]);

  useEffect(() => {
    if (celebrate) {
      const timer = setTimeout(() => setCelebrate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [celebrate]);

  return (
    <div className="relative">
      {celebrate && <ConfettiCelebration />}
      <Progress value={value} className="h-3 rounded-2xl" />
    </div>
  );
}
