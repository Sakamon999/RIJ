import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-light">{language === 'en' ? '日本語' : 'English'}</span>
    </button>
  );
}
