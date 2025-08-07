import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface WordResultCardProps {
  word: string;
  example: string;
  translation: string;
  onNext: () => void;
  loading?: boolean;
}

export default function WordResultCard({ word, example, translation, onNext, loading }: WordResultCardProps) {
  return (
    <Card className="rounded-2xl shadow-md">
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
    </Card>
  );
}
