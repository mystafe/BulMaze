'use client';
import { useUiStore } from '@/lib/store';

const languages = ['tr','en','de','es','it','pt'];

export default function LanguageSelector() {
  const { uiLang, targetLang } = useUiStore();
  const setUiLang = (lang: string) => useUiStore.setState({ uiLang: lang });
  const setTargetLang = (lang: string) => useUiStore.setState({ targetLang: lang });
  return (
    <div className="flex gap-2">
      <select
        aria-label="UI Language"
        value={uiLang}
        onChange={(e) => setUiLang(e.target.value)}
        className="border p-1 rounded"
      >
        {languages.map((l) => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>
      <select
        aria-label="Target Language"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
        className="border p-1 rounded"
      >
        {languages.map((l) => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
