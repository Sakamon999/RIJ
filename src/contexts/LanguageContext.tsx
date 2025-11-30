import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  'nav.philosophy': { en: 'Philosophy', ja: '理念' },
  'nav.wellness': { en: 'Wellness', ja: 'ウェルネス' },
  'nav.experiences': { en: 'Experiences', ja: '体験' },
  'nav.destinations': { en: 'Destinations', ja: '目的地' },
  'nav.methodology': { en: 'Methodology', ja: '方法論' },
  'nav.contact': { en: 'Contact', ja: 'お問い合わせ' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
