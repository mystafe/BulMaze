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
import { fetchJson } from '@/lib/fetchJson';

  interface Question {
    id: string;
    type: 'mcq' | 'fill';
    prompt: string;
    options?: string[];
    correct?: string;
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
      const data = await fetchJson<{ items: Question[] }>('/api/ai/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uiLang }),
      });
      const items = data.items.slice(0, 10);
      setQuestions(items);
      setAnswers(Array(items.length).fill(''));
      setStep(0);
    } catch {
      // error handled in fetchJson
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    const payload = questions.map((q, i) => ({
      id: q.id,
      correct: answers[i].trim().toLowerCase() === (q.correct ?? '').toLowerCase(),
    }));
    try {
      const { cefr } = await fetchJson<{ cefr: CEFR }>(
        '/api/ai/evaluate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: payload }),
        },
      );
      const levelNumeric = cefrToNumeric(cefr as CEFR);
      setCEFR(cefr);
      useCareerStore.setState({
        levelNumeric,
        requiredXp: requiredXP(levelNumeric),
      });
      const first = !localStorage.getItem('placementDone');
      if (first) {
        localStorage.setItem('placementDone', '1');
      }
      window.dispatchEvent(new Event('bulmaze:placement-finished'));
      router.push(first ? '/career?celebrate=1#dashboard' : '/career#dashboard');
    } catch {
      // error handled in fetchJson
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
        <CardDescription>{q.prompt}</CardDescription>
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

