import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

export const defaultNS = 'common';
export const resources = {};

if (!i18n.isInitialized) {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      ns: [defaultNS],
      defaultNS,
      interpolation: { escapeValue: false },
    });
}

export default i18n;
