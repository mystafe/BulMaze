import path from 'path';

export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'de', 'es', 'it', 'pt'],
  },
  defaultNS: 'common',
  ns: ['common', 'game', 'career'],
  fallbackLng: 'en',
  localePath: path.resolve('./src/locales'),
};
