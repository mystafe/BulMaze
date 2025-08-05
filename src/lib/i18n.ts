import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en/common.json';
import tr from '@/locales/tr/common.json';
import de from '@/locales/de/common.json';
import es from '@/locales/es/common.json';
import it from '@/locales/it/common.json';
import pt from '@/locales/pt/common.json';

export const defaultNS = 'common';
export const resources = {
  en: { [defaultNS]: en },
  tr: { [defaultNS]: tr },
  de: { [defaultNS]: de },
  es: { [defaultNS]: es },
  it: { [defaultNS]: it },
  pt: { [defaultNS]: pt },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    defaultNS,
    interpolation: { escapeValue: false },
  });
}

export default i18n;
