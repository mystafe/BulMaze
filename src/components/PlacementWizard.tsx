'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useUiStore, useCareerStore } from '@/lib/store';
import { cefrToNumeric, requiredXP, type CEFR } from '@/lib/levels';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  question: string;
  options?: string[];
  answer: string;
}

export default function PlacementWizard() {
  const uiLang = useUiStore((s) => s.uiLang);
  const setCEFR = useCareerStore((s) => s.setCEFR);
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const start = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uiLang }),
      });
      if (!res.ok) throw new Error('Request failed');
      const data: Question[] = await res.json();
      const items = data.slice(0, 10);
      setQuestions(items);
      setAnswers(Array(items.length).fill(''));
      setStep(0);
    } catch {
      toast.error('Failed to start placement', {
        action: { label: 'Retry', onClick: start },
      });
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    const payload = questions.map((q, i) => ({
      question: q.question,
      answer: answers[i],
      correct: answers[i].trim().toLowerCase() === q.answer.toLowerCase(),
    }));
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) throw new Error('Request failed');
      const { cefr } = await res.json();
      const levelNumeric = cefrToNumeric(cefr as CEFR);
      setCEFR(cefr);
      useCareerStore.setState({
        levelNumeric,
        requiredXp: requiredXP(levelNumeric),
      });
      const first = !localStorage.getItem('placementDone');
      if (first) {
        localStorage.setItem('placementDone', '1');
        router.push('/career?celebrate=1#dashboard');
      } else {
        router.push('/career#dashboard');
      }
    } catch {
      toast.error('Failed to submit answers', {
        action: { label: 'Retry', onClick: submit },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (step === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Placement Test</CardTitle>
          <CardDescription>Start the test to discover your level.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button onClick={start} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Loading...' : 'Start Test'}
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
  const next = () => {
    if (step === questions.length - 1) submit();
    else setStep(step + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {step + 1}
        </CardTitle>
        <CardDescription>{q.question}</CardDescription>
      </CardHeader>
      <CardContent>
        {q.options ? (
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
        <Button onClick={next} disabled={!answers[step] || submitting}>
          {submitting && step === questions.length - 1 && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {step === questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}

