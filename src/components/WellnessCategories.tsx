import { Droplets, Flower2, Trees, UtensilsCrossed, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface WellnessCategoriesProps {
  onTojiClick?: () => void;
  onZenClick?: () => void;
  onShinrinyokuClick?: () => void;
  onShokuyojoClick?: () => void;
  onMatsuriClick?: () => void;
}

export default function WellnessCategories({ onTojiClick, onZenClick, onShinrinyokuClick, onShokuyojoClick, onMatsuriClick }: WellnessCategoriesProps) {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    {
      icon: Droplets,
      letter: '1',
      titleKey: 'pillars.toji.title',
      subtitleKey: 'pillars.toji.subtitle',
      descKey: 'pillars.toji.desc',
      image: '/u1263267256_Please_create_a_picture_for_a_beautiful_onsen_sce_dbcf9f0e-2fee-4395-9062-2fa54c34a125_2.png',
      color: 'blue'
    },
    {
      icon: Flower2,
      letter: '2',
      titleKey: 'pillars.zen.title',
      subtitleKey: 'pillars.zen.subtitle',
      descKey: 'pillars.zen.desc',
      image: '/Gemini_Generated_Image.jpg',
      color: 'rose'
    },
    {
      icon: Trees,
      letter: '3',
      titleKey: 'pillars.shinrin.title',
      subtitleKey: 'pillars.shinrin.subtitle',
      descKey: 'pillars.shinrin.desc',
      image: '/Gemini_Shinrinyoku.jpg',
      color: 'emerald'
    },
    {
      icon: UtensilsCrossed,
      letter: '4',
      titleKey: 'pillars.shokuyojo.title',
      subtitleKey: 'pillars.shokuyojo.subtitle',
      descKey: 'pillars.shokuyojo.desc',
      image: '/u1263267256_Create_a_picture_for_a_Kyoto_Kaiseki_dishes_--ar__c7ca1901-f733-472b-a368-4cf939758789_2.png',
      color: 'amber'
    },
    {
      icon: Users,
      letter: '5',
      titleKey: 'pillars.matsuri.title',
      subtitleKey: 'pillars.matsuri.subtitle',
      descKey: 'pillars.matsuri.desc',
      image: '/Festival_Japan.png',
      color: 'orange'
    }
  ];

  const calculateTransform = (index: number) => {
    if (hoveredIndex === index) {
      const xRotation = (mousePosition.y - window.innerHeight / 2) / 50;
      const yRotation = (mousePosition.x - window.innerWidth / 2) / 50;
      return `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }
    return '';
  };

  return (
    <section id="wellness" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-sm tracking-widest uppercase font-light mb-4">{t('pillars.subtitle')}</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            {t('pillars.heading')}
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {t('pillars.description')}
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category, index) => {
              const Icon = category.icon;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    if (index === 0 && onTojiClick) {
                      onTojiClick();
                    } else if (index === 1 && onZenClick) {
                      onZenClick();
                    } else if (index === 2 && onShinrinyokuClick) {
                      onShinrinyokuClick();
                    } else if (index === 3 && onShokuyojoClick) {
                      onShokuyojoClick();
                    }
                  }}
                  className="group relative overflow-hidden rounded-lg bg-zinc-900 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 cursor-pointer transform hover:scale-105"
                  style={{
                    transform: calculateTransform(index)
                  }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={t(category.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 transition-all duration-500" />
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-500" />

                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <span className="text-emerald-400 text-xl font-normal">{category.letter}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Icon className="w-8 h-8 mb-3 text-emerald-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                      <h3 className="text-2xl font-light mb-1">{t(category.titleKey)}</h3>
                      <p className="text-sm opacity-90 tracking-wide text-emerald-300">{t(category.subtitleKey)}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 leading-relaxed font-light text-sm">
                      {t(category.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {categories.slice(3, 5).map((category, index) => {
              const Icon = category.icon;

              return (
                <div
                  key={index + 3}
                  onMouseEnter={() => setHoveredIndex(index + 3)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    if (index === 0 && onShokuyojoClick) {
                      onShokuyojoClick();
                    } else if (index === 1 && onMatsuriClick) {
                      onMatsuriClick();
                    }
                  }}
                  className="group relative overflow-hidden rounded-lg bg-zinc-900 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 cursor-pointer transform hover:scale-105"
                  style={{
                    transform: calculateTransform(index + 3)
                  }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={t(category.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 transition-all duration-500" />
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-500" />

                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <span className="text-emerald-400 text-xl font-normal">{category.letter}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Icon className="w-8 h-8 mb-3 text-emerald-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                      <h3 className="text-2xl font-light mb-1">{t(category.titleKey)}</h3>
                      <p className="text-sm opacity-90 tracking-wide text-emerald-300">{t(category.subtitleKey)}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 leading-relaxed font-light text-sm">
                      {t(category.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
