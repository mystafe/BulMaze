import { useTranslation } from 'next-i18next';

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      {t('footer.developed')}
    </footer>
  );
}
