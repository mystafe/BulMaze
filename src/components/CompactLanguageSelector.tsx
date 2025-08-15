'use client';

import { useUiStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const languageMap: { [key: string]: string } = {
  tr: 'TR',
  en: 'EN',
  de: 'DE',
  es: 'ES',
  it: 'IT',
  pt: 'PT',
};

export default function CompactLanguageSelector() {
  const { i18n, t } = useTranslation('common');

  const uiLang = useUiStore((s) => s.uiLang);
  const setUiLang = useUiStore((s) => s.setUiLang);
  const targetLang = useUiStore((s) => s.targetLang);
  const setTargetLang = useUiStore((s) => s.setTargetLang);

  const handleUILanguageChange = (newLang: string) => {
    setUiLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleTargetLanguageChange = (newLang: string) => {
    setTargetLang(newLang);
    localStorage.setItem('targetLanguage', newLang);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={uiLang} onValueChange={handleUILanguageChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={t('ui_language')} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languageMap).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={targetLang} onValueChange={handleTargetLanguageChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={t('target_language')} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languageMap).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
