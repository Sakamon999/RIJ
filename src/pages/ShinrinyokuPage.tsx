import { ArrowLeft, Trees, Heart, MapPin, Clock, Shield, Backpack, Wind, Leaf, CheckCircle2, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { useState, useEffect, useRef } from 'react';

interface ShinrinyokuPageProps {
  onBack: () => void;
}

export default function ShinrinyokuPage({ onBack }: ShinrinyokuPageProps) {
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <LanguageToggle />
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center space-x-2 text-emerald-300 hover:text-emerald-200 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-500/30 hover:border-emerald-500/50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-light tracking-wide">{t('matsuri.back')}</span>
      </button>

      <div className="pt-24">
        <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Forest Bathing"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950" />

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center mb-8">
              <Trees className="w-24 h-24 text-emerald-400 opacity-40" strokeWidth={1} />
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-wider leading-tight mb-8">
              {t('shinrin.title')}
            </h1>
            <p className="text-2xl md:text-3xl font-light text-emerald-200 mb-6 tracking-wide">
              {t('shinrin.subtitle')}
            </p>
            <p className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">
              {t('shinrin.tagline')}
            </p>
            <div className="w-16 h-px bg-emerald-400 mx-auto mt-8 opacity-50" />
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm text-gray-400 font-light tracking-widest uppercase mb-2">{t('shinrin.cta')}</p>
            <div className="w-px h-12 bg-gradient-to-b from-emerald-400/50 to-transparent mx-auto" />
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[0] = el)}
          className={`py-24 bg-black transition-all duration-1000 ${
            visibleSections.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent" />
              <h2 className="text-3xl md:text-4xl font-extralight text-emerald-300 mb-8 tracking-wide">
                {t('shinrin.summary.title')}
              </h2>
              <div className="space-y-6 text-gray-300 leading-loose font-light text-lg">
                <p>
                  {t('shinrin.summary.p1')}
                </p>
                <p>
                  {t('shinrin.summary.p2')}
                </p>
                <p>
                  {t('shinrin.summary.p3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className={`py-24 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                <span className="text-emerald-300 font-normal">RIJ</span>{t('shinrin.meaning.title')}
              </h2>
              <div className="w-12 h-px bg-emerald-400 mx-auto opacity-50" />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="group">
                <div className="mb-6 flex items-center space-x-4">
                  <Heart className="w-10 h-10 text-emerald-400 opacity-70" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-emerald-300">
                    {t('shinrin.science.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.science.p1')}
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.science.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.science.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.science.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.science.l4')}</span>
                    </li>
                  </ul>
                  <p>
                    {t('shinrin.science.p2')}
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="mb-6 flex items-center space-x-4">
                  <Leaf className="w-10 h-10 text-emerald-400 opacity-70" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-emerald-300">
                    {t('shinrin.preventive.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.preventive.p1')}
                  </p>
                  <p>
                    {t('shinrin.preventive.p2')}
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.preventive.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.preventive.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.preventive.l3')}</span>
                    </li>
                  </ul>
                  <p>
                    {t('shinrin.preventive.p3')}
                  </p>
                  <p className="text-sm italic text-gray-400 mt-6">
                    {t('shinrin.preventive.note')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className={`py-24 bg-black transition-all duration-1000 ${
            visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shinrin.experience.title')}
              </h2>
              <div className="w-12 h-px bg-emerald-400 mx-auto opacity-50" />
            </div>

            <div className="space-y-16">
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2">
                  <img
                    src="https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Ancient Forest Walk"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trees className="w-8 h-8 text-emerald-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-emerald-300">
                      {t('shinrin.forest.subtitle')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('shinrin.forest.p1')}
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <MapPin className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.forest.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <MapPin className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.forest.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <MapPin className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.forest.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <MapPin className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.forest.l4')}</span>
                      </li>
                    </ul>
                    <p>
                      {t('shinrin.forest.p2')}
                    </p>
                    <p className="text-sm italic text-gray-400 mt-6">
                      {t('shinrin.forest.note')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-3 order-2 md:order-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Heart className="w-8 h-8 text-emerald-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-emerald-300">
                      {t('shinrin.guide.title')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('shinrin.guide.p1')}
                    </p>
                    <p>
                      <strong className="text-white">{t('shinrin.guide.p2')}</strong>
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.guide.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.guide.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.guide.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shinrin.guide.l4')}</span>
                      </li>
                    </ul>
                    <p>
                      {t('shinrin.guide.p3')}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 order-1 md:order-2">
                  <img
                    src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Certified Guide"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10">
                <div className="flex items-center space-x-3 mb-4">
                  <Wind className="w-8 h-8 text-emerald-400" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-emerald-300">
                    {t('shinrin.detox.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.detox.p1')}
                  </p>
                  <p>
                    <strong className="text-white">{t('shinrin.detox.p2')}</strong>
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.detox.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.detox.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.detox.l3')}</span>
                    </li>
                  </ul>
                  <p>
                    {t('shinrin.detox.p3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          className={`py-24 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shinrin.flow.title')}
              </h2>
              <p className="text-emerald-300/70 text-sm tracking-widest uppercase font-light">{t('shinrin.flow.subtitle')}</p>
            </div>

            <div className="space-y-12">
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-zinc-950">
                  <span className="text-xs text-emerald-400 font-normal">1</span>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-emerald-300">{t('shinrin.flow.step1.time')}: {t('shinrin.flow.step1.title')}</h3>
                </div>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.flow.step1.p1')}
                  </p>
                  <p>
                    {t('shinrin.flow.step1.p2')}
                  </p>
                </div>
              </div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-zinc-950">
                  <span className="text-xs text-emerald-400 font-normal">2</span>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-emerald-300">{t('shinrin.flow.step2.time')}: {t('shinrin.flow.step2.title')}</h3>
                </div>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.flow.step2.p1')}
                  </p>
                  <p>
                    {t('shinrin.flow.step2.p2')}
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.flow.step2.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.flow.step2.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.flow.step2.l3')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-zinc-950">
                  <span className="text-xs text-emerald-400 font-normal">3</span>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-emerald-300">{t('shinrin.flow.step3.time')}: {t('shinrin.flow.step3.title')}</h3>
                </div>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.flow.step3.p1')}
                  </p>
                  <p>
                    {t('shinrin.flow.step3.p2')}
                  </p>
                  <p>
                    {t('shinrin.flow.step3.p3')}
                  </p>
                </div>
              </div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-zinc-950">
                  <span className="text-xs text-emerald-400 font-normal">4</span>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-emerald-300">{t('shinrin.flow.step4.time')}: {t('shinrin.flow.step4.title')}</h3>
                </div>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.flow.step4.p1')}
                  </p>
                  <p>
                    {t('shinrin.flow.step4.p2')}
                  </p>
                </div>
              </div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-zinc-950">
                  <span className="text-xs text-emerald-400 font-normal">5</span>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-emerald-300">{t('shinrin.flow.step5.time')}: {t('shinrin.flow.step5.title')}</h3>
                </div>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shinrin.flow.step5.p1')}
                  </p>
                  <p>
                    {t('shinrin.flow.step5.p2')}
                  </p>
                  <p>
                    {t('shinrin.flow.step5.p3')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-black/50 rounded-lg border border-emerald-500/10">
              <p className="text-gray-300 font-light italic">
                {t('shinrin.flow.note')}
              </p>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          className={`py-24 bg-black transition-all duration-1000 ${
            visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shinrin.prep.title')}
              </h2>
              <div className="w-12 h-px bg-emerald-400 mx-auto opacity-50" />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <Backpack className="w-8 h-8 text-emerald-400" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-emerald-300">
                    {t('shinrin.clothing.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p><strong className="text-white">{t('shinrin.clothing.subtitle')}</strong></p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.clothing.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.clothing.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.clothing.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.clothing.l4')}</span>
                    </li>
                  </ul>
                  <p className="mt-6"><strong className="text-white">{t('shinrin.bring.title')}</strong></p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.bring.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.bring.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.bring.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.bring.l4')}</span>
                    </li>
                  </ul>
                  <p className="text-sm italic text-gray-400 mt-6">
                    {t('shinrin.bring.note')}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-emerald-400" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-emerald-300">
                    {t('shinrin.safety.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p><strong className="text-white">{t('shinrin.safety.p1')}</strong></p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.safety.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.safety.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.safety.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.safety.l4')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shinrin.safety.l5')}</span>
                    </li>
                  </ul>
                  <p className="mt-6"><strong className="text-white">{t('shinrin.safety.p2')}</strong></p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.safety.r1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.safety.r2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.safety.r3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1">•</span>
                      <span>{t('shinrin.safety.r4')}</span>
                    </li>
                  </ul>
                  <p className="text-sm italic text-gray-400 mt-6">
                    {t('shinrin.safety.note')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[5] = el)}
          className={`py-24 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shinrin.faq.title')}
              </h2>
              <div className="w-12 h-px bg-emerald-400 mx-auto opacity-50" />
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-emerald-300 mb-3">
                      {t('shinrin.faq1.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('shinrin.faq1.a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-emerald-300 mb-3">
                      {t('shinrin.faq2.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('shinrin.faq2.a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-emerald-300 mb-3">
                      {t('shinrin.faq3.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('shinrin.faq3.a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-emerald-300 mb-3">
                      {t('shinrin.faq4.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('shinrin.faq4.a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-emerald-300 mb-3">
                      {t('shinrin.faq5.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('shinrin.faq5.a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[6] = el)}
          className={`py-32 bg-gradient-to-b from-black to-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="mb-16">
              <Trees className="w-16 h-16 text-emerald-400 opacity-40 mx-auto mb-8" strokeWidth={1} />
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shinrin.cta.title')}
              </h2>
              <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                {t('shinrin.cta.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button className="group px-8 py-8 bg-emerald-600/90 text-white rounded-lg text-base font-normal tracking-wide hover:bg-emerald-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 flex flex-col items-center justify-center space-y-3">
                <Trees className="w-10 h-10" strokeWidth={1} />
                <span>{t('shinrin.cta.book')}</span>
                <span className="text-xs font-light opacity-90">{t('shinrin.cta.book.desc')}</span>
              </button>

              <button className="group px-8 py-8 bg-zinc-800 text-white rounded-lg text-base font-normal tracking-wide hover:bg-zinc-700 border border-emerald-500/30 hover:border-emerald-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3">
                <Heart className="w-10 h-10 text-emerald-400" strokeWidth={1} />
                <span>{t('shinrin.cta.consult')}</span>
                <span className="text-xs font-light opacity-90">{t('shinrin.cta.consult.desc')}</span>
              </button>

              <button className="group px-8 py-8 bg-zinc-800 text-white rounded-lg text-base font-normal tracking-wide hover:bg-zinc-700 border border-emerald-500/30 hover:border-emerald-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3">
                <Leaf className="w-10 h-10 text-emerald-400" strokeWidth={1} />
                <span>{t('shinrin.cta.download')}</span>
                <span className="text-xs font-light opacity-90">{t('shinrin.cta.download.desc')}</span>
              </button>
            </div>

            <div className="mt-16 max-w-2xl mx-auto">
              <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                "{t('shinrin.quote')}"
              </p>
              <p className="text-xs text-gray-500 mt-2">{t('shinrin.quote.author')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
