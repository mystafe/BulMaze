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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUiStore, useCareerStore } from '@/lib/store';
import { cefrToNumeric, requiredXP, type CEFR } from '@/lib/levels';
import { fetchJson } from '@/lib/fetchJson';

interface Question {
  id: string;
  type: 'mcq' | 'fill';
  prompt: string;
  options?: string[];
}

type Phase = 'intro' | 'test' | 'result';

export default function PlacementWizard() {
  const uiLang = useUiStore((s) => s.uiLang);
  const setCEFR = useCareerStore((s) => s.setCEFR);
  const setLevelNumeric = useCareerStore((s) => s.setLevelNumeric);
  const setRequiredXP = useCareerStore((s) => s.setRequiredXP);
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('intro');
  const [items, setItems] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
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
      const list = data.items.slice(0, 10);
      setItems(list);
      setAnswers({});
      setIndex(0);
      setPhase('test');
    } catch {
      // error handled in fetchJson
    } finally {
      setLoading(false);
    }
  };

  const recordAnswer = (val: string) => {
    const q = items[index];
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  const next = () => {
    const q = items[index];
    if (!answers[q.id]) return;
    if (index === items.length - 1) {
      void submit();
    } else {
      setIndex(index + 1);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setPhase('result');
    const payload = items.map((q) => ({ id: q.id, answer: answers[q.id] || '' }));
    try {
      const { cefr } = await fetchJson<{ cefr: CEFR }>(
        '/api/ai/evaluate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: payload }),
        },
      );
      const levelNumeric = cefrToNumeric(cefr);
      setCEFR(cefr);
      setLevelNumeric(levelNumeric);
      setRequiredXP(requiredXP(levelNumeric));
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

  if (phase === 'intro') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Placement Test</CardTitle>
          <CardDescription>Start the test to discover your level.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button onClick={start} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Loading...' : 'Begin test'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (phase === 'result') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evaluating...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const q = items[index];
  const currentAnswer = answers[q.id] || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
        <CardDescription>{q.prompt}</CardDescription>
      </CardHeader>
      <CardContent>
        {q.options ? (
          <div className="grid gap-2">
            {q.options.map((opt) => (
              <Button
                key={opt}
                variant={currentAnswer === opt ? 'default' : 'outline'}
                onClick={() => recordAnswer(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        ) : (
          <Input
            value={currentAnswer}
            onChange={(e) => recordAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && currentAnswer && next()}
            placeholder="Your answer"
          />
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={next} disabled={!currentAnswer || submitting}>
          {submitting && index === items.length - 1 && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {index === items.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}

