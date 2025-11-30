import { ArrowLeft, Droplets, CheckCircle2, Calendar, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { useState, useEffect, useRef } from 'react';

interface TojiPageProps {
  onBack: () => void;
}

export default function TojiPage({ onBack }: TojiPageProps) {
  const { t } = useLanguage();
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => [...prev, index]);
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && sectionRefs.current[index]) {
          observer.unobserve(sectionRefs.current[index]!);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <LanguageToggle />
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-500/30 hover:border-emerald-500/50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-light tracking-wide">{t('matsuri.back')}</span>
      </button>

      <div className="pt-24">
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Toji Hot Spring"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-3 mb-6 px-6 py-3 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30">
              <Droplets className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 text-sm tracking-widest uppercase font-light">{t('toji.pillar')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-wide leading-tight mb-6">
              {t('toji.title')}
            </h1>
            <p className="text-2xl md:text-3xl font-light text-emerald-300 mb-4">
              {t('toji.subtitle')}
            </p>
            <div className="w-24 h-0.5 bg-emerald-400 mx-auto" />
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[0] = el)}
          className={`py-16 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="bg-gradient-to-br from-emerald-900/20 to-zinc-900/40 rounded-2xl p-8 md:p-12 border border-emerald-500/20">
              <h2 className="text-3xl md:text-4xl font-light text-emerald-400 mb-6 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-4" />
                {t('toji.summary.title')}
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed font-light text-lg">
                <p>
                  <strong className="text-white font-normal">Toji</strong> {t('toji.summary.p1')}
                </p>
                <p>
                  {t('toji.summary.p2.start')} <strong className="text-emerald-400 font-normal">RIJ</strong>{t('toji.summary.p2.mid')} <strong className="text-white font-normal">{t('toji.summary.p2.mid2')}</strong>{t('toji.summary.p2.mid3')} <strong className="text-white font-normal">{t('toji.summary.p2.mid4')}</strong>{t('toji.summary.p2.mid5')} <strong className="text-white font-normal">{t('toji.summary.p2.end')}</strong>{t('toji.summary.p2.end2')}
                </p>
                <p>
                  {t('toji.summary.p3')} <strong className="text-emerald-400 font-normal">{t('toji.summary.p3.bold')}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className={`py-20 bg-black transition-all duration-1000 ${
            visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
              {t('toji.meaning.title.start')}<span className="text-emerald-400 font-normal">{t('toji.meaning.title.rij')}</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105">
                <h3 className="text-2xl font-light text-emerald-400 mb-4 flex items-center">
                  <CheckCircle2 className="w-6 h-6 mr-3" />
                  {t('toji.leisure.title')}
                </h3>
                <p className="text-gray-300 leading-relaxed font-light">
                  {t('toji.leisure.p1')} <strong className="text-white">{t('toji.leisure.p1.bold')}</strong> {t('toji.leisure.p1.mid')} <strong className="text-emerald-300">{t('toji.leisure.p1.end')}</strong> {t('toji.leisure.p1.end2')}
                </p>
                <p className="text-gray-300 leading-relaxed font-light mt-4">
                  {t('toji.leisure.p2')} <strong className="text-white">{t('toji.leisure.p2.bold')}</strong> {t('toji.leisure.p2.mid')} <strong className="text-emerald-300">{t('toji.leisure.p2.end')}</strong> {t('toji.leisure.p2.end2')}
                </p>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105">
                <h3 className="text-2xl font-light text-emerald-400 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3" />
                  {t('toji.evidence.title')}
                </h3>
                <p className="text-gray-300 leading-relaxed font-light">
                  {t('toji.evidence.p1')} <strong className="text-white">{t('toji.evidence.p1.bold')}</strong>{t('toji.evidence.p1.mid')} <strong className="text-emerald-300">{t('toji.evidence.p1.end')}</strong> {t('toji.evidence.p1.end2')}
                </p>
                <p className="text-gray-300 leading-relaxed font-light mt-4">
                  {t('toji.evidence.p2')} <strong className="text-white">{t('toji.evidence.p2.bold')}</strong> {t('toji.evidence.p2.mid')} <strong className="text-emerald-300">{t('toji.evidence.p2.end')}</strong> {t('toji.evidence.p2.end2')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className={`py-20 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
              {t('toji.signature.title')}
            </h2>

            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <h3 className="text-3xl font-light text-emerald-400 mb-4">
                    {t('toji.access.badge1')}
                  </h3>
                  <p className="text-sm text-emerald-300 mb-6 tracking-wide uppercase font-light">{t('toji.access.badge2')}</p>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('toji.access.p1')}
                    </p>
                    <p>
                      {t('toji.access.p2')}
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <img
                    src="https://images.pexels.com/photos/5137664/pexels-photo-5137664.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Authentic Onsen"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                    src="https://images.pexels.com/photos/2563681/pexels-photo-2563681.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Guided Bathing"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-light text-emerald-400 mb-4">
                    {t('toji.guided.badge')}
                  </h3>
                  <p className="text-sm text-emerald-300 mb-6 tracking-wide uppercase font-light">{t('toji.guided.title')}</p>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('toji.guided.p1')}
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3 mt-1">•</span>
                        <span>{t('toji.guided.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3 mt-1">•</span>
                        <span>{t('toji.guided.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3 mt-1">•</span>
                        <span>{t('toji.guided.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3 mt-1">•</span>
                        <span>{t('toji.guided.l4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          className={`py-20 bg-black transition-all duration-1000 ${
            visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
              {t('toji.personalize.title')}
            </h2>

            <div className="bg-gradient-to-br from-emerald-900/30 to-zinc-900/50 rounded-2xl p-10 border border-emerald-500/20">
              <h3 className="text-2xl font-light text-emerald-400 mb-6">
                {t('toji.personalize.subtitle')}
              </h3>
              <p className="text-sm text-emerald-300 mb-8 tracking-wide uppercase font-light">{t('toji.personalize.badge')}</p>

              <div className="space-y-6 text-gray-300 leading-relaxed font-light">
                <p>
                  {t('toji.personalize.p1')}
                </p>

                <div className="bg-black/40 rounded-lg p-6 my-6">
                  <p className="text-white font-normal mb-4">{t('toji.personalize.p2')}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-300 font-normal">{t('toji.personalize.sulfur')}</p>
                        <p className="text-sm text-gray-400">{t('toji.personalize.sulfur.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-300 font-normal">{t('toji.personalize.sodium')}</p>
                        <p className="text-sm text-gray-400">{t('toji.personalize.sodium.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-300 font-normal">{t('toji.personalize.alkaline')}</p>
                        <p className="text-sm text-gray-400">{t('toji.personalize.alkaline.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-300 font-normal">{t('toji.personalize.iron')}</p>
                        <p className="text-sm text-gray-400">{t('toji.personalize.iron.desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p>
                  {t('toji.personalize.p3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          className={`py-20 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
              {t('toji.expect.title')}
            </h2>
            <p className="text-center text-emerald-300 text-sm tracking-widest uppercase font-light mb-12">{t('toji.expect.subtitle')}</p>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-10 border border-emerald-500/10">
              <h3 className="text-2xl font-light text-emerald-400 mb-8">
                {t('toji.expect.heading')}
              </h3>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-light text-white mb-2">{t('toji.expect.day1')}</h4>
                    <ul className="space-y-2 text-gray-300 font-light">
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day1.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day1.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day1.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day1.l4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-light text-white mb-2">{t('toji.expect.day2')}</h4>
                    <ul className="space-y-2 text-gray-300 font-light">
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day2.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day2.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day2.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day2.l4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-light text-white mb-2">{t('toji.expect.day3')}</h4>
                    <ul className="space-y-2 text-gray-300 font-light">
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day3.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day3.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-400 mr-3">•</span>
                        <span>{t('toji.expect.day3.l3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-black/40 rounded-lg">
                <p className="text-gray-300 font-light italic">
                  {t('toji.expect.note')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[5] = el)}
          className={`py-20 bg-black transition-all duration-1000 ${
            visibleSections.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
              {t('toji.etiquette.title')}
            </h2>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-10 border border-emerald-500/10">
              <h3 className="text-2xl font-light text-emerald-400 mb-6 flex items-center">
                <Shield className="w-7 h-7 mr-3" />
                {t('toji.etiquette.subtitle')}
              </h3>

              <div className="space-y-6 text-gray-300 leading-relaxed font-light">
                <div>
                  <h4 className="text-lg text-white font-normal mb-3">{t('toji.etiquette.before')}</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.before.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.before.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.before.l3')}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg text-white font-normal mb-3">{t('toji.etiquette.in')}</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.in.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.in.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.in.l3')}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg text-white font-normal mb-3">{t('toji.etiquette.after')}</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.after.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.after.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('toji.etiquette.after.l3')}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6 mt-8">
                  <h4 className="text-lg text-amber-400 font-normal mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {t('toji.safety.title')}
                  </h4>
                  <ul className="space-y-2 ml-6 text-amber-100/90">
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-3">⚠</span>
                      <span>{t('toji.safety.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-3">⚠</span>
                      <span>{t('toji.safety.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-3">⚠</span>
                      <span>{t('toji.safety.l3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[6] = el)}
          className={`py-24 bg-gradient-to-b from-black to-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="mb-12">
              <div className="inline-flex items-center space-x-3 mb-6 px-6 py-3 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/20">
                <Droplets className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-300 text-sm tracking-widest uppercase font-light">{t('toji.cta.title')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                {t('toji.cta.subtitle')}
              </h2>
              <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                {t('toji.cta.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button className="group px-8 py-6 bg-emerald-600 text-white rounded-xl text-base font-normal tracking-wide hover:bg-emerald-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50 flex flex-col items-center justify-center space-y-2">
                <span className="text-xl">📅</span>
                <span>{t('toji.cta.book')}</span>
                <span className="text-xs font-light opacity-90">{t('toji.cta.book.desc')}</span>
              </button>

              <button className="group px-8 py-6 bg-zinc-800 text-white rounded-xl text-base font-normal tracking-wide hover:bg-zinc-700 border border-emerald-500/30 hover:border-emerald-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-2">
                <span className="text-xl">💬</span>
                <span>{t('toji.cta.talk')}</span>
                <span className="text-xs font-light opacity-90">{t('toji.cta.talk.desc')}</span>
              </button>

              <button className="group px-8 py-6 bg-zinc-800 text-white rounded-xl text-base font-normal tracking-wide hover:bg-zinc-700 border border-emerald-500/30 hover:border-emerald-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-2">
                <span className="text-xl">📖</span>
                <span>{t('toji.cta.download')}</span>
                <span className="text-xs font-light opacity-90">{t('toji.cta.download.desc')}</span>
              </button>
            </div>

            <p className="text-sm text-gray-400 font-light mt-12 italic">
              "{t('toji.quote')}"
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
