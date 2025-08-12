import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import nextI18NextConfig from '../../next-i18next.config.mjs';

// Central i18n instance with lazy-loaded resources from /src/locales
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lng: string, ns: string) => import(`../locales/${lng}/${ns}.json`),
      ),
    )
    .init({
      ...nextI18NextConfig,
      lng:
        typeof window !== 'undefined'
          ? localStorage.getItem('ui')
            ? JSON.parse(localStorage.getItem('ui')!).state.uiLang
            : 'en'
          : 'en',
      interpolation: { escapeValue: false },
    });
}

export default i18n;
