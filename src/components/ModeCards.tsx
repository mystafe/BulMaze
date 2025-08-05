import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ModeCards() {
  const { t } = useTranslation('common');
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="transition-transform hover:-translate-y-1">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>{t('mode.career.title')}</CardTitle>
            <CardDescription>{t('mode.career.desc')}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/career" aria-label={t('mode.career.start')}>
                {t('mode.career.start')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="transition-transform hover:-translate-y-1">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>{t('mode.quick.title')}</CardTitle>
            <CardDescription>{t('mode.quick.desc')}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="secondary">
              <Link href="/quick" aria-label={t('mode.quick.start')}>
                {t('mode.quick.start')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
