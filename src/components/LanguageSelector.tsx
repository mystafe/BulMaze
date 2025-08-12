'use client';

import { useUiStore } from '@/lib/store';
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
  const uiLang = useUiStore((s) => s.uiLang);
  const setUiLang = useUiStore((s) => s.setUiLang);

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="ui-lang-select"
        className="font-medium text-gray-700 dark:text-gray-300"
      >
        Interface Language:
      </label>
      <Select value={uiLang} onValueChange={setUiLang}>
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
