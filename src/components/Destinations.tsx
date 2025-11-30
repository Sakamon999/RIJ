import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export default function Destinations() {
  const { t } = useLanguage();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => [...prev, index]);
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && cardRefs.current[index]) {
          observer.unobserve(cardRefs.current[index]!);
        }
      });
    };
  }, []);

  const destinations = [
    {
      nameKey: 'destinations.kyoto',
      regionKey: 'destinations.kyoto.region',
      specialtyKey: 'destinations.kyoto.specialty',
      image: '/u1263267256_Please_create_a_picture_for_Kyoto_in_autumn_--ar__4f75fdca-2165-43cd-bc5b-70b0946170f2_0.png',
      fallback: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=1920',
      highlightKeys: ['destinations.kyoto.h1', 'destinations.kyoto.h2', 'destinations.kyoto.h3', 'destinations.kyoto.h4']
    },
    {
      nameKey: 'destinations.hakone',
      regionKey: 'destinations.hakone.region',
      specialtyKey: 'destinations.hakone.specialty',
      image: '/u1263267256_Please_create_a_picture_for_a_Hakone_onsen_with_a_d770d264-9bba-4f13-8af5-574ab956a055_1.png',
      fallback: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1920',
      highlightKeys: ['destinations.hakone.h1', 'destinations.hakone.h2', 'destinations.hakone.h3', 'destinations.hakone.h4']
    },
    {
      nameKey: 'destinations.okinawa',
      regionKey: 'destinations.okinawa.region',
      specialtyKey: 'destinations.okinawa.specialty',
      image: '/u1263267256_Please_create_a_picture_for_a_beautiful_Okinawa_b_2e6e0c83-1f82-4b7b-876f-0d1bf4769289_1.png',
      fallback: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920',
      highlightKeys: ['destinations.okinawa.h1', 'destinations.okinawa.h2', 'destinations.okinawa.h3', 'destinations.okinawa.h4']
    },
    {
      nameKey: 'destinations.yakushima',
      regionKey: 'destinations.yakushima.region',
      specialtyKey: 'destinations.yakushima.specialty',
      image: '/u1263267256_Create_a_picture_for_a_beautiful_Yakushima_big_tr_5484f132-0377-4073-b816-80bae98aa47b_2.png',
      fallback: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1920',
      highlightKeys: ['destinations.yakushima.h1', 'destinations.yakushima.h2', 'destinations.yakushima.h3', 'destinations.yakushima.h4']
    }
  ];

  return (
    <section id="destinations" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-sm tracking-widest uppercase font-light mb-4">{t('destinations.subtitle')}</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            {t('destinations.heading')} <span className="font-normal">{t('destinations.heading.bold')}</span> {t('destinations.heading.end')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t('destinations.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {destinations.map((destination, index) => {
            const isVisible = visibleCards.includes(index);
            const delay = (index % 2) * 200;

            return (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-700 cursor-pointer h-[500px] transform ${
                isVisible ? 'opacity-100 translate-x-0 rotate-0' : `opacity-0 ${index % 2 === 0 ? '-translate-x-12' : 'translate-x-12'} rotate-2`
              }`}
              style={{
                transitionDelay: `${delay}ms`
              }}
            >
              <img
                src={destination.image}
                alt={t(destination.nameKey)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== destination.fallback) {
                    target.src = destination.fallback;
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-125 group-hover:rotate-1 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-500" />
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-sm opacity-90 mb-2 tracking-wide">{t(destination.regionKey)}</p>
                <h3 className="text-4xl font-light mb-3">{t(destination.nameKey)}</h3>
                <p className="text-lg font-light opacity-95 mb-6">{t(destination.specialtyKey)}</p>

                <div className="grid grid-cols-2 gap-3">
                  {destination.highlightKeys.map((highlightKey, hIndex) => (
                    <div key={hIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <span className="text-sm font-light">{t(highlightKey)}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-6 px-6 py-2 border border-white rounded-full text-sm font-light tracking-wide hover:bg-emerald-400 hover:border-emerald-400 hover:text-white hover:scale-105 transition-all">
                  {t('destinations.explore')} {t(destination.nameKey)}
                </button>
              </div>
            </div>
            );
          })}
        </div>

        <div className="mt-16 relative overflow-hidden rounded-lg shadow-xl h-[400px]">
          <img
            src="https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-temple-161401.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Discover more destinations"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/90 to-emerald-600/70" />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
            <div>
              <h3 className="text-4xl md:text-5xl font-light mb-4">
                {t('destinations.cta.title')} <span className="font-normal">{t('destinations.cta.title.bold')}</span>
              </h3>
              <p className="text-lg font-light opacity-95 mb-8 max-w-2xl mx-auto">
                {t('destinations.cta.description')}
              </p>
              <button className="px-8 py-4 bg-white text-emerald-900 rounded-full text-sm font-normal tracking-wide hover:bg-white/95 transition-all hover:scale-105">
                {t('destinations.cta.button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
