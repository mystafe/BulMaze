'use client';

import { useEffect } from 'react';
import type { Options } from 'canvas-confetti';

export default function ConfettiCelebration() {
  useEffect(() => {
    let confetti: ((options?: Options) => Promise<undefined> | null) | undefined;
    let cancelled = false;

    import('canvas-confetti').then((mod) => {
      if (!cancelled) {
        confetti = mod.default;
      }
    });

    const fire = () => {
      if (confetti) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
    };
    const win = () => fire();
    const placement = () => fire();
    window.addEventListener('bulmaze:win', win);
    window.addEventListener('bulmaze:placement-finished', placement);
    return () => {
      cancelled = true;
      window.removeEventListener('bulmaze:win', win);
      window.removeEventListener('bulmaze:placement-finished', placement);
    };
  }, []);
  return null;
}
