import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <LanguageSelector />
      <ThemeToggle />
    </div>
  );
}
