'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { initCard, review, type CardState } from '@/lib/spacedRepetition';

interface VocabItem {
  id: number;
  word: string;
  translation: string;
  state: CardState;
}

interface VocabTrainerProps {
  initialQueue?: VocabItem[];
}

const sampleQueue: VocabItem[] = [
  { id: 1, word: 'ябълка', translation: 'apple', state: initCard() },
  { id: 2, word: 'котка', translation: 'cat', state: initCard() },
  { id: 3, word: 'куче', translation: 'dog', state: initCard() },
];

export default function VocabTrainer({ initialQueue = sampleQueue }: VocabTrainerProps) {
  const [queue, setQueue] = useState<VocabItem[]>(initialQueue);

  const handleRate = useCallback((quality: 0 | 3 | 4 | 5) => {
    setQueue((prev) => {
      const current = prev[0];
      if (!current) return prev;
      const newState = review(current.state, quality);
      console.log('Reviewed', current.word, newState);
      return prev.slice(1);
    });
  }, []);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === '1') handleRate(0);
      if (e.key === '2') handleRate(3);
      if (e.key === '3') handleRate(4);
      if (e.key === '4') handleRate(5);
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [handleRate]);

  if (!queue.length) {
    return <div className="p-8 text-center text-xl">You&apos;re done for today🎉</div>;
  }

  const current = queue[0];

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl">{current.word}</CardTitle>
        </CardHeader>
        <CardContent>
          <details>
            <summary className="cursor-pointer select-none text-muted-foreground">Show answer</summary>
            <p className="mt-2 text-lg">{current.translation}</p>
          </details>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <Button onClick={() => handleRate(0)}>Again (0)</Button>
          <Button onClick={() => handleRate(3)}>Hard (3)</Button>
          <Button onClick={() => handleRate(4)}>Good (4)</Button>
          <Button onClick={() => handleRate(5)}>Easy (5)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

