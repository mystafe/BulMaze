'use client';
import { useCareerStore } from '@/lib/store';
import { Progress } from '@/components/ui/progress';

export default function LevelProgress() {
  const { xp, requiredXp } = useCareerStore();
  const value = (xp / requiredXp) * 100;
  return <Progress value={value} />;
}
