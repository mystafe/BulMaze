'use client';
import { ReactNode, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createInstance, i18n as I18nType } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import nextI18NextConfig from '../../next-i18next.config.mjs';

interface Props {
  locale: string;
  namespaces: string[];
  resources: Record<string, unknown>;
  children: ReactNode;
}

export default function I18nProvider({ locale, namespaces, resources, children }: Props) {
  const i18nRef = useRef<I18nType>();
  if (!i18nRef.current) {
    const i18nInstance = createInstance();
    i18nInstance
      .use(initReactI18next)
      .use(resourcesToBackend((lng: string, ns: string) => import(`../locales/${lng}/${ns}.json`)));
    i18nInstance.init({
      ...nextI18NextConfig,
      lng: locale,
      ns: namespaces,
      resources,
      interpolation: { escapeValue: false },
    });
    i18nRef.current = i18nInstance;
  }
  return <I18nextProvider i18n={i18nRef.current}>{children}</I18nextProvider>;
}
