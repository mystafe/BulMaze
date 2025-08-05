'use client';
import LevelProgress from '@/components/LevelProgress';
import { useCareerStore } from '@/lib/store';

export default function ProfilePage() {
  const { levelNumeric } = useCareerStore();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Level {levelNumeric}</h2>
      <LevelProgress />
    </div>
  );
}
