import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function Hero() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1920',
      alt: 'Japanese zen garden with morning mist',
      fallback: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      src: '/u1263267256_Create_a_photo_for_a_Japanese_tea_ceremony_in_sil_5272e9e5-7638-40ba-bd96-31dcfd24c828_2.png',
      alt: 'Japanese tea ceremony',
      fallback: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      src: '/u1263267256_Try_to_make_a_real_Japanese_Ikebana_classic_style_9fcecb21-e7de-4108-a79c-65bbcb8d662a_2.png',
      alt: 'Japanese Ikebana flower arrangement',
      fallback: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      src: '/u1263267256_Create_a_photo_for_Onsen_in_wither_snow_--ar_169__30008b5b-62ff-4c73-b422-0badd57f94bb_0.png',
      alt: 'Onsen in winter snow',
      fallback: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1920'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-10" />

      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== image.fallback) {
              target.src = image.fallback;
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ${
            index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            transformOrigin: 'left center'
          }}
        />
      ))}

      <div className="relative z-20 text-center text-white px-6 max-w-5xl mx-auto">
        <div className="space-y-6 animate-fade-in">
          <p className="text-sm md:text-base tracking-widest font-light uppercase opacity-90">
            {t('hero.subtitle')}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight">
            {t('hero.title1').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('hero.title1').split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed opacity-95">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button className="px-8 py-4 bg-white text-emerald-900 rounded-full text-sm font-normal tracking-wide hover:bg-white/95 transition-all hover:scale-105">
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </div>

      <a href="#philosophy" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white opacity-75" />
      </a>
    </section>
  );
}
