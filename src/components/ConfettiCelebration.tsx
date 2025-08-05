'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';

export default function ConfettiCelebration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }, []);

  if (!mounted) return null;
  return createPortal(<></>, document.body);
}
