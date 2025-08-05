'use client';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
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

interface Question {
  question: string;
  options?: string[];
  answer: string;
}

export default function PlacementWizard() {
  const uiLang = useUiStore((s) => s.uiLang);
  const setCEFR = useCareerStore((s) => s.setCEFR);
  const router = useRouter();

  const { t } = useTranslation('career');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    const res = await fetch('/api/ai/placement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uiLang }),
    });
    if (res.ok) {
      const data: Question[] = await res.json();
      const items = data.slice(0, 10);
      setQuestions(items);
      setAnswers(Array(items.length).fill(''));
      setStep(0);
    }
    setLoading(false);
  };

  const submit = async () => {
    const payload = questions.map((q, i) => ({
      question: q.question,
      answer: answers[i],
      correct: answers[i].trim().toLowerCase() === q.answer.toLowerCase(),
    }));
    const res = await fetch('/api/ai/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: payload }),
    });
    if (res.ok) {
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
    }
  };

  if (step === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('placement.title')}</CardTitle>
          <CardDescription>{t('placement.desc')}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button onClick={start} disabled={loading}>
            {loading ? t('loading') : t('placement.start')}
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
          {t('question')} {step + 1}
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
            placeholder={t('answerPlaceholder')}
          />
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={next} disabled={!answers[step]}>
          {step === questions.length - 1 ? t('submit') : t('next')}
        </Button>
      </CardFooter>
    </Card>
  );
}

