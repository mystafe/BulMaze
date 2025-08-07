import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface WordResultCardProps {
  word: string;
  example: string;
  translation: string;
  onNext: () => void;
  loading?: boolean;
}

export default function WordResultCard({ word, example, translation, onNext, loading }: WordResultCardProps) {
  const MotionCard = motion(Card);
  return (
    <MotionCard
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl shadow-md"
    >
      <CardHeader>
        <CardTitle>{word}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="italic">{example}</p>
        <p className="text-sm text-muted-foreground">{translation}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={onNext} aria-label="Next word" disabled={loading}>
          Next
        </Button>
      </CardFooter>
    </MotionCard>
  );
}
