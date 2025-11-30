import { Menu, X, Leaf, Languages, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  scrolled: boolean;
  onRIJClick?: () => void;
}

export default function Navigation({ isMenuOpen, setIsMenuOpen, scrolled, onRIJClick }: NavigationProps) {
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('nav.philosophy'), href: '#philosophy' },
    { name: t('nav.wellness'), href: '#wellness' },
    { name: t('nav.experiences'), href: '#experiences' },
    { name: t('nav.destinations'), href: '#destinations' },
    { name: t('nav.methodology'), href: '#methodology' },
    { name: t('nav.contact'), href: '#contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Leaf className={`w-8 h-8 transition-colors ${scrolled ? 'text-emerald-400' : 'text-white'}`} />
            <div>
              <h1 className={`text-xl font-light tracking-wider transition-colors ${
                scrolled ? 'text-white' : 'text-white'
              }`}>
                REBORN IN JAPAN
              </h1>
              <p className={`text-xs tracking-widest transition-colors ${
                scrolled ? 'text-gray-300' : 'text-white/90'
              }`}>
                {language === 'en' ? 'Your Wellness Circle Begins Here' : '日本から始まる、再生へめぐる旅'}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className={`text-sm font-light tracking-wide transition-colors hover:text-emerald-400 ${
                  scrolled ? 'text-gray-200' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-2">
              {onRIJClick && (
                <button
                  onClick={onRIJClick}
                  className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-light tracking-wide transition-all bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>RIJ MVP</span>
                </button>
              )}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-light tracking-wide transition-all ${
                  scrolled
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'en' ? '日本語' : 'English'}</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden transition-colors ${scrolled ? 'text-white' : 'text-white'}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="block text-gray-200 text-sm font-light tracking-wide hover:text-emerald-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {onRIJClick && (
              <button
                onClick={() => {
                  onRIJClick();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-sm font-light tracking-wide hover:from-emerald-600 hover:to-teal-700 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>RIJ MVP</span>
              </button>
            )}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full text-sm font-light tracking-wide hover:bg-emerald-700 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'en' ? '日本語' : 'English'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
