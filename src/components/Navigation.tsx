import { Menu, X, Leaf, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  scrolled: boolean;
}

export default function Navigation({ isMenuOpen, setIsMenuOpen, scrolled }: NavigationProps) {
  const { language, setLanguage, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1920',
      alt: 'Japanese zen garden with morning mist'
    },
    {
      src: '/u1263267256_Create_a_photo_for_a_Japanese_tea_ceremony_in_sil_5272e9e5-7638-40ba-bd96-31dcfd24c828_2.png',
      alt: 'Japanese tea ceremony'
    },
    {
      src: '/u1263267256_Try_to_make_a_real_Japanese_Ikebana_classic_style_9fcecb21-e7de-4108-a79c-65bbcb8d662a_2.png',
      alt: 'Japanese Ikebana flower arrangement'
    },
    {
      src: '/u1263267256_Create_a_photo_for_Onsen_in_wither_snow_--ar_169__30008b5b-62ff-4c73-b422-0badd57f94bb_0.png',
      alt: 'Onsen in winter snow'
    }
  ];

  const navLinks = [
    { name: t('nav.philosophy'), href: '#philosophy' },
    { name: t('nav.wellness'), href: '#wellness' },
    { name: t('nav.experiences'), href: '#experiences' },
    { name: t('nav.destinations'), href: '#destinations' },
    { name: t('nav.methodology'), href: '#methodology' },
    { name: t('nav.contact'), href: '#contact' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 overflow-hidden ${
      scrolled ? 'shadow-sm' : ''
    }`}>
      {!scrolled && (
        <>
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <div className={`absolute inset-0 ${scrolled ? 'bg-black/95 backdrop-blur-md' : ''}`} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
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
