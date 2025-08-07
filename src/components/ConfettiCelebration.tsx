'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiCelebration() {
  useEffect(() => {
    const fire = () =>
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    const win = () => fire();
    const placement = () => fire();
    window.addEventListener('bulmaze:win', win);
    window.addEventListener('bulmaze:placement-finished', placement);
    return () => {
      window.removeEventListener('bulmaze:win', win);
      window.removeEventListener('bulmaze:placement-finished', placement);
    };
  }, []);
  return null;
}
