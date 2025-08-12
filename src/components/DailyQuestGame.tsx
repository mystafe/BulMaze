'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDailyQuestStore } from '@/lib/store';
import Confetti from 'react-confetti';

interface DailyQuestGameProps {
  onQuestComplete: (score: number) => void;
}

export default function DailyQuestGame({
  onQuestComplete,
}: DailyQuestGameProps) {
  const quest = useDailyQuestStore((s) => s.quest);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (quest.length === 0) {
    return <div>No quest available.</div>;
  }

  const currentWord = quest[currentIndex];
  const progress = ((currentIndex + 1) / quest.length) * 100;
  const options = [...currentWord.options, currentWord.word].sort(
    () => Math.random() - 0.5,
  );

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent answering twice

    setSelectedAnswer(answer);
    if (answer === currentWord.word) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex < quest.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      const finalScore =
        correctAnswers + (selectedAnswer === currentWord.word ? 1 : 0);
      onQuestComplete(finalScore);
    }
  };

  if (isFinished) {
    return (
      <div className="text-center">
        <Confetti recycle={false} />
        <h2 className="text-3xl font-bold mb-4">Quest Complete!</h2>
        <p className="text-xl">
          You scored {correctAnswers} out of {quest.length}!
        </p>
        <p className="text-lg mt-2">You earned {correctAnswers * 10} XP!</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Daily Quest: Question {currentIndex + 1}/{quest.length}
        </CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">Definition:</p>
          <p className="text-xl font-semibold">{currentWord.definition}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option) => (
            <Button
              key={option}
              variant={
                selectedAnswer
                  ? option === currentWord.word
                    ? 'default' // Correct answer
                    : option === selectedAnswer
                      ? 'outline' // Wrong selected answer
                      : 'outline'
                  : 'outline'
              }
              className={`h-auto py-4 text-lg ${
                selectedAnswer &&
                option === selectedAnswer &&
                option !== currentWord.word
                  ? 'bg-red-100 border-red-500 text-red-800'
                  : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
            >
              {option}
            </Button>
          ))}
        </div>
        {selectedAnswer && (
          <div className="text-center">
            <Button onClick={handleNext} size="lg">
              {currentIndex < quest.length - 1
                ? 'Next Question'
                : 'Finish Quest'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
