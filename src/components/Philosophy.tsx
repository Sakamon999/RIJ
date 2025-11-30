import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export default function Philosophy() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="philosophy" ref={sectionRef} className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <p className="text-emerald-400 text-sm tracking-widest uppercase font-light">{t('philosophy.subtitle')}</p>
            <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
              {language === 'en' ? (
                <>
                  {t('philosophy.title1')} <span className="font-normal">{t('philosophy.title2')}</span> {t('philosophy.title3')} <span className="font-normal">{t('philosophy.title4')}</span> {t('philosophy.title5')}
                </>
              ) : (
                <>
                  {t('philosophy.title1')}<span className="font-normal">{t('philosophy.title2')}</span>{t('philosophy.title3')}
                </>
              )}
            </h2>
            <div className="w-16 h-0.5 bg-emerald-400" />
            <p className="text-lg text-gray-300 leading-relaxed font-light">
              {t('philosophy.p1')}
            </p>
            <p className="text-lg text-gray-300 leading-relaxed font-light">
              {t('philosophy.p2')}
            </p>
            <p className="text-lg text-gray-300 leading-relaxed font-light">
              {t('philosophy.p3')}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <div className="text-3xl font-light text-emerald-400 mb-2">{t('philosophy.stat1')}</div>
                <div className="text-sm text-gray-400 tracking-wide">{t('philosophy.stat1.label')}</div>
              </div>
              <div>
                <div className="text-3xl font-light text-emerald-400 mb-2">{t('philosophy.stat2')}</div>
                <div className="text-sm text-gray-400 tracking-wide">{t('philosophy.stat2.label')}</div>
              </div>
            </div>
          </div>

          <div className={`relative h-[600px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <img
              src="/u1263267256_Japanese_sand_garden_in_a_Kyoto_temple_--ar_169_-_20c62d9c-d5f5-42f1-a2fe-88de273f1fbc_2.png"
              alt="Japanese zen garden"
              className={`w-full h-full object-cover rounded-lg shadow-2xl transition-transform duration-1000 ${isVisible ? 'scale-100' : 'scale-95'}`}
            />
            <div className={`absolute inset-0 bg-emerald-500/20 rounded-lg transition-opacity duration-1000 ${isVisible ? 'opacity-0' : 'opacity-100'}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
