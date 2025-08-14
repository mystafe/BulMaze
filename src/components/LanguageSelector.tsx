'use client';

import { useUiStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const uiLang = useUiStore((s) => s.uiLang);
  const setUiLang = useUiStore((s) => s.setUiLang);
  const targetLang = useUiStore((s) => s.targetLang);
  const setTargetLang = useUiStore((s) => s.setTargetLang);

  const handleUILanguageChange = (newLang: string) => {
    setUiLang(newLang);
    i18n.changeLanguage(newLang);

    // Show success message
    toast.success(t('language.changedDesc', { lang: languageMap[newLang] }));
  };

  const handleTargetLanguageChange = (newLang: string) => {
    setTargetLang(newLang);
    toast.success(
      t('language.targetChangedDesc', { lang: languageMap[newLang] }),
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-white dark:bg-gray-800 dark:border-blue-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800 dark:text-gray-200">
            <span className="text-2xl">🌐</span>
            Interface Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <label
              htmlFor="ui-lang-select"
              className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
            >
              UI Language:
            </label>
            <Select value={uiLang} onValueChange={handleUILanguageChange}>
              <SelectTrigger
                id="ui-lang-select"
                className="w-full md:w-[200px] text-base p-4 bg-white dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600">
                {Object.entries(languageMap).map(([code, name]) => (
                  <SelectItem
                    key={code}
                    value={code}
                    className="text-base hover:bg-blue-50 dark:hover:bg-blue-800 cursor-pointer"
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200 bg-white dark:bg-gray-800 dark:border-green-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800 dark:text-gray-200">
            <span className="text-2xl">🎯</span>
            Target Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <label
              htmlFor="target-lang-select"
              className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
            >
              Learn:
            </label>
            <Select
              value={targetLang}
              onValueChange={handleTargetLanguageChange}
            >
              <SelectTrigger
                id="target-lang-select"
                className="w-full md:w-[200px] text-base p-4 bg-white dark:bg-gray-700 border-2 border-green-300 dark:border-green-600 hover:border-green-400 dark:hover:border-green-500 transition-colors"
              >
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-2 border-green-300 dark:border-green-600">
                {Object.entries(languageMap).map(([code, name]) => (
                  <SelectItem
                    key={code}
                    value={code}
                    className="text-base hover:bg-green-50 dark:hover:bg-green-800 cursor-pointer"
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This is the language you want to learn. Daily quests will be
            generated in this language.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
