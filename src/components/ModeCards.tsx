import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ModeCards() {
  const { t } = useTranslation('common');
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('mode.career.title')}</CardTitle>
          <CardDescription>{t('mode.career.desc')}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/career">{t('mode.career.start')}</Link>
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('mode.quick.title')}</CardTitle>
          <CardDescription>{t('mode.quick.desc')}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="secondary">
            <Link href="/quick">{t('mode.quick.start')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
