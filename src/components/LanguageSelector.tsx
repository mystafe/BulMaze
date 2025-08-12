'use client';

import { useUiStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const languageMap: { [key: string]: string } = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
};

export default function LanguageSelector() {
  const { i18n, t } = useTranslation('common');
  const { toast } = useToast();
  const uiLang = useUiStore((s) => s.uiLang);
  const setUiLang = useUiStore((s) => s.setUiLang);

  const handleLanguageChange = (newLang: string) => {
    setUiLang(newLang);
    i18n.changeLanguage(newLang);
    
    // Show success message
    toast({
      title: t('language.changed'),
      description: t('language.changedDesc', { lang: languageMap[newLang] }),
      duration: 3000,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="ui-lang-select"
        className="font-medium text-gray-700 dark:text-gray-300"
      >
        Interface Language:
      </label>
      <Select value={uiLang} onValueChange={handleLanguageChange}>
        <SelectTrigger
          id="ui-lang-select"
          className="w-full md:w-[200px] text-base p-4"
        >
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languageMap).map(([code, name]) => (
            <SelectItem key={code} value={code} className="text-base">
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
