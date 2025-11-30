import { ArrowLeft, UtensilsCrossed, Leaf, Wheat, Sparkles, Users, ChefHat, Heart, Sprout, CheckCircle2, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { useState, useEffect, useRef } from 'react';

interface ShokuyojoPageProps {
  onBack: () => void;
}

export default function ShokuyojoPage({ onBack }: ShokuyojoPageProps) {
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
        className="fixed top-8 left-8 z-50 flex items-center space-x-2 text-amber-300 hover:text-amber-200 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-500/30 hover:border-amber-500/50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-light tracking-wide">{t('matsuri.back')}</span>
      </button>

      <div className="pt-24">
        <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Shoku-yojo Food Experience"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950" />

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center mb-8">
              <UtensilsCrossed className="w-24 h-24 text-amber-400 opacity-40" strokeWidth={1} />
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-wider leading-tight mb-8">
              {t('shoku.title')}
            </h1>
            <p className="text-2xl md:text-3xl font-light text-amber-200 mb-6 tracking-wide">
              {t('shoku.subtitle')}
            </p>
            <div className="w-16 h-px bg-amber-400 mx-auto mt-8 opacity-50" />
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm text-gray-400 font-light tracking-widest uppercase mb-2">{t('shoku.tagline')}</p>
            <div className="w-px h-12 bg-gradient-to-b from-amber-400/50 to-transparent mx-auto" />
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
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-400/30 to-transparent" />
              <h2 className="text-3xl md:text-4xl font-extralight text-amber-300 mb-8 tracking-wide">
                {t('shoku.value.title')}
              </h2>
              <div className="space-y-6 text-gray-300 leading-loose font-light text-lg">
                <p>
                  {t('shoku.value.p1')}
                </p>
                <p>
                  {t('shoku.value.p2')}
                </p>
                <p>
                  {t('shoku.value.p3')}
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
                <span className="text-amber-300 font-normal">RIJ</span>{t('shoku.meaning.title')}
              </h2>
              <div className="w-12 h-px bg-amber-400 mx-auto opacity-50" />
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-amber-500/10">
                <div className="flex items-center space-x-4 mb-6">
                  <Heart className="w-10 h-10 text-amber-400 opacity-70" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-amber-300">
                    {t('shoku.balance.title')}
                  </h3>
                </div>
                <div className="space-y-6 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shoku.balance.p1')}
                  </p>
                  <p>
                    {t('shoku.balance.p2')}
                  </p>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.balance.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.balance.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.balance.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.balance.l4')}</span>
                    </li>
                  </ul>
                  <p className="mt-8 p-6 bg-black/30 rounded border border-amber-500/20 italic">
                    {t('shoku.balance.note')}
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
                {t('shoku.experiences.title')}
              </h2>
              <div className="w-12 h-px bg-amber-400 mx-auto opacity-50" />
            </div>

            <div className="space-y-16">
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2">
                  <img
                    src="https://images.pexels.com/photos/1580464/pexels-photo-1580464.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Shojin Ryori Temple Cuisine"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <Leaf className="w-8 h-8 text-amber-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-amber-300">
                      {t('shoku.shojin.title')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('shoku.shojin.p1')}
                    </p>
                    <p>
                      <strong className="text-white">{t('shoku.shojin.p2')}</strong>
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.shojin.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.shojin.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.shojin.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.shojin.l4')}</span>
                      </li>
                    </ul>
                    <p>
                      {t('shoku.shojin.p3')}
                    </p>
                    <p className="text-sm italic text-gray-400 mt-4">
                      {t('shoku.shojin.note')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-3 order-2 md:order-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Wheat className="w-8 h-8 text-amber-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-amber-300">
                      {t('shoku.ferment.title')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('shoku.ferment.p1')}
                    </p>
                    <p>
                      <strong className="text-white">{t('shoku.ferment.p2')}</strong>
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.ferment.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.ferment.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.ferment.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('shoku.ferment.l4')}</span>
                      </li>
                    </ul>
                    <p>
                      {t('shoku.ferment.p3')}
                    </p>
                    <p className="text-sm italic text-gray-400 mt-4">
                      {t('shoku.ferment.note')}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 order-1 md:order-2">
                  <img
                    src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fermentation Culture"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-amber-500/10">
                <div className="flex items-center space-x-3 mb-4">
                  <Sprout className="w-8 h-8 text-amber-400" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-amber-300">
                    {t('shoku.farm.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shoku.farm.intro')}
                  </p>
                  <p>
                    <strong className="text-white">{t('shoku.farm.exp')}</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="text-lg font-light text-amber-300 mb-3">{t('shoku.farm.visits')}</h4>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-3 mt-1">•</span>
                          <span>{t('shoku.farm.v1')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-3 mt-1">•</span>
                          <span>{t('shoku.farm.v2')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-3 mt-1">•</span>
                          <span>{t('shoku.farm.v3')}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-light text-amber-300 mb-3">{t('shoku.farm.practices')}</h4>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-3 mt-1">•</span>
                          <span>{t('shoku.farm.m1')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-3 mt-1">•</span>
                          <span>{t('shoku.farm.m2')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-3 mt-1">•</span>
                          <span>{t('shoku.farm.m3')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-6">
                    {t('shoku.farm.closing')}
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
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shoku.personalize.title')}
              </h2>
              <div className="w-12 h-px bg-amber-400 mx-auto opacity-50" />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="w-8 h-8 text-amber-400" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-amber-300">
                    {t('shoku.allergies.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shoku.allergies.p1')}
                  </p>
                  <p>
                    <strong className="text-white">{t('shoku.allergies.p2')}</strong>
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.allergies.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.allergies.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.allergies.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.allergies.l4')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{t('shoku.allergies.l5')}</span>
                    </li>
                  </ul>
                  <p>
                    {t('shoku.allergies.p3')}
                  </p>
                  <p>
                    {t('shoku.allergies.p4')}
                  </p>
                  <p className="text-sm italic text-gray-400 mt-6">
                    {t('shoku.allergies.note')}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <Sparkles className="w-8 h-8 text-amber-400" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-amber-300">
                    {t('shoku.ai.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('shoku.ai.p1')}
                  </p>
                  <p>
                    <strong className="text-white">{t('shoku.ai.p2')}</strong>
                  </p>
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                        <span className="text-amber-400 text-sm font-normal">1</span>
                      </div>
                      <div>
                        <p className="text-white font-light mb-1">{t('shoku.ai.step1.title')}</p>
                        <p className="text-sm">{t('shoku.ai.step1.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                        <span className="text-amber-400 text-sm font-normal">2</span>
                      </div>
                      <div>
                        <p className="text-white font-light mb-1">{t('shoku.ai.step2.title')}</p>
                        <p className="text-sm">{t('shoku.ai.step2.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                        <span className="text-amber-400 text-sm font-normal">3</span>
                      </div>
                      <div>
                        <p className="text-white font-light mb-1">{t('shoku.ai.step3.title')}</p>
                        <p className="text-sm">{t('shoku.ai.step3.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                        <span className="text-amber-400 text-sm font-normal">4</span>
                      </div>
                      <div>
                        <p className="text-white font-light mb-1">{t('shoku.ai.step4.title')}</p>
                        <p className="text-sm">{t('shoku.ai.step4.desc')}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6">
                    {t('shoku.ai.example')}
                  </p>
                  <p className="text-sm italic text-gray-400 mt-6 p-4 bg-black/30 rounded border border-amber-500/20">
                    {t('shoku.ai.disclaimer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          className={`py-24 bg-black transition-all duration-1000 ${
            visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shoku.expect.title')}
              </h2>
              <p className="text-amber-300/70 text-sm tracking-widest uppercase font-light">Your Flow</p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-amber-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-8 h-8 text-amber-400" strokeWidth={1} />
                <h3 className="text-2xl font-light text-amber-300">
                  {t('shoku.flow.title')}
                </h3>
              </div>
              <div className="space-y-6 text-gray-300 leading-relaxed font-light">
                <p>
                  {t('shoku.flow.p1')}
                </p>

                <div className="space-y-8 mt-8">
                  <div className="relative pl-12 border-l-2 border-amber-500/20">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500"></div>
                    <h4 className="text-xl font-light text-amber-300 mb-3">{t('shoku.day1.title')}</h4>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day1.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day1.l2')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="relative pl-12 border-l-2 border-amber-500/20">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500"></div>
                    <h4 className="text-xl font-light text-amber-300 mb-3">{t('shoku.day2.title')}</h4>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day2.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day2.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day2.l3')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="relative pl-12 border-l-2 border-amber-500/20">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500"></div>
                    <h4 className="text-xl font-light text-amber-300 mb-3">{t('shoku.day3.title')}</h4>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day3.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day3.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-3 mt-1">•</span>
                        <span>{t('shoku.day3.l3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="mt-8 p-6 bg-black/30 rounded border border-amber-500/20">
                  {t('shoku.flow.note')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[5] = el)}
          className={`py-32 bg-gradient-to-b from-black to-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="mb-16">
              <UtensilsCrossed className="w-16 h-16 text-amber-400 opacity-40 mx-auto mb-8" strokeWidth={1} />
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('shoku.cta.title')}
              </h2>
              <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                {t('shoku.cta.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button className="group px-8 py-8 bg-amber-600/90 text-white rounded-lg text-base font-normal tracking-wide hover:bg-amber-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30 flex flex-col items-center justify-center space-y-3">
                <Users className="w-10 h-10" strokeWidth={1} />
                <span>{t('shoku.cta.profile')}</span>
                <span className="text-xs font-light opacity-90">{t('shoku.cta.profile.desc')}</span>
              </button>

              <button className="group px-8 py-8 bg-zinc-800 text-white rounded-lg text-base font-normal tracking-wide hover:bg-zinc-700 border border-amber-500/30 hover:border-amber-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3">
                <ChefHat className="w-10 h-10 text-amber-400" strokeWidth={1} />
                <span>{t('shoku.cta.explore')}</span>
                <span className="text-xs font-light opacity-90">{t('shoku.cta.explore.desc')}</span>
              </button>

              <button className="group px-8 py-8 bg-zinc-800 text-white rounded-lg text-base font-normal tracking-wide hover:bg-zinc-700 border border-amber-500/30 hover:border-amber-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3">
                <BookOpen className="w-10 h-10 text-amber-400" strokeWidth={1} />
                <span>{t('shoku.cta.menu')}</span>
                <span className="text-xs font-light opacity-90">{t('shoku.cta.menu.desc')}</span>
              </button>
            </div>

            <div className="mt-16 max-w-2xl mx-auto">
              <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                "{t('shoku.quote')}"
              </p>
              <p className="text-xs text-gray-500 mt-2">{t('shoku.quote.author')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
