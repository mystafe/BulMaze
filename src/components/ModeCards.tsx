import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ModeCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="transition-transform hover:-translate-y-1">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Career Mode</CardTitle>
            <CardDescription>Progress through levels and earn XP.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/career" aria-label="Start">
                Start
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="transition-transform hover:-translate-y-1">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Quick Play</CardTitle>
            <CardDescription>Start a game instantly without login.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="secondary">
              <Link href="/quick" aria-label="Play">
                Play
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
