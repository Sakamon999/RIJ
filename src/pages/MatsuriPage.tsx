import { ArrowLeft, Users, Calendar, Heart, Shield, BookOpen, CheckCircle2, AlertCircle, Camera, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

interface MatsuriPageProps {
  onBack: () => void;
}

export default function MatsuriPage({ onBack }: MatsuriPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <LanguageToggle />
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3692056/pexels-photo-3692056.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Japanese Matsuri Festival"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        </div>

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="fixed top-8 left-8 z-50 flex items-center space-x-2 text-orange-300 hover:text-orange-200 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30 hover:border-orange-500/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-light">{t('matsuri.back')}</span>
          </button>

          <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-400/50 mb-8 animate-pulse">
                <Users className="w-10 h-10 text-orange-400" strokeWidth={1} />
              </div>
              <h1 className="text-5xl md:text-7xl font-extralight text-white mb-6 tracking-tight">
                {t('matsuri.hero.title1')} <span className="text-orange-300 font-light">{t('matsuri.hero.title2')}</span>,<br />
                {t('matsuri.hero.title3')} <span className="text-orange-300 font-light">{t('matsuri.hero.title4')}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-4">
                {t('matsuri.hero.subtitle')}
              </p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                {t('matsuri.hero.desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
                <Calendar className="w-8 h-8 text-orange-400 mb-4" strokeWidth={1} />
                <h3 className="text-xl font-light text-orange-300 mb-2">{t('matsuri.seasonal.title')}</h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed">
                  {t('matsuri.seasonal.desc')}
                </p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
                <Heart className="w-8 h-8 text-orange-400 mb-4" strokeWidth={1} />
                <h3 className="text-xl font-light text-orange-300 mb-2">{t('matsuri.community.title')}</h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed">
                  {t('matsuri.community.desc')}
                </p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
                <Shield className="w-8 h-8 text-orange-400 mb-4" strokeWidth={1} />
                <h3 className="text-xl font-light text-orange-300 mb-2">{t('matsuri.safety.title')}</h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed">
                  {t('matsuri.safety.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="relative bg-gradient-to-b from-black via-zinc-950 to-black py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="w-10 h-10 text-orange-400" strokeWidth={1} />
                <h2 className="text-4xl font-extralight text-white">
                  {t('matsuri.meaning.title')} <span className="text-orange-300 font-light">{t('matsuri.meaning.title.bold')}</span> {t('matsuri.meaning.title.end')}
                </h2>
              </div>
              <div className="space-y-6 text-gray-300 leading-relaxed font-light">
                <p>
                  <strong className="text-white">Matsuri (祭り)</strong> {t('matsuri.meaning.p1')} <strong className="text-orange-300">{t('matsuri.meaning.p1.bold')}</strong>{t('matsuri.meaning.p1.end')}
                </p>
                <p>
                  {t('matsuri.meaning.p2')} <strong className="text-white">{t('matsuri.meaning.p2.bold')}</strong> {t('matsuri.meaning.p2.end')}
                </p>
                <p>
                  <strong className="text-orange-300">RIJ's role:</strong> {t('matsuri.meaning.p3')} <em>{t('matsuri.meaning.p3.end')}</em>.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg p-8 border border-orange-500/20">
                <h3 className="text-2xl font-light text-orange-300 mb-4">
                  {t('matsuri.loneliness.title')}
                </h3>
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed font-light">
                  <p>
                    {t('matsuri.loneliness.p1')} <strong className="text-white">{t('matsuri.loneliness.p1.bold')}</strong>{t('matsuri.loneliness.p1.end')}
                  </p>
                  <p>
                    <strong className="text-white">{t('matsuri.loneliness.why')}</strong>
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span><strong className="text-orange-300">{t('matsuri.loneliness.l1')}</strong> {t('matsuri.loneliness.l1.end')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span><strong className="text-orange-300">{t('matsuri.loneliness.l2')}</strong>{t('matsuri.loneliness.l2.end')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span><strong className="text-orange-300">{t('matsuri.loneliness.l3')}</strong> {t('matsuri.loneliness.l3.end')}</span>
                    </li>
                  </ul>
                  <p className="text-xs italic text-gray-400 mt-4">
                    {t('matsuri.loneliness.note')}
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg p-8 border border-orange-500/20">
                <h3 className="text-2xl font-light text-orange-300 mb-4">
                  Hare & Ke: The Rhythm That Cleanses
                </h3>
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed font-light">
                  <p>
                    Japanese culture operates on two modes:
                  </p>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <div>
                        <strong className="text-white">Ke (褻)</strong> – <span className="text-gray-400">Everyday routine. Work, chores, ordinary time. Energy depletes.</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <div>
                        <strong className="text-white">Hare (晴れ)</strong> – <span className="text-orange-300">Sacred/festive time. Energy <em>renews</em>. The world is re-enchanted.</span>
                      </div>
                    </li>
                  </ul>
                  <p>
                    <strong className="text-white">Matsuri is Hare time.</strong> It's not "taking a break"—it's <strong className="text-orange-300">ritually resetting your relationship to ordinary life</strong>. You step out of linear time, do something non-productive and meaningful, then return refreshed.
                  </p>
                  <p>
                    <strong className="text-white">Why modern life needs this:</strong> We've lost sacred time. Everything is Ke (hustle, optimization, productivity). Matsuri teaches you to <em>toggle</em> again—to enter and exit special time intentionally.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                Signature <span className="text-orange-300 font-normal">Experiences</span>
              </h2>
              <div className="w-12 h-px bg-orange-400 mx-auto opacity-50" />
            </div>

            <div className="space-y-16">
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-3 order-2 md:order-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-8 h-8 text-orange-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-orange-300">
                      {t('matsuri.spectator.title')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('matsuri.spectator.intro')}
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.spectator.l1')}</strong>{t('matsuri.spectator.l1.end')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.spectator.l2')}</strong>{t('matsuri.spectator.l2.end')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.spectator.l3')}</strong>{t('matsuri.spectator.l3.end')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.spectator.l4')}</strong>{t('matsuri.spectator.l4.end')}</span>
                      </li>
                    </ul>
                    <p>
                      <strong className="text-white">{t('matsuri.spectator.wont')}</strong> {t('matsuri.spectator.wont.desc')}
                    </p>
                    <p className="text-sm italic text-gray-400 mt-4">
                      {t('matsuri.spectator.note')}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 order-1 md:order-2">
                  <img
                    src="https://images.pexels.com/photos/3692058/pexels-photo-3692058.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Festival Participation"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2">
                  <img
                    src="https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Festival Preparation"
                    className="w-full h-72 object-cover rounded-sm shadow-2xl"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="w-8 h-8 text-orange-400" strokeWidth={1} />
                    <h3 className="text-2xl font-light text-orange-300">
                      {t('matsuri.preparation.title')}
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                    <p>
                      {t('matsuri.preparation.intro')}
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.preparation.l1')}</strong> {t('matsuri.preparation.l1.end')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.preparation.l2')}</strong>{t('matsuri.preparation.l2.end')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.preparation.l3')}</strong>{t('matsuri.preparation.l3.end')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                        <span><strong className="text-orange-300">{t('matsuri.preparation.l4')}</strong>{t('matsuri.preparation.l4.end')}</span>
                      </li>
                    </ul>
                    <p>
                      <strong className="text-white">Why this isn't overkill:</strong> Matsuri has rules. Breaking them isn't just awkward—it's disrespectful to the community hosting you. Preparation ensures you're <em>useful</em>, not a liability.
                    </p>
                    <p className="text-sm italic text-gray-400 mt-4">
                      ※ Some festivals require overnight stays at local inns or temple lodging. We arrange accommodations where you'll meet local participants beforehand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('matsuri.expect.title')} ({t('matsuri.expect.subtitle')})
              </h2>
              <div className="w-12 h-px bg-orange-400 mx-auto opacity-50" />
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-orange-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-8 h-8 text-orange-400" strokeWidth={1} />
                <h3 className="text-2xl font-light text-orange-300">
                  {t('matsuri.expect.flow')}
                </h3>
              </div>
              <div className="space-y-8">
                <div className="border-l-2 border-orange-500/30 pl-6">
                  <h4 className="text-xl font-light text-white mb-3 flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center mr-3 text-sm">1</span>
                    {t('matsuri.pre.title')}
                  </h4>
                  <ul className="space-y-2 ml-11 text-gray-300 text-sm font-light">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.pre.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.pre.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.pre.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.pre.l4')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.pre.l5')}</span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-2 border-orange-500/30 pl-6">
                  <h4 className="text-xl font-light text-white mb-3 flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center mr-3 text-sm">2</span>
                    {t('matsuri.participation.title')}
                  </h4>
                  <ul className="space-y-2 ml-11 text-gray-300 text-sm font-light">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.participation.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.participation.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.participation.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.participation.l4')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.participation.l5')}</span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-2 border-orange-500/30 pl-6">
                  <h4 className="text-xl font-light text-white mb-3 flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center mr-3 text-sm">3</span>
                    {t('matsuri.reflection.title')}
                  </h4>
                  <ul className="space-y-2 ml-11 text-gray-300 text-sm font-light">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.reflection.l1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.reflection.l2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.reflection.l3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span>{t('matsuri.reflection.l4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('matsuri.etiquette.title')}
              </h2>
              <div className="w-12 h-px bg-orange-400 mx-auto opacity-50" />
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-orange-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-orange-400" strokeWidth={1} />
                <h3 className="text-2xl font-light text-orange-300">
                  {t('matsuri.etiquette.subtitle')}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-light text-white mb-3 flex items-center">
                      <Camera className="w-5 h-5 text-orange-400 mr-2" />
                      {t('matsuri.photo.title')}
                    </h4>
                    <ul className="space-y-2 ml-7 text-gray-300 text-sm font-light">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.photo.scenes')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.photo.interiors')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.photo.ceremonies')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.photo.closeups')}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-light text-white mb-3 flex items-center">
                      <Users className="w-5 h-5 text-orange-400 mr-2" />
                      {t('matsuri.boundaries.title')}
                    </h4>
                    <ul className="space-y-2 ml-7 text-gray-300 text-sm font-light">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.boundaries.mikoshi')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.boundaries.dances')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.boundaries.objects')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t('matsuri.boundaries.areas')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-light text-white mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-400 mr-2" />
                      {t('matsuri.physical.title')}
                    </h4>
                    <ul className="space-y-2 ml-7 text-gray-300 text-sm font-light">
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.physical.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.physical.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.physical.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.physical.l4')}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-light text-white mb-3 flex items-center">
                      <Heart className="w-5 h-5 text-orange-400 mr-2" />
                      {t('matsuri.consent.title')}
                    </h4>
                    <ul className="space-y-2 ml-7 text-gray-300 text-sm font-light">
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.consent.l1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.consent.l2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.consent.l3')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>{t('matsuri.consent.l4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-gray-300 text-sm font-light leading-relaxed">
                  {t('matsuri.consent.promise')}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
                {t('matsuri.ready.title')}
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                {t('matsuri.ready.desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 font-light text-lg">
                <div className="flex flex-col items-center space-y-2">
                  <MapPin className="w-6 h-6" strokeWidth={1.5} />
                  <span>{t('matsuri.ready.calendar')}</span>
                  <span className="text-xs opacity-80">{t('matsuri.ready.calendar.desc')}</span>
                </div>
              </button>

              <button className="group bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-zinc-700/50 hover:scale-105 border border-orange-500/30 font-light text-lg">
                <div className="flex flex-col items-center space-y-2">
                  <Calendar className="w-6 h-6 text-orange-400" strokeWidth={1.5} />
                  <span>{t('matsuri.ready.custom')}</span>
                  <span className="text-xs opacity-80 text-gray-400">{t('matsuri.ready.custom.desc')}</span>
                </div>
              </button>

              <button className="group bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-zinc-700/50 hover:scale-105 border border-orange-500/30 font-light text-lg">
                <div className="flex flex-col items-center space-y-2">
                  <BookOpen className="w-6 h-6 text-orange-400" strokeWidth={1.5} />
                  <span>{t('matsuri.ready.guide')}</span>
                  <span className="text-xs opacity-80 text-gray-400">{t('matsuri.ready.guide.desc')}</span>
                </div>
              </button>
            </div>

            <div className="mt-12 p-6 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-orange-500/20 max-w-3xl mx-auto">
              <p className="text-gray-300 text-sm font-light leading-relaxed">
                {t('matsuri.ready.note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-orange-500/20 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-light">
              {t('matsuri.footer.title')}
            </p>
            <div className="flex justify-center space-x-8 mt-6">
              <a href="#" className="text-gray-400 hover:text-orange-300 text-sm font-light transition-colors">{t('matsuri.footer.guidelines')}</a>
              <a href="#" className="text-gray-400 hover:text-orange-300 text-sm font-light transition-colors">{t('matsuri.footer.calendar')}</a>
              <a href="#" className="text-gray-400 hover:text-orange-300 text-sm font-light transition-colors">{t('matsuri.footer.protocols')}</a>
              <a href="#" className="text-gray-400 hover:text-orange-300 text-sm font-light transition-colors">{t('matsuri.footer.partnerships')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
