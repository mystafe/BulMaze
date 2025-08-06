'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Error boundary triggered');
  }, []);
  void error;

  return (
    <div className="p-8 text-center space-y-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p>We’re working on it. Please try again.</p>
      <button className="underline" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
