import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface WordResultCardProps {
  word: string;
  example: string;
  translation: string;
  onNext: () => void;
}

export default function WordResultCard({ word, example, translation, onNext }: WordResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{word}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="italic">{example}</p>
        <p className="text-sm text-muted-foreground">{translation}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={onNext}>Next</Button>
      </CardFooter>
    </Card>
  );
}
