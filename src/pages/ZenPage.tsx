import { ArrowLeft, Brain, Circle, BookOpen, Home, MessageCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { useState, useEffect, useRef } from 'react';

interface ZenPageProps {
  onBack: () => void;
}

export default function ZenPage({ onBack }: ZenPageProps) {
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
        className="fixed top-8 left-8 z-50 flex items-center space-x-2 text-rose-300 hover:text-rose-200 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-500/30 hover:border-rose-500/50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-light tracking-wide">{t('matsuri.back')}</span>
      </button>

      <div className="pt-24">
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Zen Garden"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center mb-8">
              <Circle className="w-20 h-20 text-rose-400 opacity-30" strokeWidth={0.5} />
            </div>
            <h1 className="text-6xl md:text-8xl font-extralight tracking-wider leading-tight mb-8">
              {t('zen.title')}
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 mb-4 tracking-wide">
              {t('zen.subtitle')}
            </p>
            <div className="w-16 h-px bg-rose-400 mx-auto opacity-50" />
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm text-gray-400 font-light tracking-widest uppercase mb-2">{t('zen.scroll')}</p>
            <div className="w-px h-12 bg-gradient-to-b from-rose-400/50 to-transparent mx-auto" />
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[0] = el)}
          className={`py-24 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-rose-400/30 to-transparent" />
              <h2 className="text-3xl md:text-4xl font-extralight text-rose-300 mb-8 tracking-wide">
                {t('zen.summary.title')}
              </h2>
              <div className="space-y-6 text-gray-300 leading-loose font-light text-lg">
                <p>
                  <strong className="text-white font-normal">Zen</strong> {t('zen.summary.p1.start')} <strong className="text-white font-normal">{t('zen.summary.p1.mid')}</strong> {t('zen.summary.p1.end')}
                </p>
                <p>
                  {t('zen.summary.p2.start')} <strong className="text-rose-300 font-normal">RIJ</strong>{t('zen.summary.p2.mid')} <strong className="text-white font-normal">{t('zen.summary.p2.zazen')}</strong>, <strong className="text-white font-normal">{t('zen.summary.p2.shakyo')}</strong>{t('zen.summary.p2.mid2')} <strong className="text-white font-normal">{t('zen.summary.p2.temple')}</strong>{t('zen.summary.p2.mid3')} <strong className="text-white font-normal">{t('zen.summary.p2.historic')}</strong> {t('zen.summary.p2.end')}
                </p>
                <p>
                  {t('zen.summary.p3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className={`py-24 bg-black transition-all duration-1000 ${
            visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                <span className="text-rose-300 font-normal">RIJ</span>{t('zen.meaning.title')}
              </h2>
              <div className="w-12 h-px bg-rose-400 mx-auto opacity-50" />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="group">
                <div className="mb-6 flex items-center space-x-4">
                  <Brain className="w-10 h-10 text-rose-400 opacity-70" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-rose-300">
                    {t('zen.brain.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('zen.brain.p1')}
                  </p>
                  <p>
                    {t('zen.brain.p2')}
                  </p>
                  <p>
                    {t('zen.brain.p3')}
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="mb-6 flex items-center space-x-4">
                  <Circle className="w-10 h-10 text-rose-400 opacity-70" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-rose-300">
                    {t('zen.respectful.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('zen.respectful.p1')}
                  </p>
                  <p>
                    <strong className="text-white">{t('zen.respectful.p2')}</strong>
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-3 mt-1">•</span>
                      <span>{t('zen.respectful.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-3 mt-1">•</span>
                      <span>{t('zen.respectful.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-3 mt-1">•</span>
                      <span>{t('zen.respectful.l3')}</span>
                    </li>
                  </ul>
                  <p>
                    {t('zen.respectful.p3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className={`py-24 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('zen.signature.title')}
              </h2>
              <div className="w-12 h-px bg-rose-400 mx-auto opacity-50" />
            </div>

            <div className="space-y-16">
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2">
                  <img
                    src="https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Zazen Meditation"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <Circle className="w-8 h-8 text-rose-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-rose-300">
                      {t('zen.zazen.subtitle')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('zen.zazen.p1')}
                    </p>
                    <p>
                      <strong className="text-white">{t('zen.zazen.learn')}</strong>
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.zazen.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.zazen.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.zazen.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.zazen.l4')}</span>
                      </li>
                    </ul>
                    <p className="text-sm italic text-gray-400 mt-6">
                      {t('zen.zazen.p2')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-3 order-2 md:order-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="w-8 h-8 text-rose-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-rose-300">
                      {t('zen.shakyo.title')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('zen.shakyo.p1')}
                    </p>
                    <p>
                      <strong className="text-white">{t('zen.shakyo.why')}</strong>
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <span className="text-rose-400 mr-3 mt-1">•</span>
                        <span>{t('zen.shakyo.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-400 mr-3 mt-1">•</span>
                        <span>{t('zen.shakyo.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-400 mr-3 mt-1">•</span>
                        <span>{t('zen.shakyo.l3')}</span>
                      </li>
                    </ul>
                    <p>
                      {t('zen.shakyo.p2')}
                    </p>
                    <p className="text-sm italic text-gray-400 mt-6">
                      {t('zen.shakyo.p3')}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 order-1 md:order-2">
                  <img
                    src="https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Shakyo Sutra Copying"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2">
                  <img
                    src="https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Shukubo Temple Stay"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <Home className="w-8 h-8 text-rose-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-rose-300">
                      {t('zen.shukubo.subtitle')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('zen.shukubo.p1')}
                    </p>
                    <p>
                      <strong className="text-white">{t('zen.shukubo.happens')}</strong>
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.shukubo.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.shukubo.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.shukubo.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('zen.shukubo.l4')}</span>
                      </li>
                    </ul>
                    <p>
                      {t('zen.shukubo.p2')}
                    </p>
                    <p className="text-sm italic text-gray-400 mt-6">
                      {t('zen.shukubo.p3')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/10">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageCircle className="w-8 h-8 text-rose-400" strokeWidth={1} />
                  <h3 className="text-2xl font-light text-rose-300">
                    {t('zen.dokusan.title')}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('zen.dokusan.p1')}
                  </p>
                  <p>
                    {t('zen.dokusan.p2')}
                  </p>
                  <p className="text-sm italic text-gray-400 mt-4">
                    {t('zen.dokusan.p3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          className={`py-24 bg-black transition-all duration-1000 ${
            visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('zen.expect.title')}
              </h2>
              <p className="text-rose-300/70 text-sm tracking-widest uppercase font-light">{t('zen.expect.subtitle')}</p>
            </div>

            <div className="space-y-12">
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-rose-400 flex items-center justify-center bg-black">
                  <span className="text-xs text-rose-400 font-normal">1</span>
                </div>
                <h3 className="text-2xl font-light text-rose-300 mb-4">{t('zen.expect.before.title')}</h3>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('zen.expect.before.brief')}
                  </p>
                  <p>
                    {t('zen.expect.before.arrival')}
                  </p>
                </div>
              </div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-rose-400 flex items-center justify-center bg-black">
                  <span className="text-xs text-rose-400 font-normal">2</span>
                </div>
                <h3 className="text-2xl font-light text-rose-300 mb-4">{t('zen.expect.during.title')}</h3>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('zen.expect.during.begin')}
                  </p>
                  <p>
                    {t('zen.expect.during.check')}
                  </p>
                  <p>
                    {t('zen.expect.during.second')}
                  </p>
                </div>
              </div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-rose-400 flex items-center justify-center bg-black">
                  <span className="text-xs text-rose-400 font-normal">3</span>
                </div>
                <h3 className="text-2xl font-light text-rose-300 mb-4">{t('zen.expect.after.title')}</h3>
                <div className="space-y-3 text-gray-300 leading-relaxed font-light">
                  <p>
                    {t('zen.expect.after.debrief')}
                  </p>
                  <p>
                    {t('zen.expect.after.practice')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-zinc-900/30 rounded-lg border border-rose-500/10">
              <p className="text-gray-300 font-light italic">
                {t('zen.expect.after.reality')}
              </p>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          className={`py-24 bg-zinc-950 transition-all duration-1000 ${
            visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('zen.etiquette.title')}
              </h2>
              <div className="w-12 h-px bg-rose-400 mx-auto opacity-50" />
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-rose-300 mb-3">
                      {t('zen.faq1.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('zen.faq1.a1')}
                    </p>
                    <p className="text-gray-300 leading-relaxed font-light mt-3">
                      {t('zen.faq1.a2')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-rose-300 mb-3">
                      {t('zen.faq2.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('zen.faq2.a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-rose-300 mb-3">
                      {t('zen.faq3.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('zen.faq3.a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-rose-300 mb-3">
                      {t('zen.faq4.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('zen.faq4.a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-light text-rose-300 mb-3">
                      {t('zen.faq5.q')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {t('zen.faq5.a')}
                    </p>
                  </div>
                </div>
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
              <Circle className="w-16 h-16 text-rose-400 opacity-30 mx-auto mb-8" strokeWidth={0.5} />
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('zen.cta.title')}
              </h2>
              <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                {t('zen.cta.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button className="group px-8 py-8 bg-rose-600/90 text-white rounded-lg text-base font-normal tracking-wide hover:bg-rose-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/30 flex flex-col items-center justify-center space-y-3">
                <Circle className="w-10 h-10" strokeWidth={1} />
                <span>{t('zen.cta.book')}</span>
                <span className="text-xs font-light opacity-90">{t('zen.cta.book.desc')}</span>
              </button>

              <button className="group px-8 py-8 bg-zinc-800 text-white rounded-lg text-base font-normal tracking-wide hover:bg-zinc-700 border border-rose-500/30 hover:border-rose-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3">
                <MessageCircle className="w-10 h-10 text-rose-400" strokeWidth={1} />
                <span>{t('zen.cta.speak')}</span>
                <span className="text-xs font-light opacity-90">{t('zen.cta.speak.desc')}</span>
              </button>

              <button className="group px-8 py-8 bg-zinc-800 text-white rounded-lg text-base font-normal tracking-wide hover:bg-zinc-700 border border-rose-500/30 hover:border-rose-500/60 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3">
                <BookOpen className="w-10 h-10 text-rose-400" strokeWidth={1} />
                <span>{t('zen.cta.download')}</span>
                <span className="text-xs font-light opacity-90">{t('zen.cta.download.desc')}</span>
              </button>
            </div>

            <div className="mt-16 max-w-2xl mx-auto">
              <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                "{t('zen.quote')}"
              </p>
              <p className="text-xs text-gray-500 mt-2">{t('zen.quote.author')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
