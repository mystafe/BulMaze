'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { initCard, review, type CardState } from '@/lib/spacedRepetition';

interface VocabItem {
  id: number;
  word: string;
  translation: string;
  definition: string;
  example: string;
  state: CardState;
}

interface VocabTrainerProps {
  initialQueue?: VocabItem[];
}

const sampleQueue: VocabItem[] = [
  {
    id: 1,
    word: 'serendipity',
    translation: 'serendipity',
    definition:
      'The occurrence and development of events by chance in a happy or beneficial way',
    example: 'Finding that book was pure serendipity.',
    state: initCard(),
  },
  {
    id: 2,
    word: 'ephemeral',
    translation: 'ephemeral',
    definition: 'Lasting for a very short time; transitory',
    example: 'The beauty of cherry blossoms is ephemeral.',
    state: initCard(),
  },
  {
    id: 3,
    word: 'ubiquitous',
    translation: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous in modern society.',
    state: initCard(),
  },
  {
    id: 4,
    word: 'eloquent',
    translation: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    example: 'She gave an eloquent speech about climate change.',
    state: initCard(),
  },
  {
    id: 5,
    word: 'resilient',
    translation: 'resilient',
    definition:
      'Able to withstand or recover quickly from difficult conditions',
    example: 'The community showed how resilient it was after the storm.',
    state: initCard(),
  },
];

export default function VocabTrainer({
  initialQueue = sampleQueue,
}: VocabTrainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  const current = initialQueue[currentIndex];

  const handleRate = useCallback(
    (quality: 0 | 3 | 4 | 5) => {
      if (!current) return;

      const newState = review(current.state, quality);
      console.log('Reviewed', current.word, newState);

      setSessionStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        correct: quality >= 4 ? prev.correct + 1 : prev.correct,
        incorrect: quality < 4 ? prev.incorrect + 1 : prev.incorrect,
      }));

      if (currentIndex < initialQueue.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setShowAnswer(false);
      }
    },
    [current, currentIndex, initialQueue.length],
  );

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setShowAnswer((prev) => !prev);
      } else if (e.key === '1') handleRate(0);
      else if (e.key === '2') handleRate(3);
      else if (e.key === '3') handleRate(4);
      else if (e.key === '4') handleRate(5);
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [handleRate]);

  if (!current) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Session Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg">
              <p>Total words: {sessionStats.total}</p>
              <p>Correct: {sessionStats.correct}</p>
              <p>Incorrect: {sessionStats.incorrect}</p>
              <p className="text-xl font-bold mt-2">
                Accuracy:{' '}
                {sessionStats.total > 0
                  ? Math.round(
                      (sessionStats.correct / sessionStats.total) * 100,
                    )
                  : 0}
                %
              </p>
            </div>
            <Progress
              value={(sessionStats.total / sessionStats.total) * 100}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / initialQueue.length) * 100;

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>
            Progress: {currentIndex + 1} / {initialQueue.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            {current.word}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAnswer ? (
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                  Definition:
                </h4>
                <p className="text-lg">{current.definition}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                  Example:
                </h4>
                <p className="text-lg italic">&ldquo;{current.example}&rdquo;</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Press{' '}
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">
                  Space
                </kbd>{' '}
                to reveal the answer
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <Button
            onClick={() => handleRate(0)}
            variant="outline"
            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
          >
            Again (1)
          </Button>
          <Button
            onClick={() => handleRate(3)}
            variant="outline"
            className="flex-1"
          >
            Hard (2)
          </Button>
          <Button onClick={() => handleRate(4)} className="flex-1">
            Good (3)
          </Button>
          <Button
            onClick={() => handleRate(5)}
            variant="secondary"
            className="flex-1"
          >
            Easy (4)
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Keyboard shortcuts: 1=Again, 2=Hard, 3=Good, 4=Easy</p>
      </div>
    </div>
  );
}
