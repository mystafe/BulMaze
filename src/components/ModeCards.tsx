import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ModeCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Career Mode</CardTitle>
          <CardDescription>Progress through levels and earn XP.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/career">Start</Link>
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick Play</CardTitle>
          <CardDescription>Start a game instantly without login.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="secondary">
            <Link href="/quick">Play</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
