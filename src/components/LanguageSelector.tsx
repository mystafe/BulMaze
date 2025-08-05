'use client';
import { useUiStore } from '@/lib/store';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const languages = ['tr', 'en', 'de', 'es', 'it', 'pt'];

export default function LanguageSelector() {
  const uiLang = useUiStore((s) => s.uiLang);
  const targetLang = useUiStore((s) => s.targetLang);
  const setUiLang = useUiStore((s) => s.setUiLang);
  const setTargetLang = useUiStore((s) => s.setTargetLang);

  return (
    <div className="flex gap-2">
      <Select value={uiLang} onValueChange={setUiLang}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="UI" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((l) => (
            <SelectItem key={l} value={l}>
              {l.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={targetLang} onValueChange={setTargetLang}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Target" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((l) => (
            <SelectItem key={l} value={l}>
              {l.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
