import { useLanguage } from '../contexts/LanguageContext';
import { Activity, Stethoscope, Microscope, HeartPulse, Brain, Eye } from 'lucide-react';

export default function HealthCheck() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Activity,
      titleKey: 'healthcheck.comprehensive.title',
      descKey: 'healthcheck.comprehensive.desc',
      image: '/u1263267256__--ar_169_--raw_--v_7_c3efb133-ff4c-4555-8979-a09787e67a8e_1.png',
      fallback: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      icon: Brain,
      titleKey: 'healthcheck.brain.title',
      descKey: 'healthcheck.brain.desc',
      image: '/u1263267256__--ar_169_--raw_--v_7_c3efb133-ff4c-4555-8979-a09787e67a8e_0.png',
      fallback: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      icon: HeartPulse,
      titleKey: 'healthcheck.cardiac.title',
      descKey: 'healthcheck.cardiac.desc',
      image: '/u1263267256_Create_a_picture_for_Comprehensive_heart_health_e_328512df-c6ad-4fbe-9462-b7591d6ca828_0.png',
      fallback: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      icon: Microscope,
      titleKey: 'healthcheck.cancer.title',
      descKey: 'healthcheck.cancer.desc',
      image: '/u1263267256_Create_a_picture_for_State-of-the-art_early_cance_9477d327-f6e4-4fb4-8d78-cd3181570800_0.png',
      fallback: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      icon: Stethoscope,
      titleKey: 'healthcheck.preventive.title',
      descKey: 'healthcheck.preventive.desc',
      image: '/u1263267256_Create_a_picture_for_Personalized_health_optimiza_d8e48277-97dd-4b10-b178-b7a19b7a9a94_1.png',
      fallback: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      icon: Eye,
      titleKey: 'healthcheck.genomic.title',
      descKey: 'healthcheck.genomic.desc',
      image: '/u1263267256_Create_a_picture_for_DNA_analysis_for_personalize_c1b00433-4809-4d4c-abc9-76dd817287ea_2 (1).png',
      fallback: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1920'
    }
  ];

  return (
    <section id="healthcheck" className="py-24 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-sm tracking-widest uppercase font-light mb-4">
            {t('healthcheck.subtitle')}
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            {t('healthcheck.title1')} <span className="font-normal text-emerald-400">{t('healthcheck.title2')}</span>
          </h2>
          <div className="w-24 h-0.5 bg-emerald-400 mx-auto mb-8" />
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            {t('healthcheck.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={t(service.titleKey)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== service.fallback) {
                        target.src = service.fallback;
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white">
                      {t(service.titleKey)}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 leading-relaxed font-light">
                    {t(service.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-zinc-900 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                {t('healthcheck.why.title')}
              </h3>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-3 mt-1">✓</span>
                  <span className="font-light">{t('healthcheck.why.point1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-3 mt-1">✓</span>
                  <span className="font-light">{t('healthcheck.why.point2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-3 mt-1">✓</span>
                  <span className="font-light">{t('healthcheck.why.point3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-3 mt-1">✓</span>
                  <span className="font-light">{t('healthcheck.why.point4')}</span>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <div className="inline-block bg-black rounded-xl p-8 shadow-lg border border-zinc-800">
                <p className="text-sm text-gray-400 mb-2 font-light tracking-wide">
                  {t('healthcheck.stats.label')}
                </p>
                <p className="text-5xl font-light text-emerald-400 mb-2">
                  {t('healthcheck.stats.number')}
                </p>
                <p className="text-gray-300 font-light">
                  {t('healthcheck.stats.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
