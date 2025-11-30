import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export default function ExperienceGallery() {
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

  const experiences = [
    {
      titleKey: 'experiences.exp4.title',
      locationKey: 'experiences.exp4.location',
      durationKey: 'experiences.exp4.duration',
      image: '/Tsubamesanjo_bit_1.png',
      descKey: 'experiences.exp4.desc',
      tagKeys: ['experiences.exp4.tag1', 'experiences.exp4.tag2', 'experiences.exp4.tag3']
    },
    {
      titleKey: 'experiences.exp5.title',
      locationKey: 'experiences.exp5.location',
      durationKey: 'experiences.exp5.duration',
      image: '/u1263267256_Create_Zen_temple_and_Zen_monk_cultural_picture_-_0f3c4dee-7e40-4f7d-9e9b-46d56b144f87_3.png',
      descKey: 'experiences.exp5.desc',
      tagKeys: ['experiences.exp5.tag1', 'experiences.exp5.tag2', 'experiences.exp5.tag3']
    },
    {
      titleKey: 'experiences.exp3.title',
      locationKey: 'experiences.exp3.location',
      durationKey: 'experiences.exp3.duration',
      image: '/u1263267256_Please_create_a_picture_for_a_beautiful_onsen_sce_dbcf9f0e-2fee-4395-9062-2fa54c34a125_2.png',
      descKey: 'experiences.exp3.desc',
      tagKeys: ['experiences.exp3.tag1', 'experiences.exp3.tag2', 'experiences.exp3.tag3']
    },
    {
      titleKey: 'experiences.exp1.title',
      locationKey: 'experiences.exp1.location',
      durationKey: 'experiences.exp1.duration',
      image: '/u1263267256_Create_a_picture_for_a_beautiful_Yakushima_big_tr_5484f132-0377-4073-b816-80bae98aa47b_3.png',
      descKey: 'experiences.exp1.desc',
      tagKeys: ['experiences.exp1.tag1', 'experiences.exp1.tag2', 'experiences.exp1.tag3']
    },
    {
      titleKey: 'experiences.exp2.title',
      locationKey: 'experiences.exp2.location',
      durationKey: 'experiences.exp2.duration',
      image: '/u1263267256_Create_a_picture_for_mountain_Kouya_temple_with_m_9b202f79-88f4-4da2-8288-936de4b4dba0_3.png',
      descKey: 'experiences.exp2.desc',
      tagKeys: ['experiences.exp2.tag1', 'experiences.exp2.tag2', 'experiences.exp2.tag3']
    },
    {
      titleKey: 'experiences.exp6.title',
      locationKey: 'experiences.exp6.location',
      durationKey: 'experiences.exp6.duration',
      image: '/u1263267256_Create_a_picture_for_Yoga_in_a_classic_way_--ar_1_f1f2daf6-0bcd-4133-ab53-c235b6b3e5b5_3.png',
      descKey: 'experiences.exp6.desc',
      tagKeys: ['experiences.exp6.tag1', 'experiences.exp6.tag2', 'experiences.exp6.tag3']
    }
  ];

  return (
    <section id="experiences" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-sm tracking-widest uppercase font-light mb-4">{t('experiences.subtitle')}</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            {t('experiences.title')} <span className="font-normal">{t('experiences.title.bold')}</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t('experiences.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience, index) => {
            const isVisible = visibleCards.includes(index);
            const delay = (index % 3) * 150;

            return (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-700 cursor-pointer bg-zinc-900 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${delay}ms`
              }}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={experience.image}
                  alt={t(experience.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-1 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-light text-gray-900 group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-white transition-all duration-300">
                  {t(experience.durationKey)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm opacity-90 mb-2 group-hover:text-emerald-300 transition-colors duration-300">{t(experience.locationKey)}</p>
                  <h3 className="text-2xl font-light mb-3 leading-tight">{t(experience.titleKey)}</h3>
                  <p className="text-sm font-light opacity-95 mb-4 leading-relaxed">{t(experience.descKey)}</p>
                  <div className="flex flex-wrap gap-2">
                    {experience.tagKeys.map((tagKey, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs tracking-wide group-hover:bg-emerald-400/30 transition-all duration-300"
                      >
                        {t(tagKey)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-emerald-700/0 group-hover:bg-emerald-700/10 transition-colors duration-500 pointer-events-none" />
            </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-full text-sm font-normal tracking-wide hover:bg-emerald-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50">
            {t('experiences.button')}
          </button>
        </div>
      </div>
    </section>
  );
}
