import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import nextI18NextConfig from '../../next-i18next.config.mjs';

export default async function initTranslations(locale: string, namespaces: string[]) {
  const i18n = createInstance();
  i18n.use(
    resourcesToBackend((lng: string, ns: string) =>
      import(`../locales/${lng}/${ns}.json`)
    ),
  );
  await i18n.init({
    ...nextI18NextConfig,
    lng: locale,
    ns: namespaces,
    interpolation: { escapeValue: false },
  });
  return {
    resources: i18n.services.resourceStore.data,
  };
}
