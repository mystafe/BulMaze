import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nextI18NextConfig from '../../next-i18next.config.mjs';

import enCommon from '../locales/en/common.json';
import enGame from '../locales/en/game.json';
import enCareer from '../locales/en/career.json';

import trCommon from '../locales/tr/common.json';
import trGame from '../locales/tr/game.json';
import trCareer from '../locales/tr/career.json';

import deCommon from '../locales/de/common.json';
import deGame from '../locales/de/game.json';
import deCareer from '../locales/de/career.json';

import esCommon from '../locales/es/common.json';
import esGame from '../locales/es/game.json';
import esCareer from '../locales/es/career.json';

import itCommon from '../locales/it/common.json';
import itGame from '../locales/it/game.json';
import itCareer from '../locales/it/career.json';

import ptCommon from '../locales/pt/common.json';
import ptGame from '../locales/pt/game.json';
import ptCareer from '../locales/pt/career.json';

const resources = {
  en: { common: enCommon, game: enGame, career: enCareer },
  tr: { common: trCommon, game: trGame, career: trCareer },
  de: { common: deCommon, game: deGame, career: deCareer },
  es: { common: esCommon, game: esGame, career: esCareer },
  it: { common: itCommon, game: itGame, career: itCareer },
  pt: { common: ptCommon, game: ptGame, career: ptCareer },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    ...nextI18NextConfig,
    lng: 'en',
    interpolation: { escapeValue: false },
  });
}

export default i18n;

