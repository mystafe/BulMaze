'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PlacementWizard from '@/components/PlacementWizard';
import AuthButtons from '@/components/AuthButtons';
import GameBoard from '@/components/GameBoard';
import ConfettiCelebration from '@/components/ConfettiCelebration';
import { Button } from '@/components/ui/button';
import { useCareerStore } from '@/lib/store';

export default function CareerPage() {
  const authEnabled = process.env.FEATURE_AUTH === 'true';
  const [gameStarted, setGameStarted] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const cefr = useCareerStore((s) => s.cefr);

  const searchParams = useSearchParams();
  const router = useRouter();
  const celebrate = searchParams.get('celebrate') === '1';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#dashboard') {
      setShowDashboard(true);
    }
  }, []);

  useEffect(() => {
    if (celebrate) {
      router.replace('/career#dashboard');
    }
  }, [celebrate, router]);

  if (gameStarted) {
    return <GameBoard />;
  }

  if (showDashboard) {
    return (
      <div className="space-y-4" id="dashboard">
        {celebrate && <ConfettiCelebration />}
        <h1 className="text-2xl font-bold">Career Dashboard</h1>
        <p>Your level: {cefr}</p>
        <Button onClick={() => setGameStarted(true)}>Start Career Game</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {authEnabled ? <AuthButtons /> : <PlacementWizard />}
    </div>
  );
}

