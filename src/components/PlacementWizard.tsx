'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MCQ {
  id: number;
  type: 'mcq';
  prompt: string;
  options: string[];
  answer: string;
}
interface Fill {
  id: number;
  type: 'fill';
  prompt: string;
  answer: string;
}
type Question = MCQ | Fill;

const questions: Question[] = [
  { id: 1, type: 'mcq', prompt: 'Select the correct article for "apple"', options: ['a', 'an', 'the', 'no article'], answer: 'an' },
  { id: 2, type: 'mcq', prompt: 'Past tense of "go"', options: ['goed', 'went', 'gone', 'goes'], answer: 'went' },
  { id: 3, type: 'mcq', prompt: 'Which is a noun?', options: ['quick', 'run', 'happiness', 'blue'], answer: 'happiness' },
  { id: 4, type: 'mcq', prompt: 'Synonym of "small"', options: ['tiny', 'huge', 'long', 'wide'], answer: 'tiny' },
  { id: 5, type: 'mcq', prompt: 'Opposite of "hot"', options: ['warm', 'cold', 'boiling', 'melted'], answer: 'cold' },
  { id: 6, type: 'fill', prompt: 'Translate to English: "bonjour"', answer: 'hello' },
  { id: 7, type: 'fill', prompt: 'Fill in: She ___ to school.', answer: 'goes' },
  { id: 8, type: 'fill', prompt: 'What is 5 + 7?', answer: '12' },
  { id: 9, type: 'fill', prompt: 'Spell the word meaning opposite of "yes"', answer: 'no' },
  { id: 10, type: 'fill', prompt: 'Type the color of the clear sky', answer: 'blue' },
];

export default function PlacementWizard() {
  const [step, setStep] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

  if (step === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Placement Test</CardTitle>
          <CardDescription>Start the test to discover your level.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button onClick={() => setStep(0)}>Start Test</Button>
        </CardFooter>
      </Card>
    );
  }

  if (step >= questions.length) {
    const score = questions.reduce(
      (acc, q, i) => acc + (answers[i].trim().toLowerCase() === q.answer.toLowerCase() ? 1 : 0),
      0
    );
    return (
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>
            You scored {score} out of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button
            onClick={() => {
              setStep(null);
              setAnswers(Array(questions.length).fill(''));
            }}
          >
            Restart
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const q = questions[step];
  const setAnswer = (val: string) =>
    setAnswers((prev) => {
      const copy = [...prev];
      copy[step] = val;
      return copy;
    });
  const next = () => setStep(step + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {step + 1}</CardTitle>
        <CardDescription>{q.prompt}</CardDescription>
      </CardHeader>
      <CardContent>
        {q.type === 'mcq' ? (
          <div className="grid gap-2">
            {q.options.map((opt) => (
              <Button
                key={opt}
                variant={answers[step] === opt ? 'default' : 'outline'}
                onClick={() => setAnswer(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        ) : (
          <Input
            value={answers[step]}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && answers[step] && next()}
            placeholder="Your answer"
          />
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={next} disabled={!answers[step]}>
          {step === questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}
