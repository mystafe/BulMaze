'use client';

import { useEffect } from 'react';

export default function ConfettiCelebration() {
  useEffect(() => {
    let confetti: typeof import('canvas-confetti').default | undefined;
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
    const win = (e: Event) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Confetti event: win', e);
      }
      fire();
    };
    const placement = (e: Event) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Confetti event: placement-finished', e);
      }
      fire();
    };
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
